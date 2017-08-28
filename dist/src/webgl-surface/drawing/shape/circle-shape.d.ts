import { RGBColor } from 'd3-color';
import { Circle } from '../../primitives/circle';
/**
 * Defines a circular shape that can be drawn
 */
export declare class CircleShape<T> extends Circle<T> {
    r: number;
    g: number;
    b: number;
    a: number;
    r2: number;
    g2: number;
    b2: number;
    a2: number;
    alpha: number;
    innerRadius: number;
    ringWidth: number;
    ringPad: number;
    outline: boolean;
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
    constructor(x: number, y: number, r: number, color: RGBColor, innerColor?: RGBColor, innerR?: number, d?: T);
    /**
     * Sets the color of the outer drawn radius
     *
     * @param color
     */
    setOuterColor(color: RGBColor): void;
    /**
     * Sets the color of the inner drawn radius
     *
     * @param color
     */
    setInnerColor(color: RGBColor): void;
    /**
     * Clones this instance of the circle shape and creates a new instance of a circle shape that
     * is identical to this one. The properties injected can be modifiers after the clone happens
     *
     * @param newProperties New properties to override the properties on the new instance
     *
     * @return {CircleShape} A newly cloned instance of this circleshape
     */
    clone(newProperties: Partial<CircleShape<T>>): CircleShape<T>;
    /**
     * Clones this instance of the circle shape and creates a new instance of a circle shape that
     * is identical to this one. This will perform the clone but will change the data type
     * associated with the circle in the cloned instance
     *
     * @param newProperties New properties to override the properties on the new instance
     *
     * @return {CircleShape} A newly cloned instance of this circleshape
     */
    cloneWithData<U>(newProperties: Partial<CircleShape<U>>): CircleShape<U>;
}
