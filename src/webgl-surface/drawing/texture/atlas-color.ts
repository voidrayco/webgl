import { Color } from 'three';
import { IPoint } from '../../primitives/point';

/**
 * Defines a color that is located on an atlas
 */
export class AtlasColor {
  // This is the metrics of the color that is rendered to the atlas
  color: Color;
  // Value between 1 - 0 for the opacity of the color
  opacity: number = 1.0;

  // The pixel width and height of the color rendered onto the atlas
  // This will always be a 2x2 so the color can be sampled in the middle
  // For a guaranteed pure color regardless of gl sampling states
  pixelWidth: number = 2;
  pixelHeight: number = 2;

  // Info explaining the location of the color on it's associated atlas
  atlasReferenceID: string;
  // This is the location in tex coordinates where the first color is located
  firstColor: IPoint;
  // This indicates how many colors were rendered in a row on the atlas
  colorsPerRow: number;
  // This indicates how far you must travel in atlas coordinate distance to get
  // To the next color index.
  nextColor: IPoint;
  // This is the index of this particular color as it appears on the atlas. You
  // Would use firstColor + nextColor * colorIndex to get to the coordinate
  // Where this color resides.
  colorIndex: number;

  /**
   * Generates a color that is rendered to an atlas and can be referenced via texture
   * later by a single value.
   *
   * @param {Color} color The color to be put into the atlas and be referenceable
   * @param {number} opacity The opacity of the color
   */
  constructor(color: Color, opacity: number);

  /**
   * Generates a color that is rendered to an atlas and can be referenced via texture
   * later by a single value.
   *
   * @param {number} r value of 0 to 1 for red channel
   * @param {number} g value of 0 to 1 for green channel
   * @param {number} b value of 0 to 1 for blue channel
   * @param {number} a value of 0 to 1 for alpha channel defaults to 1
   */
  constructor(r: number, g: number, b: number, a?: number);

  /**
   * Constructor implementation
   */
  constructor(color: Color | number, g?: number, b?: number, a: number = 1.0) {
    if (color instanceof Color) {
      this.color = color.clone();
      this.opacity = g === undefined ? 1.0 : g;
    }

    else {
      this.color = new Color(color, g, b);
      this.opacity = a;
    }
  }
}
