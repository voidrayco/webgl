import { CurvedLine, ICurvedLineOptions } from '../../primitives/curved-line';
import { IPoint } from '../../primitives/point';
import { ReferenceColor } from '../reference/reference-color';
export interface ICurvedLineShapeOptions extends ICurvedLineOptions {
    /** Flags whether or not the calculated geometry for the line is cached or not */
    cacheSegments?: boolean;
    /** The depth of line to be rendered */
    depth?: number;
    /**
     * The color that will be at the end of the line. If this is differing from the
     * start color, the line will be a gradient.
     */
    endColor?: ReferenceColor;
    /**
     * The ending opacity of the line. If this differs from the start opacity, the line
     * will be a gradient.
     */
    endOpacity?: number;
    /** The desired thickness of the line */
    lineWidth?: number;
    /** The base color of the line. */
    startColor: ReferenceColor;
    /** The base opacity of the line */
    startOpacity?: number;
}
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
    /** Depeth of draw location */
    depth: number;
    /** The ending color components of this line. This must be a color reference */
    endColor: ReferenceColor;
    /** The starting color components of this line. This must be a color reference */
    startColor: ReferenceColor;
    /** How thick the line should be */
    lineWidth: number;
    /**
     * Creates an instance of CurvedLineShape.
     *
     * @param {ICurvedLineShapeOptions} options The options for creating this line
     */
    constructor(options: ICurvedLineShapeOptions);
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
