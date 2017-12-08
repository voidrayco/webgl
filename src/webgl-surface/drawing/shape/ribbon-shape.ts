import { ICurvedLineOptions } from '../../primitives/curved-line';
import { IPoint } from '../../primitives/point';
import { bezier2 } from '../../util/interpolation';
import { ReferenceColor } from '../reference/reference-color';
import { CurvedLineShape } from '../shape/curved-line-shape';

export interface IRibbonOptions extends ICurvedLineOptions{
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

export class RibbonShape<T> extends CurvedLineShape<T> {
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
  start2: IPoint;

  end2: IPoint;

  center1: IPoint;

  center2: IPoint;

  constructor(options: IRibbonOptions) {
    super(options);

    this.cachesQuadSegments = options.cachedQuadSegments || true;
    this.depth = options.depth || 0;
    this.start2 = options.start2;
    this.end2 = options.end2;
    this.encapsulatePoints(this.getRibbonStrip());
    this.center1 = options.center1;
    this.center2 = options.center2;
  }

  clone() {
    // Perform the clone
    const clone: RibbonShape<T> = new RibbonShape<T>({
      center1: this.center1,
      center2: this.center2,
      controlPoints: this.controlPoints,
      end: this.end,
      end2: this.end2,
      endColor: this.endColor,
      resolution: this.resolution,
      start: this.start,
      start2 : this.start2,
      startColor: this.startColor,
      type: this.type,
    });

    clone.d = this.d;

    return clone;
  }

  distanceTo(point: IPoint): number {
    if (this.pointInside(point)) return 0;
    return super.distanceTo(point);
  }

  pointInside(point: IPoint): boolean {
    const points = this.getRibbonStrip();
    const nvert: number = points.length;
    let i: number;
    let j: number;
    let c: boolean = false;
    const testx = point.x;
    const testy = point.y;

    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
      if (((points[i].y > testy) !== (points[j].y > testy)) &&
         (testx < (points[j].x - points[i].x) * (testy - points[i].y) /
         (points[j].y - points[i].y) + points[i].x)) {
        c = !c;
      }
    }

    return c;
  }

  getRibbonStrip(): IPoint[]{
    const strip: IPoint[] = [];
    const dt = 1 / this.resolution;
    const c1 = this.controlPoints[0];
    for (let i = 0 ; i <= this.resolution; i++ ) {
      strip.push(bezier2(dt * i, this.start, this.end, c1));
    }
    for (let i = this.resolution; i >= 0; i--){
      strip.push(bezier2(dt * i, this.start2, this.end2, c1));
    }
    return strip;
  }

}
