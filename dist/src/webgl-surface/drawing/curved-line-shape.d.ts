import { RGBColor } from 'd3-color';
import { CurvedLine, CurveType } from '../primitives/curved-line';
import { IPoint } from '../primitives/point';
/**
 * This defines a drawable curved line shape. It contains the information necessary
 * to efficiently render the line.
 *
 * @export
 * @class CurvedLineShape
 * @extends {CurvedLine<T>}
 * @template T An associated data type that can be linked to this shape to make data retrieval from interacting
 *             with the shape easier.
 */
export declare class CurvedLineShape<T> extends CurvedLine<T> {
    /** When true, this line will cache the segments of the curve as rendered quads */
    cachesQuadSegments: boolean;
    /** If caching is set, then this stores the calculated quads that composes this line */
    cachedQuadSegments: IPoint[];
    /** How thick the line should be */
    lineWidth: number;
    /** Depeth of draw location */
    depth: number;
    r: number;
    g: number;
    b: number;
    a: number;
    /**
     * Retrieves the color of this curve based on gl color values
     * @return {RGBColor}
     */
    /**
     * Applies an rgb color to this curve.
     */
    color: RGBColor;
    /**
     * Retrieves the color of this curve based on 256 value colors
     * @return {RGBColor}
     */
    readonly color256: RGBColor;
    /**
     * Creates an instance of CurvedLineShape.
     *
     * @param {CurveType} type The curve type. Defines
     * @param {IPoint} p1
     * @param {IPoint} p2
     * @param {IPoint[]} controlPoints
     * @param {number} [resolution=20]
     * @param {boolean} [cacheSegments=false]
     */
    constructor(type: CurveType, p1: IPoint, p2: IPoint, controlPoints: IPoint[], color?: RGBColor, resolution?: number, cacheSegments?: boolean);
    /**
     * Returns a new instance of this object that mimicks the properties of this Object
     *
     * @returns {CurvedLineShape<T>} The cloned object
     */
    clone(): CurvedLineShape<T>;
    /**
     * @override
     * See base definition
     */
    distanceTo(point: IPoint): number;
    /**
     * This produces a triangle strip that represents the quads that composes this line. If caching is present,
     * subsequent calls to this method will be much faster unless the cache gets invalidated.
     *
     * @return {IPoint[]} The Triangle Strip of points to create the quads that make each segment of the curve
     */
    getTriangleStrip(): IPoint[];
    /**
     * @override
     * Adjusts the relevant points that defines the curve and recalculates all items necessary
     *
     * @param {IPoint} p1
     * @param {IPoint} p2
     * @param {IPoint[]} controlPoints
     */
    setPoints(p1: IPoint, p2: IPoint, controlPoints?: IPoint[]): void;
}
