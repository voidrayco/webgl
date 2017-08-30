import { RGBColor } from 'd3-color';
import { Bounds } from '../../primitives/bounds';
export declare class QuadShape<T> extends Bounds<T> {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(bounds: Bounds<any>, color?: RGBColor);
}
