import { rgb, RGBColor } from 'd3-color';
import { Circle } from '../../primitives/circle';

/**
 * Defines a circular shape that can be drawn
 */
export class CircleShape<T> extends Circle<T> {
  // Color
  r: number = 0;
  g: number = 0;
  b: number = 0;
  a: number = 0;
  // Inner radius color
  r2: number = 0;
  g2: number = 0;
  b2: number = 0;
  a2: number = 0;
  // Other properties
  alpha: number = 0;
  innerRadius: number = 0;
  ringWidth: number = 0;
  ringPad: number = 0;
  outline: boolean = false;
  selectedIndex: number;

  /**
   * Sets the properties of the shape to be drawn
   *
   * @param x Center of the circle
   * @param y Center of the circle
   * @param r The radius of the circle
   * @param color The color of the circle
   * @param color The color within the inner radius of the circle
   * @param innerR The inner radius of the circle
   * @param d A data object to associate with this circle
   */
  constructor(x: number, y: number, r: number, color: RGBColor, innerColor?: RGBColor, innerR?: number, d?: T) {
    super(x, y, r, d);

    if (color) {
      // FIXME: This is solving a bizarre potential race condition (or other voodoo) where the numbers are not being
      // Applied correctly to this object when applying the d3 color object properties to this.
      const {r, g, b, opacity} = color;
      this.setOuterColor({r, g, b, opacity} as RGBColor);
    }

    if (innerR === undefined) {
      innerR = 0;
    }

    this.innerRadius = innerR;

    if (innerColor) {
      this.setInnerColor(innerColor);
    }
  }

  /**
   * Sets the color of the outer drawn radius
   *
   * @param color
   */
  setOuterColor(color: RGBColor) {
    const { r, g, b, opacity } = color;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = opacity;
  }

  /**
   * Sets the color of the inner drawn radius
   *
   * @param color
   */
  setInnerColor(color: RGBColor) {
    this.r2 = color.r;
    this.g2 = color.g;
    this.b2 = color.b;
    this.a2 = color.opacity;
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
    return Object.assign(
      new CircleShape(
        this._centerX,
        this._centerY,
        this._radius,
        rgb(this.r, this.g, this.b, this.a),
        rgb(this.r2, this.g2, this.b2, this.a2),
        this.innerRadius,
        this.d),
      this,
      newProperties,
    ) as CircleShape<T>;
  }

  /**
   * Clones this instance of the circle shape and creates a new instance of a circle shape that
   * is identical to this one. This will perform the clone but will change the data type
   * associated with the circle in the cloned instance
   *
   * @param newProperties New properties to override the properties on the new instance
   *
   * @return {CircleShape} A newly cloned instance of this circleshape
   */
  cloneWithData<U>(newProperties: Partial<CircleShape<U>>): CircleShape<U> {
    return Object.assign(
      new CircleShape<U>(
        this._centerX,
        this._centerY,
        this._radius,
        rgb(this.r, this.g, this.b, this.a),
        rgb(this.r2, this.g2, this.b2, this.a2),
        this.innerRadius),
      this,
      newProperties,
    ) as CircleShape<U>;
  }
}
