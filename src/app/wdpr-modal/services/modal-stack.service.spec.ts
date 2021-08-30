import { TestBed } from '@angular/core/testing';

import { ModalStackService } from './modal-stack.service';

describe('ModalStackService', () => {
  let service: ModalStackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalStackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
