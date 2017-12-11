import { Line } from '../../primitives/line';
import { IPoint } from '../../primitives/point';
import { ReferenceColor } from '../reference/reference-color';

export interface ILineShapeOptions {
  /** This sets whether or not the line should respect scaling on it's thickness */
  allowScaling?: boolean;
  /** Sorting order of the line */
  depth?: number;
  /** Color of the line at the end point */
  endColor?: ReferenceColor;
  /** The start point of the line */
  p1: IPoint;
  /** THe end point of the line */
  p2: IPoint;
  /** The color of the line at the start point */
  startColor?: ReferenceColor;
  /** The thickness of the line */
  thickness?: number;
}

/**
 * Defines a line that can be drawn
 */
export class LineShape<T> extends Line<T> {
  /** Sorting order */
  depth: number;
  /** The color of the line at the start point */
  startColor: ReferenceColor;
  /** The color of the line at the end point */
  endColor: ReferenceColor;
  /** The thickness of the line */
  thickness: number;
  /** Setting that allows scaling on the line or not for it's thickness */
  allowScaling: boolean;

  /**
   * Generate a new line that can be drawn
   */
  constructor(options: ILineShapeOptions) {
    super(options.p1, options.p2);

    this.allowScaling = options.allowScaling || false;
    this.depth = options.depth || 0.0;
    this.endColor = options.endColor;
    this.startColor = options.startColor;
    this.thickness = options.thickness || 1.0;
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
    return Object.assign<LineShape<T>, Partial<LineShape<T>>>(
      new LineShape(this),
      newProperties,
    ) as LineShape<T>;
  }
}
