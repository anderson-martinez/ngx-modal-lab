import { ElementRef, NgZone } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TransitionOptions } from '../../interfaces/transition-options';
import { TransitionService } from '../../utils/transition.service';

import { ModalWindowComponent } from './modal-window.component';

describe('ModalWindowComponent', () => {
  let component: ModalWindowComponent;
  let fixture: ComponentFixture<ModalWindowComponent>;
  let transitionServiceSpy: jasmine.SpyObj<TransitionService>;
  let ngZoneService: NgZone;
  let elRef: ElementRef;

  beforeEach(async(() => {
    transitionServiceSpy = jasmine.createSpyObj('transitionService', ['runTransition']);
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

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    ngZoneService = TestBed.inject(NgZone);
    transitionServiceSpy.runTransition.and.returnValue(of(undefined));
    elRef = TestBed.inject(ElementRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the dismiss event when the dismiss is called with the reason provided', () => {
    const reason = 'test';
    const dismiss$ = component.dismissEvent;
    dismiss$.asObservable().subscribe((reason) => {
      expect(reason).toBe(reason);
    })
    component.dismiss(reason);
  });

  describe('hide', () => {
    it('should return an observable that emits when the modal window is hide', () => {
      // 2 transitions for _show() & 2 transitions for hide()
      const transitionsCalled = 4;
      const finishedHidden$ = component.hide();
      finishedHidden$.subscribe(() => {
        expect(transitionServiceSpy.runTransition).toHaveBeenCalled();
      });
    });
  });
});
