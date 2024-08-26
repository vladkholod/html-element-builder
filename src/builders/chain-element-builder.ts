import { ElementBuilder } from '../models/element-builder';
import { RawTransformer } from '../models/raw-transformer';
import { TargetElement } from '../models/target-element';

export class ChainElementBuilder implements ElementBuilder {
    private readonly transformers: RawTransformer[] = [];

    public constructor(private readonly target: TargetElement) { }

    public match(
        predicate: () => boolean,
        success: (builder: ElementBuilder) => ElementBuilder,
        fail?: (builder: ElementBuilder) => ElementBuilder,
    ): ElementBuilder {
        if (predicate()) {
            return success(this);
        } else {
            return fail?.(this) ?? this;
        }
    }

    public withClass(className: string, ...rest: string[]): ElementBuilder {
        this.transformers.push((element) => element.classList.add(className, ...rest));

        return this;
    }

    public withChild(children: HTMLElement[]): ElementBuilder;
    public withChild(children: HTMLCollection): ElementBuilder;
    public withChild(child: HTMLElement, ...rest: HTMLElement[]): ElementBuilder;
    public withChild(singleOrCollection: HTMLElement | HTMLElement[] | HTMLCollection, ...rest: HTMLElement[]): ElementBuilder {
        let appendChildren: HTMLElement[];
        if (singleOrCollection instanceof HTMLCollection || Array.isArray(singleOrCollection)) {
            appendChildren = [...singleOrCollection] as HTMLElement[];
        } else {
            appendChildren = [singleOrCollection, ...rest];
        }

        this.transformers.push((element) => element.append(...appendChildren));

        return this;
    }

    public withText(text: string): ElementBuilder {
        this.transformers.push((element) => element.innerText = text);

        return this;
    }

    public withListener<EventName extends keyof HTMLElementEventMap>(eventName: EventName, handler: (event: HTMLElementEventMap[EventName]) => void): ElementBuilder {
        this.transformers.push((element) => element.addEventListener(eventName, handler));

        return this;
    }

    public withRawTransformation(transformer: RawTransformer): ElementBuilder {
        this.transformers.push(transformer);

        return this;
    }

    public build(): HTMLElement {
        const element: HTMLElement = typeof this.target === 'string'
            ? document.createElement(this.target)
            : this.target;

        for (const transformer of this.transformers) {
            transformer(element);
        }

        return element;

    }
}
