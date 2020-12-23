import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TemplateEditorComponent} from './template-editor.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {Template} from '../template.types';
import {of, throwError} from 'rxjs';
import {DtsService} from '../dts.service';
import {certificate, template} from '../../../test/template';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {templatesAll} from '../../../test/templates';

import { CKEDITOR } from './template-editor.component';

xdescribe('TemplateEditorComponent', () => {
  let component: TemplateEditorComponent;
  let fixture: ComponentFixture<TemplateEditorComponent>;
  let dtsService: DtsService;
  const expectedBodyTemplate = `<div id="container" class="page"><p style="text-align:center;">Enrollment #: <span class="char-style-override-6">{{ enrollmentId }}</span></p><p><span class="char-style-override-2" style="line-height: 1.2;">Course Certificate</span></p><p><span class="char-style-override-3">This is to certify</span></p><p><span class="char-style-override-1">{{ student.firstName }} {{ student.lastName }}&nbsp;-&nbsp;{{~#each student.licenses as |license|~}}{{license.state}} {{license.type}} {{license.number}}{{#unless @last}}; {{/unless}}{{~/each~}}</span></p><p><span>has successfully completed </span><span class="char-style-override-1">{{ course.hours }} contact hours</span><span>{{#if (eq course.format 'live')}}Live Continuing Education{{else}}continuing education online training{{/if}} on the topic of:</span></p><p><span class="char-style-override-4">{{ course.name }}</span><br>{{#if course.authors}}{{#with course.authors as |authors|}}Course Speakers:{{#each authors~}}{{this}}{{#unless @last}} | {{/unless}}{{~/each}}{{/with}}{{/if}}</p><p><span>Presented by HomeCEUConnection.com, 5048 Tennyson Pkwy, Suite 200 Plano TX 75024</span></p><p><span>Course completed on {{ completionDate }}</span></p></div>`;

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

  it('should create',  () => {
    // const temp = CKEDITOR;
    expect(component).toBeTruthy();
  });

  it('should initialize and allow creating a new template', (done) => {
    const expectedBody = `<p><br></p>`;

    // wait for editor to display the default template
    setTimeout(() => {
      // switch display mode from code to wysiwyg
      const sourceButton = fixture.debugElement.nativeElement.querySelector('.cke_button__source');
      sourceButton.click();

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

    component.templateObject.docType = 'enrollment';
    component.templateObject.templateKey = 'dummyTemplateKey';
    component.ngOnInit();

    // verify the form control has received the template data
    expect(component.templateEditor.controls.templateData.value).toEqual(template);

    // wait for editor to display the template
    setTimeout(() => {
      // switch display mode from code to wysiwyg
      const sourceButton = fixture.debugElement.nativeElement.querySelector('.cke_button__source');
      sourceButton.click();

      // get the template content from the CK Editor rendered in an iFrame
      const editorData = fixture.debugElement.nativeElement.querySelectorAll('.cke_wysiwyg_frame');
      const content = editorData[0].contentDocument;

      // verify the CK Editor control has received and displayed the template data
      expect(content.body.innerHTML).toEqual(expectedBodyTemplate);
     // expect(component.dirty).toBeFalse();

      done();
    }, 1000);
  });

  it('should save a template', (done) => {
    spyOn(dtsService, 'getTemplateByKey').and.returnValue(of(template));
    spyOn(dtsService, 'saveTemplate').and.returnValue(of(templatesAll.items[0]));

    component.templateObject.docType = 'enrollment';
    component.templateObject.templateKey = 'dummyTemplateKey';
    component.ngOnInit();

    // verify the form control has received the template data
    expect(component.templateEditor.controls.templateData.value).toEqual(template);

    // wait for editor to display the template
    setTimeout(() => {
      // switch display mode from code to wysiwyg
      const sourceButton = fixture.debugElement.nativeElement.querySelector('.cke_button__source');
      sourceButton.click();
      // component.editorChanged(null);

      expect(component.statusMessage).toEqual('');

      component.onSubmit();

      expect(component.statusMessage).toEqual('Template saved');

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

    component.templateObject.docType = 'enrollment';
    component.templateObject.templateKey = 'dummyTemplateKey';
    component.ngOnInit();

    // verify the form control has received the template data
    expect(component.templateEditor.controls.templateData.value).toEqual(template);

    // wait for editor to display the template
    setTimeout(() => {
      // switch display mode from code to wysiwyg
      const sourceButton = fixture.debugElement.nativeElement.querySelector('.cke_button__source');
      sourceButton.click();
      // component.editorChanged(null);

      expect(component.templateEditor.errors?.saveFailed).toBeUndefined();

      component.onSubmit();

      expect(component.templateEditor.errors?.saveFailed).toBeTrue();

      done();
    }, 1000);
  });

  it('should copy a template', (done) => {
    spyOn(dtsService, 'getTemplateByKey').and.returnValue(of(template));

    component.templateObject.docType = 'enrollment';
    component.templateObject.templateKey = 'dummyTemplateKey';
    component.ngOnInit();

    // verify the form control has received the template data
    expect(component.templateEditor.controls.templateData.value).toEqual(template);

    // wait for editor to display the template
    setTimeout(() => {
      // switch display mode from code to wysiwyg
      const sourceButton = fixture.debugElement.nativeElement.querySelector('.cke_button__source');
      sourceButton.click();

      // expect(component.dirty).toBeFalse();
      const editorData = fixture.debugElement.nativeElement.querySelectorAll('.cke_wysiwyg_frame');
      expect(editorData[0].contentDocument.body.innerHTML).toEqual(expectedBodyTemplate);

      component.copyTemplate();

     // expect(component.dirty).toBeTrue();
      const editorDataCopied = fixture.debugElement.nativeElement.querySelectorAll('.cke_wysiwyg_frame');
      expect(editorDataCopied[0].contentDocument.body.innerHTML).toEqual(expectedBodyTemplate);

      done();
    }, 1000);
  });

  it('should render a template', (done) => {
    spyOn(dtsService, 'getTemplateByKey').and.returnValue(of(template));
    spyOn(dtsService, 'renderTemplate').and.returnValue(of(certificate));

    const doc = jasmine.createSpyObj('document', ['open', 'write', 'close']);
    const windowDialog = jasmine.createSpyObj('modal', ['']);
    windowDialog.document = doc;
    spyOn(window, 'open').and.returnValue(windowDialog);

    component.templateObject.docType = 'enrollment';
    component.templateObject.templateKey = 'dummyTemplateKey';
    component.templateEditor.controls.dataKey.setValue('123456');
    component.ngOnInit();

    // verify the form control has received the template data
    expect(component.templateEditor.controls.templateData.value).toEqual(template);

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
