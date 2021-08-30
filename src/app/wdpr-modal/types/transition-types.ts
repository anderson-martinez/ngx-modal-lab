export type TransitionStartFn<T = any> = (element: HTMLElement, animation: boolean, context: T) => TransitionEndFn | void;
export type TransitionEndFn = () => void;