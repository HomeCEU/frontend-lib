import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DtsService} from '../dts.service';
import {Template} from '../template.types';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CKEditor4} from 'ckeditor4-angular';

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent implements OnInit {
  /**
   * Either creating or editing a template
   */
  existingTemplate = true;

  /**
   * Used to display status messages
   */
  statusMessage = '';

  /**
   * Changes made to template
   */
  dirty = false;

  /**
   * Provides access to properties and methods of the CkEditor
   */
  editorControl: CKEditor4.Editor;

  /**
   * CKEditor configuration
   */
  editorConfig = {
    toolbar: [
      { name: 'basicstyles', items: [ 'Bold', 'Italic' ] },
      { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo' ] },
      { name: 'document', items: ['Source'] }
    ],
    allowedContent: true,
    fullPage: true,
    startupMode: 'source',
    height: '700px'
  };

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

    this.templateEditor = this.formBuilder.group({
      templateData: '',
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
    if (this.templateObject.docType && this.templateObject.templateKey) {
      this.templateEditor.patchValue(this.templateObject);

      // retrieve template content for existing template
      this.dtsService.getTemplateByKey(this.templateObject.docType, this.templateObject.templateKey).subscribe(data => {
        this.templateEditor.controls.templateData.setValue(data, { emitEvent: false });
        this.dirty = false;
        this.existingTemplate = true;
      });
    }
    else {
      // creating a new template
      this.dirty = true;
      this.existingTemplate = false;
    }

    // require user to confirm closing the dialog with unsaved changes
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(() => {
      this.discardChangesAndClose();
    });
  }

  /**
   * Saves the template
   */
  onSubmit(): void {
    // todo - when creating a new template need to verify the template key entered by the user does not currently exist in the db
    //  otherwise would overwrite existing template

    this.dtsService.saveTemplate(
      this.templateEditor.value.templateKey,
      this.templateEditor.value.author,
      this.templateEditor.value.templateData
    ).subscribe( data => {
      // TODO - notify if save failed
      this.dirty = false;
      this.existingTemplate = true;
      this.statusMessage = 'Template saved';
    });
  }

  /**
   * Displays a modal window containing a certificate populated with data
   */
  renderTemplate(): void {
    if (this.templateObject.docType && this.templateObject.templateKey && this.templateEditor.value.dataKey) {
      this.dtsService.renderTemplate(this.templateObject.docType, this.templateObject.templateKey, this.templateEditor.value.dataKey)
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
    // get the template prior to resetting the form
    const templateData = this.templateEditor.controls.templateData.value;

    this.templateEditor.reset();

    // copy the previous template into the form
    this.templateEditor.controls.templateData.setValue(templateData);

    // todo - need a way to get the user name for the currently logged in user
    this.templateEditor.controls.author.setValue('Unknown User');

    this.existingTemplate = false;  // creating a new template
    this.dirty = true;              // needs saving
  }

  /**
   * Fires when the content of the editor has changed - used to indicate when user has made changes
   * @param event information
   */
  editorChanged(event): void {
    this.dirty = true;
    this.statusMessage = '';
  }

  /**
   * Prompts the user to confirm closing the dialog with unsaved changes
   */
  discardChangesAndClose(): void {
    if (this.dirty) {
      const cn = confirm('Discard unsaved changes and close?');
      if (cn) {
        this.dialogRef.close();
      }
    }
    else {
      this.dialogRef.close();
    }
  }

  /**
   * CkEditor is loaded and ready
   * @param event information
   */
  editorReady(event): void {
    this.editorControl = event.editor;
  }
}
