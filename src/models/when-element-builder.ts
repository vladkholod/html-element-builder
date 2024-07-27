import { OmitExact } from '../utils/omit-exact';
import { ElementBuilder } from './element-builder';

export type WhenElementBuilder = OmitExact<ElementBuilder, 'when' | 'build'>;
