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
   * List of templates as an observable
   */
  rows: Observable<Template[]>;

  /**
   * Prevent CKEditor error when editor tab is not active and no instance of the editor exists
   */
  showEditor = false;

  /**
   * Selected template passed to the editor component
   */
  selectedTemplate: Template = null;

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
    this.rows = this.dtsService.getTemplates('enrollment');
  }

  /**
   * Handle selection of a template
   * @param rowEvent event data for the activated row
   */
  rowClick(rowEvent): void {
    if (rowEvent.type === 'click') {
      this.selectedTemplate = {... rowEvent.row} as Template;
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
