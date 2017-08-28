import { Line } from '../../primitives/line';
import { IPoint } from '../../primitives/point';

/**
 * Defines a line that can be drawn
 */
export class LineShape<T> extends Line<T> {
  // Color 1
  a: number = 0;
  b: number = 0;
  g: number = 0;
  r: number = 1;
  // Color 2 ?
  a2: number = 0;
  b2: number = 0;
  g2: number = 0;
  r2: number = 1;
  // Other properties
  cull: boolean = true;
  selectedIndex: number;
  thickness: number = 1;

  /**
   * Generate a new line that can be drawn
   */
  constructor(p1: IPoint, p2: IPoint, d: T, r: number, g: number, b: number, a: number, r2: number, g2: number, b2: number, a2: number, thickness?: number) {
    super(p1, p2);

    Object.assign(this, {
      a,
      a2,
      b,
      b2,
      d,
      g,
      g2,
      r,
      r2,
    });

    if (thickness !== undefined) {
      this.thickness = thickness;
    }
  }

  /**
   * Clones this instance of the line shape and creates a new instance of a line shape that
   * is identical to this one. The properties injected can be modifiers after the clone happens
   *
   * @param newProperties New properties to override the properties on the new instance
   *
   * @return {CircleShape} A newly cloned instance of this line shape
   */
  clone(newProperties: Partial<LineShape<T>>) {
    return Object.assign(
      new LineShape(this.p1, this.p2, this.d, this.r, this.g, this.b, this.a, this.r2, this.g2, this.b2, this.a2),
      this,
      newProperties,
    ) as LineShape<T>;
  }
}
