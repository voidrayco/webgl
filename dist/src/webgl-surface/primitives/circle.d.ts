import { Bounds } from './bounds';
import { IPoint } from './point';
export declare class Circle<T> extends Bounds<T> {
    /** a UID of the circle */
    _id: number;
    /** Radius of the circle */
    _radius: number;
    /** X coord of the center of the circle */
    _centerX: number;
    /** Y coord of the center of the circle */
    _centerY: number;
    readonly values: {
        x: number;
        y: number;
        radius: number;
    };
    radius: number;
    centerX: number;
    centerY: number;
    /**
     * Generate a new Circle object
     *
     * @param x The center of the circle
     * @param y The center of the circle
     * @param r The radius of the circle
     * @param d A data object to associate with the circle
     */
    constructor(x: number, y: number, r: number, d?: any);
    /**
     * Tests if the specified bounds is inside this circle
     *
     * @param b The bounds to test against
     */
    boundsInside(b: Bounds<any>): boolean;
    /**
     * Calculates the distance to a provided point
     *
     * @param {IPoint} p The point to calculate the distance of the middle of the
     *                   circle to
     * @param {boolean} notSquared Flag true to prevent the Math.sqrt operation, leaving
     *                             the result as distance^2
     *
     * @return {number} The distance from mid circle to the point
     */
    distanceTo(p: IPoint, notSquared?: boolean): number;
    /**
     * Retrieves the closest circle to a provided point
     *
     * @param {Array} circles The circles to see who is the nearest
     * @param {IPoint} p The point to compare the circles against for nearness
     *
     * @return {Circle} The nearest circle
     */
    static getClosest(circles: Circle<any>[], p: IPoint): undefined;
    /**
     * Tests if this circle is colliding with the specified circle
     *
     * @param c The circle to test against
     *
     * @return {boolean} True if colliding
     */
    hitCircle(c: Circle<any>): boolean;
    /**
     * @override
     * This makes it so the test of a point tests based on a Circle shape
     *
     * @param p The point to test if inside the circle
     *
     * @return True if the point is inside
     */
    hitPoint(p: IPoint): boolean;
    /**
     * If there are multiple metrics to update for the circle, this is the most
     * efficient way to do that as it will update it's bounds only once.
     *
     * @param x
     * @param y
     * @param r
     */
    position(x: number, y: number, r: number): void;
    /**
     * @override
     * Tests if a point is inside the circle
     *
     * @param p The point to test if inside the circle
     *
     * @return True if the point is inside
     */
    pointInside(p: IPoint): boolean;
    /**
     * When the circle gains different circle metrics, it's Bounds must adjust
     * accordingly, which is what this method recalculates.
     */
    updateBounds(): void;
    /**
     * Pretty print the metrics of this circle
     */
    toString(): string;
}
