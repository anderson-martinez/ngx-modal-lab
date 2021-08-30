import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Inject, Injectable, Injector, NgZone, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalWindowComponent } from '../components/modal-window/modal-window.component';
import { ScrollBarService } from '../utils/services/scroll-bar.service';
import { focusTrap } from '../utils/focus-trap'
import { ModalRef } from '../classes/modal-ref';
import { ActiveModal } from '../classes/active-modal';
import { ContentRef } from '../classes/content-ref';
import { ModalBackdropComponent } from '../components/modal-backdrop/modal-backdrop.component';
import { EventEmitter } from '@angular/core';

//service to mantain the control of displayed modals
@Injectable({
  providedIn: 'root'
})
export class ModalStackService {
  private _activeWindowCmptHasChanged = new Subject();

  private _windowCmpts: ComponentRef<ModalWindowComponent>[] = [];
  private _ariaHiddenValues: Map<Element, string | null> = new Map();
  private _modalsRefs: ModalRef[] = [];
  private _activeInstances: EventEmitter<ModalRef[]> = new EventEmitter();
  private _windowAttributes = [
    'animation', 'ariaLabelledBy', 'ariaDescribedBy', 'backdrop', 'centered', 'keyboard', 'scrollable', 'size',
    'windowClass', 'modalDialogClass'
  ];

  constructor(
    private _applicationRef: ApplicationRef, private _injector: Injector,
    @Inject(DOCUMENT) private _document: any, private _scrollBar: ScrollBarService,
    private _rendererFactory: RendererFactory2, private _ngzone: NgZone
  ) {
    // Trap focus on active WindowCmpt
    this._activeWindowCmptHasChanged.subscribe(() => {
      if (this._windowCmpts.length) {
        const activeWindowCmpt = this._windowCmpts[this._windowCmpts.length - 1];
        focusTrap(this._ngzone, activeWindowCmpt.location.nativeElement, this._activeWindowCmptHasChanged);
        this._revertAriaHidden();
        this._setAriaHidden(activeWindowCmpt.location.nativeElement);
      }
    });
  }

  open(moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: any, options): ModalRef {
    const containerEl = this._document.body;


    const renderer = this._rendererFactory.createRenderer(null, null);

    const revertPaddingForScrollBar = this._scrollBar.compensate();
    const removeBodyClass = () => {
      if (!this._modalsRefs.length) {
        renderer.removeClass(this._document.body, 'modal-open');
        this._revertAriaHidden();
      }
    };

    if (!containerEl) {
      throw new Error(`The specified modal container "${options.container || 'body'}" was not found in the DOM.`);
    }

    const activeModal = new ActiveModal();
    const contentRef = this._createFromComponent(moduleCFR, options.injector || contentInjector, content, activeModal, options);
    let backdropCmptRef: ComponentRef<ModalBackdropComponent> | undefined =
      options.backdrop !== false ? this._attachBackdrop(moduleCFR, containerEl) : undefined;
    let WindowCmptRef: ComponentRef<ModalWindowComponent> = this._attachWindowComponent(moduleCFR, containerEl, contentRef);
    // TODO before close to Analytics
    let modalRef: ModalRef = new ModalRef(WindowCmptRef, contentRef, backdropCmptRef, options.beforeDismiss);

    this._registerModalRef(modalRef);
    this.registerWindowCmpt(WindowCmptRef);
    modalRef.result.then(revertPaddingForScrollBar, revertPaddingForScrollBar);
    modalRef.result.then(removeBodyClass, removeBodyClass);
    activeModal.close = (result: any) => { modalRef.close(result); };
    activeModal.dismiss = (reason: any) => { modalRef.dismiss(reason); }
    this._applyWindowOptions(WindowCmptRef.instance, options);
    if (this._modalsRefs.length === 1) {
      renderer.addClass(this._document.body, 'modal-open');
    }

    if (backdropCmptRef && backdropCmptRef.instance) {
      this._applyBackdropOptions(backdropCmptRef.instance, options);
      backdropCmptRef.changeDetectorRef.detectChanges();
    }
    WindowCmptRef.changeDetectorRef.detectChanges();
    return modalRef;
  }

