import { assert } from './assert';
import {
  Factory,
  FactoryType,
  createFactory,
  Creator,
  Disposer,
} from './createFactory';
import { createMeta as createMetaInternal, Meta, MetaId } from './createMeta';
import { InferMetaTypeFromArgs } from './types';

let _internalId = 0;

export interface MetaInjector {
  /**
   * Safely checks that {@link Creator} is linked with {@link Meta}
   */
  isRegistered(meta: Meta<unknown>): boolean;

  /**
   * Creates {@link Meta} and associate it with type `T` and creator parameters `P` if exists
   */
  createMeta<T, P = unknown>(desc?: string): Meta<T, P>;

  /**
   * Binds {@link Meta} with {@link Creator}
   */
  register<T, P>(meta: Meta<T, P>, creator: Creator<T, P>): void;
  register<T, P>(
    meta: Meta<T, P>,
    creator: Creator<T, P>,
    disposer: Disposer<T>
  ): void;
  register<T, P>(
    meta: Meta<T, P>,
    creator: Creator<T, P>,
    type: FactoryType
  ): void;
  register<T, P>(
    meta: Meta<T, P>,
    creator: Creator<T, P>,
    disposer: Disposer<T>,
    type: FactoryType
  ): void;
  register<T, P>(
    meta: Meta<T, P>,
    creator: Creator<T, P>,
    third?: Disposer<T> | FactoryType,
    fourth?: FactoryType
  ): void;

  /**
   * Unregister {@link Creator} binded to the {@link Meta} from scope and run `dispose` function associated with this registration
   *
   * Throws runtime error if registration not exists
   */
  unregister(...metaArgs: Meta<unknown>[]): void;

  /**
   * Retrieves objects registered in the scope.
   *
   * @returns Tuple of objects transformed from input meta arguments
   */
  retrieve<T extends Meta<unknown>[]>(
    ...metaArgs: [...T]
  ): InferMetaTypeFromArgs<T>;

  /**
   * Restores previously overidden {@link Meta} in case if {@link _allowOverriding} equals `true`
   */
  restore(...metaArgs: Meta<unknown>[]): void;
}

export function createMetaInjector(
  /**
   * **Not safe if you don't know what you are doing because changing objects in runtime will produce unexpected behavior**
   *
   * Allow registration another {@link Creator} with previously registered {@link Meta}.
   * For example, you need to override some service for the test environment
   *
   * ```ts
   * const di = createMetaInjector(process.env.NODE_ENV === 'test');
   * ```
   *
   * @default false
   */
  allowOverriding?: boolean
): MetaInjector {
  const _factories: Record<MetaId, Factory<unknown, unknown>> = {};
  const _pendingRestore: Record<MetaId, Factory<unknown, unknown>> = {};
  const _allowOverriding = allowOverriding ?? false;

  function _releaseStorage(id: MetaId, storage: Record<MetaId, unknown>): void {
    storage[id] = null;
    delete storage[id];
  }

  function _getFactory<T, P>(meta: Meta<T, P>): T {
    _ensureRegistered(meta);

    const [id, , params = []] = meta;
    return _factories[id][0](params) as T;
  }

  function _ensureRegistered(meta: Meta<unknown>): void {
    const [, desc] = meta;
    assert(isRegistered(meta), `Object with id@${desc} is not registered`);
  }

  function isRegistered(meta: Meta<unknown>): boolean {
    return meta[0] in _factories;
  }

  function createMeta<T, P = unknown>(desc?: string): Meta<T, P> {
    return createMetaInternal<T, P>(++_internalId, desc);
  }

  function register<T, P>(
    meta: Meta<T, P>,
    creator: Creator<T, P>,
    third?: Disposer<T> | FactoryType,
    fourth?: FactoryType
  ): void {
    const [id, desc] = meta;

    assert(
      !_allowOverriding ? !isRegistered(meta) : true,
      `Object with id@${desc} already registered`
    );

    if (_allowOverriding && isRegistered(meta)) {
      _pendingRestore[id] = _factories[id];
    }

    const type =
      typeof third === 'number'
        ? third
        : typeof fourth === 'number'
        ? fourth
        : FactoryType.Lazy;
    const disposer = typeof third === 'function' ? third : null;

    _factories[id] = createFactory(type, creator, disposer) as Factory<
      unknown,
      unknown
    >;
  }

  function restore(...metaArgs: Meta<unknown>[]): void {
    assert(
      _allowOverriding,
      'You can use `restore` method only when `createMetaInjector(true)`'
    );

    for (const meta of metaArgs) {
      const [id, desc] = meta;
      assert(
        id in _pendingRestore,
        `Override existing registration with id@${desc} before use this method`
      );

      _factories[id] = _pendingRestore[id];
      _releaseStorage(id, _pendingRestore);
    }
  }

  function unregister(...metaArgs: Meta<unknown>[]): void {
    for (const meta of metaArgs) {
      _ensureRegistered(meta);

      const [id] = meta;
      const [, dispose] = _factories[id];

      dispose();

      _releaseStorage(id, _factories);
      _releaseStorage(id, _pendingRestore);
    }
  }

  function retrieve<T extends Meta<unknown>[]>(
    ...metaArgs: [...T]
  ): InferMetaTypeFromArgs<T> {
    return metaArgs.map((m) => _getFactory(m)) as InferMetaTypeFromArgs<T>;
  }

  return Object.freeze({
    isRegistered,
    createMeta,
    register,
    restore,
    retrieve,
    unregister,
  });
}
