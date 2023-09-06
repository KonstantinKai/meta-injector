import { FactoryType } from '@kdevsoft/meta-injector';
import { injector } from '../injector';
import { Feature2 } from './Feature2';
import { feature2Meta } from './meta';

injector.register(
  feature2Meta,
  (...args) => new Feature2(...args),
  FactoryType.Factory
);
