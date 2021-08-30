import { ComponentRef } from '@angular/core';
import { async } from '@angular/core/testing';
import { ModalBackdropComponent } from '../components/modal-backdrop/modal-backdrop.component';
import { ModalWindowComponent } from '../components/modal-window/modal-window.component';
import { ContentRef } from './content-ref';
import { ModalRef } from './modal-ref';

fdescribe('ModalRef', () => {
  const _windowCmptRef
  const contentRef: jasmine.SpyObj<ContentRef> = jasmine.createSpyObj('contentRef', ['']);
  const _backdropCmptRef: jasmine.SpyObj<ComponentRef<ModalBackdropComponent>> = jasmine.createSpyObj('ModalBackdropComponent', ['']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalWindowComponent],
      providers: [
        {
          provide: ElementRef,
          useValue: {
            nativeElement: {
              classList: []
            }
          } as ElementRef,
        },
        {
          provide: TransitionService,
          useValue: transitionServiceSpy
        }
      ]
    })
      .compileComponents();
  }));

  it('should create an instance', () => {
    expect(new ModalRef(_windowCmptRef, contentRef, _backdropCmptRef, () => { })).toBeTruthy();
  });
});
