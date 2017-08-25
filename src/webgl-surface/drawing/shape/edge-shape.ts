import { rgb, RGBColor } from 'd3-color';
import { Line } from '../primitives/line';
import { IPoint } from '../primitives/point';
import { LineShape } from './line-shape';

/**
 * This defines an edge that can be drawn.
 * This type of edge is a quad with distorted ends. The quad will represent a
 * line with each end having potentially different sizes thus giving a four sided
 * polygon rather than a parallelogram.
 *
 * The edge shape also doubles up as a simple line shape should it be desired to
 * render differently.
 */
export class EdgeShape<T> extends LineShape<T> {
  /** Top left of the quad to generate this edge */
  tl: IPoint = {x: 0, y: 0};
  /** Bottom left of the quad to generate this edge */
  bl: IPoint = {x: 0, y: 0};
  /** Top right of the quad to generate this edge */
  tr: IPoint = {x: 0, y: 0};
  /** Bottom Right of the quad to generate this edge */
  br: IPoint = {x: 0, y: 0};

  /** Represents the line from the tl to the tr */
  topEdge: Line<T>;
  /** Represents the line from the bl to the br */
  bottomEdge: Line<T>;

  /** The width of the edge at the termination point */
  endWidth: number = 1;

  /**
   * Constructor with basic parameters to declare an edge
   *
   * @param p1 The point the edge begins at
   * @param p2 The point the edge terminates at
   * @param d The data associated with the edge
   * @param p1Col The color at the start point
   * @param p2Col The color at the end point
   * @param p1Width The width at the start point. Example: if you specify 4, then
   *                the start part of the edge will fan out 2 on either side of the
   *                start point
   * @param p2Width The width at the end point. Example: if you specify 4, then
   *                the end part of the edge will fan out 2 on either side of the
   *                end point
   */
  constructor(p1: IPoint, p2: IPoint, d: T, p1Col: RGBColor, p2Col: RGBColor, p1Width: number, p2Width: number) {
    // Set up all of our line shape based metrics
    super(
      p1, p2, d,
      p1Col.r, p1Col.g, p1Col.b, p1Col.opacity,
      p2Col.r, p2Col.g, p2Col.b, p2Col.opacity,
      p1Width,
    );

    this.endWidth = p2Width;
    this.setPoints(p1, p2);
  }

  /**
   * Clones this instance of the edge shape and creates a new instance of an edge shape that
   * is identical to this one. The properties injected can be modifiers after the clone happens
   *
   * @param newProperties New properties to override the properties on the new instance
   *
   * @return {EdgeShape} A newly cloned instance of this edgeshape
   */
  clone(newProperties: Partial<EdgeShape<T>>): EdgeShape<T> {
    return Object.assign(
      new EdgeShape(
        this.p1, this.p2, this.d,
        rgb(this.r, this.g, this.b, this.a),
        rgb(this.r2, this.g2, this.b2, this.a2),
        this.thickness,
        this.endWidth,
      ),
      this,
      newProperties,
    ) as EdgeShape<T>;
  }

  /**
   * Algorithm provided by
   * https://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
   * Adapted to Javascript by Chris @ VoidRay co
   *
   * Remember the point must be in the same
   * coordinate system that the edge is using
   *
   * @param {number} point The point to test
   *
   * @return {boolean} True if the point is inside the edge
   */
  pointInside(point: IPoint): boolean {
    const testx = point.x;
    const testy = point.y;

    // This is an algortihm to handle any number of points for a polygon. In this
    // Case our polygon is simply the points that make this fat edge. Note:
    // The points MUST be in CW order
    const points: IPoint[] = [this.tl, this.tr, this.br, this.bl];
    const numberVertices: number = points.length;
    let isClockwise: boolean = false;

    for (let i = 0, j = numberVertices - 1; i < numberVertices; j = i++) {
      if (((points[i].y > testy) !== (points[j].y > testy)) &&
         (testx < (points[j].x - points[i].x) * (testy - points[i].y) /
         (points[j].y - points[i].y) + points[i].x))        {
        isClockwise = !isClockwise;
      }
    }

    return isClockwise;
  }

  /**
   * @override
   * This sets the two endpoints for this edge and recalculates the bounds
   * of the edge accordingly.
   *
   * @param {IPoint} p1 The start point
   * @param {IPoint} p2 The end point
   */
  setPoints(p1: IPoint, p2: IPoint) {
    super.setPoints(p1, p2);

    if (this.tl) {
      // Get the distance from the points we will go based on specified widths
      const p1Dx = this.thickness / 2;
      const p2Dx = this.endWidth / 2;

      // Calculate the deltas to get from point to quad edge
      const p1DeltaX = this.perpendicular.x * p1Dx;
      const p1DeltaY = this.perpendicular.y * p1Dx;
      const p2DeltaX = this.perpendicular.x * p2Dx;
      const p2DeltaY = this.perpendicular.y * p2Dx;

      // Apply the metrics to our quad points
      // Start side of the edge
      this.tl.x = this.p1.x + p1DeltaX;
      this.tl.y = this.p1.y + p1DeltaY;
      this.bl.x = this.p1.x - p1DeltaX;
      this.bl.y = this.p1.y - p1DeltaY;

      // End side of the edge
      this.tr.x = this.p2.x + p2DeltaX;
      this.tr.y = this.p2.y + p2DeltaY;
      this.br.x = this.p2.x - p2DeltaX;
      this.br.y = this.p2.y - p2DeltaY;

      // Create lines for the edges for computations and faster hit detections
      this.topEdge = new Line<T>(this.tl, this.tr);
      this.bottomEdge = new Line<T>(this.bl, this.br);

      // Make sure our bounds reflects the entirety of the fat edge
      this.encapsulatePoints([this.tl, this.tr, this.bl, this.br]);
    }
  }
}
