/**
 * Checks input condition and throws runtime exception
 */
export function assert(
  condition: boolean,
  message?: string
): asserts condition {
  if (!condition) {
    throw new Error(`[MetaInjectorError]: ${message}`);
  }
}
