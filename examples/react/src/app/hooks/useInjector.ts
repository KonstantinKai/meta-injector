import { createMetaInjectorHook } from '@kdev/meta-injector-react';
import { injector } from '../biz/injector';

export const useInjector = createMetaInjectorHook(injector);
