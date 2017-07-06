import { IPoint } from 'webgl-surface/primitives/point';
import { ISize } from 'webgl-surface/primitives/size';

/**
 * This defines any data we want associated with quads within this rendering
 * ecosystem
 */
export interface IQuadShapeData {
  id: number,
  position: IPoint,
  size: ISize,
}
