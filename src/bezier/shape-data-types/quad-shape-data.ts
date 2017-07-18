import { IPoint } from 'webgl-surface/primitives/point';
import { ISize } from 'webgl-surface/primitives/size';

/**
 * YoYo changed here
 * This defines any data we want associated with quads within this rendering
 * ecosystem
 */
export interface IQuadShapeData {
  id: number,
  position: IPoint,
  size: ISize,
}
