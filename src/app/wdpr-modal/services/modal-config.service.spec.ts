import { TestBed } from '@angular/core/testing';

import { ModalConfigService } from './modal-config.service';

describe('ModalConfigService', () => {
  let service: ModalConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
