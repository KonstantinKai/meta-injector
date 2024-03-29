# ![meta injector react logo](../../assets/meta-injector-react.png)

React binding for `@kdevsoft/meta-injector`

---

## Installation

```sh
npm install @kdevsoft/meta-injector-react
```

## Usage

Create application level hook and ReactElement for using `@kdevsoft/meta-injector`

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

```ts
// file: useInjector.ts
import { createMetaInjectorHook } from '@kdevsoft/meta-injector-react';
import { injector } from './injector';

export const useInjector = createMetaInjectorHook(injector);
```

```ts
// file: InjectorElement.ts
import { createMetaInjectorElement } from '@kdevsoft/meta-injector-react';
import { injector } from './injector';

export const InjectorElement = createMetaInjectorElement(injector);
```

Hook use case. Under the hood uses `React.useMemo` to reduce amount of render

```tsx
// file: TestElement1.tsx
import { FC } from 'react';
import { services } from './services';
import { useInjector } from './useInjector';

const Element: FC = () => {
  const [service1, service2, service3] = useInjector(services.service1, services.service2, services.service3);

  return (
    <>
      <div>{service1 /* str1 */}</div>
      <div>{service2 /* str2 */}</div>
      <div>{service3 /* str3 */}</div>
    </>
  );
};

const TestElement1 = Element;
export default TestElement1;
```

Element use case. Under the hood uses `useInjector` hook with `React.memo` HOC with custom comparator

```tsx
// file: TestElement2.tsx
import { FC } from 'react';
import { services } from './services';
import { InjectElement } from './InjectElement';

const Element: FC = () => (
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

---

Do you like the package? Buy me a coffee :)

<a href="https://www.buymeacoffee.com/konstantinkai" target="_blank"><img src="https://github.com/KonstantinKai/meta-injector/blob/main/assets/buymeacoffee-button.png?raw=true" alt="Buy Me A Coffee"></a>
