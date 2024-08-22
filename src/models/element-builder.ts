import { RawTransformer } from './raw-transformer';

export type ElementBuilder = {
    match(
        predicate: () => boolean,
        successFn: (builder: ElementBuilder) => ElementBuilder,
        failFn?: (builder: ElementBuilder) => ElementBuilder,
    ): ElementBuilder;

    withClass(className: string, ...rest: string[]): ElementBuilder;

    withChild(child: HTMLElement, ...rest: HTMLElement[]): ElementBuilder;
    withChild(children: HTMLElement[]): ElementBuilder;
    withChild(children: HTMLCollection): ElementBuilder;

    withText(text: string): ElementBuilder;

    withListener<EventName extends keyof HTMLElementEventMap>(
        eventName: EventName,
        handler: (event: HTMLElementEventMap[EventName]) => void
    ): ElementBuilder;

    withRawTransformation(transformer: RawTransformer): ElementBuilder;

    build(): HTMLElement;
};
