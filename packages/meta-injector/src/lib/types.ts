/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta } from './createMeta';

export type InferParameters<P, R> = (
  ...params: P extends abstract new (...args: any) => any
    ? ConstructorParameters<P>
    : P extends (...args: any) => any
    ? Parameters<P>
    : P extends unknown[]
    ? P
    : never
) => R;

export type UnwrapMetaType<T> = T extends Meta<infer U> ? U : T;

export type InferMetaTypeFromArgs<T extends [...any[]]> = T extends [
  infer H,
  ...infer R
]
  ? [UnwrapMetaType<H>, ...InferMetaTypeFromArgs<R>]
  : [];
