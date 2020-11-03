import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {DtsComponent} from './dts.component';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {DtsService} from './dts.service';
import {of} from 'rxjs';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {templatesAll, templatesEnrollment} from '../../test/templates';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';

describe('DtsComponent', () => {
  let component: DtsComponent;
  let fixture: ComponentFixture<DtsComponent>;

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
        NgxDatatableModule,
        MatDialogModule,
        ReactiveFormsModule
      ],
      declarations: [
        DtsComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        HttpClient,
        HttpHandler,
        MatDialog,
        FormBuilder
      ]
    })
    .compileComponents();
  });

  it('should create', inject([DtsService], (dtsService: DtsService) => {
    spyOn(dtsService, 'getTemplates').and.returnValue(of(null));
    createComponent();
    expect(component).toBeTruthy();
  }));

  it('should display a list of all available templates', inject([DtsService], (dtsService: DtsService) => {
    dtsService.getTemplates = jasmine.createSpy().and.returnValue(of(templatesAll.items));
    createComponent();

    const gridData = fixture.debugElement.nativeElement.querySelectorAll('.datatable-body');
    expect(gridData[0].textContent).toEqual('NursingTemplateSue Anderson 1/5/20, 6:35 PM NutritionTemplateRobert Martin 3/5/20,' +
      ' 6:35 PM PhysicalTherapyTemplateSteve Giles 4/5/20, 7:35 PM ');
  }));

  it('should display a list of templates by document type', inject([DtsService], (dtsService: DtsService) => {
    dtsService.getTemplates = jasmine.createSpy().and.returnValue(of(templatesEnrollment.items));
    createComponent();

    const gridData = fixture.debugElement.nativeElement.querySelectorAll('.datatable-body');
    expect(gridData[0].textContent).toEqual('NutritionTemplateRobert Martin 3/5/20, 6:35 PM PhysicalTherapyTemplateSteve Giles ' +
      '4/5/20, 7:35 PM ');
  }));

});
