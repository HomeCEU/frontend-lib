import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {DtsService} from './dts.service';
import {Template} from './models/template.types';
import {MatDialog} from '@angular/material/dialog';
import {TemplateEditorComponent} from './template-editor/template-editor.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, switchMap} from 'rxjs/operators';
import {UnsubscribeOnDestroyAdapter} from './unsubscribe-on-destroy-adapter';
import {TemplateTypeEnum} from './models/templateTypeEnum';

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

  templateTypeEnum: typeof  TemplateTypeEnum = TemplateTypeEnum;

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
   * Type of template
   */
  templateType = TemplateTypeEnum.template;

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
        console.log(`v1.4 User: ${this.userName}  Status: ${status}  Endpoint: ${this.dtsService.url}`);
      },
      error => {
        console.error(`Failed to connect to ${this.dtsService.url} - ${error.message}`);
      });

    // populate grid with template data
    this.rows = this.dtsService.getTemplates(this.templateType);

    this.dtsForm = this.formBuilder.group({
      templateFilter: '',
      searchOptions: ['enrollment']
    });

    this.registerReactiveFormFields();
  }

  /**
   * Listens to form field changes
   */
  registerReactiveFormFields(): void {
    // handle changing document type and refreshing the data grid
    this.subs.sink = this.dtsForm.get('searchOptions').valueChanges.subscribe(val => {
      this.templateType = val;
      this.rows = this.dtsService.getTemplates(this.templateType);
      this.table.offset = 0;
    });

    // filter grid of templates by template name and author
    this.subs.sink = this.dtsForm.get('templateFilter').valueChanges.pipe(
      debounceTime(500),
      switchMap(() => this.dtsService.getTemplates(this.templateType))
    ).subscribe( templates => {
      const searchTerm = this.dtsForm.controls.templateFilter.value;
      if (searchTerm) {
        templates = templates.filter(data => data.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

      const templateDialog = this.dialog.open(TemplateEditorComponent, {
        data: {
          id: this.selectedTemplate.id,
          docType: this.selectedTemplate.docType,
          key: this.selectedTemplate.key,
          author: this.userName,
          createdAt: this.selectedTemplate.createdAt,
          bodyUri: this.selectedTemplate.bodyUri,
          metadata: this.selectedTemplate.metadata
        },
        minWidth: this.dialogWidth
      });

      templateDialog.afterClosed().subscribe(() => {
        this.rows = this.dtsService.getTemplates(this.templateType);
      });
    }
  }

  /**
   * Launches dialog to create a new template
   */
  newTemplate(): void {
    const templateDialog = this.dialog.open(TemplateEditorComponent, {
      data: {
        id: '',
        docType: 'enrollment',
        key: '',
        author: this.userName,
        createdAt: '',
        bodyUri: '',
        metadata: {
          type: this.templateType
        }
      },
      minWidth: this.dialogWidth
    });

    templateDialog.afterClosed().subscribe(() => {
      this.rows = this.dtsService.getTemplates(this.templateType);
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
