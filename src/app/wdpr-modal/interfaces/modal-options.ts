import { Injector } from "@angular/core";

/**
 * Options available when opening new modal windows with `NgbModal.open()` method.
 */
export interface ModalOptions {
    /**
     * If `true`, modal opening and closing will be animated.
     *
     */
    animation?: boolean;

    /**
     * `aria-labelledby` attribute value to set on the modal window.
     *
     */
    ariaLabelledBy?: string;

    /**
     * `aria-describedby` attribute value to set on the modal window.
     *
     */
    ariaDescribedBy?: string;

    /**
     * If `true`, the backdrop element will be created for a given modal.
     *
     * Alternatively, specify `'static'` for a backdrop which doesn't close the modal on click.
     *
     * Default value is `true`.
     */
    backdrop?: boolean | 'static';

    /**
     * Callback right before the modal will be dismissed.
     *
     * If this function returns:
     * * `false`
     * * a promise resolved with `false`
     * * a promise that is rejected
     *
     * then the modal won't be dismissed.
     */
    beforeDismiss?: () => boolean | Promise<boolean>;

    /**
     * If `true`, the modal will be centered vertically.
     *
     * Default value is `false`.
     *
     */
    centered?: boolean;

    /**
     * A selector specifying the element all new modal windows should be appended to.
     * Since v5.3.0 it is also possible to pass the reference to an `HTMLElement`.
     *
     * If not specified, will be `body`.
     */
    container?: string | HTMLElement;

    /**
     * The `Injector` to use for modal content.
     */
    injector?: Injector;

    /**
     * If `true`, the modal will be closed when `Escape` key is pressed
     *
     * Default value is `true`.
     */
    keyboard?: boolean;

    /**
     * Scrollable modal content (false by default).
     */
    scrollable?: boolean;

    /**
     * Size of a new modal window.
     */
    size?: 'sm' | 'lg' | 'xl' | string;

    /**
     * A custom class to append to the modal window.
     */
    windowClass?: string;

    /**
     * A custom class to append to the modal dialog.
     */
    modalDialogClass?: string;

    /**
     * A custom class to append to the modal backdrop.
     */
    backdropClass?: string;
}
