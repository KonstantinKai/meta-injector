![release](https://github.com/KonstantinKai/meta-injector/actions/workflows/release.yml/badge.svg)
![npm package minimized gzipped size (scoped version select exports)](https://img.shields.io/bundlejs/size/%40kdevsoft/meta-injector)

# ![meta injector logo](https://github.com/KonstantinKai/meta-injector/raw/main/assets/meta-injector.png)

Lightweight, Typescript friendly, easy to use and understand service locator implementation. **(just 800 B gzipped)**

---

No constructors binding, your service can be as anything that javascript allows (plain objects, functions, primitives, classes, .etc).
```ts
// just create simple meta descriptor of your service with
const service1Meta = injector.createMeta<Type>('<optionally descriptive name>');

// bind descriptor to the `Creator` with
injector.register(service1Meta, () => Type);

// and use it anywhere with
const [service1, service2, service3, service4] = injector.retrieve(service1Meta, service2Meta, service3Meta, service4Meta, ...rest);
// p.s. service2Meta, service3Meta, service4Meta, are just for showing how you can retrieve dependencies
```
You don't need to remember service alias or service type anymore.

## Key features

- Simplicity
- Lightweight (800 B gzipped)
- Typescript friendly
- Lazy services initialization
- Services mocking for testing with the ability to restore them on teardown

## Motivation

Have a centralized place for application services. No need to specify type of service implicitly on access, your service type holds `meta` descriptor.
Since typescript `import type` feature was released and combining it with async `import()` feature of ES specification I decide to create dependency injection solution for projects I'm working with. For large application final code bundle size plays an important role. Less code faster start.

## Installation

```sh
npm install @kdevsoft/meta-injector
```

## Usage

Setting up your application. You should create app level instance of `MetaInjector`;

```ts
// file: injector.ts
import { createMetaInjector } from '@kdevsoft/meta-injector';

export const injector = createMetaInjector();
```

Define your service

```ts
// file: Feature1.ts
export class Feature1 {
  method1(): void {}
  method2(): void {}
}
```

Create meta descriptor. You can create meta objects in separate file related to the service, or collects all application services in one file, but don't forget import your services with `type` modifier e.g. `import type { Type } from './Type'`. [Read more](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export) about `import type`

_Variant 1:_ holds meta descriptor in a separate file

```ts
// file: feature1Meta.ts
import { injector } from './injector';
import type { Feature1 } from './Feature1';

export const feature1Meta = injector.createMeta<Feature1>('descriptive name of service');
```

_Variant 2:_ holds meta descriptor in one file

```ts
// file: services.ts
import { injector } from './injector';
import type { Feature1 } from './Feature1';
import type { Feature2 } from './Feature2';
import type { Feature3 } from './Feature3';
import type { Feature4 } from './Feature4';

export const services = {
  feature1: injector.createMeta<Feature1>('feature1'),
  feature2: injector.createMeta<Feature2>('feature2'),
  feature3: injector.createMeta<Feature3>('feature3'),
  feature4: injector.createMeta<Feature4>('feature4'),
} as const;
```

_Variant 3:_ holds meta descriptor in a feature based manner

```ts
// file: feature1/meta.ts
import { injector } from '@/injector';
import type { Feature1 } from './biz/Feature1';

export const feature1ServicesMeta = {
  feature1: injector.createMeta<Feature1>('feature1');
} as const;

---
// file: feature2/meta.ts
import { injector } from '@/injector';
import type { Feature2 } from './biz/Feature2';

export const feature2ServicesMeta = {
  feature2: injector.createMeta<Feature2>('feature2');
} as const;

---
// file: app/services.ts
import { feature1ServicesMeta } from 'feature1/meta';
import { feature2ServicesMeta } from 'feature2/meta';

export const services = {
  ...feature1ServicesMeta,
  ...feature2ServicesMeta,
} as const;

```

Bind meta with implementation physically

```ts
// file: feature1Registration.ts
import { injector } from './injector';
import { feature1Meta } from './feature1Meta';
import { Feature1 } from './Feature1';

// There is a three types of service registration:
//
// FactoryType.Lazy - calls creator function only on the first access (**Used by default**)
// FactoryType.Instant - calls creator function only once until they will be unregistered
// FactoryType.Factory - calls creator function every time when you access them by meta
injector.register(feature1Meta, () => new Feature1());
```

Difference between `FactoryType.Instant` & `FactoryType.Lazy`:

```ts
const metaInstant = injector.createMeta<'Instant'>();
const metaLazy = injector.createMeta<'Lazy'>();

injector.register(metaInstant, () => 'Instant', FactoryType.Instant); // will call creator function immediately and store 'Instant' string in memory
injector.register(metaLazy, () => 'Lazy', FactoryType.Lazy); // will not call creator function

const [instantStr] = injector.retrieve(metaInstant); // returns previously created 'Instant' string
const [lazyStr1] = injector.retrieve(metaLazy); // will call creator function and returns 'Lazy' string
const [lazyStr2] = injector.retrieve(metaLazy); // will not call creator function and returns previously created 'Lazy' string
```

Get access to this service in some code of your app

```ts
// file: some-file.ts
import { injector } from './injector';
import { feature1Meta } from './feature1Meta';

import './feature1Registration';

const [feature1] = injector.retrieve(feature1Meta);

feature1.method1();
feature1.method2();
```

If you are using `FactoryType.Factory` and your service can accept arguments, no problem, you can do it while retrieving them

```ts
class Service1 {
  constructor(public a: string, public b: number) {}
}

interface Service2 {
  a: boolean;
}
function createService2(a: boolean): Service2 {
  return { a };
}

// declare second type parameter to infer constructor or function arguments
const s1Meta = injector.createMeta<Service1, typeof Service1>('s1');
const s2Meta = injector.createMeta<Service2, typeof createService2>('s2');

injector.register(s1Meta, (...args) => new Service1(...args), FactoryType.Factory);
injector.register(s2Meta, (...args) => createService2(...args), FactoryType.Factory);

// Now you can create your services every time with necessary parameters. All parameters are strong typed
const [s1_1, s2_1] = injector.retrieve(s1Meta.withParams('str1', 1), s2Meta.withParams(true));
const [s1_2, s2_2] = injector.retrieve(s1Meta.withParams('str2', 2), s2Meta.withParams(false));

s1_1.a === 'str1';
s1_1.b === 1;
s1_2.a === 'str2';
s1_2.b === 2;

s2_1.a === true;
s2_2.a === false;
```

If you need free some resources after the service was unregistered, sure...

```ts
class Service {
  subscribe(): void {
    // Some code
  }

  unsubscribe(): void {
    // Some code
  }
}

const meta = injector.createMeta<Service>('s1');

injector.register(
  meta,
  () => new Service(),
  /**
   * @param {Service | null} obj
   *
   * NOTE: `obj` can be `null` in case for `FactoryType.Lazy` or `FactoryType.Factory` if you call `unregister` before the `retrieve` method
   */
  (obj) => obj?.unsubscribe()
);

// A few moment later
// ...
// This method will call dispose function if they was specified
injector.unregister(meta);
```

## Integration

**React**

Easy to use `@kdevsoft/meta-injector` library with React via `@kdevsoft/@meta-injector-react` bindings. This library provides hook and ReactElement for retrieving services from the registry

Create an application wide hook and element:

```ts
// file: useInjector.ts
import { injector } from './app-injector';
import { createMetaInjectorHook } from '@kdevsoft/meta-injector-react';

export const useInjector = createMetaInjectorHook(injector);
```

```ts
// file: InjectorElement.ts
import { injector } from './injector';
import { createMetaInjectorElement } from '@kdevsoft/meta-injector-react';

export const InjectorElement = createMetaInjectorElement(injector);
```

Usage

For example we have the following services

```ts
// file: services.ts
import { injector } from './injector';

export const services = {
  service1: injector.createMeta<'str1'>(),
  service2: injector.createMeta<'str2'>(),
  service3: injector.createMeta<'str3'>(),
} as const;
```

```ts
// file: registration.ts
import { services } from './services';

(
  [
    [services.service1, 'str1'],
    [services.service2, 'str2'],
    [services.service3, 'str3'],
  ] as const
).forEach(([meta, value]) => {
  injector.register(meta, () => value);
});
```

Retrieve services with the hook in `FunctionComponent`

```tsx
// file: TestElement1.tsx
import { FC } from 'react';
import { services } from './services';
import { useInjector } from './useInjector';

export const TestElement1: FC = () => {
  const [service1, service2, service3] = useInjector(services.service1, services.service2, services.service3);

  return (
    <>
      <div>{service1 /* str1 */}</div>
      <div>{service2 /* str2 */}</div>
      <div>{service3 /* str3 */}</div>
    </>
  );
};
```

Retrieve services with the `Element` in `FunctionComponent`

```tsx
// file: TestElement2.tsx
import { FC } from 'react';
import { services } from './services';
import { InjectElement } from './InjectElement';

export const TestElement2: FC = () => (
  <InjectElement metaList={[services.service1, services.service2, services.service3]}>
    {(service1, service2, service3) => (
      <>
        <div>{service1 /* str1 */}</div>
        <div>{service2 /* str2 */}</div>
        <div>{service3 /* str3 */}</div>
      </>
    )}
  </InjectElement>
);
```

## Testability

This lib was created with respect of testability. You can override binded `meta` with another implementation of destination services for testing environment or production runtime (only if you known what are you doing) with ability of restoring original implementation.

To able to override existing bindings for ability to test your code with mocked or overridden dependencies you should pass `true` parameter to the `createMetaInjector` function. To do this you can use environment variables for example. Go to your app level `MetaInjector` instance and do the following

```ts
// file: injector.ts
import { createMetaInjector } from '@kdevsoft/meta-injector';

export const injector = createMetaInjector(process.env.NODE_ENV === 'test');
```

Imagine you need to mock service which works with some backend API

```ts
// file: BackendAPI.ts
export class BackendAPI {
  async fetchThing1(param1: string): Promise<string[]> {
    const result = await fetch(`/pathname1?param1=${param1}`, {
      method: 'GET',
    });
    return await result.json();
  }
}
```

```ts
// file: AppLogic1.ts
import type { BackendAPI } from './BackendAPI';

export class AppLogic1 {
  constructor(public readonly api: BackendAPI) {}

  listOfStrings: string[] = [];

  async fetchThing1(param: string): Promise<void> {
    try {
      const result = await this.api.fetchThing1(param);
      this.listOfStrings = result;
    } catch {
      // Supress an error
    }
  }
}
```

```ts
// file: services.ts
import { injector } from './injector';
import type { BackendAPI } from './BackendAPI';
import type { AppLogic1 } from './AppLogic1';

export const services = {
  appLogic1: injector.createMeta<AppLogic1>();
  backendAPI: injector.createMeta<BackendAPI>();
} as const;
```

```ts
// file: backendAPIRegistration.ts
import { injector } from './injector';
import { BackendAPI } from './BackendAPI';
import { services } from './services';

injector.register(services.backendAPI, () => new BackendAPI());
```

```ts
// file: appLogic1Registration.ts
import { injector } from './injector';
import { AppLogic1 } from './AppLogic1';
import { services } from './services';

import './backendAPIRegistration';

injector.register(services.appLogic1, () => {
  const [api] = services.retrieve(services.backendAPI);
  return new AppLogic(api);
});
```

```ts
// file appLogic1.spec.ts
import { injector } from './injector';
import { services } from './services';
import type { BackendAPI } from './BackendAPI';

import './appLogic1Registration';

class MockedBackendAPI implements BackendAPI {
  fetchThing1(param1: string): Promise<string[]> {
    return Promise.resolve(['str1', 'str2', 'str3', 'str4']);
  }
}

describe('app logic 1', () => {
  before(() => {
    // Override services.backendAPI with mocked implementation
    injector.register(services.backendAPI, () => new MockedBackendAPI());
  });

  after(() => {
    // Restore initial implementation of the service
    injector.restore(services.backendAPI);
  });

  test('Should works correctly with list of strings', async () => {
    const [appLogic1] = injector.retrieve(services.appLogic1);

    await appLogic1.fetchThing1('param1');

    expect(appLogic1.listOfString).toEqual(['str1', 'str2', 'str3', 'str4']);
  });
});
```

## API

```ts
const api = createMetaInjector();
```

| Method                                                                               | Description                                                                                                            |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `createMeta<T, P = unknown>(desc?: string): Meta<T, P>`                              | Creates `Meta` and associate it with type `T` and creator parameters `P` if exists                                     |
| `register<T, P>(meta: Meta<T, P>, creator: Creator<T, P>): void`                     | Binds `Meta` with `Creator`. `register` can accept four arguments, see `MetaInjector` definition for more details      |
| `retrieve<T extends Meta<unknown>[]>(...metaArgs: [...T]): InferMetaTypeFromArgs<T>` | Retrieves objects registered in the `injector`. Returns `Tuple` of objects transformed from input meta arguments       |
| `unregister(...metaArgs: Meta<unknown>[]): void`                                     | Unregister `Creator` binded to the `Meta` from `injector` and run `dispose` function associated with this registration |
| `isRegistered(meta: Meta<unknown>): boolean`                                         | Safely checks that `Creator` is linked with `Meta`                                                                     |
| `restore(...metaArgs: Meta<unknown>[]): void`                                        | Restores previously overidden `Meta` in case if `_allowOverriding` equals `true`                                       |

## Tips
- Allow overriding for dev environment with hot module replacement
```ts
export const injector = createMetaInjector(process.env.NODE_ENV === 'test' || typeof module.hot !== 'undefined');

// or if you are using `vite`
export const injector = createMetaInjector([typeof import.meta.hot !== 'undefined', import.meta.env.DEV].includes(true));
```

---

Do you like the package? Buy me a coffee :)

<a href="https://www.buymeacoffee.com/konstantinkai" target="_blank"><img src="https://github.com/KonstantinKai/meta-injector/blob/main/assets/buymeacoffee-button.png?raw=true" alt="Buy Me A Coffee"></a>

---

### Inspired by `get_it` `dart` package
