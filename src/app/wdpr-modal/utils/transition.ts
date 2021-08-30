import { NgZone } from '@angular/core';
import { EMPTY, fromEvent, Observable, of, Subject, timer } from 'rxjs';
import { endWith, filter, takeUntil } from 'rxjs/operators';
import { TransitionCtx } from '../interfaces/transition-ctx';
import { TransitionOptions } from '../interfaces/transition-options';
import { runInZone, getTransitionDurationMs } from './util';
export type TransitionStartFn<T = any> = (element: HTMLElement, animation: boolean, context: T) => TransitionEndFn | void;
export type TransitionEndFn = () => void;

const noopFn: TransitionEndFn = () => { };

const transitionTimerDelayMs = 5;
const runningTransitions = new Map<HTMLElement, TransitionCtx<any>>();

export const runTransition = <T>(zone: NgZone, element: HTMLElement, startFn: TransitionStartFn, options: TransitionOptions<T>):
    Observable<undefined> => {

    // Getting Initial context from options
    let context = options.context || <T>{};

    const running = runningTransitions.get(element);
    if (running) {
        switch (options.runningTransition) {
            // If there is one running and we want to continue to run, we have to cancel the new one.
            // not emitting any values, but simply completing the observable with EMPTY
            case 'continue':
                return EMPTY;
            // If there is one running and we want it to stop, we have to complete the running one.
            case 'stop':
                zone.run(() => running.transition$.complete());
                context = Object.assign(running.context, context);
                runningTransitions.delete(element);
        }
    }

    // runing the start function
    const endFn = startFn(element, options.animation, context) || noopFn;

    if (!options.animation || window.getComputedStyle(element).transitionProperty === 'none') {
        zone.run(() => endFn());
        return of(undefined).pipe(runInZone(zone));
    }

    //starting a new transition
    const transition$ = new Subject<any>();
    const finishTransition$ = new Subject<any>();
    const stop$ = transition$.pipe(endWith(true));
    runningTransitions.set(element, {
        transition$,
        complete: () => {
            finishTransition$.next();
            finishTransition$.complete();
        },
        context
    });

    const transitionDurationMs = getTransitionDurationMs(element);

    // 1. We have to both listen for the 'transitionend' event and have a 'just-in-case' timer,
    // because 'transitionend' event might not be fired in some browsers, if the transitioning
    // element becomes invisible (ex. when scrolling, making browser tab inactive, etc.). The timer
    // guarantees, that we'll release the DOM element and complete 'ngbRunTransition'.
    // 2. We need to filter transition end events, because they might bubble from shorter transitions
    // on inner DOM elements. We're only interested in the transition on the 'element' itself.
    zone.runOutsideAngular(() => {
        const transitionEnd$ =
            fromEvent(element, 'transitionend')
                .pipe(
                    takeUntil(stop$),
                    filter(({ target }) => target === element)
                );
        const timer$ = timer(transitionDurationMs + transitionTimerDelayMs)
            .pipe(takeUntil(stop$))
            .subscribe(() => {
                runningTransitions.delete(element);
                zone.run(() => {
                    endFn();
                    transition$.next();
                    transition$.complete();
                });
            });
    });

    return transition$.asObservable();
}