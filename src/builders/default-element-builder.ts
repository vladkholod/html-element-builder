import { ElementBuilder } from '../models/element-builder';
import { WhenElementBuilder } from '../models/when-element-builder';
import { ElementConfig } from '../models/element-config';
import { TargetElement } from '../models/target-element';
import { RawTransformer } from '../models/raw-transformer';

export class DefaultElementBuilder implements ElementBuilder {
    private readonly config: ElementConfig;

    private predicate?: () => boolean;

    constructor(target: TargetElement) {
        this.config = {
            target,
        };
    }

    public when(predicate: () => boolean): WhenElementBuilder {
        this.predicate = predicate;
        return this;
    }

    public withClass(className: string, ...rest: string[]): ElementBuilder {
        return this.applyWithPredicate((config) => {
            config.classNames ??= [];
            config.classNames.push(className, ...rest);
        });
    }

    public withChild(children: HTMLCollection): ElementBuilder;
    public withChild(child: HTMLElement, ...rest: HTMLElement[]): ElementBuilder;
    public withChild(singleOrCollection: HTMLElement | HTMLCollection, ...rest: HTMLElement[]): ElementBuilder {
        return this.applyWithPredicate((config) => {
            config.children ??= [];

            if (singleOrCollection instanceof HTMLCollection) {
                config.children.push(...singleOrCollection);
            } else {
                config.children.push(singleOrCollection, ...rest);
            }
        });
    }

    public withText(text: string): ElementBuilder {
        return this.applyWithPredicate((config) => {
            config.innerText = text;
        });
    }

    public withListener<EventName extends keyof HTMLElementEventMap>(eventName: EventName, handler: (event: HTMLElementEventMap[EventName]) => void): ElementBuilder {
        return this.applyWithPredicate((config) => {
            config.listeners ??= [];
            config.listeners.push([eventName, handler]);
        });
    }

    public withRawTransformation(transformer: RawTransformer): ElementBuilder {
        return this.applyWithPredicate((config) => {
            config.rawTransformers ??= [];
            config.rawTransformers.push(transformer);
        });
    }

    public build(): HTMLElement {
        const element: HTMLElement = typeof this.config.target === 'string'
            ? document.createElement(this.config.target)
            : this.config.target;

        if (this.config.classNames !== undefined) {
            element.classList.add(...this.config.classNames);
        }

        if (this.config.children !== undefined) {
            element.append(...this.config.children);
        }

        if (this.config.innerText !== undefined) {
            element.innerText = this.config.innerText;
        }

        this.config.listeners?.forEach(([eventName, handler]) =>
            element.addEventListener(eventName, handler));

        this.config.rawTransformers?.forEach((transformer) => transformer(element));

        return element;
    }

    private applyWithPredicate(successFn: (config: ElementConfig) => void): this {
        if (this.predicate?.() !== false) {
            successFn(this.config);
        }

        this.predicate = undefined;

        return this;
    }
}
