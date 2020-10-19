import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {DtsService} from './dts.service';
import {Template} from './template.types';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {map} from 'rxjs/operators';

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
   * Prevent CKEditor error when editor tab is not active and no instance of the editor exists
   */
  showEditor = false;

  /**
   * Selected template whch is passed to the editor component
   */
  selectedTemplate: Template = null;

  dtsForm: FormGroup;

  /**
   * Columns in the data grid.
   */
  columns = [
    { prop: 'author', name: 'Author'},
    { prop: 'templateKey', name: 'Template Key'},
    { prop: 'templateId', name: 'Template Id'},
    { prop: 'createdAt', name: 'Created'}
  ];

  constructor(private dtsService: DtsService, private formBuilder: FormBuilder) {
    this.dtsForm = this.formBuilder.group({
      templateKey: new FormControl()
    });

    this.rows = this.dtsService.getTemplates('enrollment');

    this.onValueChanges();
  }

  /**
   * Filters templates by the user entered template key
   */
  onValueChanges(): void {
    this.dtsForm.valueChanges.subscribe(val => {
      this.rows = this.dtsService.getTemplates('enrollment')
        .pipe(
          map(templates => templates.filter( (template) => {
            return template.templateKey.toLowerCase().includes(val.templateKey.toLowerCase());
        })));
    });
  }

  /**
   * Handle selection of a template
   * @param rowEvent event data for the activated row
   */
  rowClick(rowEvent): void {
    if (rowEvent.type === 'click') {

      this.dtsForm.controls['templateKey'].setValue(rowEvent.row.templateKey);

      this.selectedTemplate = new class implements Template {
        author: string;
        bodyUri: string;
        createdAt: string;
        docType: string;
        templateId: string;
        templateKey: string;
      };
      this.selectedTemplate.docType = rowEvent.row.docType;
      this.selectedTemplate.templateKey = rowEvent.row.templateKey;
      this.selectedTemplate.createdAt =  rowEvent.row.createdAt;
      this.selectedTemplate.templateId =  rowEvent.row.templateId;
      this.selectedTemplate.author =  rowEvent.row.author;
    }
  }

  /**
   * Handles selections of a tab
   * @param tab selected
   */
  tabClick(tab): void {
    if (tab.index === 1) {
      this.showEditor = true;
    }
  }
}
