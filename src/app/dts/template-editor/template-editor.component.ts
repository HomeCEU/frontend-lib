import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DtsService} from '../dts.service';
import {Template} from '../template.types';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {debounceTime, switchMap} from 'rxjs/operators';
import {UnsubscribeOnDestroyAdapter} from '../unsubscribe-on-destroy-adapter';

declare var CKEDITOR: any;

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  /**
   * Either creating or editing a template used to prevent changing the Template Name for an existing template
   */
  existingTemplate = false;

  /**
   * Used to display status messages
   */
  statusMessage = '';

  templateEditor: FormGroup;

  /**
   * Check for changes when closing modal via 'esc'
   */
  @HostListener('window:keyup.esc') onKeyUp(): void {
    this.discardChangesAndClose();
  }

  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event): void {
    event.returnValue = false;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public templateObject: Template,
              private dtsService: DtsService,
              public dialogRef: MatDialogRef<TemplateEditorComponent>,
              private formBuilder: FormBuilder) {

    super();

    this.templateEditor = this.formBuilder.group({
      templateKey: ['', [Validators.required, Validators.maxLength(40)]], // VARCHAR(255) in the database
      templateId: '',
      author: '',
      dataKey: ''
    });
  }

  /**
   * Retrieves template and loads template data into the editor
   */
  ngOnInit(): void {

    // configure the template editor
    this.configTemplateEditor();

    if (this.templateObject.docType && this.templateObject.templateKey) {
      this.templateEditor.patchValue(this.templateObject);

      // retrieve template content for existing template
      this.subs.sink = this.dtsService.getTemplateByKey(this.templateObject.docType, this.templateObject.templateKey).subscribe(data => {
        CKEDITOR.instances.editor1.setData(data, () => {
          CKEDITOR.instances.editor1.resetDirty();
        });
        this.existingTemplate = true;
      });
    }

    // require user to confirm closing the dialog with unsaved changes
    this.dialogRef.disableClose = true;
    this.subs.sink = this.dialogRef.backdropClick().subscribe(() => {
      this.discardChangesAndClose();
    });

    this.validateTemplateName();
  }

  /**
   * Configures the template editor
   */
  configTemplateEditor(): void {
    CKEDITOR.replace('editor1', {
      extraPlugins: 'sourcedialog',
      toolbar: [
        { name: 'basicstyles', items: [ 'Bold', 'Italic' ] },
        { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo' ] },
        { name: 'document', items: ['Source'] }
      ],
      startupMode: 'source',
      allowedContent: true,
      fullPage: true,
      height: '500px'
    });

    CKEDITOR.instances.editor1.on('focus', (event) => {
      this.statusMessage = '';
    });
  }

  /**
   * Ensures new template name (key) is unique for saving
   */
  validateTemplateName(): void {
    this.subs.sink = this.templateEditor.get('templateKey').valueChanges.pipe(
      debounceTime(500),
      switchMap(term => this.dtsService.getTemplateByKey('enrollment', term)))
      .subscribe(data => {
        if (data) {
          this.templateEditor.controls.templateKey.setErrors({inUse: true});
        }
      });
  }

  /**
   * Saves the template
   */
  onSubmit(): void {
    const templateData = CKEDITOR.instances.editor1.getData();

    this.subs.sink = this.dtsService.saveTemplate(
      this.templateEditor.value.templateKey,
      this.templateEditor.value.author,
      templateData
    ).subscribe(
      () => {
        CKEDITOR.instances.editor1.resetDirty();
        this.existingTemplate = true;
        this.statusMessage = 'Template saved';
      },
      () => {
        this.templateEditor.setErrors({ saveFailed: true });
      });
  }

  /**
   * Displays a modal window containing a certificate populated with data
   */
  renderTemplate(): void {
    if (this.templateObject.docType && this.templateObject.templateKey && this.templateEditor.value.dataKey) {
      this.subs.sink = this.dtsService.renderTemplate(this.templateObject.docType, this.templateObject.templateKey,
        this.templateEditor.value.dataKey)
        .subscribe(certificate => {
          const modal = window.open('', 'certificate', 'scrollbars=1,resizable=1');
          modal.document.open();
          modal.document.write(certificate);
          modal.document.close();
      });
    }
  }

  /**
   * Creates a new template from the existing template
   */
  copyTemplate(): void {
    this.templateEditor.controls.templateKey.setValue('');
    this.existingTemplate = false;
  }

  /**
   * Prompts the user to confirm closing the dialog with unsaved changes
   */
  discardChangesAndClose(): void {
    if (CKEDITOR.instances.editor1.checkDirty()) {
      const cn = confirm('Discard unsaved changes and close?');
      if (cn) {
        this.dialogRef.close();
      }
    }
    else {
      this.dialogRef.close();
    }
  }

  canCopy(): boolean {
    return !this.existingTemplate || CKEDITOR.instances.editor1.checkDirty();
  }

  canSave(): boolean {
    const isDirty = CKEDITOR.instances.editor1.checkDirty();
    const mode = CKEDITOR.instances.editor1.mode;
    const canSave = isDirty && (mode === 'source') && !this.templateEditor.invalid;
    //console.log(`isDirty: ${isDirty}   mode: ${mode}   !invalid: ${!this.templateEditor.invalid}`);
    return canSave;
  }
}
