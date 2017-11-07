/**
 * This defines the structure of an easing method
 */
export declare type EasingMethod = (t: number, s: number, c: number, d: number) => number;
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
export declare function linear(t: number, s: number, c: number, d: number): number;
export declare function easeInQuad(t: number, b: number, c: number, d: number): number;
export declare function easeOutQuad(t: number, b: number, c: number, d: number): number;
export declare function easeInOutQuad(t: number, b: number, c: number, d: number): number;
export declare function easeInCubic(t: number, b: number, c: number, d: number): number;
export declare function easeOutCubic(t: number, b: number, c: number, d: number): number;
export declare function easeInOutCubic(t: number, b: number, c: number, d: number): number;
export declare function easeInQuart(t: number, b: number, c: number, d: number): number;
export declare function easeOutQuart(t: number, b: number, c: number, d: number): number;
export declare function easeInOutQuart(t: number, b: number, c: number, d: number): number;
export declare function easeInQuint(t: number, b: number, c: number, d: number): number;
export declare function easeOutQuint(t: number, b: number, c: number, d: number): number;
export declare function easeInOutQuint(t: number, b: number, c: number, d: number): number;
export declare function easeInSine(t: number, b: number, c: number, d: number): number;
export declare function easeOutSine(t: number, b: number, c: number, d: number): number;
export declare function easeInOutSine(t: number, b: number, c: number, d: number): number;
export declare function easeInExpo(t: number, b: number, c: number, d: number): number;
export declare function easeOutExpo(t: number, b: number, c: number, d: number): number;
export declare function easeInOutExpo(t: number, b: number, c: number, d: number): number;
export declare function easeInCirc(t: number, b: number, c: number, d: number): number;
export declare function easeOutCirc(t: number, b: number, c: number, d: number): number;
export declare function easeInOutCirc(t: number, b: number, c: number, d: number): number;
export declare function easeInElastic(t: number, b: number, c: number, d: number): number;
export declare function easeOutElastic(t: number, b: number, c: number, d: number): number;
export declare function easeInOutElastic(t: number, b: number, c: number, d: number): number;
export declare function easeInBack(t: number, b: number, c: number, d: number, s: number): number;
export declare function easeOutBack(t: number, b: number, c: number, d: number, s: number): number;
export declare function easeInOutBack(t: number, b: number, c: number, d: number, s: number): number;
export declare function easeInBounce(t: number, b: number, c: number, d: number): number;
export declare function easeOutBounce(t: number, b: number, c: number, d: number): number;
export declare function easeInOutBounce(t: number, b: number, c: number, d: number): number;
