import { Line } from '../../primitives/line';
import { IPoint } from '../../primitives/point';
/**
 * Defines a line that can be drawn
 */
export declare class LineShape<T> extends Line<T> {
    r: number;
    g: number;
    b: number;
    a: number;
    r2: number;
    g2: number;
    b2: number;
    a2: number;
    cull: boolean;
    selectedIndex: number;
    thickness: number;
    /**
     * Generate a new line that can be drawn
     */
    constructor(p1: IPoint, p2: IPoint, d: T, r: number, g: number, b: number, a: number, r2: number, g2: number, b2: number, a2: number, thickness?: number);
    /**
     * Clones this instance of the line shape and creates a new instance of a line shape that
     * is identical to this one. The properties injected can be modifiers after the clone happens
     *
     * @param newProperties New properties to override the properties on the new instance
     *
     * @return {CircleShape} A newly cloned instance of this line shape
     */
    clone(newProperties: Partial<LineShape<T>>): LineShape<T>;
}
