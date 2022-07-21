/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FactoryType } from './createFactory';
import { MetaInjector } from './MetaInjector';
import { createMeta, Meta } from './createMeta';

describe('MetaInjector', () => {
  it('test #1 (register/retrieve flow)', () => {
    const injector = new MetaInjector();

    expect(() => injector.retrieve(createMeta(1, '1'))).toThrow(
      'Object with id@1 is not registered in MetaInjector'
    );

    const fn1 = jest.fn();
    const m1 = injector.createMeta<string, [a: number]>();
    injector.register(
      m1,
      () => {
        fn1();
        return 'str1';
      },
      FactoryType.Instant
    );
    expect(fn1).toBeCalledTimes(1);

    expect(() => injector.register(m1, () => 'str1')).toThrow(
      'Object with id@1 already registered in MetaInjector'
    );

    expect(() => injector.retrieve(m1.withParams(1))).toThrow(
      'Cannot use parameters with "Singleton" type'
    );

    expect(injector.retrieve(m1)).toEqual(['str1']);
    expect(fn1).toBeCalledTimes(1);

    const fn2 = jest.fn();
    const m2 = injector.createMeta<string>();
    injector.register(m2, () => {
      fn2();
      return 'str2';
    });
    expect(fn2).not.toBeCalled();

    expect(injector.retrieve(m2)).toEqual(['str2']);
    expect(fn2).toBeCalledTimes(1);
    injector.retrieve(m2);
    expect(fn2).toBeCalledTimes(1);

    expect(() => injector.register(createMeta(2, '2'), () => 'str2')).toThrow(
      'Object with id@2 already registered in MetaInjector'
    );

    const cl3 = class {
      constructor(public readonly a: number = 0, public readonly b?: number) { }
    };
    const fn3 = jest.fn();
    const m3 = injector.createMeta<InstanceType<typeof cl3>, typeof cl3>();
    injector.register(
      m3,
      (...args) => {
        fn3(...args);
        return new cl3(...args);
      },
      FactoryType.Factory
    );

    const [r31, r32, r33, r34] = injector.retrieve(
      m3,
      m3.withParams(1),
      m3.withParams(2).withParams(3),
      m3.withParams(4, 5)
    );

    expect(fn3).toBeCalledTimes(4);
    expect(r31 !== r32 && r31 !== r33 && r32 !== r33).toBeTruthy();
    expect(r31.a).toEqual(0);
    expect(r32.a).toEqual(1);
    expect(r33.a).toEqual(3);
    expect(fn3).nthCalledWith(1);
    expect(fn3).nthCalledWith(2, 1);
    expect(fn3).nthCalledWith(3, 3);
    expect(fn3).nthCalledWith(4, 4, 5);

    const m4 = injector.createMeta<string>('desc');
    expect(() => injector.retrieve(m4)).toThrow(
      'Object with id@desc is not registered in MetaInjector'
    );
  });

  it('test #3 (unregister flow)', () => {
    const injector = new MetaInjector();

    const fn1 = jest.fn();
    const m1 = injector.createMeta<string>();
    const m2 = injector.createMeta<string>();
    const m3 = injector.createMeta<string>();
    injector.register(m1, () => 'str1', fn1);
    injector.register(m2, () => 'str2');
    injector.register(m3, () => 'str3');

    expect(fn1).not.toBeCalled();

    expect(injector.retrieve(m1)).toEqual(['str1']);
    expect(fn1).not.toBeCalled();

    injector.unregister(m1);
    injector.unregister(m2, m3);

    expect(fn1).toBeCalledTimes(1);
    expect(fn1).toBeCalledWith('str1');

    expect(() => injector.retrieve(m1)).toThrow();
    expect(() => injector.retrieve(m2)).toThrow();
    expect(() => injector.retrieve(m3)).toThrow();
  });

  it('test #3 (allowOverriding/restore flow)', () => {
    const injector1 = new MetaInjector();
    const injector2 = new MetaInjector(true);

    const meta = injector1.createMeta<string>('9');

    injector1.register(meta, () => 'str1');
    expect(() => injector1.register(meta, () => 'str1')).toThrow();
    expect(injector1.retrieve(meta)).toEqual(['str1']);
    expect(() => injector1.restore(meta)).toThrow(
      'You can use `restore` method only when `new MetaInjector(true)`'
    );

    injector2.register(meta, () => 'str2');
    expect(injector2.retrieve(meta)).toEqual(['str2']);
    injector2.register(meta, () => 'str3');
    expect(injector2.retrieve(meta)).toEqual(['str3']);
    expect(() => injector2.restore(injector2.createMeta('10'))).toThrow(
      'Override existing registration with id@10 before use this method'
    );

    injector2.restore(meta);
    expect(injector2.retrieve(meta)).toEqual(['str2']);

    injector2.register(meta, () => 'str4');
    expect(injector2.retrieve(meta)).toEqual(['str4']);
    injector2.unregister(meta);

    expect(() => injector2.restore(meta)).toThrow(
      'Override existing registration with id@9 before use this method'
    );
  });

  it('test #4 (dispose with nullable object)', () => {
    const injector = new MetaInjector();

    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const meta1 = injector.createMeta<string>('1');
    const meta2 = injector.createMeta<string>('2');
    injector.register(meta1, () => 'str1', fn1);
    injector.register(meta2, () => 'str2', fn2, FactoryType.Factory);

    injector.unregister(meta1, meta2);

    expect(fn1).toBeCalledWith(null);
    expect(fn2).toBeCalledWith(null);

    injector.register(meta1, () => 'str1', fn1);
    injector.register(meta2, () => 'str2', fn2, FactoryType.Factory);

    injector.retrieve(meta1, meta2);

    injector.unregister(meta1, meta2);

    expect(fn1).toBeCalledWith('str1');
    expect(fn2).toBeCalledWith('str2');

    expect(fn1).toBeCalledTimes(2);
    expect(fn2).toBeCalledTimes(2);
  });
});
