import { ElementBuilder } from '../models/element-builder';
import { RawTransformer } from '../models/raw-transformer';

export class ChainElementBuilder<T extends HTMLElement> implements ElementBuilder<T> {
    private readonly transformers: RawTransformer<T>[] = [];

    public constructor(private readonly target: keyof HTMLElementTagNameMap | HTMLElement) { }

    public match(
        predicate: () => boolean,
        success: (builder: ElementBuilder<T>) => ElementBuilder<T>,
        fail?: (builder: ElementBuilder<T>) => ElementBuilder<T>,
    ): ElementBuilder<T> {
        if (predicate()) {
            return success(this);
        } else {
            return fail?.(this) ?? this;
        }
    }

    public withClass(className: string, ...rest: string[]): ElementBuilder<T> {
        this.transformers.push((element) => element.classList.add(className, ...rest));

        return this;
    }

    public withChild(children: HTMLElement[]): ElementBuilder<T>;
    public withChild(children: HTMLCollection): ElementBuilder<T>;
    public withChild(child: HTMLElement, ...rest: HTMLElement[]): ElementBuilder<T>;
    public withChild(singleOrCollection: HTMLElement | HTMLElement[] | HTMLCollection, ...rest: HTMLElement[]): ElementBuilder<T> {
        let appendChildren: HTMLElement[];
        if (singleOrCollection instanceof HTMLCollection || Array.isArray(singleOrCollection)) {
            appendChildren = [...singleOrCollection] as HTMLElement[];
        } else {
            appendChildren = [singleOrCollection, ...rest];
        }

        this.transformers.push((element) => element.append(...appendChildren));

        return this;
    }

    public withText(text: string): ElementBuilder<T> {
        this.transformers.push((element) => element.innerText = text);

        return this;
    }

    public withListener<EventName extends keyof HTMLElementEventMap>(eventName: EventName, handler: (event: HTMLElementEventMap[EventName]) => void): ElementBuilder<T> {
        this.transformers.push((element) => element.addEventListener(eventName, handler));

        return this;
    }

    public withRawTransformation(transformer: RawTransformer<T>): ElementBuilder<T> {
        this.transformers.push(transformer);

        return this;
    }

    public build(): T {
        const element: T = (typeof this.target === 'string'
            ? document.createElement(this.target)
            : this.target) as T;

        for (const transformer of this.transformers) {
            transformer(element);
        }

        return element;

    }
}
