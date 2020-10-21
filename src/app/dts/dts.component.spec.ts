import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DtsComponent} from './dts.component';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {DtsService} from './dts.service';
import {of} from 'rxjs';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {templatesAll, templatesEnrollment} from '../../test/templates';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('DtsComponent', () => {
  let component: DtsComponent;
  let fixture: ComponentFixture<DtsComponent>;
  let dtsService: DtsService;

  /**
   * Create the component which calls the constructor to populate the data grid
   */
  function createComponent(): void {
    fixture = TestBed.createComponent(DtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxDatatableModule
      ],
      declarations: [
        DtsComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        HttpClient,
        HttpHandler
      ]
    })
    .compileComponents();

    dtsService = TestBed.get(DtsService);
  });

  it('should create', () => {
    spyOn(dtsService, 'getTemplates').and.returnValue(of(null));
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should display a list of all available templates', ()  => {
    dtsService.getTemplates = jasmine.createSpy().and.returnValue(of(templatesAll.items));
    createComponent();

    const gridData = fixture.debugElement.nativeElement.querySelectorAll('.datatable-body');
    expect(gridData[0].textContent).toEqual('Robert MartinNutritionTemplate3fa85f64-5717-4562-b3fc-2c963f66afa62020-03-05T23:' +
      '35:12.876ZSteve GilesPhysicalTherapyTemplate1fa85f64-5717-4562-b3fc-2c963f66afa62020-04-05T23:35:12.876ZSue AndersonNursingTem' +
      'plate2fa85f64-5717-4562-b3fc-2c963f66afa62020-01-05T23:35:12.876Z');
  });

  it('should display a list of templates by document type', ()  => {
    dtsService.getTemplates = jasmine.createSpy().and.returnValue(of(templatesEnrollment.items));
    createComponent();

    const gridData = fixture.debugElement.nativeElement.querySelectorAll('.datatable-body');
    expect(gridData[0].textContent).toEqual('Robert MartinNutritionTemplate3fa85f64-5717-4562-b3fc-2c963f66afa62020-03-05T23:' +
      '35:12.876ZSteve GilesPhysicalTherapyTemplate1fa85f64-5717-4562-b3fc-2c963f66afa62020-04-05T23:35:12.876Z');
  });

});
