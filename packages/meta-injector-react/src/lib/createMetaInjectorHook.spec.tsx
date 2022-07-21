/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { FactoryType, MetaInjector } from '@kdev/meta-injector';
import { createMetaInjectorHook } from './createMetaInjectorHook';

const injector = new MetaInjector();
const useInjector = createMetaInjectorHook(injector);

function service(name: string): string {
  return name ?? 'default';
}
const m1 = injector.createMeta<ReturnType<typeof service>, typeof service>();
injector.register(m1, service, FactoryType.Factory);

describe('createMetaInjectorHook usage', () => {
  it('test #1', () => {
    const { result, rerender } = renderHook((meta: typeof m1) => useInjector(meta), {
      initialProps: m1,
    });

    const result1 = result.current;
    expect(result1).toEqual(['default']);
    rerender(m1);
    const result2 = result.current;
    expect(result2).toEqual(['default']);

    /**
     * Ensures that previosly two results are equal objects (`useMemo` are working)
     */
    expect(result1 === result2).toBeTruthy();

    rerender(m1.withParams('str1'));
    const result3 = result.current;

    expect(result3).toEqual(['str1']);
    expect(result1 !== result3).toBeTruthy();

    rerender(m1.withParams('str1'));
    const result4 = result.current;

    expect(result4).toEqual(['str1']);

    /**
     * Every `meta.withParams` always returns new meta
     */
    expect(result3 !== result4).toBeTruthy();
  });
});
