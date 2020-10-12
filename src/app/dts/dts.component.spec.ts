import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtsComponent } from './dts.component';

describe('DtsComponent', () => {
  let component: DtsComponent;
  let fixture: ComponentFixture<DtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
