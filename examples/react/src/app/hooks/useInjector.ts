import { createMetaInjectorHook } from '@kdevsoft/meta-injector-react';
import { injector } from '../biz/injector';

export const useInjector = createMetaInjectorHook(injector);
