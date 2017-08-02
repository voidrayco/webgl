import { RGBColor } from 'd3-color';
import { IPoint } from 'webgl-surface/primitives/point';

/**
 * YoYo changed here
 * This defines any data we want associated with quads within this rendering
 * ecosystem
 */
export interface IQuadShapeData {
  color: RGBColor,
  id: number,
  lineWidth: number,
  p1: IPoint,
  p2: IPoint,
}
