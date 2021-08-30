import { Injectable, Injector } from '@angular/core';
import { ModalOptions } from '../interfaces/modal-options';

/**
 * configuration service for Modal
 * can be injected in the root to set the configurations of all modals.
 */
@Injectable({
  providedIn: 'root'
})
export class ModalConfigService implements Required<ModalOptions>{
  animation: boolean = true;
  ariaLabelledBy: string;
  ariaDescribedBy: string;
  backdrop: boolean | 'static' = 'static';
  beforeDismiss: () => boolean | Promise<boolean>;
  centered: boolean = true;
  container: string | HTMLElement;
  injector: Injector;
  keyboard: boolean = true;
  scrollable: boolean;
  size: 'sm' | 'lg' | 'xl' | string;
  windowClass: string;
  modalDialogClass: string;
  backdropClass: string;

  constructor() { }

}
