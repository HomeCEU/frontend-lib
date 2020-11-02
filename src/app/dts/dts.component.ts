import {Component, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {DtsService} from './dts.service';
import {Template} from './template.types';
import {MatDialog} from '@angular/material/dialog';
import {TemplateEditorComponent} from './template-editor/template-editor.component';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-dts',
  templateUrl: './dts.component.html',
  styleUrls: ['./dts.component.scss']
})
export class DtsComponent {
  /**
   * List of templates as an observable
   */
  rows: Observable<Template[]>;

  /**
   * Selected template passed to the editor component
   */
  selectedTemplate: Template = null;

  dtsForm: FormGroup;
  dialogWidth = 1000;
  @ViewChild('templateTable') table: any;

  constructor(private dtsService: DtsService,
              private dialog: MatDialog,
              private formBuilder: FormBuilder) {

    this.rows = this.dtsService.getTemplates('enrollment');

    this.dtsForm = this.formBuilder.group({
      templateFilter: '',
    });
  }

  /**
   * Handle selection of a template
   * @param rowEvent event data for the activated row
   */
  rowClick(rowEvent): void {
    if (rowEvent.type === 'click' && rowEvent.column.name) {
      this.selectedTemplate = {... rowEvent.row} as Template;

      this.dialog.open(TemplateEditorComponent, {
        data: {
          templateId: this.selectedTemplate.templateId,
          docType: this.selectedTemplate.docType,
          templateKey: this.selectedTemplate.templateKey,
          author: this.selectedTemplate.author,
          createdAt: this.selectedTemplate.createdAt,
          bodyUri: this.selectedTemplate.bodyUri
        },
        minWidth: this.dialogWidth
      });
    }
  }

  /**
   * Launches dialog to create a new template
   */
  newTemplate(): void {
    this.dialog.open(TemplateEditorComponent, {
      data: {
        templateId: '',
        docType: 'enrollment',
        templateKey: '',
        author: '',
        createdAt: '',
        bodyUri: ''
      },
      minWidth: this.dialogWidth
    });
  }

  /**
   * Expand the row to dislay template details
   * @param row containing all fields
   */
  toggleExpandRow(row): void {
    this.table.rowDetail.toggleExpandRow(row);
  }
}
