import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection } from '../../selections/selection';
import { IOuterRingData } from '../../shape-data-types/outer-ring-data';
import { IChordChartConfig, IData } from '../types';
/**
 * Responsible for generating the static OuterRings in the system
 */
export declare class OuterRingInteractionsCache extends ShapeBufferCache<CurvedLineShape<IOuterRingData>> {
    generate(data: IData, config: IChordChartConfig, selection: Selection): void;
    buildCache(data: IData, config: IChordChartConfig, selection: Selection): void;
}
