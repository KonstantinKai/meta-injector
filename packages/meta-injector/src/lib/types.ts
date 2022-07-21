/* eslint-disable @typescript-eslint/no-explicit-any */
export type InferParameters<P, R> = (
  ...params: P extends abstract new (...args: any) => any
    ? ConstructorParameters<P>
    : P extends (...args: any) => any
    ? Parameters<P>
    : P extends unknown[]
    ? P
    : never
) => R;
