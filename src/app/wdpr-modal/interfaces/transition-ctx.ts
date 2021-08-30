import { Subject } from "rxjs";

export interface TransitionCtx<T> {
    transition$: Subject<any>;
    complete: () => void;
    context?: T;
}
