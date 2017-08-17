import { OuterRingGenerator } from 'chord-chart/generators/outer-ring/outer-ring-generator';
import { IOuterRingData } from 'chord-chart/shape-data-types/outer-ring-data';
import { Label } from 'webgl-surface/drawing/label';
import { Selection } from '../../selections/selection';
import { IChordChartConfig, IData } from '../types';
import { LabelBaseCache } from './label-base-cache';
export declare class LabelGenerator {
    baseCache: LabelBaseCache;
    allLabels: Label<any>[];
    currentData: IData;
    bustCaches(data: IData, config: IChordChartConfig, selection: Selection): void;
    /** */
    generate(data: IData, config: IChordChartConfig, outerRingGenerator: OuterRingGenerator, selection: Selection): void;
    getBaseBuffer(): Label<IOuterRingData>[];
}
