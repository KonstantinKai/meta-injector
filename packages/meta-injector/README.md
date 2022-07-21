# ![meta injector logo](../../assets/logo.png)

Lightweight, Typescript friendly, easy to use and understand service locator implementation.

---

No constructors binding, your service can be as anything that javascript allows (plain objects, functions, primitives, classes, .etc).
Just create simple `Meta<Type, OptionalCreatorParameters>` description of your service, bind this `meta` to the `Creator<Type>` and use it anywhere.

This lib was created with respect of testability. You can override binded `meta` with another implementation of destanation services for testing environment or production runtime (only if you known what are you doing) with ability of restoring original implememtation.

## Installation

```sh
npm install @kdev/meta-injector
```

## Usage

Setting up you application. You should create app level instance of `MetaInjector`;

```ts
// file: injector.ts
import { MetaInjector } from '@kdev/meta-injector';

export const injector = new MetaInjector();
```

Define your service

```ts
// file: Feature1.ts
export class Feature1 {
  method1(): void {}
  method2(): void {}
}
```

Create meta object. You can create meta objects in separate file related to the service, or collects all application services in one file, but don't forget import your services with `type` modifier e.g. `import type { Type } from './Type'`

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
