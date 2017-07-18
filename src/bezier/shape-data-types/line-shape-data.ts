import { RGBColor } from 'd3-color';
import { IPoint } from 'webgl-surface/primitives/point';

/**
 * YoYo changed here
 * This defines any data we want associated with quads within this rendering
 * ecosystem
 */
export interface ILineShapeData {
  color1: RGBColor,
  color2: RGBColor,
  id: number,
  p1: IPoint,
  p2: IPoint,
  thickness: number,
}
