import { ElementBuilder } from '../models/element-builder';
import { ElementConfig } from '../models/element-config';
import { RawTransformer } from '../models/raw-transformer';

type DefaultElementBuilderOptions = {
    tag?: keyof HTMLElementTagNameMap;
    element?: HTMLElement;
    config?: ElementConfig;
}

export class DefaultElementBuilder implements ElementBuilder {
    private readonly config: ElementConfig;

    private constructor(options: DefaultElementBuilderOptions) {
        this.config = this.getConfigFromOptions(options);
    }

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
        this.config.classNames ??= [];
        this.config.classNames.push(className, ...rest);

        return this;
    }

    public withChild(children: HTMLElement[]): ElementBuilder;
    public withChild(children: HTMLCollection): ElementBuilder;
    public withChild(child: HTMLElement, ...rest: HTMLElement[]): ElementBuilder;
    public withChild(singleOrCollection: HTMLElement | HTMLElement[] | HTMLCollection, ...rest: HTMLElement[]): ElementBuilder {
        this.config.children ??= [];
        if (singleOrCollection instanceof HTMLCollection || Array.isArray(singleOrCollection)) {
            this.config.children.push(...singleOrCollection);
        } else {
            this.config.children.push(singleOrCollection, ...rest);
        }

        return this;
    }

    public withText(text: string): ElementBuilder {
        this.config.innerText = text;

        return this;
    }

    public withListener<EventName extends keyof HTMLElementEventMap>(eventName: EventName, handler: (event: HTMLElementEventMap[EventName]) => void): ElementBuilder {
        this.config.listeners ??= [];
        this.config.listeners.push([eventName, handler]);

        return this;
    }

    public withRawTransformation(transformer: RawTransformer): ElementBuilder {
        this.config.rawTransformers ??= [];
        this.config.rawTransformers.push(transformer);

        return this;
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
