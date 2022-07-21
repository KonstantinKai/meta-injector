import { injector } from '../injector';
import { Feature1 } from './Feature1';
import { feature1Meta } from './meta';

injector.register(feature1Meta, () => new Feature1());
