import { OuterRingGenerator } from 'chord-chart/generators/outer-ring/outer-ring-generator';
import { RGBColor } from 'd3-color';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { IPoint } from 'webgl-surface/primitives/point';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection } from '../../selections/selection';
import { IChordData } from '../../shape-data-types/chord-data';
import { IChord, IChordChartConfig, IData } from '../types';
export interface ICurveData {
    color: RGBColor;
    controlPoint: IPoint;
    destEndpoint: {};
    endpoint: {};
    p1: IPoint;
    p2: IPoint;
    source: IChord;
}
/**
 * Responsible for generating the static chords in the system
 *
 * @export
 * @class ChordBaseCache
 * @extends {ShapeBufferCache<CurvedLineShape<ICurvedLineData>>}
 */
export declare class ChordBaseCache extends ShapeBufferCache<CurvedLineShape<IChordData>> {
    generate(data: IData, config: IChordChartConfig, outerRings: OuterRingGenerator, selection: Selection): void;
    buildCache(data: IData, config: IChordChartConfig, outerRings: OuterRingGenerator, selection: Selection): void;
    /**
     * This processes the data to calculate initial needed metrics to make generating
     * shapes simpler.
     */
    preProcessData(data: IData, config: IChordChartConfig): ICurveData[];
}
