# ![meta injector logo](../../assets/meta-injector.png)

Lightweight, Typescript friendly, easy to use and understand service locator implementation.

---

Do you like the package? Buy me a coffee :)

<a href="https://www.buymeacoffee.com/konstantinkai" target="_blank"><img src="https://github.com/KonstantinKai/uploadcare_client/blob/master/assets/button.png?raw=true" alt="Buy Me A Coffee"></a>

No constructors binding, your service can be as anything that javascript allows (plain objects, functions, primitives, classes, .etc).
Just create simple `Meta<Type, OptionalCreatorParameters>` description of your service, bind this `meta` to the `Creator<Type>` and use it anywhere.

This lib was created with respect of testability. You can override binded `meta` with another implementation of destination services for testing environment or production runtime (only if you known what are you doing) with ability of restoring original implementation.

## Motivation

<!-- TODO: review -->

Have a centralized place for application services registration.
Since typescript `import type` feature was released and combining it with async `import()` feature of ES specification I decide to create dependency injection solution for projects I'm working with. For large application final code bundle size plays an important role. Less code faster start. `React` with `MobX` is my primary UI tools

## Installation

```sh
npm install @kdev/meta-injector
```

## Usage

Setting up your application. You should create app level instance of `MetaInjector`;

```ts
// file: injector.ts
import { createMetaInjector } from '@kdev/meta-injector';

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

Create meta object. You can create meta objects in separate file related to the service, or collects all application services in one file, but don't forget import your services with `type` modifier e.g. `import type { Type } from './Type'`. [Read more](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export) about `import type`

```ts
// file: feature1Meta.ts
import { injector } from './injector';
import type { Feature1 } from './Feature1';

export const feature1Meta = injector.createMeta<Feature1>();
```

Bind meta with imlementation physicaly

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

## Testability

To able to override existing bindings for abillity to test your code with mocked or overriden dependencies you should pass `true` parameter to the `MetaInjector` constructor. To do this you can use environment variables for example. Go to your app level `MetaInjector` instance and do the following

```ts
// file: injector.ts
import { createMetaInjector } from '@kdev/meta-injector';

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
