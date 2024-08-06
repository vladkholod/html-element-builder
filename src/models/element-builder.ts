import { RawTransformer } from './raw-transformer';
import { WhenElementBuilder } from './when-element-builder';

export type ElementBuilder = {
    when(predicate: () => boolean): WhenElementBuilder;

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
