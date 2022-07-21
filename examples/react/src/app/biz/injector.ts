import { MetaInjector } from '@kdev/meta-injector';

export const injector = new MetaInjector(process.env['NODE_ENV'] === 'test');
