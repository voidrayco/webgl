import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Selection } from '../../selections/selection';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';
import { IChordChartConfig, IData as IChordData } from '../types';
import { ChordBaseCache } from './chord-base-cache';

const debug = require('debug')('chord-chart');

export class ChordGenerator {
  chordBase: ChordBaseCache = new ChordBaseCache();

  /**
   * Flag which caches need busting
   */
  bustCaches() {
    this.chordBase.bustCache = true;
  }

  /**
   * Generates the buffers for static chords in the charts
   */
  generate(data: IChordData, config: IChordChartConfig, selection: Selection) {
    debug('Generating chords');
    this.bustCaches();
    this.chordBase.generate(data, config, selection);
  }

  /**
   * Get the base buffer
   */
  getBaseBuffer(): CurvedLineShape<ICurvedLineData>[] {
    return this.chordBase.getBuffer();
  }
}