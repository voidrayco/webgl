import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Selection } from '../../selections/selection';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';
import { IChordChartConfig, IData as IChordData } from '../types';
import { ChordBaseCache } from './chord-base-cache';
import { ChordInteractionsCache } from './chord-interaction-cache';

const debug = require('debug')('chord-generator');

export class ChordGenerator {
  chordBase: ChordBaseCache = new ChordBaseCache();
  chordInteractions: ChordInteractionsCache = new ChordInteractionsCache();

  /**
   * Flag which caches need busting
   */
  bustCaches(selection: Selection) {
    this.chordBase.bustCache = true;
    this.chordInteractions.bustCache = true;
  }

  /**
   * Generates the buffers for static chords in the charts
   */
  generate(data: IChordData, config: IChordChartConfig, selection: Selection) {
    debug('Generating chords');
    this.bustCaches(selection);
    this.chordBase.generate(data, config, selection);
    this.chordInteractions.generate(selection);
  }

  /**
   * Get the base buffer
   */
  getBaseBuffer(): CurvedLineShape<ICurvedLineData>[] {
    return this.chordBase.getBuffer();
  }
}
