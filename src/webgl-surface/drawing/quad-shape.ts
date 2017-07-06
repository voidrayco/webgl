import { Bounds } from '../primitives/bounds'
import { rgb, RGBColor } from 'd3-color'

export class QuadShape<T> extends Bounds<T> {
  r: number = 1.0
  g: number = 0.0
  b: number = 0.0
  a: number = 1.0

  constructor(bounds: Bounds<any>, color?: RGBColor) {
    super(0, 0, 0, 0)
  }
}
