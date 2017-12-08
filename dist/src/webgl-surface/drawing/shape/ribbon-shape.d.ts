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
    /** The first bezier line of ribbon */
    start2: IPoint;
    end2: IPoint;
    center1: IPoint;
    center2: IPoint;
    constructor(options: IRibbonOptions);
    clone(): RibbonShape<T>;
}
