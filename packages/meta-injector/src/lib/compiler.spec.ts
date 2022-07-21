/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { FactoryType } from './createFactory';
import { MetaInjector } from './MetaInjector';

interface E {
  dispose: () => void;
  m4: () => void;
}

function ee(a: boolean): E {
  return {
    dispose: () => { },
    m4: () => { },
  };
}

describe('compiler test', () => {
  it('test #1', () => {
    const di = new MetaInjector();

    class A {
      constructor(public a?: string) { }
      m() { }
    }
    class B {
      m1() { }
    }
    class C {
      m2() { }
    }
    class D {
      dispose(): void { }
      m3() { }
    }
    class F {
      constructor(a: number, b?: number) { }
      m5() { }
    }

    const m1 = di.createMeta<A, typeof A>();
    const m2 = di.createMeta<B>();
    const m3 = di.createMeta<C>();
    const m4 = di.createMeta<D>();
    const m5 = di.createMeta<E, typeof ee>();
    const m6 = di.createMeta<F, typeof F>();

    const services = {
      m1: di.createMeta<A>(),
      m2: di.createMeta<B>(),
    } as const;

    di.register(m1, (a) => new A(a));
    di.register(m2, () => new B());
    di.register(m3, () => new C(), FactoryType.Instant);
    di.register(
      m4,
      () => new D(),
      (obj) => obj?.dispose()
    );
    di.register(
      m5,
      (a) => ee(a),
      (obj) => obj?.dispose(),
      FactoryType.Instant
    );
    di.register(m6, (...args) => new F(...args), FactoryType.Factory);

    di.register(services.m1, () => new A());

    const [a, b, c, d, e, f] = di.retrieve(
      m1.withParams('a'),
      m2,
      m3,
      m4,
      m5,
      m6.withParams(1, 2).withParams(3)
    );

    di.unregister(m1, m2, m3);

    try {
      di.restore(m4, m5);
    } catch (error) {
      // Supress error
    }

    a.m();
    b.m1();
    c.m2();
    d.m3();
    e.m4();
    f.m5();
  });
});
