import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {DtsService} from './dts.service';
import {Template} from './template.types';
import {MatDialog} from '@angular/material/dialog';
import {TemplateEditorComponent} from './template-editor/template-editor.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, switchMap} from 'rxjs/operators';
import {UnsubscribeOnDestroyAdapter} from './unsubscribe-on-destroy-adapter';

@Component({
  selector: 'app-dts',
  templateUrl: './dts.component.html',
  styleUrls: ['./dts.component.scss']
})
export class DtsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  /**
   * List of templates as an observable
   */
  rows: Observable<Template[]>;

  /**
   * Selected template passed to the editor component
   */
  selectedTemplate: Template = null;

  /**
   * Unique user identifier for saving
   */
  userName: string;

  /**
   * Angular reactive form group control
   */
  dtsForm: FormGroup;

  dialogWidth = 1200;

  /**
   * Id of data table
   */
  @ViewChild('templateTable') table: any;

  /**
   * Constructor
   * @param elm attributes from the root component
   * @param dtsService api for communicating with the backend
   * @param dialog modal for creating/editing templates
   * @param formBuilder controls
   */
  constructor(private elm: ElementRef,
              private dtsService: DtsService,
              private dialog: MatDialog,
              private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.userName = this.elm.nativeElement.getAttribute('userName');
    this.dtsService.url = this.elm.nativeElement.getAttribute('dtsUrl');

    this.subs.sink = this.dtsService.getStatus().subscribe(
      status => {
        console.log(`User: ${this.userName}  Status: ${status}  Endpoint: ${this.dtsService.url}`);
      },
      error => {
        console.error(`Failed to connect to ${this.dtsService.url} - ${error.message}`);
      });

    this.rows = this.dtsService.getTemplates('enrollment');

    this.dtsForm = this.formBuilder.group({
      templateFilter: '',
    });

    // filter grid of templates by template name and author
    this.subs.sink = this.dtsForm.get('templateFilter').valueChanges.pipe(
      debounceTime(500),
      switchMap(() => this.dtsService.getTemplates('enrollment'))
    ).subscribe( templates => {
      const searchTerm = this.dtsForm.controls.templateFilter.value;
      if (searchTerm) {
        templates = templates.filter(data => data.templateKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.author.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      this.rows = of(templates);
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
          author: this.userName,
          createdAt: this.selectedTemplate.createdAt,
          bodyUri: this.selectedTemplate.bodyUri
        },
        height : 'auto',
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
        author: this.userName,
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
