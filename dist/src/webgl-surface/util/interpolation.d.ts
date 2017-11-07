import { IPoint } from '../primitives/point';
import { EasingMethod } from './easing';
/**
 * This enum is just a common way to define interpolation types
 */
export declare enum InterpolationMethod {
    BEZIER2 = 0,
    BEZIER3 = 1,
    CIRCULAR = 2,
}
/**
 * This calculates a quadratic bezier curve.
 *
 * We use specific bezier curve implementations for low degree curves as it is
 * much much faster to calculate.
 *
 * @param {number} t The 0 - 1 time interval for the part of the curve we desire
 * @param {IPoint} p1 The First end point of the curve
 * @param {IPoint} p2 The second end point of the curve
 * @param {IPoint} c1 The control point of the curve
 *
 * @returns {IPoint} The calculated point on the curve for the provided time interval
 */
export declare function bezier2(t: number, p1: IPoint, p2: IPoint, c1: IPoint): IPoint;
/**
 * This calculates a cubic bezier curve.
 *
 * We use specific bezier curve implementations for low degree curves as it is
 * much much faster to calculate.
 *
 * @param {number} t The 0 - 1 time interval for the part of the curve we desire
 * @param {IPoint} p1 The First end point of the curve
 * @param {IPoint} p2 The second end point of the curve
 * @param {IPoint} c1 The first control point of the curve
 * @param {IPoint} c2 The second control point of the curve
 *
 * @returns {IPoint} The calculated point on the curve for the provided time interval
 */
export declare function bezier3(t: number, p1: IPoint, p2: IPoint, c1: IPoint, c2: IPoint): IPoint;
/**
 * This calculates a point along a path defined as a circular path which is a
 * path moving along the edge of a circle from one point to the next. This will
 * even allow for moving along a circle with a growing radius.
 *
 * @param {number} t The 0 - 1 time interval for the part of the path we desire
 * @param {IPoint} p1 The First end point of the curve
 * @param {IPoint} p2 The second end point of the curve
 * @param {IPoint} c1 The control point, or more importantly, the center of the circle
 * @param {EasingMethod} radiusEasing Default easing for the radius growing is linear.
 *                                    Insert a custom easing method to change this.
 *
 * @returns {IPoint}
 */
export declare function circular(t: number, p1: IPoint, p2: IPoint, c1: IPoint, radiusEasing?: EasingMethod): IPoint;
export declare const pickInterpolation: {
    [key: number]: Function;
};
