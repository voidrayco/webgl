import { Bounds } from '../../primitives/bounds';
import { ReferenceColor } from '../reference/reference-color';
import { AtlasTexture } from '../texture/atlas-texture';

export interface IPointIconShapeOptions {
  atlasTexture: AtlasTexture,
  size: number,
  tint: ReferenceColor,
}

/**
 * Defines an icon that can be rendered by the gpu. This is an axis oriented
 * image only (no rotations) and may make optimizations to only render as a
 * point sprite.
 */
export class PointIconShape<T> extends Bounds<T> {
  /** This is the level of opacity the image will be rendered with */
  opacity: number = 1.0;
  /** This is the image to be rendered */
  atlasTexture: AtlasTexture;
  /** This is a tint to be applied to the image */
  tint: ReferenceColor;

  /**
   * Returns the largest edge of the image
   */
  get size(): number {
    return Math.max(this.width, this.height);
  }

  /**
   * This is the size the image will be rendered within World Space. The size
   * correlates to the largest edge of the image
   */
  set size(val: number) {
    if (this.atlasTexture.aspectRatio > 1) {
      this.width = val;
      this.height = val / this.atlasTexture.aspectRatio;
    }

    else {
      this.width = val * this.atlasTexture.aspectRatio;
      this.height = val;
    }
  }

  /**
   * Generates a new ImageShape that can be rendered
   *
   * @param {AtlasTexture} image The AtlasTexture to use when rendering this image
   * @param {number} size This is the size of the longest edge of the image while
   *                      retaining aspect ratio.
   */
  constructor(options: IPointIconShapeOptions) {
    super(0, 1, 0, 1);
    this.atlasTexture = options.atlasTexture;
    this.size = options.size;
    this.tint = options.tint;
  }

  /**
   * Centers this image on a provided location
   *
   * @param {number} x The x coordinate in world space
   * @param {number} y The y coordinate in world space
   */
  centerOn(x: number, y: number) {
    this.x = x - (this.width / 2.0);
    this.y = y - (this.height / 2.0);
  }
}
