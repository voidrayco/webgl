import { Circle, ICircleOptions } from '../../primitives/circle';
import { ReferenceColor } from '../reference/reference-color';
export interface ICircleShapeOptions extends ICircleOptions {
    /** Determines rendering order for the  */
    depth: number;
    /** Color of the circle for the area that is less than the innerRadius */
    innerColor?: ReferenceColor;
    /** Specifies an inner colored area of the circle */
    innerRadius?: number;
    /** Color of the circle for the area that is greater than the innerRadius */
    outerColor?: ReferenceColor;
}
/**
 * Defines a circular shape that can be drawn
 */
export declare class CircleShape<T> extends Circle<T> {
    /** The rendering depth of the circle */
    depth: number;
    /** Color of the circle for the area that is less than the innerRadius */
    innerColor?: ReferenceColor;
    /** Specifies an inner colored area of the circle */
    innerRadius?: number;
    /** Color of the circle for the area that is greater than the innerRadius */
    outerColor?: ReferenceColor;
    /**
     * Sets the properties of the shape to be drawn
     *
     * @param {ICircleShapeOptions} options The options for the shape
     */
    constructor(options: ICircleShapeOptions);
    /**
     * Clones this instance of the circle shape and creates a new instance of a circle shape that
     * is identical to this one. The properties injected can be modifiers after the clone happens
     *
     * @param newProperties New properties to override the properties on the new instance
     *
     * @return {CircleShape} A newly cloned instance of this circleshape
     */
    clone(newProperties: Partial<CircleShape<T>>): CircleShape<T>;
}
