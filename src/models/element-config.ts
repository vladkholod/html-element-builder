import { ListenerDescriptor } from './listener-descriptor';
import { RawTransformer } from './raw-transformer';
import { TargetElement } from './target-element';

export type ElementConfig = {
    target: TargetElement;
    classNames?: string[];
    children?: Element[];
    innerText?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listeners?: ListenerDescriptor<any>[];
    rawTransformers?: RawTransformer[];
};
