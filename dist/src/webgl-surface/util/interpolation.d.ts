import { IPoint } from '../primitives/point';
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
