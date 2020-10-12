import { TestBed } from '@angular/core/testing';

import { DtsService } from './dts.service';

describe('DtsService', () => {
  let service: DtsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DtsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
