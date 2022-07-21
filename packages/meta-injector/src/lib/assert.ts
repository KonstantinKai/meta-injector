type Condition = boolean | (() => boolean);

/**
 * Checks input condition and throws runtime exception
 */
export function assert(
  condition: Condition,
  message?: string
): asserts condition {
  if (typeof condition === 'function') {
    condition = condition();
  }

  if (!condition) {
    throw new Error(`[MetaInjectorError]: ${message}`);
  }
}
