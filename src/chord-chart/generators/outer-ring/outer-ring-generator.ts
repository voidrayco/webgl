import { ColorGenerator } from 'chord-chart/generators/color/color-generator';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Selection, SelectionType } from '../../selections/selection';
import { IOuterRingData } from '../../shape-data-types/outer-ring-data';
import { IChordChartConfig, IData as IChordData } from '../types';
import { OuterRingBaseCache } from './outer-ring-base-cache';
import { OuterRingInteractionsCache } from './outer-ring-interaction-cache';

const debug = require('debug')('outer-ring-chart');

export class OuterRingGenerator {
  outerRingBase: OuterRingBaseCache = new OuterRingBaseCache();
  outerRingInteraction: OuterRingInteractionsCache = new OuterRingInteractionsCache();

  /** Tracks last data set that was rendered */
  lastData: IChordData;
  lastSplit: boolean;
  isHovered: boolean = false;

  /**
   * Flag which caches need busting
   */
  bustCaches(data: IChordData, config: IChordChartConfig, selection: Selection) {
    const didDataChange = data !== this.lastData;
    const didSelectionChange = selection.didSelectionCategoryChange(SelectionType.MOUSEOVER_OUTER_RING);
    const didSplitChange = this.lastSplit !== config.splitTopLevelGroups;
    const hasSelection = selection.getSelection(SelectionType.MOUSEOVER_OUTER_RING).length > 0;

    if (didDataChange || didSplitChange) {
      this.outerRingBase.bustCache = true;
      this.outerRingBase.bustCache = true;
    }

    if (didSelectionChange) {
      if (this.isHovered && !hasSelection) {
        this.outerRingBase.bustCache = true;
        this.isHovered = false;
      }

      else if (!this.isHovered && hasSelection) {
        this.outerRingBase.bustCache = true;
        this.isHovered = true;
      }

      this.outerRingInteraction.bustCache = true;
    }

    this.lastData = data;
    this.lastSplit = config.splitTopLevelGroups;
  }

  /**
   * Generates the buffers for static outer rings in the charts
   */
  generate(data: IChordData, config: IChordChartConfig, colorGenerator: ColorGenerator, selection: Selection) {
    debug('Generating outer rings');
    this.bustCaches(data, config, selection);
    debug(data);
    this.outerRingBase.generate(data, config, colorGenerator, selection);
    this.outerRingInteraction.generate(data, config, colorGenerator, selection);
  }

  /**
   * Get the base buffer
   */
  getBaseBuffer(): CurvedLineShape<IOuterRingData>[] {
    return this.outerRingBase.getBuffer();
  }

  getInteractionBuffer(): CurvedLineShape<IOuterRingData>[] {
    return this.outerRingInteraction.getBuffer();
  }
}
