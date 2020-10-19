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
        this.templateEditor.controls['templateData'].setValue(data);
        this.templateEditor.controls['templateKey'].setValue(this.templateObject.templateKey);
        this.templateEditor.controls['templateId'].setValue(this.templateObject.templateId);
        this.templateEditor.controls['author'].setValue(this.templateObject.author);
      });
    }
  }
}
