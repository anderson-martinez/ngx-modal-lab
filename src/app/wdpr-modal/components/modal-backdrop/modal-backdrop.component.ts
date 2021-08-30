import { ElementRef, Input, NgZone } from '@angular/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { TransitionService } from '../../utils/transition.service';
import { reflow } from '../../utils/util';

@Component({
  selector: 'app-modal-backdrop',
  encapsulation: ViewEncapsulation.None,
  template: '',
  styleUrls: ['./modal-backdrop.component.less'],
  host: {
    '[class]': '"modal-backdrop" + (backdropClass ? " " + backdropClass : "")',
    '[class.show]': '!animation',
    '[class.fade]': 'animation',
    'style': 'z-index: 1050'
  }
})
export class ModalBackdropComponent implements OnInit {
  @Input() animation: boolean;
  @Input() backdropClass: string;

  constructor(
    private _el: ElementRef<HTMLElement>, private _zone: NgZone, private transitionService: TransitionService
  ) { }

  ngOnInit(): void {
    this._zone.onStable.asObservable().pipe(take(1)).subscribe(() => {
      this.transitionService.runTransition(this._zone, this._el.nativeElement, (element: HTMLElement, animation: boolean) => {
        if (animation) {
          reflow(element);
        }
        element.classList.add('show');
      }, { animation: this.animation, runningTransition: 'continue' });
    });
  }

  hide(): Observable<void> {
    return this.transitionService.runTransition(this._zone, this._el.nativeElement, ({ classList }) => classList.remove('show'), { animation: this.animation, runningTransition: 'stop' })
  }
}
