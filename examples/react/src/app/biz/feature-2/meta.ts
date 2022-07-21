import { injector } from '../injector';
import type { Feature2 } from './Feature2';

export const feature2Meta = injector.createMeta<Feature2, typeof Feature2>('feature_2');
