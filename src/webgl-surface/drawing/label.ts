import { rgb, RGBColor } from 'd3-color';
import { omit } from 'ramda';
import { IPoint } from '../primitives/point';
import { AnchorPosition, RotateableQuad } from '../primitives/rotateable-quad';
import { ISize } from '../primitives/size';
import { Sprite } from './sprite';
import { AtlasTexture } from './texture/atlas-texture';

const measurement = new Sprite(200, 200, 1, 1);
const defaultColor: RGBColor = rgb(255, 255, 255, 1);

export class Label<T> extends RotateableQuad<T> {
  color: RGBColor = defaultColor;
  depth: number = 0;
  direction: string = 'inherit';
  font: string = 'serif';
  fontSize: number = 10;
  fontWeight: number = 400;
  maxWidth: number = undefined;
  text: string = '';
  textAlign: 'start' | 'center' | 'right' = 'start';
  textBaseline: 'bottom' | 'alphabetic' | 'middle' | 'top' | 'hanging' = 'alphabetic';
  zoomable: boolean = false;

  /** This contains the texture information that was used to rasterize the label */
  rasterizedLabel: AtlasTexture;
  /**
   * This contains an adjustment to aid in the rasterization process. Getting
   * reliable dimensions for fonts and text can be incredibly challenging,
   * thus, this allows you to offset the rasterization if you get pieces of
   * the label cut off.
   */
  rasterizationOffset: IPoint = {x: 0, y: 12};
  /**
   * This contains an adjustment to aid in the rasterization process. Getting
   * reliable dimensions for fonts and text can be incredibly challenging,
   * thus, this allows you to pad the rasterization space if you get pieces of
   * the label cut off.
   */
  rasterizationPadding: ISize = {width: 0, height: 0};

  /**
   * Creates an instance of Label.
   *
   * @param {Partial<Label<T>>} [options={}]
   */
  constructor(options: Partial<Label<T>> = {}) {
    super({x: 0, y: 1}, {width: 1, height: 1}, 0, AnchorPosition.TopLeft);

    // Set props
    Object.assign(this, options);

    // Make sure the color is a copy
    this.color = rgb(this.color);

    // Calculate the text's measurements
    measurement.context.font = this.makeCSSFont();
    const measuredSize = measurement.context.measureText(this.text);

    // Adjust the dimensions to the measurement
    this.setSize({
      height: this.fontSize + 10,
      width: measuredSize.width,
    });
  }

  /**
   * Copies all of the properties of a label and makes this label use them
   *
   * @param {Label} label The labels whose properties we wish to copy
   */
  copyLabel(label: Label<T>) {
    // Assign the properties of the other label to this
    // Specifically, ONLY label properties
    Object.assign(
      this,
      omit(['x', 'y', 'width', 'height'], label),
    );

    // Use this to set the text to make sure all of the metrics are re-calculated
    this.setText(label.text);
  }

  /**
   * Takes all of the current settings and makes a CSS font string
   */
  makeCSSFont(fontSize?: number) {
    return `${this.fontWeight} ${fontSize || this.fontSize}px ${this.font}`;
  }

  /**
   * Change the position this text is rendered to
   *
   * @param x X world coordinate
   * @param y Y world coordinate
   */
  position(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Change the text and the calculated bounding box for this label
   */
  setText(lbl: string) {
    // Recalculate text size
    measurement.context.font = this.makeCSSFont();
    const size = measurement.context.measureText(lbl);

    // Set our properties based on the calculated size
    this.height = this.fontSize;
    this.text = lbl;
    this.width = size.width;
  }
}
