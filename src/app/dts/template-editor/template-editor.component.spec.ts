import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TemplateEditorComponent} from './template-editor.component';
import {FormBuilder} from '@angular/forms';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {Template} from '../template.types';
import {of} from 'rxjs';
import {DtsService} from '../dts.service';
import {template} from '../../../test/template';

describe('TemplateEditorComponent', () => {
  let component: TemplateEditorComponent;
  let fixture: ComponentFixture<TemplateEditorComponent>;
  let dtsService: DtsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateEditorComponent ],
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

    component.templateObject = {} as Template;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a template by template key on initialization', done  => {
    spyOn(dtsService, 'getTemplateByKey').and.returnValue(of(template));

    component.templateObject.docType = 'dummyDocType';
    component.templateObject.templateKey = 'dummyTemplateKey';
    component.ngOnInit();

    dtsService.getTemplateByKey(component.templateObject.docType, component.templateObject.templateKey).subscribe( result => {
      expect(result).toEqual(template);
      done();
    });
  });

});
