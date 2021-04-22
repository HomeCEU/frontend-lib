import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TemplateEditorComponent} from './template-editor.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {Template} from '../models/template.types';
import {of, throwError} from 'rxjs';
import {DtsService} from '../dts.service';
import {editorBodyTemplate, template} from '../../../test/template';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {templatesEnrollment, templatesImage, templatesPartial} from '../../../test/templates';
import {TemplateTypeEnum} from '../models/templateTypeEnum';

/**
 * Initializes the editor with a template
 * @param component to display
 */
function loadEditorWithTemplate(component: TemplateEditorComponent): void {
  // specify the doc type and template to load
  component.templateObject.docType = 'enrollment';
  component.templateObject.key = 'dummyTemplateKey';

  // for testing we need to recreate the component with the template noted above
  component.ngOnDestroy();
  component.ngOnInit();
}

/**
 * Initializes the editor with a partial
 * @param component to display
 */
function loadEditorWithPartial(component: TemplateEditorComponent): void {
  // specify the doc type and template to load
  component.templateObject.docType = 'enrollment';
  component.templateObject.key = 'dummyTemplateKey';
  component.templateObject.metadata = {
    type: 'partial'
  };

  // for testing we need to recreate the component with the template noted above
  component.ngOnDestroy();
  component.ngOnInit();
}

describe('TemplateEditorComponent', () => {
  let component: TemplateEditorComponent;
  let fixture: ComponentFixture<TemplateEditorComponent>;
  let dtsService: DtsService;
  const expectedBodyTemplate = editorBodyTemplate.replace(/(\r\n|\n|\r)/gm, '');

  const dialogMock = {
    disableClose: true,
    close: () => {},
    backdropClick: () => of({})
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        TemplateEditorComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
      ],
      providers: [
        HttpClient,
        HttpHandler,
        FormBuilder,
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: dialogMock}
      ]
    })
    .compileComponents();

    dtsService = TestBed.inject(DtsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateEditorComponent);
    component = fixture.componentInstance;

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(dtsService, 'getTemplates')
      .withArgs(TemplateTypeEnum.partial).and.returnValue(of(templatesPartial.items))
      .withArgs(TemplateTypeEnum.image).and.returnValue(of(templatesImage.items));

    component.templateObject = {} as Template;

    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create',  () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and allow creating a new template', (done) => {
    const expectedBody = `<p><br></p>`;

    // wait for editor to display the default template
    setTimeout(() => {
      // get the template content from the CK Editor rendered in an iFrame
      const editorData = fixture.debugElement.nativeElement.querySelectorAll('.cke_wysiwyg_frame');
      const content = editorData[0].contentDocument;

      // verify the CK Editor control has displayed the default template markup
      expect(content.body.innerHTML).toEqual(expectedBody);

      done();
    }, 1000);
  });

  it('should initialize and allow creating a new partial template', (done) => {
    const expectedBody = `<br>`;

    loadEditorWithPartial(component);

    // wait for editor to display the default template
    setTimeout(() => {
      // get the template content from the CK Editor rendered in an iFrame
      const editorData = fixture.debugElement.nativeElement.querySelectorAll('.cke_wysiwyg_frame');
      const content = editorData[0].contentDocument;

      // verify the CK Editor control has displayed the default partial template markup
      expect(content.body.innerHTML).toEqual(expectedBody);

      done();
    }, 1000);
  });

  it('should get a template by template id on initialization and allow edit', (done) => {
    spyOn(dtsService, 'getTemplateContentById').and.returnValue(of(template));

    loadEditorWithTemplate(component);

    // wait for editor to display the template
    setTimeout(() => {
      // get the template content from the CK Editor rendered in an iFrame
      const editorData = fixture.debugElement.nativeElement.querySelectorAll('.cke_wysiwyg_frame');
      const content = editorData[0].contentDocument;

      expect(content.body.innerHTML).toEqual(expectedBodyTemplate);

      done();
    }, 1000);
  });

  it('should save a template', (done) => {
    spyOn(dtsService, 'getTemplateContentById').and.returnValue(of(template));
    spyOn(dtsService, 'saveTemplate').and.returnValue(of(templatesEnrollment.items[0]));

    loadEditorWithTemplate(component);

    // wait for editor to display the template
    setTimeout(() => {
      expect(component.statusMessage).toEqual('');

      // trigger the CKEditor Dirty Flag
      const editorData = fixture.debugElement.nativeElement.querySelectorAll('.cke_wysiwyg_frame');
      editorData[0].contentDocument.body.innerHTML = '<p>New Template</p>';

      component.onSubmit();

      expect(component.statusMessage).toEqual('Template saved.');
      expect(component.templateObject.id).toEqual('3fa85f64-5717-4562-b3fc-2c963f66afa6');

      done();
    }, 1000);
  });

  it('should handle an error when saving a template', (done) => {
    spyOn(dtsService, 'getTemplateContentById').and.returnValue(of(template));
    spyOn(dtsService, 'saveTemplate').and.returnValue(throwError({
      error: {
        code: '403'
      }
    }));

    loadEditorWithTemplate(component);

    // wait for editor to display the template
    setTimeout(() => {
      // trigger the CKEditor Dirty Flag
      const editorData = fixture.debugElement.nativeElement.querySelectorAll('.cke_wysiwyg_frame');
      editorData[0].contentDocument.body.innerHTML = '<p>New Template</p>';

      component.onSubmit();

      expect(component.statusMessage).toEqual('Save failed. Please try again.');

      done();
    }, 1000);
  });

  it('should copy a template', (done) => {
    spyOn(dtsService, 'getTemplateContentById').and.returnValue(of(template));

    loadEditorWithTemplate(component);

    // wait for editor to display the template
    setTimeout(() => {
      const editorData = fixture.debugElement.nativeElement.querySelectorAll('.cke_wysiwyg_frame');
      expect(editorData[0].contentDocument.body.innerHTML).toEqual(expectedBodyTemplate);

      component.copyTemplate();

      const editorDataCopied = fixture.debugElement.nativeElement.querySelectorAll('.cke_wysiwyg_frame');
      expect(editorDataCopied[0].contentDocument.body.innerHTML).toEqual(expectedBodyTemplate);

      done();
    }, 1000);
  });
});
