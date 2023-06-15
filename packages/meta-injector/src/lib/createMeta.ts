import { InferParameters } from './types';

type MetaWithParams<P, T> = {
  withParams: InferParameters<P, Meta<T, P>>;
};

export type MetaId = number;

/**
 * Meta type for holding service type and single key in `MetaInjector`
 *
 * @typeParam T Type of a service object
 */
export type Meta<T, P = unknown> = readonly [
  id: MetaId,
  desc: string,

  /**
   * Always equals `undefined`, **only** for type referring
   *
   * NOTE: don't change the index of this field
   */
  runtimeType: T,

  parameters?: P
] &
  Readonly<MetaWithParams<P, T>>;

export function createMeta<T, P = unknown>(
  id: MetaId,
  desc?: string,
  params?: P
): Meta<T, P> {
  let u: undefined;
  desc ??= id.toString();
  const meta = [id, desc, u, params] as never;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (meta as MetaWithParams<P, T>).withParams = (...args: any) =>
    createMeta(id, desc, args);

  return Object.freeze(meta) as Meta<T, P>;
}
