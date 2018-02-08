import { ICurvedLineOptions } from '../../primitives/curved-line';
import { IPoint } from '../../primitives/point';
import { ReferenceColor } from '../reference/reference-color';
import { CurvedLineShape } from '../shape/curved-line-shape';
export interface IRibbonOptions extends ICurvedLineOptions {
    cachedQuadSegments?: boolean;
    depth?: number;
    startColor?: ReferenceColor;
    endColor?: ReferenceColor;
    start: IPoint;
    start2: IPoint;
    end: IPoint;
    end2: IPoint;
    resolution?: number;
    center1: IPoint;
    center2: IPoint;
    controlPoints: IPoint[];
}
/**
 * This defines a drawable ribbon shape.  It contains the information necessary
 * to efficiently render the ribbon.
 *
 * @export
 * @class RibbonShape
 * @extends {CurvedLineShape<T>}
 * @template T An associated data type that can be linked to this shape to make data retrieval from interacting
 *             with the shape easier
 */
export declare class RibbonShape<T> extends CurvedLineShape<T> {
    /** When true, this line will cache the segments of the curve as rendered quads */
    cachesQuadSegments: boolean;
    /** If caching is set, then this stores the calculated quads that composes this line */
    cachedQuadSegments: IPoint[];
    /** Depeth of draw location */
    depth: number;
    /** The ending color components of this line. This must be a color reference */
    endColor: ReferenceColor;
    /** The starting color components of this line. This must be a color reference */
    startColor: ReferenceColor;
    /** The starting point of ribbon's second bezier line */
    start2: IPoint;
    /** The ending point of ribbon's second bezier line */
    end2: IPoint;
    /** Then center of hemiSphere where two starting points are located */
    center1: IPoint;
    /** Then center of hemiSphere where two ending points are located */
    center2: IPoint;
    /**
     *
     * Creates and instance of RibbonShape
     *
     * @param {IRibbonOptions} options  The options for creating this ribbon
     *
     */
    constructor(options: IRibbonOptions);
    /**
     * Returns a new instance of this object that mimicks the properties of this Object
     *
     * @returns {RibbonShape<T>} The cloned object
     */
    clone(): RibbonShape<T>;
    /**
     * @override
     * Return distance from a point to ribbon. If the point is in ribbon, return 0
     * Otherwise use method of superclass.
     */
    distanceTo(point: IPoint): number;
    /**
     * Test whether a point is in the ribbon using Point Inclusion in Polygon Test method
     * @param point
     */
    pointInside(point: IPoint): boolean;
    /**
     * This prodeuces all the points along the two bezier lines.
     * The order of all the points pushed should be clockwise.
     *
     * @return {IPoint[]} The points to create the quads that make each segment of the ribbon.
     *
     */
    getRibbonStrip(): IPoint[];
}
