import { IPoint, Point } from '../primitives/point';
import { EasingMethod, linear } from './easing';

/**
 * This enum is just a common way to define interpolation types
 */
export enum InterpolationMethod {
  BEZIER2,
  BEZIER3,
  CIRCULAR,
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
export function circular(t: number, p1: IPoint, p2: IPoint, c1: IPoint, radiusEasing?: EasingMethod): IPoint {
  // Get the direction vector from the circle center to the first end point
  const direction1 = Point.getDirection(c1, p1);
  // Get the angle of the first vector
  let theta1 = Math.atan2(direction1.y, direction1.x);
  // Get the direction vector from the circle center to the second end point
  const direction2 = Point.getDirection(c1, p2);
  // Get the angle of the second vector
  let theta2 = Math.atan2(direction2.y, direction2.x);
  // Ensure our theta's are definitely between 0 to Math.PI * 2 after the atan
  // Calculation
  if (theta1 < 0) theta1 += Math.PI * 2;
  if (theta2 < 0) theta2 += Math.PI * 2;

  let dTheta = theta2 - theta1;

  // We ALWAYS want our path to be the shortest around the circle
  if (dTheta > Math.PI) {
    dTheta = theta1 - theta2;
  }

  // We use this to calculate how far we are between the two points in radians
  // Based on the time parameter provided for the interpolation
  dTheta *= t;

  // We must have the radial distance of both points to properly calculate
  // An easing between the two radii
  const radius1 = Point.getDistance(p1, c1);
  const radius2 = Point.getDistance(p2, c1);

  // We control how the radius eases out for the path, which is determined by
  // The easing method, otherwise, it just linearly radiates out
  const radius = (radiusEasing || linear)(t, radius1, radius2 - radius1, 1.0);

  return {
    x: Math.cos(theta1 + dTheta) * radius + c1.x,
    y: Math.sin(theta1 + dTheta) * radius + c1.y,
  };
}

export const pickInterpolation: {[key: number]: Function} = {
  [InterpolationMethod.BEZIER2]: bezier2,
  [InterpolationMethod.BEZIER3]: bezier3,
  [InterpolationMethod.CIRCULAR]: circular,
};
