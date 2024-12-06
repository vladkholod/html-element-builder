import { RawTransformer } from './raw-transformer';

export type ElementBuilder<T extends HTMLElement> = {
    match(
        predicate: () => boolean,
        successFn: (builder: ElementBuilder<T>) => ElementBuilder<T>,
        failFn?: (builder: ElementBuilder<T>) => ElementBuilder<T>,
    ): ElementBuilder<T>;

    withClass(className: string, ...rest: string[]): ElementBuilder<T>;

    withChild(child: HTMLElement, ...rest: HTMLElement[]): ElementBuilder<T>;
    withChild(children: HTMLElement[]): ElementBuilder<T>;
    withChild(children: HTMLCollection): ElementBuilder<T>;

    withText(text: string): ElementBuilder<T>;

    withListener<EventName extends keyof HTMLElementEventMap>(
        eventName: EventName,
        handler: (event: HTMLElementEventMap[EventName]) => void
    ): ElementBuilder<T>;

    withRawTransformation(transformer: RawTransformer<T>): ElementBuilder<T>;

    build(): HTMLElement;
};
