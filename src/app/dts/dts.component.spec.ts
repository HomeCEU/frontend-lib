import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {DtsComponent} from './dts.component';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {DtsService} from './dts.service';
import {of} from 'rxjs';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {templatesAll, templatesEnrollment} from '../../test/templates';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';;

describe('DtsComponent', () => {
  let component: DtsComponent;
  let fixture: ComponentFixture<DtsComponent>;
  let dialog: MatDialog;

  /**
   * Create the component which calls the constructor to populate the data grid
   */
  function createComponent(): void {
    fixture = TestBed.createComponent(DtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  class MatDialogMock {
    open(): any {
      return {
        afterClosed: () => of()
      };
    }
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
        { provide: MatDialog, useClass: MatDialogMock },
        FormBuilder
      ]
    }).compileComponents().then(() => {
      dialog = TestBed.get(MatDialog);
    });
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

  it('should launch a modal dialog to create a template', inject([DtsService], (dtsService: DtsService) => {
    dtsService.getTemplates = jasmine.createSpy().and.returnValue(of(templatesAll.items));
    spyOn(dialog, 'open').and.callThrough();
    createComponent();
    component.newTemplate();
    expect(dialog.open).toHaveBeenCalled();
  }));

  it('should select a template and launch a modal to edit a template', inject([DtsService], (dtsService: DtsService) => {
    const mockEvent = {
      event: MouseEvent,
      column: {
        minWidth: '300',
        name: 'Author',
        prop: 'author'
      },
      type: 'click',
      row: {
        author: 'Bill Anderson',
        bodyUri: '/template/2fa85f64-5717-4562-b3fc-2c963f32afa1',
        createdAt: '2020-01-05T23:35:12.876Z',
        docType: 'enrollment',
        templateId: '2fa85f64-5717-4562-b3fc-2c963f32afa1',
        templateKey: 'Nursing Template F'
      }
    };

    dtsService.getTemplates = jasmine.createSpy().and.returnValue(of(templatesAll.items));
    spyOn(dialog, 'open').and.callThrough();
    createComponent();
    component.userName = 'test user';
    component.rowClick(mockEvent);
    fixture.detectChanges();

    expect(dialog.open).toHaveBeenCalled();
  }));

});

