/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChainElementBuilder } from '../builders/chain-element-builder';
import { ElementBuilder } from '../models/element-builder';

export function createChainElementBuilder<TagName extends keyof HTMLElementTagNameMap>(tagName: TagName): ElementBuilder<HTMLElementTagNameMap[TagName]>;

export function createChainElementBuilder<T extends HTMLElement>(target: T): ElementBuilder<T>;

// Implementation
export function createChainElementBuilder(arg: any): ElementBuilder<any> {
    if (typeof arg === 'string') {
        return new ChainElementBuilder<any>(arg as any);
    } else {
        return new ChainElementBuilder(arg);
    }
}
