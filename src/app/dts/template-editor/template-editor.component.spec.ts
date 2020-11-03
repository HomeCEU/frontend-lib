import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TemplateEditorComponent} from './template-editor.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {Template} from '../template.types';
import {of} from 'rxjs';
import {DtsService} from '../dts.service';
import {template} from '../../../test/template';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {CKEditorModule} from 'ckeditor4-angular';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

describe('TemplateEditorComponent', () => {
  let component: TemplateEditorComponent;
  let fixture: ComponentFixture<TemplateEditorComponent>;
  let dtsService: DtsService;

  const dialogMock = {
    disableClose: true,
    close: () => {},
    backdropClick: () => of({})
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CKEditorModule
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

    dtsService = TestBed.get(DtsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateEditorComponent);
    component = fixture.componentInstance;

    spyOn(window, 'confirm').and.returnValue(true);

    component.editorConfig = {
      toolbar: [
        { name: 'basicstyles', items: [ 'Bold', 'Italic' ] },
        { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo' ] },
        { name: 'document', items: ['Source'] }
      ],
      allowedContent: true,
      fullPage: true,
      startupMode: 'source',
      height: '700px'
    };

    component.templateObject = {} as Template;

    fixture.detectChanges();
  });

  it('should create',  () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and allow creating a new template', (done) => {
    const expectedBody = `<p><br></p>`;

    // wait for editor to display the default template
    setTimeout(($element) => {
      // switch display mode from code to wysiwyg
      const sourceButton = fixture.debugElement.nativeElement.querySelector('.cke_button__source');
      sourceButton.click();

      // get the template content from the CK Editor rendered in an iFrame
      const editorData = fixture.debugElement.nativeElement.querySelectorAll('.cke_wysiwyg_frame');
      const content = editorData[0].contentDocument;

      // verify the CK Editor control has displayed the default template makrup
      expect(content.body.innerHTML).toEqual(expectedBody);
      // expect(component.dirty).toBeFalse();

      done();
    }, 500);
  });

  it('should get a template by template key on initialization and allow edit', (done) => {
    const expectedBody = `<div id="container" class="page"><p style="text-align:center;">Enrollment #: <span class="char-style-override-6">{{ enrollmentId }}</span></p><p><span class="char-style-override-2" style="line-height: 1.2;">Course Certificate</span></p><p><span class="char-style-override-3">This is to certify</span></p><p><span class="char-style-override-1">{{ student.firstName }} {{ student.lastName }}&nbsp;-&nbsp;{{~#each student.licenses as |license|~}}{{license.state}} {{license.type}} {{license.number}}{{#unless @last}}; {{/unless}}{{~/each~}}</span></p><p><span>has successfully completed </span><span class="char-style-override-1">{{ course.hours }} contact hours</span><span>{{#if (eq course.format 'live')}}Live Continuing Education{{else}}continuing education online training{{/if}} on the topic of:</span></p><p><span class="char-style-override-4">{{ course.name }}</span><br>{{#if course.authors}}{{#with course.authors as |authors|}}Course Speakers:{{#each authors~}}{{this}}{{#unless @last}} | {{/unless}}{{~/each}}{{/with}}{{/if}}</p><p><span>Presented by HomeCEUConnection.com, 5048 Tennyson Pkwy, Suite 200 Plano TX 75024</span></p><p><span>Course completed on {{ completionDate }}</span></p></div>`;
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
      expect(content.body.innerHTML).toEqual(expectedBody);
      expect(component.dirty).toBeFalse();

      done();
    }, 500);
  });

});
