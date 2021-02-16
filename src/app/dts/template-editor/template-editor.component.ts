import {Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DtsService} from '../dts.service';
import {Template} from '../template.types';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {debounceTime, switchMap} from 'rxjs/operators';
import {UnsubscribeOnDestroyAdapter} from '../unsubscribe-on-destroy-adapter';
import {DataField} from './data-field.types';
import {
  DATA_FIELD_STUDENT,
  DATA_FIELD_COURSE,
  DATA_FIELD_NURSING,
  DATA_FIELD_STANDARD
} from './data-fields';

declare var CKEDITOR: any;

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent extends UnsubscribeOnDestroyAdapter implements OnInit, OnDestroy {
  /**
   * Either creating or editing a template used to prevent changing the Template Name for an existing template
   */
  existingTemplate = false;

  /**
   * User setting to show/hide drag and drop data fields
   */
  dataFieldsVisible = localStorage.getItem('dataFieldsVisible') === null;

  /**
   * Used to display status messages
   */
  statusMessage = '';

  templateEditor: FormGroup;

  /**
   * Array of drag and drop data fields
   */
  dragAndDropDataFieldStudent: DataField[] = DATA_FIELD_STUDENT;
  dragAndDropDataFieldCourse: DataField[] = DATA_FIELD_COURSE;
  dragAndDropDataFieldNursing: DataField[] = DATA_FIELD_NURSING;
  dragAndDropDataFieldStandard: DataField[] = DATA_FIELD_STANDARD;

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
  }

  /**
   * Retrieves template and loads template data into the editor
   */
  ngOnInit(): void {
    this.templateEditor = this.formBuilder.group({
      templateKey: ['', [Validators.required, Validators.maxLength(40)]], // VARCHAR(255) in the database
      templateId: '',
      author: '',
      dataKey: ''
    });

    // registers event listeners for the CKEditor Control
    this.registerEditorEventListeners();

    // require user to confirm closing the dialog with unsaved changes
    this.dialogRef.disableClose = true;
    this.subs.sink = this.dialogRef.backdropClick().subscribe(() => {
      this.discardChangesAndClose();
    });
  }

  /**
   * Destroys the component
   */
  ngOnDestroy(): void {
    // Destroy the previously registered editor
    if (CKEDITOR.instances.editor1) {
      CKEDITOR.instances.editor1.destroy();
    }

    super.ngOnDestroy();
  }

  /**
   * Registers for CKEditor events for interacting with template data
   */
  registerEditorEventListeners(): void {
    CKEDITOR.replace('editor1', {
      on: {
        instanceReady: () => {
          // Editor created, fully initialized, and ready - populate form fields, load editor, and register template name change listener

          // When an item in the data field list is dragged, copy its data into the drag and drop data transfer.
          // This data is later read by the editor#paste listener in the datafield plugin.
          CKEDITOR.document.getById('dataFieldListStudent').on('dragstart', (evt) => {
            this.dragDataFieldElement(evt);
          });
          CKEDITOR.document.getById('dataFieldListCourse').on('dragstart', (evt) => {
            this.dragDataFieldElement(evt);
          });
          CKEDITOR.document.getById('dataFieldListStandardAcc').on('dragstart', (evt) => {
            this.dragDataFieldElement(evt);
          });
          CKEDITOR.document.getById('dataFieldListNursingAcc').on('dragstart', (evt) => {
            this.dragDataFieldElement(evt);
          });

          // update form fields with template data
          this.templateEditor.patchValue(this.templateObject);

          // load the editor with a template
          if (this.templateObject.docType && this.templateObject.templateKey) {
            this.loadEditorWithTemplate();
          }

          // register template name change listener
          this.validateTemplateName();
        },
        focus: () => {
          // Fired when the editor instance receives the input focus - clear any status messages
          this.statusMessage = '';
        }
      }
    });
  }

  loadEditorWithTemplate(): void {
    // retrieve template content for existing template
    this.subs.sink = this.dtsService.getTemplateByKey(this.templateObject.docType, this.templateObject.templateKey).subscribe(data => {
      CKEDITOR.instances.editor1.setData(data, () => {
        CKEDITOR.instances.editor1.resetDirty();
      });
      this.existingTemplate = true;
    });
  }

  /**
   * Handles dragging and dropping a data field into the template
   * @param evt element being dragged
   */
  dragDataFieldElement(evt): void {
    const target = evt.data.getTarget().getAscendant('li', true);

    // Initialization of the CKEditor 4 data transfer facade is a necessary step to extend and unify native
    // browser capabilities. For instance, Internet Explorer does not support any other data type than 'text' and 'URL'.
    // Note: evt is an instance of CKEDITOR.dom.event, not a native event.
    CKEDITOR.plugins.clipboard.initDragDataTransfer(evt);

    const dataTransfer = evt.data.dataTransfer;

    // Pass an object with data field details. Based on it, the editor#paste listener in the datafield plugin
    // will create the HTML code to be inserted into the editor.
    let dataField: DataField;
    const dataFieldElement = target.data('dataFieldElement');

    switch (target.data('dataFieldType')) {
      case 'student': {
        dataField = this.dragAndDropDataFieldStudent[dataFieldElement];
        break;
      }
      case 'course': {
        dataField = this.dragAndDropDataFieldCourse[dataFieldElement];
        break;
      }
      case 'standardAcc': {
        dataField = this.dragAndDropDataFieldStandard[dataFieldElement];
        break;
      }
      case 'NursingAcc': {
        dataField = this.dragAndDropDataFieldNursing[dataFieldElement];
        break;
      }
    }
    dataTransfer.setData('dataFieldElement', dataField);

    // We need to set some normal data types to backup values for two reasons:
    // * In some browsers this is necessary to enable drag and drop into text in the editor.
    // * The content may be dropped in another place than the editor.
    dataTransfer.setData('text/html', target.getText());
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
          this.statusMessage = 'Template name is in use. Please choose another name.';
          this.templateEditor.get('templateKey').setErrors(({inuse: true}));
        }
        else {
          this.statusMessage = '';
        }
      });
  }

  /**
   * Saves the template
   */
  onSubmit(): void {
    if (CKEDITOR.instances.editor1.mode === 'source') {
      alert('Switch to wysiwyg mode to save. No changes saved.');
      return;
    }
    if (!CKEDITOR.instances.editor1.checkDirty() && this.existingTemplate) {
      alert('Template is not dirty. No changes saved.');
      return;
    }

    // prepare data for saving
    let templateData = CKEDITOR.instances.editor1.getData();
    templateData = this.translateForSaving(templateData);

    this.subs.sink = this.dtsService.saveTemplate(
      this.templateEditor.value.templateKey,
      this.templateEditor.value.author,
      templateData
    ).subscribe(
      (result) => {
        if (!this.templateObject.templateId) {
          // populate new template object with data from the save result
          Object.assign(this.templateObject, result);
        }
        CKEDITOR.instances.editor1.resetDirty();
        this.existingTemplate = true;
        this.statusMessage = 'Template saved.';
      },
      (error) => {
        console.error('Save failed: ', error);
        this.statusMessage = 'Save failed. Please try again.';
      });
  }

  /**
   * Prepares data for saving to the backend by converting character codes
   * @param templateText to convert
   */
  translateForSaving(templateText): string {
    // translate partial data fields
    templateText = templateText.replaceAll('{{&gt;', '{{>');

    // translate single quotes
    templateText = templateText.replaceAll('&#39;', '\'');

    return templateText;
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

  /**
   * Checks if the user can create a new template by copying the existing template.
   */
  canCopy(): boolean {
    return !this.existingTemplate || CKEDITOR.instances.editor1.checkDirty();
  }

  /**
   * Shows/hides the list of drag and drop data fields
   */
  toggleDataFields(): void {
    this.dataFieldsVisible = !this.dataFieldsVisible;
    this.dataFieldsVisible ? localStorage.removeItem('dataFieldsVisible') : localStorage.setItem('dataFieldsVisible', '');
  }
}
