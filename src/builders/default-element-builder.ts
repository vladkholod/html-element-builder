import { ElementBuilder } from '../models/element-builder';
import { WhenElementBuilder } from '../models/when-element-builder';
import { ElementConfig } from '../models/element-config';
import { RawTransformer } from '../models/raw-transformer';

type DefaultElementBuilderOptions = {
    tag?: keyof HTMLElementTagNameMap;
    element?: HTMLElement;
    config?: ElementConfig;
}

export class DefaultElementBuilder implements ElementBuilder {
    private readonly config: ElementConfig;

    private predicate?: () => boolean;

    private constructor(options: DefaultElementBuilderOptions) {
        this.config = this.getConfigFromOptions(options);
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

    public withChild(children: HTMLElement[]): ElementBuilder;
    public withChild(children: HTMLCollection): ElementBuilder;
    public withChild(child: HTMLElement, ...rest: HTMLElement[]): ElementBuilder;
    public withChild(singleOrCollection: HTMLElement | HTMLElement[] | HTMLCollection, ...rest: HTMLElement[]): ElementBuilder {
        return this.applyWithPredicate((config) => {
            config.children ??= [];

            if (singleOrCollection instanceof HTMLCollection || Array.isArray(singleOrCollection)) {
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

    private getConfigFromOptions({ config: elementConfig, element: htmlElement, tag }: DefaultElementBuilderOptions): ElementConfig {
        if (elementConfig) {
            return elementConfig;
        }

        if (htmlElement) {
            return { target: htmlElement };
        }

        if (tag) {
            return { target: tag };
        }

        throw new Error('None of options is defined');
    }

    public static forTag(tag: keyof HTMLElementTagNameMap): DefaultElementBuilder {
        return new DefaultElementBuilder({ tag });
    }

    public static forElement(element: HTMLElement): DefaultElementBuilder {
        return new DefaultElementBuilder({ element });
    }

    public static forConfig(config: ElementConfig): DefaultElementBuilder {
        return new DefaultElementBuilder({ config });
    }
}
