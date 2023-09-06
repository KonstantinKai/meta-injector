import { createMetaInjector } from '@kdevsoft/meta-injector';

export const injector = createMetaInjector(
  ['test', 'development'].includes(process.env.NODE_ENV)
);
