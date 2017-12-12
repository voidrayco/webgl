import { Vector4 } from 'three';
import { Circle, ICircleOptions } from '../../primitives/circle';

export interface ICircleShapeOptions extends ICircleOptions {
  /** Determines rendering order for the  */
  depth: number;
  /** Color of the circle for the area that is less than the innerRadius */
  color?: Vector4;
  /** Specifies an inner colored area of the circle */
  innerColor?: Vector4;

  innerRadius?: number;
  /** Color of the circle for the area that is greater than the innerRadius */
  size: number;
}

/**
 * Defines a circular shape that can be drawn
 */
export class CircleShape<T> extends Circle<T> {
  /** Color of the circle for the area that is greater than the innerRadius */
  color?: Vector4;
  /** The rendering depth of the circle */
  depth: number;
  /** Color of the circle for the area that is less than the innerRadius */
  innerColor?: Vector4;
  /** Specifies an inner colored area of the circle */
  innerRadius?: number;
  size: number;

  /**
   * Sets the properties of the shape to be drawn
   *
   * @param {ICircleShapeOptions} options The options for the shape
   */
  constructor(options: ICircleShapeOptions) {
    super(options);

    this.depth = options.depth || 0;
    this.color = options.color;
    this.innerColor = options.innerColor;
    this.innerRadius = options.innerRadius;
    this.size = options.size;
  }

  /**
   * Clones this instance of the circle shape and creates a new instance of a circle shape that
   * is identical to this one. The properties injected can be modifiers after the clone happens
   *
   * @param newProperties New properties to override the properties on the new instance
   *
   * @return {CircleShape} A newly cloned instance of this circleshape
   */
  clone(newProperties: Partial<CircleShape<T>>): CircleShape<T> {
    const instance = new CircleShape(this) as CircleShape<T>;
    instance.d = this.d;
    return instance;
  }
}
