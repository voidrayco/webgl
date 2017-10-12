/**
 * This defines the structure of an easing method
 */
export type EasingMethod = (t: number, s: number, c: number, d: number) => number;

/**
 * Does a linear easing of a value
 *
 * @param {number} t The time elapsed: 0 to d
 * @param {number} s The start value
 * @param {number} c The change in value
 * @param {number} d The duration of the change
 *
 * @returns A number linearly progressing from s to s+c depending on the value of
 *          t in relation to d
 */
export function linear(t: number, s: number, c: number, d: number): number {
  return c * t / d + s;
}
