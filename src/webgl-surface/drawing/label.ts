import {rgb, RGBColor} from 'd3-color';
import {omit} from 'ramda';
import {Bounds} from '../primitives/bounds';
import {Sprite} from './sprite';

const measurement = new Sprite(200, 200, 1, 1);
const defaultColor: RGBColor = rgb(255, 255, 255, 1);

export class Label<T> extends Bounds<T> {
  color: RGBColor = defaultColor;
  direction: string = 'inherit';
  font: string = 'serif';
  fontSize: number = 10;
  fontWeight: number = 400;
  maxWidth: number = undefined;
  text: string = '';
  textAlign: 'start' | 'center' | 'right' = 'start';
  textBaseline: 'bottom' | 'alphabetic' | 'middle' | 'top' | 'hanging' = 'alphabetic';
  zoomable: boolean = false;

  constructor(options: Partial<Label<T>> = {}) {
    super(options.x, options.x + 1, options.y, options.y + 1);

    // Set props
    Object.assign(this, options);

    // Make sure the color is a copy
    this.color = rgb(this.color);

    // Calculate the text's measurements
    measurement.context.font = this.makeCSSFont();
    const measuredSize = measurement.context.measureText(this.text);

    // Adjust bounds to measurement
    this.height = this.fontSize;
    this.width = measuredSize.width;
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
