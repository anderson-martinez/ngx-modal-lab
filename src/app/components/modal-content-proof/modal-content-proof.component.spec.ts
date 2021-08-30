import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalContentProofComponent } from './modal-content-proof.component';

describe('ModalContentProofComponent', () => {
  let component: ModalContentProofComponent;
  let fixture: ComponentFixture<ModalContentProofComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalContentProofComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalContentProofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
