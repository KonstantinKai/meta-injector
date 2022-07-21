import type { Meta, MetaInjector } from '@kdev/meta-injector';
import { memo } from 'react';
import { createMetaInjectorHook } from './createMetaInjectorHook';

interface InjectorElement {
  <M1 extends Meta<unknown>>
    (props: {
      metaList: [M1];
      children: (...args: [M1[2]]) => JSX.Element;
    }): JSX.Element;
  <M1 extends Meta<unknown>,
    M2 extends Meta<unknown>>
    (props: {
      metaList: [M1, M2];
      children: (...args: [M1[2], M2[2]]) => JSX.Element;
    }): JSX.Element;
  <M1 extends Meta<unknown>,
    M2 extends Meta<unknown>,
    M3 extends Meta<unknown>>
    (props: {
      metaList: [M1, M2, M3];
      children: (...args: [M1[2], M2[2], M3[2]]) => JSX.Element;
    }): JSX.Element;
  <M1 extends Meta<unknown>,
    M2 extends Meta<unknown>,
    M3 extends Meta<unknown>,
    M4 extends Meta<unknown>>
    (props: {
      metaList: [M1, M2, M3, M4];
      children: (...args: [M1[2], M2[2], M3[2], M4[2]]) => JSX.Element;
    }): JSX.Element;
  <M1 extends Meta<unknown>,
    M2 extends Meta<unknown>,
    M3 extends Meta<unknown>,
    M4 extends Meta<unknown>,
    M5 extends Meta<unknown>>
    (props: {
      metaList: [M1, M2, M3, M4, M5];
      children: (...args: [M1[2], M2[2], M3[2], M4[2], M5[2]]) => JSX.Element;
    }): JSX.Element;
  <M1 extends Meta<unknown>,
    M2 extends Meta<unknown>,
    M3 extends Meta<unknown>,
    M4 extends Meta<unknown>,
    M5 extends Meta<unknown>,
    M6 extends Meta<unknown>>
    (props: {
      metaList: [M1, M2, M3, M4, M5, M6];
      children: (...args: [M1[2], M2[2], M3[2], M4[2], M5[2], M6[2]]) => JSX.Element;
    }): JSX.Element;
  <M1 extends Meta<unknown>,
    M2 extends Meta<unknown>,
    M3 extends Meta<unknown>,
    M4 extends Meta<unknown>,
    M5 extends Meta<unknown>,
    M6 extends Meta<unknown>,
    M7 extends Meta<unknown>>
    (props: {
      metaList: [M1, M2, M3, M4, M5, M6, M7];
      children: (...args: [M1[2], M2[2], M3[2], M4[2], M5[2], M6[2], M7[2]]) => JSX.Element;
    }): JSX.Element;
  <M1 extends Meta<unknown>,
    M2 extends Meta<unknown>,
    M3 extends Meta<unknown>,
    M4 extends Meta<unknown>,
    M5 extends Meta<unknown>,
    M6 extends Meta<unknown>,
    M7 extends Meta<unknown>,
    M8 extends Meta<unknown>>
    (props: {
      metaList: [M1, M2, M3, M4, M5, M6, M7, M8];
      children: (...args: [M1[2], M2[2], M3[2], M4[2], M5[2], M6[2], M7[2], M8[2]]) => JSX.Element;
    }): JSX.Element;
}

type Props = Parameters<InjectorElement>[0];

export const createMetaInjectorElement = (injector: MetaInjector) => {
  const useInjector = createMetaInjectorHook(injector);
  const InjectorElement = (props: Props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const services = useInjector(...props.metaList);
    return props.children(...services);
  }

  InjectorElement.displayName = 'MetaInjectorElement';

  return memo(
    InjectorElement,
    (prevProps, nextProps) => nextProps.metaList.every((meta, index) => meta === prevProps.metaList[index])
  ) as never as InjectorElement;
};
