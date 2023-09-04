/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render } from '@testing-library/react';
import { FactoryType, createMetaInjector } from '@kdev/meta-injector';
import { createMetaInjectorElement } from './createMetaInjectorElement';

const injector = createMetaInjector();
const Element = createMetaInjectorElement(injector);

const m1 = injector.createMeta<string>();
const m2 = injector.createMeta<string, [string?]>();

injector.register(m1, () => 'str1');
injector.register(m2, (str) => str ?? 'str2', FactoryType.Factory);

describe('createMetaInjectorElement usage', () => {
  it('test #1', () => {
    const fn = jest.fn();
    const { queryByTestId, rerender } = render(
      <Element metaList={[m1, m2]}>
        {(a, b) => {
          fn();
          return (
            <>
              <div data-testid="a">{a}</div>
              <div data-testid="b">{b}</div>
            </>
          );
        }}
      </Element>
    );

    expect(queryByTestId('a')!.innerHTML).toEqual('str1');
    expect(queryByTestId('b')!.innerHTML).toEqual('str2');
    expect(fn).toBeCalledTimes(1);

    rerender(
      <Element metaList={[m1, m2]}>
        {(a, b) => {
          fn();
          return (
            <>
              <div data-testid="a">{a}</div>
              <div data-testid="b">{b}</div>
            </>
          );
        }}
      </Element>
    );

    expect(fn).toBeCalledTimes(1);

    rerender(
      <Element metaList={[m2.withParams('str3'), m1]}>
        {(a, b) => {
          fn();
          return (
            <>
              <div data-testid="a">{a}</div>
              <div data-testid="b">{b}</div>
            </>
          );
        }}
      </Element>
    );

    expect(queryByTestId('a')!.innerHTML).toEqual('str3');
    expect(queryByTestId('b')!.innerHTML).toEqual('str1');

    expect(fn).toBeCalledTimes(2);

    rerender(
      <Element metaList={[m2.withParams('str3'), m1]}>
        {(a, b) => {
          fn();
          return (
            <>
              <div data-testid="a">{a}</div>
              <div data-testid="b">{b}</div>
            </>
          );
        }}
      </Element>
    );

    expect(fn).toBeCalledTimes(3);
  });
});
