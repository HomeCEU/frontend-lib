import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TemplateEditorComponent} from './template-editor.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {Template} from '../template.types';
import {of, throwError} from 'rxjs';
import {DtsService} from '../dts.service';
import {certificate, editorBodyTemplate, template} from '../../../test/template';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {templatesAll} from '../../../test/templates';

/**
 * Initializes the editor with a template
 * @param component to display
 */
function loadEditor(component: TemplateEditorComponent): void {
  // specify the doc type and template to load
  component.templateObject.docType = 'enrollment';
  component.templateObject.templateKey = 'dummyTemplateKey';

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

  it('should get a template by template key on initialization and allow edit', (done) => {
    spyOn(dtsService, 'getTemplateByKey').and.returnValue(of(template));

    loadEditor(component);

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
    spyOn(dtsService, 'getTemplateByKey').and.returnValue(of(template));
    spyOn(dtsService, 'saveTemplate').and.returnValue(of(templatesAll.items[0]));

    loadEditor(component);

    // wait for editor to display the template
    setTimeout(() => {
      expect(component.statusMessage).toEqual('');

      // trigger the CKEditor Dirty Flag
      const editorData = fixture.debugElement.nativeElement.querySelectorAll('.cke_wysiwyg_frame');
      editorData[0].contentDocument.body.innerHTML = '<p>New Template</p>';

      component.onSubmit();

      expect(component.statusMessage).toEqual('Template saved.');
      expect(component.templateObject.templateId).toEqual('2fa85f64-5717-4562-b3fc-2c963f66afa6');

      done();
    }, 1000);
  });

  it('should handle an error when saving a template', (done) => {
    spyOn(dtsService, 'getTemplateByKey').and.returnValue(of(template));
    spyOn(dtsService, 'saveTemplate').and.returnValue(throwError({
      error: {
        code: '403'
      }
    }));

    loadEditor(component);

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
    spyOn(dtsService, 'getTemplateByKey').and.returnValue(of(template));

    loadEditor(component);

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

  // may remove this as there's a cypress test for this scenario
  xit('should render a template', (done) => {
    spyOn(dtsService, 'getTemplateByKey').and.returnValue(of(template));
    spyOn(dtsService, 'renderTemplate').and.returnValue(of(certificate));

    const doc = jasmine.createSpyObj('document', ['open', 'write', 'close']);
    const windowDialog = jasmine.createSpyObj('modal', ['']);
    windowDialog.document = doc;
    spyOn(window, 'open').and.returnValue(windowDialog);

    component.templateEditor.controls.dataKey.setValue('123456');
    loadEditor(component);

    // wait for editor to display the template
    setTimeout(() => {
      // switch display mode from code to wysiwyg
      const sourceButton = fixture.debugElement.nativeElement.querySelector('.cke_button__source');
      sourceButton.click();
      component.renderTemplate();

      expect(window.open).toHaveBeenCalled();
      expect(doc.open).toHaveBeenCalled();
      expect(doc.write).toHaveBeenCalled();
      expect(doc.close).toHaveBeenCalled();

      done();
    }, 1000);
  });

});
