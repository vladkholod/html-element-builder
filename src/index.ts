import { ElementBuilder } from './models/element-builder';
import { TargetElement } from './models/target-element';
import { ConfigElementBuilder } from './builders/config-element-builder';
import { ChainElementBuilder } from './builders/chain-element-builder';

function eb(target: TargetElement): ElementBuilder {
    return new ChainElementBuilder(target);
}

export {
    ConfigElementBuilder,
    ChainElementBuilder,

    eb,
};
