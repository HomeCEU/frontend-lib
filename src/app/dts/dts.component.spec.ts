import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DtsComponent} from './dts.component';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {DtsService} from './dts.service';
import {of} from 'rxjs';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {templates} from '../../test/templates';

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
        HttpHandler
      ]
    })
    .compileComponents();

    dtsService = TestBed.get(DtsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list of templates', done  => {
    spyOn(dtsService, 'getTemplates').and.returnValue(of(templates.items));

    component.getTemplates();

    dtsService.getTemplates().subscribe( result => {
      expect(result.length).toEqual(2);
      done();
    });
  });

});
