import { Line } from '../../primitives/line';
import { IPoint } from '../../primitives/point';
import { ReferenceColor } from '../reference/reference-color';
import { LineShape } from './line-shape';
export interface IEdgeShapeOptions {
    /** The color of the edge at the end */
    endColor: ReferenceColor;
    /** The width of the edge at it's end */
    endWidth: number;
    /** The starting point of the line the edge represents */
    p1: IPoint;
    /** The ending point of the line the edge represents  */
    p2: IPoint;
    /** The starting color of the edge */
    startColor: ReferenceColor;
    /** The ending color of the edge */
    startWidth: number;
}
/**
 * This defines an edge that can be drawn.
 * This type of edge is a quad with distorted ends. The quad will represent a
 * line with each end having potentially different sizes thus giving a four sided
 * polygon rather than a parallelogram.
 *
 * The edge shape also doubles up as a simple line shape should it be desired to
 * render differently.
 */
export declare class EdgeShape<T> extends LineShape<T> {
    /** Top left of the quad to generate this edge */
    tl: IPoint;
    /** Bottom left of the quad to generate this edge */
    bl: IPoint;
    /** Top right of the quad to generate this edge */
    tr: IPoint;
    /** Bottom Right of the quad to generate this edge */
    br: IPoint;
    /** Represents the line from the tl to the tr */
    topEdge: Line<T>;
    /** Represents the line from the bl to the br */
    bottomEdge: Line<T>;
    /** The width of the edge at the termination point */
    endWidth: number;
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
    constructor(options: IEdgeShapeOptions);
    /**
     * Clones this instance of the edge shape and creates a new instance of an edge shape that
     * is identical to this one. The properties injected can be modifiers after the clone happens
     *
     * @param newProperties New properties to override the properties on the new instance
     *
     * @return {EdgeShape} A newly cloned instance of this edgeshape
     */
    clone(newProperties: Partial<EdgeShape<T>>): EdgeShape<T>;
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
    pointInside(point: IPoint): boolean;
    /**
     * @override
     * This sets the two endpoints for this edge and recalculates the bounds
     * of the edge accordingly.
     *
     * @param {IPoint} p1 The start point
     * @param {IPoint} p2 The end point
     */
    setPoints(p1: IPoint, p2: IPoint): void;
}
