import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {DtsService} from './dts.service';
import {Template} from './template.types';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-dts',
  templateUrl: './dts.component.html',
  styleUrls: ['./dts.component.scss']
})
export class DtsComponent {
  rows: Observable<Template>;
  templateForm: FormGroup;

  columns = [
    { prop: 'author', name: 'Author'},
    { prop: 'templateKey', name: 'Template Key'},
    { prop: 'templateId', name: 'Template Id'},
    { prop: 'createdAt', name: 'Created'}
  ];

  constructor(private dtsService: DtsService, private formBuilder: FormBuilder) {

    this.templateForm = this.formBuilder.group({
      searchValue: new FormControl('enrollment'),
      type: new FormControl()
    });
  }

  getTemplates(): void {
    const searchValue = this.templateForm.controls['searchValue'].value;
    const searchType = this.templateForm.controls['type'].value;

    this.rows = this.dtsService.getTemplates(searchType, searchValue);
  }
}
