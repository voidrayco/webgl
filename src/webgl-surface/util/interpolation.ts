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
export function bezier2(t: number, p1: IPoint, p2: IPoint, c1: IPoint): IPoint {
  const t2 = t * t;
  const mt = 1 - t;
  const mt2 = mt * mt;

  return {
    x: p1.x * mt2 + c1.x * 2 * mt * t + p2.x * t2,
    y: p1.y * mt2 + c1.y * 2 * mt * t + p2.y * t2,
  };
}

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
export function bezier3(t: number, p1: IPoint, p2: IPoint, c1: IPoint, c2: IPoint): IPoint {
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;

  return {
    x: p1.x * mt3 + 3 * c1.x * mt2 * t + 3 * c2.x * mt * t2 + p2.x * t3,
    y: p1.y * mt3 + 3 * c1.y * mt2 * t + 3 * c2.y * mt * t2 + p2.y * t3,
  };
}
