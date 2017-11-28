import { Bounds } from '../../primitives/bounds';
import { CurvedLine } from '../../primitives/curved-line';
import { IPoint, Point } from '../../primitives/point';
import { ReferenceColor } from '../reference/reference-color';

export interface IRibbonOptions {
  cachedQuadSegments?: boolean;
  depth?: number;
  startColor?: ReferenceColor;
  endColor?: ReferenceColor;
  line1: CurvedLine<any>;
  line2: CurvedLine<any>;
  resolution?: number;
  center1: IPoint;
  center2: IPoint;
}

export class RibbonShape<T> extends Bounds<T> {
  /** When true, this line will cache the segments of the curve as rendered quads */
  cachesQuadSegments: boolean;
  /** If caching is set, then this stores the calculated quads that composes this line */
  cachedQuadSegments: IPoint[];
  /** Depeth of draw location */
  depth: number = 0;
  /** The ending color components of this line. This must be a color reference */
  endColor: ReferenceColor;
  /** The starting color components of this line. This must be a color reference */
  startColor: ReferenceColor;
  /** The first bezier line of ribbon */
  line1: CurvedLine<T>;
  /** The second bezier line of ribbon */
  line2: CurvedLine<T>;

  center1: IPoint;

  center2: IPoint;

  resolution: number;

  constructor(options: IRibbonOptions) {
    super(
      Number.MAX_VALUE,
      -Number.MAX_VALUE,
      -Number.MAX_VALUE,
      Number.MAX_VALUE,
    );

    this.encapsulatePoint(this.line1.start);
    this.cachesQuadSegments = options.cachedQuadSegments || true;
    this.depth = options.depth || 0;

    this.startColor = options.startColor;
    this.endColor = options.endColor;

    this.line1 = options.line1;
    this.line2 = options.line2;

    this.center1 = options.center1;
    this.center2 = options.center2;

    this.resolution = options.resolution;
  }

  clone() {
    // Perform the clone
    const clone: RibbonShape<T> = new RibbonShape<T>({
      center1: this.center1,
      center2: this.center2,
      endColor: this.endColor,
      line1: this.line1,
      line2 : this.line2,
      resolution: this.resolution,
      startColor: this.startColor,
    });

    clone.d = this.d;

    return clone;
  }

}
