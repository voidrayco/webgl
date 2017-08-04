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

  /**
   * Flag which caches need busting
   */
  bustCaches(data: IChordData, config: IChordChartConfig, selection: Selection) {
    if (data !== this.lastData || selection.didSelectionCategoryChange(SelectionType.MOUSEOVER_OUTER_RING)) {
      this.outerRingBase.bustCache = true;
      this.outerRingInteraction.bustCache = true;
    }

     this.lastData = data;
  }

  /**
   * Generates the buffers for static outer rings in the charts
   */
  generate(data: IChordData, config: IChordChartConfig, selection: Selection) {
    debug('Generating outer rings');
    this.bustCaches(data, config, selection);
    debug(data);
    this.outerRingBase.generate(data, config, selection);
    this.outerRingInteraction.generate(data, config, selection);
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
