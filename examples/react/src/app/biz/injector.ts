import { createMetaInjector } from '@kdev/meta-injector';

export const injector = createMetaInjector(process.env['NODE_ENV'] === 'test');
