import { ElementBuilder } from './models/element-builder';
import { TargetElement } from './models/target-element';
import { DefaultElementBuilder } from './builders/default-element-builder';

function elementBuilder(tagOrElement: TargetElement): ElementBuilder { 
    return new DefaultElementBuilder(tagOrElement);
}

export {
    DefaultElementBuilder as ElementBuilder,
    elementBuilder as eb,
};
