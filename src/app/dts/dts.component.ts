import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {DtsService} from './dts.service';
import {Template} from './template.types';
import {environment} from '../../environments/environment.prod';

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
   * Row columns in the data grid.
   */
  columns = [
    { prop: 'author', name: 'Author'},
    { prop: 'templateKey', name: 'Template Key'},
    { prop: 'templateId', name: 'Template Id'},
    { prop: 'createdAt', name: 'Created'}
  ];

  constructor(private dtsService: DtsService) {
    console.log(environment.production);
  }

  /**
   * Populates the data grid with a list of templates.
   */
  getTemplates(): void {
    this.rows = this.dtsService.getTemplates();
  }
}
