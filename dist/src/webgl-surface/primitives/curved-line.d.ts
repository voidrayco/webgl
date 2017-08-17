import { Bounds } from './bounds';
import { IPoint } from './point';
/**
 * This enum covers the type of curved lines that can be made. Making a specific curve
 *
 * @export
 * @enum {number}
 */
export declare enum CurveType {
    /** This will make the curve be generated from interpolating between the end points and provided control points */
    Bezier = 0,
    /**
     * This will draw a curve as though there is a circular arc passing over the two end points. The radius of the
     * circular arc is determined by how far the control point is from the straight line that can be made from the two
     * end points.
     */
    CircularCCW = 1,
    CircularCW = 2,
    /**
     * This ignores the control points altogether and just created a straight line with a single segment that consists
     * of the specified endpoints
     */
    Straight = 3,
}
/**
 * Defines an object which illustrates a curved line. Curved lines can be formed in many
 * ways but most often from two end points and some provided control points.
 *
 * @export
 * @class CurvedLine
 * @extends {Bounds<T>}
 * @template T An associated data type with this object. Use <never> if no data type is ever associated
 */
export declare class CurvedLine<T> extends Bounds<T> {
    /** Stores the segments that have been calculated. Only gets populated if cachesSegments is true */
    cachedSegments: IPoint[];
    /** Flag to indicate if this line caches its segments. Uses more ram but performs better if true */
    cachesSegments: boolean;
    /**
     * The control points used for calculating the curvature of the line. Circular curves only use a single point
     * to indicate the middle of the circle that the line arcs from.
     */
    controlPoints: IPoint[];
    /** This is the automatically set method that will be used in calculating the distance to a point from this line */
    distanceMethod: (line: CurvedLine<any>, point: IPoint) => number;
    /** This is an end point of the line */
    p1: IPoint;
    /** This is an end point of the line */
    p2: IPoint;
    /** This is how many segments can be used to generate the line. More segments = less performant but prettier */
    resolution: number;
    /** This is the automatically set method used to calculate the segments needed to piece together the curve */
    segmentMethod: (line: CurvedLine<any>) => IPoint[];
    /** This indicates how the curve is formed from the control points. See the enum values for more details. */
    type: CurveType;
    /**
     * Generates a primitive that describes a curved line, which is defined by the lines end points, type, and control points
     *
     * @param {CurveType} type The type of curve. Determines how the control points are utilized
     * @param {IPoint} p1 The start of the curve
     * @param {IPoint} p2 The end of the curve
     * @param {IPoint[]} controlPoints The control points that affects the curvature of the line
     * @param {number} [resolution=20] The number of segments used to compose the line (more segments means prettier but more costly lines)
     * @param {boolean} [cacheSegments=false] Speeds up line calculations for when the line does not change but takes more RAM
     *
     * @memberof CurvedLine
     */
    constructor(type: CurveType, p1: IPoint, p2: IPoint, controlPoints: IPoint[], resolution?: number, cacheSegments?: boolean);
    readonly values: {
        controlPoints: IPoint[];
        p1: IPoint;
        p2: IPoint;
    };
    /**
     * Calculates the nearest distance from the provided point to this curved line
     *
     * @param {IPoint} point The point to test the distance from
     *
     * @returns {number} The calculated nearest distance from this curve to the point
     */
    distanceTo(point: IPoint): number;
    /**
     * Picks the closest line in the list to a given point
     *
     * @param {CurvedLine<any>[]} lines The lines to compare
     * @param {IPoint} p The point to compare against
     *
     * @return {Line} The nearest line to the point
     */
    static getClosest<T>(lines: CurvedLine<T>[], point: IPoint): undefined;
    /**
     * This returns the line strip that represents the curve. A line strip is specifically a group of points
     * that forms line segments by taking the current point as one end and the previous point as the second end
     * thus, you would start at index 1 and loop to the end to generate all of the lines composing this single
     * line.
     *
     * @return {IPoint[]} All of the points in the line strip
     */
    getLineStrip(): IPoint[];
    /**
     * Adjusts the relevant points that defines the curve and recalculates all items necessary
     *
     * @param {IPoint} p1
     * @param {IPoint} p2
     * @param {IPoint[]} controlPoints
     * @param {boolean} preventRebounding If set, this will prevent the bounds from being recalculated
     */
    setPoints(p1: IPoint, p2: IPoint, controlPoints?: IPoint[]): void;
}
