import { createMetaInjector } from '@kdevsoft/meta-injector';

export const injector = createMetaInjector(process.env['NODE_ENV'] === 'test');
