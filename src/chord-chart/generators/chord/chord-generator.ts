import { OuterRingGenerator } from 'chord-chart/generators/outer-ring/outer-ring-generator';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Selection, SelectionType } from '../../selections/selection';
import { IChordData } from '../../shape-data-types/chord-data';
import { IChordChartConfig, IData } from '../types';
import { ChordBaseCache } from './chord-base-cache';
import { ChordInteractionsCache } from './chord-interaction-cache';

const debug = require('debug')('chord-generator');

export class ChordGenerator {
  chordBase: ChordBaseCache = new ChordBaseCache();
  chordInteractions: ChordInteractionsCache = new ChordInteractionsCache();

  lastHemisphere: boolean;
  lastData: IData;

  /**
   * Flag which caches need busting
   */
  bustCaches(data: IData, config: IChordChartConfig, outerRings: OuterRingGenerator, selection: Selection) {
    const didDataChange = data !== this.lastData;
    const didSelectionChange = selection.didSelectionCategoryChange(SelectionType.MOUSEOVER_CHORD);
    const didHemisphereChange = this.lastHemisphere !== config.splitTopLevelGroups;

    if (didSelectionChange || didDataChange || didHemisphereChange) {
      this.chordBase.bustCache = true;
    }

    if (didSelectionChange || didHemisphereChange) {
      this.chordInteractions.bustCache = true;
    }

    this.lastHemisphere = config.splitTopLevelGroups;
    this.lastData = data;
  }

  /**
   * Generates the buffers for static chords in the charts
   */
  generate(data: IData, config: IChordChartConfig, outerRings: OuterRingGenerator, selection: Selection) {
    debug('Generating chords');
    this.bustCaches(data, config, outerRings, selection);
    this.chordBase.generate(data, config, outerRings, selection);
    this.chordInteractions.generate(config, selection);
  }

  /**
   * Get the base buffer
   */
  getBaseBuffer(): CurvedLineShape<IChordData>[] {
    return this.chordBase.getBuffer();
  }

  getInteractionBuffer(): CurvedLineShape<IChordData>[] {
    return this.chordInteractions.getBuffer();
  }
}
