import type { Meta, MetaInjector } from '@kdevsoft/meta-injector';
import { useMemo } from 'react';

export const createMetaInjectorHook =
  (injector: MetaInjector): MetaInjector['retrieve'] =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...injectable: any[]): any =>
      useMemo(
        () => injector.retrieve(...(injectable as [Meta<unknown>])),
        injectable
      );
