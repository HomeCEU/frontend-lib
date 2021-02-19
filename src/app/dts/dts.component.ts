import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {DtsService} from './dts.service';
import {Template} from './template.types';
import {MatDialog} from '@angular/material/dialog';
import {TemplateEditorComponent} from './template-editor/template-editor.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, switchMap} from 'rxjs/operators';
import {UnsubscribeOnDestroyAdapter} from './unsubscribe-on-destroy-adapter';
import {DocumentTypeEnum} from './models/documentType.enum';

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

  /**
   * Type of document
   */
  documentType = DocumentTypeEnum.Enrollment;

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
        console.log(`v1.2 User: ${this.userName}  Status: ${status}  Endpoint: ${this.dtsService.url}`);
      },
      error => {
        console.error(`Failed to connect to ${this.dtsService.url} - ${error.message}`);
      });

    // populate grid with template data
    this.rows = this.dtsService.getTemplates(this.documentType);

    this.dtsForm = this.formBuilder.group({
      templateFilter: '',
      searchOptions: ['enrollment']
    });

    this.registerReactiveFormFields();
  }

  /**
   * Listents to form field changes
   */
  registerReactiveFormFields(): void {
    // handle changing document type and refreshing the data grid
    this.subs.sink = this.dtsForm.get('searchOptions').valueChanges.subscribe(val => {
      this.documentType = val;
      this.rows = this.dtsService.getTemplates(this.documentType);
      this.table.offset = 0;
    });

    // filter grid of templates by template name and author
    this.subs.sink = this.dtsForm.get('templateFilter').valueChanges.pipe(
      debounceTime(500),
      switchMap(() => this.dtsService.getTemplates(this.documentType))
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
    // todo - temporary fix to disable editing partials and images, see CEMS-2255
    if (rowEvent.type === 'click' && rowEvent.column.name && rowEvent.row.docType === 'enrollment') {
      this.selectedTemplate = {... rowEvent.row} as Template;

      const templateDialog = this.dialog.open(TemplateEditorComponent, {
        data: {
          templateId: this.selectedTemplate.templateId,
          docType: this.selectedTemplate.docType,
          templateKey: this.selectedTemplate.templateKey,
          author: this.userName,
          createdAt: this.selectedTemplate.createdAt,
          bodyUri: this.selectedTemplate.bodyUri
        },
        minWidth: this.dialogWidth
      });

      templateDialog.afterClosed().subscribe(() => {
        this.rows = this.dtsService.getTemplates(this.documentType);
      });
    }
  }

  /**
   * Launches dialog to create a new template
   */
  newTemplate(): void {
    const templateDialog = this.dialog.open(TemplateEditorComponent, {
      data: {
        templateId: '',
        docType: this.documentType,
        templateKey: '',
        author: this.userName,
        createdAt: '',
        bodyUri: ''
      },
      minWidth: this.dialogWidth
    });

    templateDialog.afterClosed().subscribe(() => {
      this.rows = this.dtsService.getTemplates(this.documentType);
    });
  }

  /**
   * Expand the row to display template details
   * @param row containing all fields
   */
  toggleExpandRow(row): void {
    this.table.rowDetail.toggleExpandRow(row);
  }
}
