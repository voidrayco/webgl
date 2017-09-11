import { IPoint } from '../primitives/point';
import { ISize } from '../primitives/size';

/**
 * Defines projection methods used to switch between screen and world spaces
 */
export interface IProjection {
  /**
   * Get a size on the screen projected to the size in the world
   *
   * @param w The width on the screen
   * @param h The height on the screen
   * @param obj An object to inject the values in so a new object is not allocated
   *
   * @return {ISize} The newly created object or the object in the third param
   */
  screenSizeToWorld(w: number, h: number, obj?: ISize): ISize

  /**
   * Get a position on the screen projected to a coordinate in the world
   *
   * @param x The x position on the screen
   * @param y The y position on the screen
   * @param obj An object to inject the values in so a new object is not allocated
   *
   * @return {IPoint} The newly created object or the object in the third param
   */
  screenToWorld(x: number, y: number, obj?: IPoint): IPoint

  /**
   * Get a size in the world projected to the size on the screen
   *
   * @param w The width in the world
   * @param h The height in the world
   * @param obj An object to inject the values in so a new object is not allocated
   *
   * @return {ISize} The newly created object or the object in the third param
   */
  worldSizeToScreen(w: number, h: number, obj?: ISize): ISize

  /**
   * Get a position in the world projected to a coordinate on the screen
   *
   * @param x The x position in the world
   * @param y The y position in the world
   * @param obj An object to inject the values in so a new object is not allocated
   *
   * @return {IPoint} The newly created object or the object in the third param
   */
  worldToScreen(x: number, y: number, obj?: IPoint): IPoint
}
