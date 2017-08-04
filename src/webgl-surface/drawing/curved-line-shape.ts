import { rgb, RGBColor } from 'd3-color';
import { CurvedLine, CurveType } from '../primitives/curved-line';
import { Line } from '../primitives/line';
import { IPoint, Point } from '../primitives/point';

/**
 * This defines a drawable curved line shape. It contains the information necessary
 * to efficiently render the line.
 *
 * @export
 * @class CurvedLineShape
 * @extends {CurvedLine<T>}
 * @template T An associated data type that can be linked to this shape to make data retrieval from interacting
 *             with the shape easier.
 */
export class CurvedLineShape<T> extends CurvedLine<T> {
  /** When true, this line will cache the segments of the curve as rendered quads */
  cachesQuadSegments: boolean;
  /** If caching is set, then this stores the calculated quads that composes this line */
  cachedQuadSegments: IPoint[];
  /** How thick the line should be */
  lineWidth: number = 1;
  /** Depeth of draw location */
  depth: number = 0;

  // The color components of this line
  r: number = 0;
  g: number = 0;
  b: number = 0;
  a: number = 0;

  /**
   * Retrieves the color of this curve based on gl color values
   * @return {RGBColor}
   */
  get color(): RGBColor {
    return rgb(this.r, this.g, this.b, this.a);
  }

  /**
   * Retrieves the color of this curve based on 256 value colors
   * @return {RGBColor}
   */
  get color256(): RGBColor {
    return rgb(this.r * 255.0, this.g * 255.0, this.b * 255.0, this.a);
  }

  /**
   * Applies an rgb color to this curve.
   */
  set color(val: RGBColor) {
    // See if this is a base 255 color system
    // For which we normalize the color
    if (val.r > 1.0 || val.g > 1.0 || val.b > 1.0) {
      this.r = val.r / 255.0;
      this.g = val.g / 255.0;
      this.b = val.b / 255.0;
    }

    // Otherwise, we just apply as a 0-1 system
    else {
      this.r = val.r;
      this.g = val.g;
      this.b = val.b;
    }

    // Set a, as it's always a 0-1 range
    this.a = val.opacity;
  }

  /**
   * Creates an instance of CurvedLineShape.
   *
   * @param {CurveType} type The curve type. Defines
   * @param {IPoint} p1
   * @param {IPoint} p2
   * @param {IPoint[]} controlPoints
   * @param {number} [resolution=20]
   * @param {boolean} [cacheSegments=false]
   */
  constructor(type: CurveType, p1: IPoint, p2: IPoint, controlPoints: IPoint[], color?: RGBColor, resolution: number = 20, cacheSegments: boolean = false) {
    // We pass our properties to the curve line but we do not let it cache it's version of the line segments
    // As we will be constructing our own segmentation requiring a new type of cache
    super(type, p1, p2, controlPoints, resolution);

    this.encapsulatePoints(this.getTriangleStrip());
    this.cachesQuadSegments = cacheSegments;

    if (color) {
      this.color = color;
    }
  }

  /**
   * Returns a new instance of this object that mimicks the properties of this Object
   *
   * @returns {CurvedLineShape<T>} The cloned object
   */
  clone() {
    // Perform the clone
    const clone: CurvedLineShape<T> = new CurvedLineShape<T>(
      this.type,
      this.p1,
      this.p2,
      this.controlPoints,
      this.color,
      this.resolution,
      this.cachesSegments,
    );

    clone.lineWidth = this.lineWidth;
    clone.depth = this.depth;
    clone.d = this.d;

    return clone;
  }

  /**
   * @override
   * See base definition
   */
  distanceTo(point: IPoint): number {
    return Math.max(0, super.distanceTo(point) - (this.lineWidth / 2.0));
  }

  /**
   * This produces a triangle strip that represents the quads that composes this line. If caching is present,
   * subsequent calls to this method will be much faster unless the cache gets invalidated.
   *
   * @return {IPoint[]} The Triangle Strip of points to create the quads that make each segment of the curve
   */
  getTriangleStrip(): IPoint[] {
    if (this.cachesSegments && this.cachedQuadSegments) {
      return this.cachedQuadSegments;
    }

    // Make a container to hold our triangle strip info
    const strip: IPoint[] = [];
    const normal: IPoint[] = [];
    // Start with calculating the line strip so we can use the line segments
    // To produce the quads we need to render
    const lineStrip = this.getLineStrip();
    const lineWidthHalf = this.lineWidth / 2.0;
    const line = new Line(Point.zero(), Point.zero());
    // We make a container point for the scaling operation to reduce allocations
    const scaledPoint: IPoint = Point.zero();

    // If the line strip is empty, then there is nothing to produce and makes
    // Us unable to reduce the lineStrip, so return empty here
    if (lineStrip.length < 2) {
      return [];
    }

    // Calculate bisecting normal or each node
    for (let i = 0; i < lineStrip.length - 1; i++){
      line.setPoints(lineStrip[i], lineStrip[i + 1]);
      if (normal.length === 0){
        normal.push(line.perpendicular);
      }else{
        // Sum of two normals of a point
        const temp: IPoint = {
          x: normal[i].x + line.perpendicular.x,
          y: normal[i].y + line.perpendicular.y,
        };
        // Normalize the sum of two normals
        const sqrt = Math.sqrt(temp.x * temp.x + temp.y * temp.y);
        temp.x = temp.x / sqrt;
        temp.y = temp.y / sqrt;
        normal[i] = temp;
      }
      normal.push(line.perpendicular);
    }

    // Use the new normals to generate quads
    for (let i = 0; i < lineStrip.length - 1; i++){
      const previous: IPoint = lineStrip[i];
      const current: IPoint = lineStrip[i + 1];
      // TR
      strip.push(
        Point.add(
          Point.scale(normal[i + 1], -lineWidthHalf, scaledPoint),
          current,
        ),
      );
      // BR
      strip.push(
        Point.add(
          Point.scale(normal[i + 1], lineWidthHalf, scaledPoint),
          current,
        ),
      );
      // TL
      strip.push(
        Point.add(
          Point.scale(normal[i], -lineWidthHalf, scaledPoint),
          previous,
        ),
      );

      // BL
      strip.push(
        Point.add(
          Point.scale(normal[i], lineWidthHalf, scaledPoint),
          previous,
        ),
      );
    }

    return strip;
  }

  /**
   * @override
   * Adjusts the relevant points that defines the curve and recalculates all items necessary
   *
   * @param {IPoint} p1
   * @param {IPoint} p2
   * @param {IPoint[]} controlPoints
   */
  setPoints(p1: IPoint, p2: IPoint, controlPoints?: IPoint[]) {
    super.setPoints(p1, p2, controlPoints);
    this.cachedQuadSegments = [];
  }
}
