import { Color } from 'three';
import { ReferenceColor } from '../../drawing/reference/reference-color';
import { IPoint } from '../../primitives/point';
import { EasingMethod } from '../../util/easing';
import { CurvedLineShape, ICurvedLineShapeOptions } from '../shape/curved-line-shape';
export interface IAnimatedCurvedLineShapeOptions extends ICurvedLineShapeOptions {
    duration?: number;
    easing?: EasingMethod;
    endColorStop?: ReferenceColor;
    startStop?: IPoint;
    endStop?: IPoint;
    startColorStop?: ReferenceColor;
    startTime?: number;
}
/**
 * This represents curved lines and what it would take to animate various properties.
 * While this provides helpers to aid in animating the properties, it is up to
 * buffers, shaders and materials to render those changes appropriately.
 */
export declare class AnimatedCurvedLineShape<T> extends CurvedLineShape<T> {
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
    easing: EasingMethod;
    /** The color this curve should be at the end of the animation */
    private _startColorStop;
    private _startColorChange;
    startColorStop: ReferenceColor;
    /** The color the end of this curve should be at the end of the animation */
    private _endColorStop;
    private _endColorChange;
    endColorStop: ReferenceColor;
    /** The starting end point's destination */
    startStop: IPoint;
    endStop: IPoint;
    constructor(options?: IAnimatedCurvedLineShapeOptions);
    /**
     * This calculates the current start color with the given easing function
     * based on how much time has lapsed since startTime
     */
    private _currentStartColor;
    readonly currentStartColor: Color;
    /**
     * This calculates the current end color with the given easing function
     * based on how much time has lapsed since startTime
     */
    private _currentEndColor;
    readonly currentEndColor: Color;
    readonly currentStart: IPoint;
    readonly currentEnd: IPoint;
}
