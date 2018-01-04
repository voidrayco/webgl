import { IPoint } from './primitives/point';
import { ISize } from './primitives/size';
import { WebGLSurface } from './webgl-surface';

/**
 * This represents all of the properties of shared rendering contexts
 */
export interface ISharedRenderContext {
  context: WebGLSurface<any, any>,
  position: IPoint,
  size: ISize,
}
