import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DtsService} from '../dts.service';
import {Template} from '../template.types';

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent implements OnInit {

  /**
   * Template to edit
   */
  @Input()
  templateObject: Template;

  /**
   * Indicator to display message indicating template saved
   */
  templateSaved = false;

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
    height: '700px',
    on: {
      // Fired after setting the editing mode. Cannot bind to the event in the template.
      mode(event): void {
        const disableSaveButtonCss = ' mat-button-disabled';
        const saveButton = document.getElementById('saveButton') as HTMLInputElement;
        if (event.editor.mode === 'source') {
          saveButton.disabled = true;
          saveButton.className += disableSaveButtonCss;
        }
        else {
          saveButton.disabled = false;
          saveButton.className = saveButton.className.replace(disableSaveButtonCss, '');
        }
      }
    }
  };

  templateEditor: FormGroup;

  constructor(private dtsService: DtsService, private formBuilder: FormBuilder) {
    this.templateEditor = this.formBuilder.group({
      templateData: '',
      templateKey: '',
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
      this.dtsService.getTemplateByKey(this.templateObject.docType, this.templateObject.templateKey).subscribe(data => {
        this.templateEditor.controls['templateData'].setValue(data, { emitEvent: false });
        this.templateEditor.controls['templateKey'].setValue(this.templateObject.templateKey);
        this.templateEditor.controls['templateId'].setValue(this.templateObject.templateId);
        this.templateEditor.controls['author'].setValue(this.templateObject.author);
      });
    }
  }

  /**
   * Saves the template
   */
  onSubmit(): void {
    this.dtsService.saveTemplate(
      this.templateEditor.value.templateKey,
      this.templateEditor.value.author,
      this.templateEditor.value.templateData
    ).subscribe( data => {
      // TODO - remove console log and notify if save failed
      this.templateSaved = true;
      console.log(data);
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
}
