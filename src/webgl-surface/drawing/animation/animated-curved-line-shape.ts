import { Color } from 'three';
import { ReferenceColor } from '../../drawing/reference/reference-color';
import { IPoint } from '../../primitives/point';
import { EasingMethod, linear } from '../../util/easing';
import { circular } from '../../util/interpolation';
import { CurvedLineShape, ICurvedLineShapeOptions } from '../shape/curved-line-shape';

export interface IAnimatedCurvedLineShapeOptions extends ICurvedLineShapeOptions {
  duration?: number;
  easing?: EasingMethod;
  endColorStop?: ReferenceColor;
  p1Stop?: IPoint;
  p2Stop?: IPoint;
  startColorStop?: ReferenceColor;
  startTime?: number;
}

/**
 * This represents curved lines and what it would take to animate various properties.
 * While this provides helpers to aid in animating the properties, it is up to
 * buffers, shaders and materials to render those changes appropriately.
 */
export class AnimatedCurvedLineShape<T> extends CurvedLineShape<T> {
  /**
   * The time in milliseconds the animation will start. It is recommended to
   * use FrameInfo.lastFrameTime and NOT Date.now()
   */
  startTime: number;
  /** THe duration of the animation in milliseconds */
  duration: number;
  /**
   * This defines the suggested easing for the animation for any of
   * the values.
   */
  easing: EasingMethod = linear;

  /** The color this curve should be at the end of the animation */
  private _startColorStop: ReferenceColor;
  private _startColorChange: Color = new Color(0, 0, 0);

  set startColorStop(value: ReferenceColor) {
    const startBase = this.startColor.base.color;
    const newBase = value.base.color;
    this._startColorStop = value;
    this._startColorChange.r = newBase.r - startBase.r;
    this._startColorChange.g = newBase.g - startBase.g;
    this._startColorChange.b = newBase.b - startBase.b;
  }

  get startColorStop(): ReferenceColor {
    return this._startColorStop;
  }

  /** The color the end of this curve should be at the end of the animation */
  private _endColorStop: ReferenceColor;
  private _endColorChange: Color = new Color(0, 0, 0);

  set endColorStop(value: ReferenceColor) {
    const startBase = this.startColor.base.color;
    const newBase = value.base.color;
    this._endColorStop = value;
    this._endColorChange.r = newBase.r - startBase.r;
    this._endColorChange.g = newBase.g - startBase.g;
    this._endColorChange.b = newBase.b - startBase.b;
  }

  get endColorStop(): ReferenceColor {
    return this._endColorStop;
  }

  /** The starting end point's destination */
  startStop: IPoint = {x: 0, y: 0};
  endStop: IPoint = {x: 0, y: 0};

  constructor(options?: IAnimatedCurvedLineShapeOptions) {
    super(options);

    if (options) {
      this.startStop = options.p1Stop || {x: 0, y: 0};
      this.endStop = options.p2Stop || {x: 0, y: 0};

      if (options.startColorStop) {
        this.startColorStop = options.startColorStop;
      }

      if (options.endColorStop) {
        this.endColorStop = options.endColorStop;
      }
    }
  }

  /**
   * This calculates the current start color with the given easing function
   * based on how much time has lapsed since startTime
   */
  private _currentStartColor: Color = new Color(0, 0, 0);
  get currentStartColor(): Color {
    const time = Date.now() - this.startTime;
    const startBase = this.startColor.base.color;

    this._currentStartColor.r = this.easing(time, startBase.r, this._startColorChange.r, this.duration);
    this._currentStartColor.g = this.easing(time, startBase.g, this._startColorChange.g, this.duration);
    this._currentStartColor.b = this.easing(time, startBase.b, this._startColorChange.b, this.duration);

    return this._currentStartColor;
  }

  /**
   * This calculates the current end color with the given easing function
   * based on how much time has lapsed since startTime
   */
  private _currentEndColor: Color = new Color(0, 0, 0);
  get currentEndColor(): Color {
    const time = Date.now() - this.startTime;
    const endBase = this.endColor.base.color;

    this._currentEndColor.r = this.easing(time, endBase.r, this._endColorChange.r, this.duration);
    this._currentEndColor.g = this.easing(time, endBase.g, this._endColorChange.g, this.duration);
    this._currentEndColor.b = this.easing(time, endBase.b, this._endColorChange.b, this.duration);

    return this._currentEndColor;
  }

  get currentP1(): IPoint {
    const time = Date.now() - this.startTime;
    // Since we must use a circular interpolation to calculate the animated position
    // Of the end point, we must apply the easing to the path the point will take
    // Which gets applied to the interpolations t value of 0 - 1
    const easedTime = this.easing(time, 0, 1, this.duration);

    return circular(easedTime, this.start, this.startStop, this.controlPoints[0]);
  }

  get currentP2(): IPoint {
    const time = Date.now() - this.startTime;
    // Since we must use a circular interpolation to calculate the animated position
    // Of the end point, we must apply the easing to the path the point will take
    // Which gets applied to the interpolations t value of 0 - 1
    const easedTime = this.easing(time, 0, 1, this.duration);
    // Apply the circular interpolation to the points
    return circular(easedTime, this.end, this.endStop, this.controlPoints[0]);
  }
}