  private _applyWindowOptions(windowInstance: ModalWindowComponent, options: any) {
    this._windowAttributes.forEach((optionName: string) => {
      if (options[optionName]) {
        windowInstance[optionName] = options[optionName];
      }
    })
    console.log(windowInstance.backdrop);
  }

  private _applyBackdropOptions(backdropInstance: ModalBackdropComponent, options: any) {
    this._windowAttributes.forEach((optionName: string) => {
      if (options[optionName]) {
        backdropInstance[optionName] = options[optionName];
      }
    })
  }

  private _registerModalRef(modalRef: ModalRef) {
    const unregisterModalRef = () => {
      const index = this._modalsRefs.indexOf(modalRef);
      if (index > -1) {
        this._modalsRefs.splice(index, 1);
        this._activeInstances.emit(this._modalsRefs);
      }
    };

    this._modalsRefs.push(modalRef);
    this._activeInstances.emit(this._modalsRefs);
    modalRef.result.then(unregisterModalRef, unregisterModalRef);
  }

  registerWindowCmpt(windowCmpt: ComponentRef<ModalWindowComponent>) {
    this._windowCmpts.push(windowCmpt);
    this._activeWindowCmptHasChanged.next();

    windowCmpt.onDestroy(() => {
      const index = this._windowCmpts.indexOf(windowCmpt);
      if (index > -1) {
        this._windowCmpts.splice(index, 1);
        this._activeWindowCmptHasChanged.next();
      }
    });
  }

  get activeInstances() { return this._activeInstances; }

  dismissAll(reason?: any) {
    this._modalsRefs.forEach(modalRef => modalRef.dismiss(reason));
  }

  hasOpenModals(): boolean { return this._modalsRefs.length > 0 }

  private _attachWindowComponent(moduleCFR: ComponentFactoryResolver, containerEl: any, contentRef: ContentRef): ComponentRef<ModalWindowComponent> {
    let windowFactory = moduleCFR.resolveComponentFactory(ModalWindowComponent);
    let windowCmptRef = windowFactory.create(this._injector, contentRef.nodes);
    this._applicationRef.attachView(windowCmptRef.hostView);
    containerEl.appendChild(windowCmptRef.location.nativeElement);
    return windowCmptRef;
  }

  private _attachBackdrop(moduleCFR: ComponentFactoryResolver, containerEl: any): ComponentRef<ModalBackdropComponent> {
    let backdropFactory = moduleCFR.resolveComponentFactory(ModalBackdropComponent);
    let backdropCmptRef = backdropFactory.create(this._injector);
    this._applicationRef.attachView(backdropCmptRef.hostView);
    containerEl.appendChild(backdropCmptRef.location.nativeElement);
    return backdropCmptRef;
  }

  private _createFromComponent(moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: any, context: ActiveModal, options: any): ContentRef {
    const contentCmptFactory = moduleCFR.resolveComponentFactory(content);
    const injectorCreateOptions = { providers: [{ provide: ActiveModal, useValue: context }], parent: contentInjector };
    const modalContentInjector = Injector.create(injectorCreateOptions);
    const componentRef = contentCmptFactory.create(modalContentInjector);
    const componentNativeEl = componentRef.location.nativeElement;
    if (options.scrollable) {
      (componentNativeEl as HTMLElement).classList.add('component-host-scrollable');
    }
    this._applicationRef.attachView(componentRef.hostView);
    return new ContentRef([[componentNativeEl]], componentRef.hostView, componentRef);
  }



  private _revertAriaHidden() {
    this._ariaHiddenValues.forEach((value, element) => {
      if (value) {
        element.setAttribute('aria-hidden', value);
      } else {
        element.removeAttribute('aria-hidden');
      }
    })
  }

  private _setAriaHidden(element: Element) {
    const parent = element.parentElement;
    if (parent && element !== this._document.body) {
      Array.from(parent.children).forEach(sibling => {
        if (sibling !== element && sibling.nodeName !== 'SCRIPT') {
          this._ariaHiddenValues.set(sibling, sibling.getAttribute('aria-hidden'));
          sibling.setAttribute('aria-hidden', 'true');
        }
      })
      this._setAriaHidden(parent);
    }
  }
}
