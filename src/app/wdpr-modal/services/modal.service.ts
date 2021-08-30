import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { ModalRef } from '../classes/modal-ref';
import { ModalConfigService } from './modal-config.service';
import { ModalStackService } from './modal-stack.service';
import { ModalOptions } from '../interfaces/modal-options';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private _moduleCFR: ComponentFactoryResolver,
    private _injector: Injector,
    private _modalStack: ModalStackService,
    private _modalConfig: ModalConfigService
  ) { }


  /**
   * 
   * @param content Component that will be render in the modal
   *                it has to have a dependency of ActiveModal Class  
   * @param options {Object} with the options to be passed to the component.
   * @returns {ModalRef} reference to the modal component that has been opened.
   */
  open(content: any, options: ModalOptions = {}): ModalRef {
    const mergedOptions = { ...this._modalConfig, ...options };
    return this._modalStack.open(this._moduleCFR, this._injector, content, mergedOptions);
  }

  get activeInstances() { return this._modalStack.activeInstances; }

  /**
   * Dismisses all currently displayed modal windows with the supplied reason.
   * 
   * @param reason the reason why the modal is dismissed;
   */
  dismissAll(reason?: any): void {
    this._modalStack.dismissAll(reason);
  }

  /**
   * Indicates if there are currently any open modal windows in the application
   * @returns {boolean}
   */
  hasOpenModals(): boolean { return this._modalStack.hasOpenModals(); }


}
