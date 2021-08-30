import { NgZone } from "@angular/core";
import { Observable, OperatorFunction } from "rxjs";

//TODO extract in one file run-in-zone.operator.ts
export function runInZone<T>(zone: NgZone): OperatorFunction<T, T> {
    return (source) => {
        return new Observable(observer => {
            const onNext = (value: T) => zone.run(() => observer.next(value));
            const onError = (e: any) => zone.run(() => observer.error(e));
            const onComplete = () => zone.run(() => observer.complete());
            return source.subscribe(onNext, onError, onComplete);
        })
    }
}

export const getTransitionDurationMs = (element: HTMLElement) => {
    const { transitionDelay, transitionDuration } = window.getComputedStyle(element);
    const transitionDelaySec = parseFloat(transitionDelay);
    const transitionDurationSec = parseFloat(transitionDuration);

    return (transitionDelaySec + transitionDurationSec) * 1000;
}

/**
 * Force a browser reflow
 * @param element 
 * @returns 
 */
export const reflow = (element: HTMLElement) => {
    return (element || document.body).getBoundingClientRect();
}