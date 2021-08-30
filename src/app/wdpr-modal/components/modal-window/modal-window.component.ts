import { DOCUMENT } from '@angular/common';
import { EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import { Output } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ElementRef, Inject, NgZone, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { zip } from 'rxjs/internal/observable/zip';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { TransitionOptions } from '../../interfaces/transition-options';
import { Key } from '../../constants/key.enum';
import { ModalDismissReasons } from '../../constants/modal-dismiss-reasons.enum';
import { getFocusableBoundaryElements } from '../../utils/focus-trap';
import { reflow } from '../../utils/util';

import { TransitionService } from '../../utils/transition.service';

@Component({
  selector: 'app-modal-window',
  host: {
    '[class]': '"modal d-block" + (windowClass ? " " + windowClass : "")',
    '[class.fade]': 'animation',
    'role': 'dialog',
    'tabindex': '-1',
    '[attr.aria-modal]': 'true',
    '[attr.aria-labelledby]': 'ariaLabelledBy',
    '[attr.aria-describedby]': 'ariaDescribedBy'
  },
  templateUrl: './modal-window.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./modal-window.component.less']
})
export class ModalWindowComponent implements OnInit, OnDestroy {
  private _closed$ = new Subject<void>();

  @ViewChild('dialog', { static: true }) private _dialogEl: ElementRef<HTMLElement>;

  @Input() animation: boolean;
  @Input() ariaLabeledBy: string;
  @Input() ariaDescribedBy: string;
  @Input() backdrop: boolean | string;
  @Input() centered: string;
  @Input() keyboard = true;
  @Input() scrollable: string;
  @Input() size: string;
  @Input() windowClass: string;
  @Input() modalDialogClass: string;

  @Output('dismiss') dismissEvent = new EventEmitter();

  shown = new Subject<void>();
  hidden = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) private _document: any,
    private _elRef: ElementRef,
    private _zone: NgZone,
    private transitionService: TransitionService
  ) { }

  dismiss(reason): void { this.dismissEvent.emit(reason); };


  ngOnInit(): void {
    this._zone.onStable.asObservable()
      .pipe(take(1))
      .subscribe(() => {
        this._show();
      })
  }

  ngOnDestroy(): void { this._disableEventHandling() };

  hide(): Observable<any> {
    const { nativeElement } = this._elRef;
    const context: TransitionOptions<any> = {
      animation: this.animation,
      runningTransition: 'stop'
    };

    const windowTransition$ = this.transitionService.runTransition(this._zone, nativeElement, () => nativeElement.classList.remove('show'), context);
    const dialogTransition$ = this.transitionService.runTransition(this._zone, this._dialogEl.nativeElement, () => { }, context);
    const transitions$ = zip(windowTransition$, dialogTransition$);

    transitions$.subscribe(() => {
      this.hidden.next();
      this.hidden.complete();
    });

    return transitions$;
  }

  private _show() {
    const context: TransitionOptions<any> = {
      animation: this.animation,
      runningTransition: 'continue'
    };

    const windowTransition$ =
      this.transitionService.runTransition(
        this._zone,
        this._elRef.nativeElement,
        (element: HTMLElement, animation: boolean) => {
          if (animation) {
            reflow(element);
          }
          element.classList.add('show');
        },
        context
      );
    const dialogTransition$ = this.transitionService.runTransition(this._zone, this._dialogEl.nativeElement, () => { }, context);

    zip(windowTransition$, dialogTransition$).subscribe(() => {
      this.shown.next();
      this.shown.complete();
    });

    this._enableEventHandling();
    this._setFocus();
  }

  private _enableEventHandling() {
    const { nativeElement } = this._elRef;
    this._zone.runOutsideAngular(() => {
      fromEvent<KeyboardEvent>(nativeElement, 'keydown')
        .pipe(
          takeUntil(this._closed$),
          filter(e => e.keyCode === Key.Escape)
        ).subscribe(event => {
          if (this.keyboard) {
            requestAnimationFrame(() => {
              if (!event.defaultPrevented) {
                this._zone.run(() => this.dismiss(ModalDismissReasons.ESC));
              }
            });
          } else if (this.backdrop === 'static') {
            this._bumpBackdrop();
          }
        });

      // listening to mousedown and mouseup to prevent modal from closing when pressing the mouse
      // inside the modal dialog and releasing it outside
      let preventClose = false;
      fromEvent<MouseEvent>(this._dialogEl.nativeElement, 'moousedown')
        .pipe(
          takeUntil(this._closed$),
          tap(() => preventClose = false),
          switchMap(() => {
            return fromEvent<MouseEvent>(nativeElement, 'mouseup')
              .pipe(takeUntil(this._closed$), take(1));
          }),
          filter(({ target }) => nativeElement === target)
        )
        .subscribe(() => { preventClose = true });

      // listening to click to dismiss the modal on modal window click, except when:
      // 1. clicking on modal dialog itself
      // 2. closing was prevented by mousedown/up handlers
      // 3. clicking on scrollbar when the viewport is too samll and modal doesn´t fit 
      fromEvent<MouseEvent>(nativeElement, 'click')
        .pipe(takeUntil(this._closed$))
        .subscribe(({ target }) => {
          if (nativeElement === target) {
            console.log(this.backdrop);
            if (this.backdrop === 'static') {
            } else if (this.backdrop === true && !preventClose) {
              this._zone.run(() => this.dismiss(ModalDismissReasons.BACKDROP_CLICK));
            }
          }
        })
      preventClose = false;
    });
  }

  private _disableEventHandling() { this._closed$.next() };

  private _setFocus() {
    const { nativeElement } = this._elRef;
    if (!nativeElement.contains(document.activeElement)) {
      const firstFocusable = getFocusableBoundaryElements(nativeElement)[0];

      const elementToFocus = firstFocusable || nativeElement;
      elementToFocus.focus();
    }
  }

  private _bumpBackdrop() {
    if (this.backdrop === 'static') {
      this.transitionService.runTransition(this._zone, this._elRef.nativeElement, ({ classList }) => {
        classList.add('modal-static');
        return () => classList.remove('modal-static');
      }, { animation: this.animation, runningTransition: 'continue' });
    }
  }
}
