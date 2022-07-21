import { assert } from './assert';
import {
  Factory,
  FactoryType,
  createFactory,
  Creator,
  Disposer,
} from './createFactory';
import { createMeta, Meta, MetaId } from './createMeta';

let _internalId = 0;

export class MetaInjector {
  constructor(
    /**
     * **Not safe if you don't know what you are doing because changing objects in runtime will produce unexpected behavior**
     *
     * Allow registration another {@link Creator} with previously registered {@link Meta}.
     * For example, you need to override some service for the test environment
     *
     * ```ts
     * const di = new MetaInjector(process.env.NODE_ENV === 'test');
     * ```
     *
     * @default false
     */
    allowOverriding?: boolean
  ) {
    this._allowOverriding = allowOverriding ?? false;
  }

  private readonly _allowOverriding: boolean;
  private readonly _factories: Record<MetaId, Factory<unknown, unknown>> = {};
  private _pendingRestore: Record<MetaId, Factory<unknown, unknown>> = {};

  private _releaseStorage(id: MetaId, storage: Record<MetaId, unknown>): void {
    storage[id] = null;
    delete storage[id];
  }

  private _getObject<T, P>(meta: Meta<T, P>): T {
    const [id, , , params = []] = meta;

    this._ensureRegistered(meta);

    const [getObject] = this._factories[id];

    return getObject(params) as T;
  }

  private _ensureRegistered(meta: Meta<unknown>): void {
    const [, desc] = meta;
    assert(
      this.isRegistered(meta),
      `Object with id@${desc} is not registered in MetaInjector`
    );
  }

  /**
   * Safely checks that {@link Creator} with {@link Meta} is registered
   */
  isRegistered(meta: Meta<unknown>): boolean {
    return meta[0] in this._factories;
  }

  /**
   * Creates {@link Meta} and associate it with type `T` and creator parameters `P` if exists
   */
  createMeta<T, P = unknown>(desc?: string): Meta<T, P> {
    return createMeta<T, P>(++_internalId, desc);
  }

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
  ): void {
    const [id, desc] = meta;

    assert(
      !this._allowOverriding ? !this.isRegistered(meta) : true,
      `Object with id@${desc} already registered in MetaInjector`
    );

    if (this._allowOverriding && this.isRegistered(meta)) {
      this._pendingRestore[id] = this._factories[id];
    }

    const type =
      typeof third === 'number'
        ? third
        : typeof fourth === 'number'
          ? fourth
          : FactoryType.Lazy;
    const disposer = typeof third === 'function' ? third : null;

    const factory = createFactory(type, creator, disposer);
    this._factories[id] = factory as Factory<unknown, unknown>;
  }

  /**
   * Restores previously overidden {@link Meta} in case if {@link _allowOverriding} equals `true`
   */
  restore(...metaArgs: Meta<unknown>[]): void {
    for (const meta of metaArgs) {
      const [id, desc] = meta;
      assert(
        this._allowOverriding,
        'You can use `restore` method only when `new MetaInjector(true)`'
      );
      assert(
        id in this._pendingRestore,
        `Override existing registration with id@${desc} before use this method`
      );

      this._factories[id] = this._pendingRestore[id];
      this._releaseStorage(id, this._pendingRestore);
    }
  }

  /**
   * Unregister {@link Creator} binded to the {@link Meta} from scope and run `dispose` function associated with this registration
   *
   * Throws runtime error if registration not exists
   *
   * Throws runtime error if dispose was attached and object didn't get accessed
   */
  unregister(...metaArgs: Meta<unknown>[]): void {
    for (const meta of metaArgs) {
      const [id] = meta;

      this._ensureRegistered(meta);

      const [, dispose] = this._factories[id];

      dispose();

      this._releaseStorage(id, this._factories);
      this._releaseStorage(id, this._pendingRestore);
    }
  }

  /**
   * Retrieves objects registered in the scope.
   * 
   * **Note:** limit by 8 elements is only for TS compiler
   *
   * @returns Tuple of objects transformed from input meta arguments
   */
  retrieve<M1 extends Meta<unknown>>(meta1: M1): [M1[2]];
  retrieve<M1 extends Meta<unknown>, M2 extends Meta<unknown>>(
    meta1: M1,
    meta2: M2
  ): [M1[2], M2[2]];
  retrieve<
    M1 extends Meta<unknown>,
    M2 extends Meta<unknown>,
    M3 extends Meta<unknown>
  >(meta1: M1, meta2: M2, meta3: M3): [M1[2], M2[2], M3[2]];
  retrieve<
    M1 extends Meta<unknown>,
    M2 extends Meta<unknown>,
    M3 extends Meta<unknown>,
    M4 extends Meta<unknown>
  >(meta1: M1, meta2: M2, meta3: M3, meta4: M4): [M1[2], M2[2], M3[2], M4[2]];
  retrieve<
    M1 extends Meta<unknown>,
    M2 extends Meta<unknown>,
    M3 extends Meta<unknown>,
    M4 extends Meta<unknown>,
    M5 extends Meta<unknown>
  >(
    meta1: M1,
    meta2: M2,
    meta3: M3,
    meta4: M4,
    meta5: M5
  ): [M1[2], M2[2], M3[2], M4[2], M5[2]];
  retrieve<
    M1 extends Meta<unknown>,
    M2 extends Meta<unknown>,
    M3 extends Meta<unknown>,
    M4 extends Meta<unknown>,
    M5 extends Meta<unknown>,
    M6 extends Meta<unknown>
  >(
    meta1: M1,
    meta2: M2,
    meta3: M3,
    meta4: M4,
    meta5: M5,
    meta6: M6
  ): [M1[2], M2[2], M3[2], M4[2], M5[2], M6[2]];
  retrieve<
    M1 extends Meta<unknown>,
    M2 extends Meta<unknown>,
    M3 extends Meta<unknown>,
    M4 extends Meta<unknown>,
    M5 extends Meta<unknown>,
    M6 extends Meta<unknown>,
    M7 extends Meta<unknown>
  >(
    meta1: M1,
    meta2: M2,
    meta3: M3,
    meta4: M4,
    meta5: M5,
    meta6: M6,
    meta7: M7
  ): [M1[2], M2[2], M3[2], M4[2], M5[2], M6[2], M7[2]];
  retrieve<
    M1 extends Meta<unknown>,
    M2 extends Meta<unknown>,
    M3 extends Meta<unknown>,
    M4 extends Meta<unknown>,
    M5 extends Meta<unknown>,
    M6 extends Meta<unknown>,
    M7 extends Meta<unknown>,
    M8 extends Meta<unknown>
  >(
    meta1: M1,
    meta2: M2,
    meta3: M3,
    meta4: M4,
    meta5: M5,
    meta6: M6,
    meta7: M7,
    meta8: M8
  ): [M1[2], M2[2], M3[2], M4[2], M5[2], M6[2], M7[2], M8[2]];
  retrieve(...metaArgs: Meta<unknown>[]): unknown[] {
    return metaArgs.map((meta) => this._getObject(meta));
  }
}
