/**
 * This is a way to describe the boundaries within world space,
 * where the camera is looking. This is being used because going from
 * DOM coordinates to WebGL coordinates, experiences a y axis flip in coordinate
 * system.
 *
 * This may become obsolete when the Bounds class is better able to reconcile these
 * differences.
 */
export interface IWorldViewport {
  top: number
  left: number
  bottom: number
  right: number
}

/**
 * Defines methods for working with IWorldViewport Objects
 */
export class WorldViewport {
  /**
   * @static
   * Compares the dimensions of two viewports.
   * Returns false if they are not equal
   *
   * @param {IWorldViewport} a The first viewport
   * @param {IWorldViewport} b The second viewport
   *
   * @return {boolean} True if equal
   */
  static isEqual(a: IWorldViewport, b: IWorldViewport) {
    return a.top === b.top && a.right === b.right && a.bottom === b.bottom && a.left === b.left
  }
}
