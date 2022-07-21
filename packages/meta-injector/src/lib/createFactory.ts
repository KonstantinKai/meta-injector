import { assert } from './assert';
import { InferParameters } from './types';

/**
 * Factory function
 */
export type Creator<T, P = unknown> = InferParameters<P, T>;

/**
 * Possibly `obj` can be `null` in case for `LateSingleton, Factory` if object didn't accessed it before
 */
export type Disposer<T> = (obj: T | null) => unknown;

export const enum FactoryType {
  /**
   * Calls {@link Creator} only once until they will be unregistered
   */
  Instant,

  /**
   * Calls {@link Creator} only on the first access
   */
  Lazy,

  /**
   * Calls {@link Creator} every time when you access them by meta
   */
  Factory,
}

export type Factory<T, P> = readonly [
  getObject: (params: P) => T,

  /**
   * Add ability for disposing resources when calling `unregister` method of `MetaInjector`
   */
  dispose: () => void
];

/**
 * Main point for creating registered objects
 *
 * @typeParam T Type of service object
 */
export function createFactory<T, P>(
  type: FactoryType,
  creator: Creator<T, P>,
  disposer?: Disposer<T> | null
): Factory<T, P> {
  const effectiveDisposer = disposer ?? null;

  let object =
    type === FactoryType.Instant ? creator(...([] as never)) : null;

  return Object.freeze([
    (params: P) => {
      assert(
        [
          FactoryType.Instant,
          FactoryType.Lazy,
          FactoryType.Factory,
        ].includes(type),
        `Cannot operate with type "${type}"`
      );

      assert(
        FactoryType.Instant === type
          ? (params as never as unknown[]).length === 0
          : true,
        'Cannot use parameters with "Singleton" type'
      );

      if (type === FactoryType.Factory) {
        object = creator(...(params as never));
      }

      return (object ??= creator(...(params as never)));
    },
    () => {
      if (effectiveDisposer !== null) {
        new Promise<null>((resolve) => {
          try {
            effectiveDisposer(object);
          } catch (error) {
            // Supress an error
          } finally {
            resolve(null);
          }
        });
      }
    },
  ]) as Factory<T, P>;
}
