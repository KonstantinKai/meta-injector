import { createMetaInjector } from '@kdev/meta-injector';

export const injector = createMetaInjector(
  ['test', 'development'].includes(process.env.NODE_ENV)
);
