import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

export type CompensationReverter = () => void;

@Injectable({
  providedIn: 'root'
})
export class ScrollBarService {

  constructor(@Inject(DOCUMENT) private _document: any) { }

  compensate(): CompensationReverter {
    const width = this._getWidth();
    return !this._isPresent(width) ? () => { } : this._adjustBody(width);
  }

  /**
   * Adds a padding of the given widht on the right of the body.
   * 
   * @param width 
   */
  private _adjustBody(scrollbarWidth: number): CompensationReverter {
    const body = this._document.body;
    const userSetPaddingStyle = body.style.paddingRight;
    const actualPadding = parseFloat(window.getComputedStyle(body)['padding-right']);
    body.style['padding-right'] = `${actualPadding + scrollbarWidth}px`
    return () => body.style['padding-right'] = userSetPaddingStyle;
  }

  /**
   * Tells whether a scrollbar is currently present on the body.
   * @param scrollbarWidth 
   * 
   */
  private _isPresent(scrollbarWidth: number) {
    const rect = this._document.body.getBoundingClientRect();
    const bodyToViewportGap = window.innerWidth - (rect.left + rect.right);
    const uncertainty = 0.1 * scrollbarWidth;
    return bodyToViewportGap >= scrollbarWidth - uncertainty;
  }


  private _getWidth() {
    const measurer = this._document.createElement('div');
    measurer.className = 'modal-scrollbar-measure';

    const body = this._document.body;
    const width = measurer.getBoundingClientRect().width - measurer.clientWidth;

    return width;
  }
}
