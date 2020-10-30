import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {TemplateEditorComponent} from './template-editor.component';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {Template} from '../template.types';
import {of} from 'rxjs';
import {DtsService} from '../dts.service';
import {template} from '../../../test/template';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {CKEditorModule} from 'ckeditor4-angular';

describe('TemplateEditorComponent', () => {
  let component: TemplateEditorComponent;
  let fixture: ComponentFixture<TemplateEditorComponent>;
  let dtsService: DtsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
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
        FormBuilder
      ]
    })
    .compileComponents();

    dtsService = TestBed.get(DtsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateEditorComponent);
    component = fixture.componentInstance;

    component.editorConfig = {
      toolbar: [
        { name: 'basicstyles', items: [ 'Bold', 'Italic' ] },
        { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo' ] },
        { name: 'document', items: ['Source'] }
      ],
      allowedContent: true,
      fullPage: true,
      startupMode: 'source',
      height: '700px',
      on: {
        mode(event): void {
        }
      }
    };

    component.templateObject = {} as Template;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a template by template key on initialization', fakeAsync(() => {
    spyOn(dtsService, 'getTemplateByKey').and.returnValue(of(template));

    component.templateObject.docType = 'dummyDocType';
    component.templateObject.templateKey = 'dummyTemplateKey';
    component.ngOnInit();
    tick();

    // verify the form control has received the template data
    expect(component.templateEditor.controls['templateData'].value).toEqual(template);

    // When executing the unit test you can see the template text displayed in the editor so the functionality is working correctly,
    // however at this point in time the ckeditor control is not yet rendered. Eventually it is rendered as a textarea element with nine
    // attributes however there is no inner HTML representing the template text so it's currently not possible to verify the editor
    // displayed with text.
    // const templateData = fixture.debugElement.nativeElement.querySelectorAll('.cke_source');
  }));

});
