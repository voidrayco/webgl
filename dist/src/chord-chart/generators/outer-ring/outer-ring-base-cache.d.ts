import { RGBColor } from 'd3-color';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection } from '../../selections/selection';
import { IOuterRingData } from '../../shape-data-types/outer-ring-data';
import { IChord, IChordChartConfig, IData, IEndpoint } from '../types';
/**
 * Responsible for generating the static outer rings in the system
 */
export declare class OuterRingBaseCache extends ShapeBufferCache<CurvedLineShape<IOuterRingData>> {
    generate(data: IData, config: IChordChartConfig, selection: Selection): void;
    buildCache(data: IData, config: IChordChartConfig, selection: Selection): void;
    /**
     * This processes the data to calculate initial needed metrics to make generating
     * shapes simpler.
     */
    preProcessData(data: IData, config: IChordChartConfig): {
        color: RGBColor;
        controlPoint: {
            x: number;
            y: number;
        };
        flows: IChord[];
        id: string;
        p1: {
            x: number;
            y: number;
        };
        p2: {
            x: number;
            y: number;
        };
        source: IEndpoint;
    }[];
}
