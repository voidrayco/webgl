import { CurvedLine, ICurvedLineOptions } from '../../primitives/curved-line';
import { Line } from '../../primitives/line';
import { IPoint, Point } from '../../primitives/point';
import { ReferenceColor } from '../reference/reference-color';

export interface IMarchingAnts {
  /**
   * This is how fast the ants will march along the line. A speed of 1 will
   * make the ants march the full line in 1 second. A speed of 2 will make them
   * march the line if half a second. Conversly, a speed of 0.5 will make them
   * march in 2 seconds.
   */
  speed: number;
  /**
   * This is how long the solid part of the ant line is
   * This number is a value that ranges from 0 - 1, so it is more a percentage
   * of the line rather than a pixel value. The pixel value can be calculated
   * if the distance of the line is first calculated.
   */
  strokeLength: number;
  /**
   * This is how long the gap is between each ant. This too is a value between
   * 0 - 1 (see strokeLength)
   */
  gapLength: number;
}

export interface ICurvedLineShapeOptions extends ICurvedLineOptions {
  /** Flags whether or not the calculated geometry for the line is cached or not */
  cacheSegments?: boolean;
  /** The depth of line to be rendered */
  depth?: number;
  /**
   * The color that will be at the end of the line. If this is differing from the
   * start color, the line will be a gradient.
   */
  endColor?: ReferenceColor;
  /**
   * The ending opacity of the line. If this differs from the start opacity, the line
   * will be a gradient.
   */
  endOpacity?: number;
  /** The desired thickness of the line */
  lineWidth?: number;
  /**
   * When this is set, the line will have properties needed for rendering marching
   * ants in webgl
   */
  marchingAnts?: IMarchingAnts;
  /** The base color of the line. */
  startColor?: ReferenceColor;
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
  /** Depeth of draw location */
  depth: number = 0;
  /** The ending color components of this line. This must be a color reference */
  endColor: ReferenceColor;
  /** The starting color components of this line. This must be a color reference */
  startColor: ReferenceColor;
  /** How thick the line should be */
  lineWidth: number = 1;
  /** When set, this curved line will have the potential to render as a marching ant line */
  marchingAnts: IMarchingAnts;

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
    this.lineWidth = options.lineWidth || 1;
    this.startColor = options.startColor;
    this.endColor = options.endColor;
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
      end: this.end,
      endColor: this.endColor,
      lineWidth: this.lineWidth,
      resolution: this.resolution,
      start: this.start,
      startColor: this.startColor,
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
   * @param {IPoint} start
   * @param {IPoint} end
   * @param {IPoint[]} controlPoints
   */
  setPoints(start: IPoint, end: IPoint, controlPoints?: IPoint[]) {
    super.setPoints(start, end, controlPoints);
    this.cachedQuadSegments = [];
  }
}
