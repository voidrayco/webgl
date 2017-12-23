import { omit } from 'ramda';
import { IPoint } from '../../primitives/point';
import { AnchorPosition, RotateableQuad } from '../../primitives/rotateable-quad';
import { ISize } from '../../primitives/size';
import { ReferenceColor } from '../reference/reference-color';
import { AtlasTexture } from '../texture/atlas-texture';
import { Sprite } from '../texture/sprite';

const measurement = new Sprite(200, 200, 1, 1);

export class Label<T> extends RotateableQuad<T> {
  depth: number = 40;
  direction: string = 'inherit';
  font: string = 'serif';
  fontSize: number = 10;
  fontWeight: number = 400;
  maxWidth: number = undefined;
  text: string = '';
  truncatedText: string = '';
  id: string = '';
  textAlign: 'start' | 'center' | 'right' = 'start';
  textBaseline: 'bottom' | 'alphabetic' | 'middle' | 'top' | 'hanging' = 'alphabetic';
  allowScaling: boolean = true;

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
  rasterizationOffset: IPoint = {x: 20, y: 0};
  /**
   * This contains an adjustment to aid in the rasterization process. Getting
   * reliable dimensions for fonts and text can be incredibly challenging,
   * thus, this allows you to pad the rasterization space if you get pieces of
   * the label cut off.
   */
  rasterizationPadding: ISize = {width: 0, height: 0};

  color?: ReferenceColor;

  /**
   * Creates an instance of Label.
   *
   * @param {Partial<Label<T>>} [options={}]
   */
  constructor(options: Partial<Label<T>> = {}) {
    super({x: 0, y: 1}, {width: 1, height: 1}, 0, AnchorPosition.TopLeft);
    // Set props
    Object.assign(this, options);
    // Make sure our dimensions are set
    this.setFontSize(options.fontSize || 12);
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
   * This gets the actual text this label is capable of rendering
   */
  getText(): string {
    if (this._baseLabel) {
      return this._baseLabel.getText();
    }

    return this.text;
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
   * This sets the font size for the label based on the base text dimensions
   *
   * @param {number} fontSize
   */
  setFontSize(fontSize: number) {
    const lbl = this.getText();
    const size = this.getSize();
    let width = size.width;
    let height = size.height;

    if (this.baseLabel) {
      const baseSize = this.baseLabel.getSize();
      const scale = fontSize / this.baseLabel.fontSize;
      height = baseSize.height * scale;
      width = baseSize.width * scale;
    }

    else {
      const ctx = measurement.context;
      ctx.font = this.makeCSSFont();
      const size = ctx.measureText(lbl);
      // Set our properties based on the calculated size
      height = fontSize + this.rasterizationPadding.height;
      width = size.width + this.rasterizationOffset.x + this.rasterizationPadding.width;

      // We must analyze the label for truncation based on the max width
      const threeDotsWide = ctx.measureText('...').width;
      let text = this.text;
      let truncatedWidth = width;

      // If we're beyond our max width limit, we must truncate
      if (this.maxWidth && (width > this.maxWidth)) {
        let beyondMax = false;

        while (truncatedWidth > this.maxWidth) {
          text = text.substring(0, text.length - 2);
          truncatedWidth =
            ctx.measureText(text).width +
            threeDotsWide +
            this.rasterizationOffset.x +
            this.rasterizationPadding.width
          ;
          beyondMax = true;
        }

        if (beyondMax) {
          text += '...';
        }

        this.truncatedText = text;
        width = truncatedWidth;
      }

      // Otherwise, indicate we are not truncated at all
      else {
        this.truncatedText = '';
      }
    }

    this.fontSize = fontSize;
    this.setSize({width, height});
  }

  /**
   * Change the text and the calculated bounding box for this label
   */
  setText(lbl: string) {
    this.text = lbl;
    this.setFontSize(this.fontSize);
  }

  update() {
    this.setFontSize(this.fontSize);
    super.update();
  }
}
