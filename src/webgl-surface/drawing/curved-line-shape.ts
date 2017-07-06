import { CurvedLine, CurveType } from '../primitives/curved-line'
import { IPoint, Point } from '../primitives/point'
import { Line } from '../primitives/line'
import { rgb, RGBColor } from 'd3-color'

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
  cachesQuadSegments: boolean
  /** If caching is set, then this stores the calculated quads that composes this line */
  cachedQuadSegments: IPoint[]
  /** How thick the line should be */
  lineWidth: number = 1
  /** Depeth of draw location */
  depth: number = 0

  // The color components of this line
  r: number = 0
  g: number = 0
  b: number = 0
  a: number = 0

  /**
   * Retrieves the color of this curve based on gl color values
   * @return {RGBColor}
   */
  get color(): RGBColor {
    return rgb(this.r, this.g, this.b, this.a)
  }

  /**
   * Retrieves the color of this curve based on 256 value colors
   * @return {RGBColor}
   */
  get color256(): RGBColor {
    return rgb(this.r * 255.0, this.g * 255.0, this.b * 255.0, this.a)
  }

  /**
   * Applies an rgb color to this curve.
   */
  set color(val: RGBColor) {
    // See if this is a base 255 color system
    // for which we normalize the color
    if (val.r > 1.0 || val.g > 1.0 || val.b > 1.0) {
      this.r = val.r / 255.0
      this.g = val.g / 255.0
      this.b = val.b / 255.0
    }

    // Otherwise, we just apply as a 0-1 system
    else {
      this.r = val.r
      this.g = val.g
      this.b = val.b
    }

    // Set a, as it's always a 0-1 range
    this.a = val.opacity
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
    // as we will be constructing our own segmentation requiring a new type of cache
    super(type, p1, p2, controlPoints, resolution, false)
    this.cachesQuadSegments = cacheSegments

    if (color) {
      this.color = color
    }
  }

  /**
   * This produces a triangle strip that represents the quads that composes this line. If caching is present,
   * subsequent calls to this method will be much faster unless the cache gets invalidated.
   *
   * @return {IPoint[]} The Triangle Strip of points to create the quads that make each segment of the curve
   */
  getTriangleStrip(): IPoint[] {
    if (this.cachesSegments && this.cachedQuadSegments) {
      return this.cachedQuadSegments
    }

    // Make a container to hold our triangle strip info
    const strip: IPoint[] = []
    // Start with calculating the line strip so we can use the line segments
    // to produce the quads we need to render
    const lineStrip = this.getLineStrip()
    const lineWidthHalf = this.lineWidth / 2.0
    let line = new Line(Point.zero(), Point.zero())
    // We make a container point for the scaling operation to reduce allocations
    const scaledPoint: IPoint = Point.zero()

    // If the line strip is empty, then there is nothing to produce and makes
    // us unable to reduce the lineStrip, so return empty here
    if (lineStrip.length < 2) {
      return []
    }

    // Go through the linestrip to analyze each segment and covert it to a quad
    lineStrip.reduce((previous: IPoint, current: IPoint): IPoint => {
      // Update our line object with our new segment
      line.setPoints(previous, current)
      // Use the perpendicular calculation to produce our quad
      // Make the points where they will be in Clockwise fashion in our buffer
      // TR
      strip.push(
        Point.add(
          Point.scale(line.perpendicular, -lineWidthHalf, scaledPoint),
          current
        )
      )

      // BR
      strip.push(
        Point.add(
          Point.scale(line.perpendicular, lineWidthHalf, scaledPoint),
          current
        )
      )

      // TL
      strip.push(
        Point.add(
          Point.scale(line.perpendicular, -lineWidthHalf, scaledPoint),
          previous
        )
      )

      // BL
      strip.push(
        Point.add(
          Point.scale(line.perpendicular, lineWidthHalf, scaledPoint),
          previous
        )
      )

      return current
    })

    return strip
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
    super.setPoints(p1, p2, controlPoints)
    this.cachedQuadSegments = []
  }
}
