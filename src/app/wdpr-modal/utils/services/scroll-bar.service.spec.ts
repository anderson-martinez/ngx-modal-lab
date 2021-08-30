import { TestBed } from '@angular/core/testing';

import { ScrollBarService } from './scroll-bar.service';

describe('ScrollBarService', () => {
  let service: ScrollBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
