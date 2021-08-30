import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponentTestV2Component } from './modal-component-test-v2.component';

describe('ModalComponentTestV2Component', () => {
  let component: ModalComponentTestV2Component;
  let fixture: ComponentFixture<ModalComponentTestV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalComponentTestV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponentTestV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
