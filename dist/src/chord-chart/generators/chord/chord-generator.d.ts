import { OuterRingGenerator } from 'chord-chart/generators/outer-ring/outer-ring-generator';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Selection } from '../../selections/selection';
import { IChordData } from '../../shape-data-types/chord-data';
import { IChordChartConfig, IData } from '../types';
import { ChordBaseCache } from './chord-base-cache';
import { ChordInteractionsCache } from './chord-interaction-cache';
export declare class ChordGenerator {
    chordBase: ChordBaseCache;
    chordInteractions: ChordInteractionsCache;
    lastHemisphere: boolean;
    lastData: IData;
    /**
     * Flag which caches need busting
     */
    bustCaches(data: IData, config: IChordChartConfig, outerRings: OuterRingGenerator, selection: Selection): void;
    /**
     * Generates the buffers for static chords in the charts
     */
    generate(data: IData, config: IChordChartConfig, outerRings: OuterRingGenerator, selection: Selection): void;
    /**
     * Get the base buffer
     */
    getBaseBuffer(): CurvedLineShape<IChordData>[];
    getInteractionBuffer(): CurvedLineShape<IChordData>[];
}
