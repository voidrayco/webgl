import { rgb, RGBColor } from 'd3-color';
import { Color } from 'three';
import { CurvedLine, ICurvedLineOptions } from '../primitives/curved-line';
import { Line } from '../primitives/line';
import { IPoint, Point } from '../primitives/point';

export interface ICurvedLineShapeOptions extends ICurvedLineOptions {
  /** Flags whether or not the calculated geometry for the line is cached or not */
  cacheSegments?: boolean;
  /** The depth of line to be rendered */
  depth?: number;
  /**
   * The color that will be at the end of the line. If this is differing from the
   * start color, the line will be a gradient.
   */
  endColor?: Color;
  /**
   * The ending opacity of the line. If this differs from the start opacity, the line
   * will be a gradient.
   */
  endOpacity?: number;
  /** The desired thickness of the line */
  lineWidth?: number;
  /** The base color of the line. */
  startColor: Color;
  /** The base opacity of the line */
  startOpacity?: number;
}

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

  // The starting color components of this line
  r: number = 0;
  g: number = 0;
  b: number = 0;
  a: number = 1;
  // The ending color components of this line
  r2: number = 0;
  g2: number = 0;
  b2: number = 0;
  a2: number = 1;

  /**
   * This indicates whether or not this line is rendered thin with a width of 1 or not
   * thin lines perform much better than fat lines.
   */
  isThin: boolean = false;

  /**
   * Retrieves the color of this curve based on gl color values
   * @return {Color}
   */
  get color(): Color {
    return new Color(this.r, this.g, this.b);
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
  set color(val: Color) {
    this.r = val.r;
    this.g = val.g;
    this.b = val.b;
  }

  /**
   * Retrieves the end color of this curve based on gl color values
   * @return {Color}
   */
  get endColor(): Color {
    return new Color(this.r2, this.g2, this.b2);
  }

  /**
   * Retrieves the end color of this curve based on 256 value colors
   * @return {RGBColor}
   */
  get endColor256(): RGBColor {
    return rgb(this.r2 * 255.0, this.g2 * 255.0, this.b2 * 255.0, this.a);
  }

  /**
   * Applies an ending rgb color to this curve.
   */
  set endColor(val: Color) {
    this.r2 = val.r;
    this.g2 = val.g;
    this.b2 = val.b;
  }

  /**
   * Creates an instance of CurvedLineShape.
   *
   * @param {ICurvedLineShapeOptions} options The options for creating this line
   */
  constructor(options: ICurvedLineShapeOptions) {
    // We pass our properties to the curve line but we do not let it cache it's version of the line segments
    // As we will be constructing our own segmentation requiring a new type of cache
    super(options);

    this.encapsulatePoints(this.getTriangleStrip());
    this.cachesQuadSegments = options.cacheSegments;
    this.depth = options.depth || 0;
    this.a = options.startOpacity || 0;
    this.a2 = options.endOpacity || 0;
    this.lineWidth = options.lineWidth || 1;

    if (options.startColor) {
      this.color = options.startColor;
    }

    if (options.endColor) {
      this.endColor = options.endColor;
    }

    else if (options.startColor) {
      this.endColor = options.startColor;
    }
  }

  /**
   * Returns a new instance of this object that mimicks the properties of this Object
   *
   * @returns {CurvedLineShape<T>} The cloned object
   */
  clone() {
    // Perform the clone
    const clone: CurvedLineShape<T> = new CurvedLineShape<T>({
      cacheSegments: this.cachesSegments,
      controlPoints: this.controlPoints,
      end: this.p2,
      endOpacity: this.a2,
      lineWidth: this.lineWidth,
      resolution: this.resolution,
      start: this.p1,
      startColor: this.color,
      startOpacity: this.a,
      type: this.type,
    });

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
