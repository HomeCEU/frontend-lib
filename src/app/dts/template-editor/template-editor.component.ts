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
   * Enable/disable template changes
   */
  canSave = false;

  /**
   * Original template content
   */
  originalTemplate = null;

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

  constructor(private dtsService: DtsService, private formBuilder: FormBuilder) {
    this.templateEditor = this.formBuilder.group({
      templateData: new FormControl(),
      templateKey: new FormControl(),
      templateId: new FormControl(),
      author: new FormControl()
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

    // trap template changes
    this.templateEditor.get('templateData').valueChanges.subscribe(val => {
      if (this.originalTemplate) {
        // changes made so enable save
        // TODO - compare "val" against "originalTemplate" to determine if actual changes were made
        this.canSave = true;
      }
      else {
        // template is loaded into the editor in "preview" mode - do not enable saving
        this.originalTemplate = val;
      }
    });
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
      // TODO - will remove this at a later point
      console.log(data);
    });
  }
}
