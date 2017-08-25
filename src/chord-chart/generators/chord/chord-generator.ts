import { ColorGenerator } from 'chord-chart/generators/color/color-generator';
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

  lastSplit: boolean;
  lastData: IData;
  isHovered: boolean = false;

  /**
   * Flag which caches need busting
   */
  bustCaches(data: IData, config: IChordChartConfig, colorGenerator: ColorGenerator, outerRings: OuterRingGenerator, selection: Selection) {
    const didDataChange = data !== this.lastData;
    const didSelectionChange =
      selection.didSelectionCategoryChange(SelectionType.MOUSEOVER_CHORD) ||
      selection.didSelectionCategoryChange(SelectionType.MOUSEOVER_OUTER_RING)
    ;
    const didSplitChange = this.lastSplit !== config.splitTopLevelGroups;
    const hasSelection =
      selection.getSelection(SelectionType.MOUSEOVER_CHORD).length > 0 ||
      selection.getSelection(SelectionType.MOUSEOVER_OUTER_RING).length > 0
    ;

    if (didDataChange || didSplitChange) {
      this.chordBase.bustCache = true;
      this.chordInteractions.bustCache = true;
    }

    if (didSelectionChange) {
      if (this.isHovered && !hasSelection) {
        this.chordBase.bustCache = true;
        this.isHovered = false;
      }

      else if (!this.isHovered && hasSelection) {
        this.chordBase.bustCache = true;
        this.isHovered = true;
      }

      this.chordInteractions.bustCache = true;
    }

    this.lastSplit = config.splitTopLevelGroups;
    this.lastData = data;
  }

  /**
   * Generates the buffers for static chords in the charts
   */
  generate(data: IData, config: IChordChartConfig, colorGenerator: ColorGenerator, outerRings: OuterRingGenerator, selection: Selection) {
    debug('Generating chords');
    this.bustCaches(data, config, colorGenerator, outerRings, selection);
    this.chordBase.generate(data, config, colorGenerator, outerRings, selection);
    this.chordInteractions.generate(config, colorGenerator, selection);
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
