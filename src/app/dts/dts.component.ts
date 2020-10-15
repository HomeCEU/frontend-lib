import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {DtsService} from './dts.service';
import {Template} from './template.types';

@Component({
  selector: 'app-dts',
  templateUrl: './dts.component.html',
  styleUrls: ['./dts.component.scss']
})
export class DtsComponent {
  /**
   * List of templates as an observable.
   */
  rows: Observable<Template[]>;

  /**
   * Columns in the data grid.
   */
  columns = [
    { prop: 'author', name: 'Author'},
    { prop: 'templateKey', name: 'Template Key'},
    { prop: 'templateId', name: 'Template Id'},
    { prop: 'createdAt', name: 'Created'}
  ];

  constructor(private dtsService: DtsService) {
  }

  /**
   * Populates the data grid with a list of templates.
   * @param documentType indicates type of document
   */
  getTemplates(documentType?: string): void {
    this.rows = this.dtsService.getTemplates(documentType);
  }

  /**
   * Handle row click
   * @param rowEvent event data for the activated row
   */
  rowClick(rowEvent): void {
    if (rowEvent.type === 'click') {
      this.dtsService.getTemplateByKey(rowEvent.row.docType, rowEvent.row.templateKey).subscribe(data => {
        // TODO: CEMS 2078 - Frontend DTS displays selected template in template editor
        console.log(data);
      });
    }
  }
}
