import { RGBColor } from 'd3-color';
import { Bounds } from '../../primitives/bounds';

export class QuadShape<T> extends Bounds<T> {
  r: number = 1.0;
  g: number = 0.0;
  b: number = 0.0;
  a: number = 1.0;

  constructor(bounds: Bounds<any>, color?: RGBColor) {
    super(bounds.x, bounds.right, bounds.y, bounds.bottom);
  }
}
