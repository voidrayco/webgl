import { IPoint } from './point';
/**
 * Class to manage the x, y, width, and height of an object
 *
 * @template T This specifies the data type associated with this shape and is accessible
 *             via the property 'd'
 */
export declare class Bounds<T> {
    /** The total rectangular surface area of this instance */
    readonly area: number;
    /** The bottom coordinate for this instance (y + height) */
    readonly bottom: number;
    height: number;
    item: null;
    /** An x, y coordinate pair representing the center of this object */
    readonly mid: {
        x: number;
        y: number;
    };
    readonly right: number;
    /** A data object for relating this shape to some information */
    d: T;
    width: number;
    x: number;
    y: number;
    /**
     * Create a new instance
     *
     * @param left  The left side (x coordinate) of the instance
     * @param right The right side of the instance
     * @param top The top (y coordinate) of the instance
     * @param bottom The bottom of the instance
     */
    constructor(left: number, right: number, top: number, bottom: number);
    /**
     * Check to see if a given point lies within the bounds of this instance
     *
     * @param point The point to check
     */
    containsPoint(point: IPoint): boolean;
    /**
     * Copies the properties of the bounds specified
     *
     * @param b The bounds whose dimensions we wish to copy
     */
    copyBounds(b: Bounds<any>): void;
    /**
     * Ensure that this object contains the smaller bounds
     *
     * This method will not shrink this class, but only grow it as necessary to
     * fit the destination object
     *
     * @param bounds The bounds to encapsulate
     */
    encapsulate(bounds: Bounds<any>): void;
    /**
     * Ensure that this object contains the provided list of bounds
     *
     * This will never shrink or modify the original area covered by this bounds
     * but will instead stay the same or include the original area plus the specified
     * list of bounds.
     *
     * @param {Bounds<any>[]} bounds The list of bounds objects to encapsulate
     * @param {boolean} sizeToFirst If this is set, the procedure will start by making this bounds
     *                              be a clone of the first bounds object in the list
     */
    encapsulateBounds(bounds: Bounds<any>[], sizeToFirst?: boolean): void;
    /**
     * Grow this class to contain the specified point
     *
     * This method will not shrink this instance. It will only grow it as
     * necessary.
     *
     * @param point The point to encapsulate
     */
    encapsulatePoint(point: IPoint): void;
    /**
     * Efficiently encapsulates a set of points by growing the current dimensions
     * of the bounds until the points are enclosed. This will perform faster than
     * running encapsulatePoint for a list of points.
     *
     * @param points An array of points that Can be of format {x, y} or [x, y]
     *
     * @memberOf Bounds
     */
    encapsulatePoints(points: any[]): void;
    /**
     * Checks to see if another bounds fits in itself.
     *
     * @param {Bounds} inner The bounds to test against
     *
     * @return {number} int 1 is an exact fit, 2 it fits with space, 0 it doesn't fit
     */
    fits(inner: Bounds<T>): number;
    /**
     * Check to see if the provided bounds intersects with this instance
     *
     * @param bounds The bounds to test against this instance
     *
     * @return True if the other object intersects with this instance
     */
    hitBounds(bounds: Bounds<T>): boolean;
    /**
     * Tests if a point is inside this bounds
     *
     * @param p The point to test
     *
     * @return boolean The point to test
     */
    pointInside(p: IPoint): boolean;
    /**
     * Test function to type check the provided value
     *
     * @return True if value is a bounds object
     */
    static isBounds(value: any): value is Bounds<any>;
    /**
     * Check if this instance is completely inside the provided bounds
     *
     * @param bounds The bounds to test against this instance
     *
     * @return True if this instance is inside the provided bounds
     */
    isInside(bounds: Bounds<T>): boolean;
    /**
     * Generates a Bounds object covering max extents
     *
     * @return {Bounds} bounds covering as wide of a range as possible
     */
    static maxBounds(): Bounds<{}>;
}
