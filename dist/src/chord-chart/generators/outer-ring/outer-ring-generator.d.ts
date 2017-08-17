import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Selection } from '../../selections/selection';
import { IOuterRingData } from '../../shape-data-types/outer-ring-data';
import { IChordChartConfig, IData as IChordData } from '../types';
import { OuterRingBaseCache } from './outer-ring-base-cache';
import { OuterRingInteractionsCache } from './outer-ring-interaction-cache';
export declare class OuterRingGenerator {
    outerRingBase: OuterRingBaseCache;
    outerRingInteraction: OuterRingInteractionsCache;
    /** Tracks last data set that was rendered */
    lastData: IChordData;
    lastHemisphere: boolean;
    /**
     * Flag which caches need busting
     */
    bustCaches(data: IChordData, config: IChordChartConfig, selection: Selection): void;
    /**
     * Generates the buffers for static outer rings in the charts
     */
    generate(data: IChordData, config: IChordChartConfig, selection: Selection): void;
    /**
     * Get the base buffer
     */
    getBaseBuffer(): CurvedLineShape<IOuterRingData>[];
    getInteractionBuffer(): CurvedLineShape<IOuterRingData>[];
}
