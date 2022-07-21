import { injector } from '../injector';
import type { Feature1 } from './Feature1';

export const feature1Meta = injector.createMeta<Feature1>('feature_1');
