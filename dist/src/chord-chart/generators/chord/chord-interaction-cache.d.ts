import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection } from '../../selections/selection';
import { IChordData } from '../../shape-data-types/chord-data';
import { IChordChartConfig } from '../types';
/**
 * Responsible for generating the static chords in the system
 */
export declare class ChordInteractionsCache extends ShapeBufferCache<CurvedLineShape<IChordData>> {
    generate(config: IChordChartConfig, selection: Selection): void;
    buildCache(config: IChordChartConfig, selection: Selection): void;
}
