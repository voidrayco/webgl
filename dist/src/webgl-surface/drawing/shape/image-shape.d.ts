import { Bounds } from '../../primitives/bounds';
import { AtlasTexture } from '../texture/atlas-texture';
/**
 * Defines an image that can be rendered by the gpu. This is an axis oriented
 * image only (no rotations)
 */
export declare class ImageShape<T> extends Bounds<T> {
    /** This is the image to be rendered */
    texture: AtlasTexture;
    /** This is the level of opacity the image will be rendered with */
    opacity: number;
    /**
     * Returns the largest edge of the image
     */
    /**
     * This is the size the image will be rendered within World Space. The size
     * correlates to the largest edge of the image
     */
    size: number;
    /**
     * Generates a new ImageShape that can be rendered
     *
     * @param {AtlasTexture} image The AtlasTexture to use when rendering this image
     * @param {number} size This is the size of the longest edge of the image while
     *                      retaining aspect ratio.
     */
    constructor(image: AtlasTexture, size: number);
    /**
     * Centers this image on a provided location
     *
     * @param {number} x The x coordinate in world space
     * @param {number} y The y coordinate in world space
     */
    centerOn(x: number, y: number): void;
}
