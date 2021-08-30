import { ComponentRef } from "@angular/core";
import { Observable, of, Subject, zip } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ModalBackdropComponent } from "../components/modal-backdrop/modal-backdrop.component";
import { ModalWindowComponent } from "../components/modal-window/modal-window.component";
import { ContentRef } from "./content-ref";

export class ModalRef {
    private _closed = new Subject<any>();
    private _dismissed = new Subject<any>();
    private _hidden = new Subject<void>();
    private _resolve: (value: unknown) => void;
    private _reject: (reason?: any) => void;

    /**
     * The instance of a component used for the modal content
     */
    get componentInstance(): any {
        if (this._contentRef && this._contentRef.componentRef) {
            return this._contentRef.componentRef.instance;
        }
    }

    /**
     * The promise will resolve when the modal is closed, and rejected when the modal is dismissed;
     */
    result: Promise<any>;

    /**
     * The observable will emit a value when the modal is closed via .close();
     */
    get closed(): Observable<any> { return this._closed.asObservable().pipe(takeUntil(this._hidden)); }

    /**
     * The observable will emit a value when the modal is dismissed via .dismiss() 
     * */
    get dismissed(): Observable<any> { return this._dismissed.asObservable().pipe(takeUntil(this._hidden)); }

    /**
     * The observable will emit a value when the modal window and backdrop are closed
     * */
    get hidden(): Observable<void> { return this._hidden.asObservable(); }

    /**
     * The observable will emit a value when modal is fully visible and animation was finished.
     */
    get shown(): Observable<void> { return this._windowCmptRef.instance.shown.asObservable(); }

    constructor(
        private _windowCmptRef: ComponentRef<ModalWindowComponent>,
        private _contentRef: ContentRef,
        private _backdropCmptRef?: ComponentRef<ModalBackdropComponent>,
        private _beforeDismiss?: Function
    ) {
        this._windowCmptRef.instance.dismissEvent.subscribe((reason: any) => this.dismiss(reason));

        this.result = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        })
    }

    /**
     * Closes the modal with an optional result value 
     */
    close(result?: any): void {
        if (this._windowCmptRef) {
            this._closed.next(result);
            this._resolve(result);
            this._removeModalElements();
        }
    }

    private _dismiss(reason?: any) {
        this._dismissed.next(reason);
        this._reject(reason);
        this._removeModalElements();
    }

    /**
     * Dismisses the modal with an optional reason value
     */
    dismiss(reason?: any): void {
        if (this._windowCmptRef) {
            if (!this._beforeDismiss) {
                this._dismiss(reason);
            } else {
                const dismiss = this._beforeDismiss();
                if (dismiss && dismiss.then) {
                    dismiss.then(
                        result => {
                            if (result !== false) {
                                this._dismiss(reason);
                            }
                        },
                        () => { }
                    );
                } else if (dismiss !== false) {
                    this._dismiss(reason);
                }
            }
        }
    }

    private _removeModalElements() {
        const windowTransition$ = this._windowCmptRef.instance.hide();
        const backdropTransition$ = this._backdropCmptRef ? this._backdropCmptRef.instance.hide() : of(undefined);

        // hiding window
        windowTransition$.subscribe(() => {
            const { nativeElement } = this._windowCmptRef.location;
            nativeElement.parentNode.removeChild(nativeElement);
            this._windowCmptRef.destroy();

            if (this._contentRef && this._contentRef.viewRef) {
                this._contentRef.viewRef.destroy();
            }

            this._windowCmptRef = <any>null;
            this._contentRef = <any>null;
        });

        // hiding backdrop
        backdropTransition$.subscribe(() => {
            if (this._backdropCmptRef) {
                const { nativeElement } = this._backdropCmptRef.location;
                nativeElement.parentNode.removeChild(nativeElement);
                this._backdropCmptRef.destroy();
                this._backdropCmptRef = <any>null;
            }
        });

        zip(windowTransition$, backdropTransition$).subscribe(() => {
            this._hidden.next();
            this._hidden.complete();
        });
    }
}
