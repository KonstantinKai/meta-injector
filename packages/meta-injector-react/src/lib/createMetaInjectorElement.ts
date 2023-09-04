import type {
  InferMetaTypeFromArgs,
  Meta,
  MetaInjector,
} from '@kdev/meta-injector';
import { memo } from 'react';
import { createMetaInjectorHook } from './createMetaInjectorHook';

interface InjectorElement {
  <T extends Meta<unknown>[]>(props: {
    metaList: [...T];
    children: (...args: InferMetaTypeFromArgs<T>) => JSX.Element;
  }): JSX.Element;
}

type Props = Parameters<InjectorElement>[0];

export const createMetaInjectorElement = (injector: MetaInjector) => {
  const useInjector = createMetaInjectorHook(injector);
  const InjectorElement = (props: Props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const services = useInjector(...props.metaList);
    return props.children(...services);
  };

  InjectorElement.displayName = 'MetaInjectorElement';

  return memo(InjectorElement, (prevProps, nextProps) =>
    nextProps.metaList.every(
      (meta, index) => meta === prevProps.metaList[index]
    )
  ) as never as InjectorElement;
};
