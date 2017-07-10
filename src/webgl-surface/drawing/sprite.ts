/**
 * A canvas element wrapper that aids in tracking a canvas element along with
 * content scaling properties.
 *
 * @class Sprite
 */
export class Sprite {
  canvas:  HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  scaleX:  number = 1;
  scaleY:  number = 1;

  /**
   * Retrieves the content scaling of this object
   *
   * @readonly
   *
   * @memberOf Sprite
   */
  getContentScale(): {x: number, y: number} {
    return {
      x: this.scaleX,
      y: this.scaleY,
    };
  }

  /**
   * Retrieves the size of the content ignoring scaling
   *
   * @readonly
   *
   * @memberOf Sprite
   */
  getContentSize() {
    return {
      height: this.canvas.height,
      width:  this.canvas.width,
    };
  }

  /**
   * Retrieves the dimensional width of the content applying scaling
   *
   * @readonly
   *
   * @memberOf Sprite
   */
  getWidth() {
    return this.canvas.width / this.scaleX;
  }

  /**
   * Retrieves the dimensional height of the content applying scaling
   *
   * @readonly
   *
   * @memberOf Sprite
   */
  getHeight() {
    return this.canvas.height / this.scaleY;
  }

  //
  // Ctor at the top below props
  //

  /**
   * Creates an instance of Sprite.
   *
   * @param w             The width of the context to create
   * @param h             The height of the context to create
   * @param contentScaleX The content scaling of the content
   * @param contentScaleY The content scaling of the content
   *
   * @memberOf Sprite
   */
  constructor(w: number, h: number, contentScaleX: number, contentScaleY: number) {
    const canvas: HTMLCanvasElement = document.createElement('canvas');

    if (canvas) {
      this.scaleX   = contentScaleX || this.scaleX;
      this.scaleY   = contentScaleY || this.scaleY;

      canvas.width  = w * this.scaleX;
      canvas.height = h * this.scaleY;

      this.context  = canvas.getContext('2d');
      this.canvas   = canvas;
    }
  }
}
