import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DtsComponent} from './dts.component';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {DtsService} from './dts.service';
import {of} from 'rxjs';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {templatesAll, templatesEnrollment} from '../../test/templates';
import {FormBuilder} from '@angular/forms';

describe('DtsComponent', () => {
  let component: DtsComponent;
  let fixture: ComponentFixture<DtsComponent>;
  let dtsService: DtsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxDatatableModule
      ],
      declarations: [
        DtsComponent
      ],
      providers: [
        HttpClient,
        HttpHandler,
        FormBuilder
      ]
    })
    .compileComponents();

    dtsService = TestBed.get(DtsService);
    spyOn(dtsService, 'getTemplates').and.returnValue(of(null));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list of all available templates', done  => {
    // reset the spy and expected result
    dtsService.getTemplates = jasmine.createSpy().and.returnValue(of(templatesAll.items));

    fixture.detectChanges();

    dtsService.getTemplates().subscribe( result => {
      expect(result.length).toEqual(3);
      done();
    });
  });

  it('should display a list of templates by document type', done  => {
    // reset the spy and expected result
    dtsService.getTemplates = jasmine.createSpy().and.returnValue(of(templatesEnrollment.items));

    fixture.detectChanges();

    dtsService.getTemplates().subscribe( result => {
      expect(result.length).toEqual(2);
      done();
    });
  });

});
