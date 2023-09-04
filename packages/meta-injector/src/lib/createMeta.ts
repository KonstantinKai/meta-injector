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
  parameters?: P
] &
  Readonly<MetaWithParams<P, T>>;

export function createMeta<T, P = unknown>(
  id: MetaId,
  desc?: string,
  params?: P
): Meta<T, P> {
  desc ??= id.toString();
  const meta = [id, desc, params] as unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (meta as MetaWithParams<P, T>).withParams = (...args: any) =>
    createMeta(id, desc, args);

  return Object.freeze(meta) as Meta<T, P>;
}
