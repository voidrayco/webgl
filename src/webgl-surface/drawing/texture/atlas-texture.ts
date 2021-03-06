import { IPoint } from '../../primitives/point';
import { Label } from '../shape/label';

/**
 * Defines a texture that is located on an atlas
 */
export class AtlasTexture {
  // Stores where this image was loaded from the file system
  image: string | HTMLImageElement;
  // Stores the string label this image has rendered rather than the path
  label: Label<any>;

  /** Stores the aspect ratio of the image for quick reference */
  aspectRatio: number = 1.0;

  // The pixel width and height of the image, since most of our operations with the GPU and other relevant numbers
  // Such as scaling etc will involve floats, we store them as floats here to reduce casting needs
  pixelWidth: number;
  pixelHeight: number;

  // Info explaining the location of the image on it's associated atlas
  atlasReferenceID: string;
  atlasTL: IPoint;
  atlasTR: IPoint;
  atlasBL: IPoint;
  atlasBR: IPoint;

  /**
   * Generates a new atlas texture that points to a specific image resource.
   *
   * @param path The path to the image resource to be loaded into the atlas.
   */
  constructor(path?: string | HTMLImageElement, label?: Label<any>) {
    this.image = path;
    this.label = label;

    // Let the label keep track of it's rasterization
    if (label) {
      this.label.rasterizedLabel = this;
    }
  }
}
