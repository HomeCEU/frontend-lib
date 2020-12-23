import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DtsService} from '../dts.service';
import {Template} from '../template.types';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {debounceTime, switchMap} from 'rxjs/operators';
import {UnsubscribeOnDestroyAdapter} from '../unsubscribe-on-destroy-adapter';

export declare var CKEDITOR: any;

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

  DATAFIELDS = [{
      name: '{{ student.fistName }}',
      avatar: 'student'
    },
    {
      name: '{{ course.name }}',
      avatar: 'course'
    }
  ];

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

    // registers the drag and drop custom plugin
    this.registerEditorPlugin();

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
      extraPlugins: 'hcard, sourcedialog',
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

    CKEDITOR.on('instanceReady', (event) => {
      // When an item in the data field list is dragged, copy its data into the drag and drop data transfer.
      // This data is later read by the editor#paste listener in the hcard plugin.
      CKEDITOR.document.getById('dataFieldList').on('dragstart', (evt) => {
        // The target may be some element inside the draggable div (e.g. the image), so get the div.data-field.
        const target = evt.data.getTarget().getAscendant('div', true);

        // Initialization of the CKEditor 4 data transfer facade is a necessary step to extend and unify native
        // browser capabilities. For instance, Internet Explorer does not support any other data type than 'text' and 'URL'.
        // Note: evt is an instance of CKEDITOR.dom.event, not a native event.
        CKEDITOR.plugins.clipboard.initDragDataTransfer(evt);

        const dataTransfer = evt.data.dataTransfer;

        // Pass an object with data field details. Based on it, the editor#paste listener in the hcard plugin
        // will create the HTML code to be inserted into the editor. You could set 'text/html' here as well, but:
        // * It is a more elegant and logical solution that this logic is kept in the hcard plugin.
        // * We do not know now where the content will be dropped and the HTML to be inserted
        // might vary depending on the drop target.
        dataTransfer.setData('contact', this.DATAFIELDS[target.data('contact')]);

        // We need to set some normal data types to backup values for two reasons:
        // * In some browsers this is necessary to enable drag and drop into text in the editor.
        // * The content may be dropped in another place than the editor.
        dataTransfer.setData('text/html', target.getText());

        // We can still access and use the native dataTransfer - e.g. to set the drag image.
        // Note: IEs do not support this method... :(.
        if (dataTransfer.$.setDragImage) {
          dataTransfer.$.setDragImage(target.findOne('img').$, 0, 0);
        }
      });
    });

    CKEDITOR.instances.editor1.on('focus', (event) => {
      this.statusMessage = '';
    });
  }

  /**
   * Custom plugin allows moving data fields within the template editor when in wysiwyg mode
   */
  registerEditorPlugin(): void {
    const plugins = CKEDITOR.instances.editor1.plugins;
    try {
      CKEDITOR.plugins.add('hcard', {
        requires: 'widget',

        init(editor): void {
          editor.widgets.add('hcard', {
            allowedContent: 'span(!data-field); a[href](!p-name);',
            requiredContent: 'span(data-field)',
            pathName: 'hcard',

            upcast: (el) => {
              return el.name === 'span' && el.hasClass('data-field');
            }
          });

          // This feature does not have a button, so it needs to be registered manually.
          editor.addFeature(editor.widgets.registered.hcard);

          // Handle dropping a data field by transforming the data field object into HTML.
          // Note: All pasted and dropped content is handled in one event - editor#paste.
          editor.on('paste', (evt) => {
            const dataField = evt.data.dataTransfer.getData('contact');
            if (!dataField) {
              return;
            }

            evt.data.dataValue =
              '<span class="data-field">' + dataField.name +
              ' ' +
              '</span>';
          });
        }
      });
    }
    catch (error) {
      // todo - ignore error for now - need to find out and fix why this errors on second load of an editor
    }
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

  /**
   * Checks if the user can create a new template by copying the existing template.
   */
  canCopy(): boolean {
    return !this.existingTemplate || CKEDITOR.instances.editor1.checkDirty();
  }

  /**
   * Checks if the user can save the current template.  Must be dirty, a valid form, and in source mode.
   */
  canSave(): boolean {
    const isDirty = CKEDITOR.instances.editor1.checkDirty();
    const sourceMode = CKEDITOR.instances.editor1.mode === 'source';
    const canSave = isDirty && sourceMode && !this.templateEditor.invalid;
    return canSave;
  }
}
