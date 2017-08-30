import { omit } from 'ramda';
import { Color } from 'three';
import { IPoint } from '../../primitives/point';
import { AnchorPosition, RotateableQuad } from '../../primitives/rotateable-quad';
import { ISize } from '../../primitives/size';
import { AtlasTexture } from '../texture/atlas-texture';
import { Sprite } from '../texture/sprite';

const measurement = new Sprite(200, 200, 1, 1);

export class Label<T> extends RotateableQuad<T> {
  depth: number = 0;
  direction: string = 'inherit';
  font: string = 'serif';
  fontSize: number = 10;
  fontWeight: number = 400;
  maxWidth: number = undefined;
  text: string = '';
  id: string = '';
  textAlign: 'start' | 'center' | 'right' = 'start';
  textBaseline: 'bottom' | 'alphabetic' | 'middle' | 'top' | 'hanging' = 'alphabetic';
  zoomable: boolean = false;

  /**
   * For rasterizing a label, we don't want to have duplicate labels rendered to our atlas
   * so we can base a label off another label. When this happens ONLY certain properties
   * on this label can cause notable changes (such as color and positioning)
   */
  _baseLabel: Label<any>;

  set baseLabel(value: Label<any>) {
    this._baseLabel = value;
    this.text = value.text;
    this.fontSize = value.fontSize;
    this.font = value.font;
    this.textAlign = value.textAlign;
    this.textBaseline = value.textBaseline;
  }

  get baseLabel(): Label<any> {
    return this._baseLabel;
  }

  /** This contains the texture information that was used to rasterize the label */
  _rasterizedLabel: AtlasTexture;

  /**
   * This getter ensures the rasterized label retrieved is either this labels own rasterization
   * or from a base.
   */
  get rasterizedLabel(): AtlasTexture {
    if (this.baseLabel) {
      return this.baseLabel.rasterizedLabel;
    }

    return this._rasterizedLabel;
  }

  set rasterizedLabel(value: AtlasTexture) {
    this._rasterizedLabel = value;
  }

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

  // Label coloring
  r: number = 1;
  g: number = 1;
  b: number = 1;
  a: number = 1;

  set color(value: Color) {
    this.r = value.r;
    this.g = value.g;
    this.b = value.b;
  }

  /**
   * Creates an instance of Label.
   *
   * @param {Partial<Label<T>>} [options={}]
   */
  constructor(options: Partial<Label<T>> = {}) {
    super({x: 0, y: 1}, {width: 1, height: 1}, 0, AnchorPosition.TopLeft);

    // Set props
    Object.assign(this, options);

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
