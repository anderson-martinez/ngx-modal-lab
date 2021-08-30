export interface TransitionOptions<T> {
    animation: boolean;
    runningTransition: 'continue' | 'stop';
    context?: T;
}
