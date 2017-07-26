import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Selection } from '../../selections/selection';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';
import { IChordChartConfig, IData as IChordData } from '../types';
import { OuterRingBaseCache } from './outer-ring-base-cache';

const debug = require('debug')('outer-ring-chart');

export class OuterRingGenerator {
  outerRingBase: OuterRingBaseCache = new OuterRingBaseCache();

  /**
   * Flag which caches need busting
   */
  bustCaches() {
    this.outerRingBase.bustCache = true;
  }

  /**
   * Generates the buffers for static outer rings in the charts
   */
  generate(data: IChordData, config: IChordChartConfig, selection: Selection) {
    debug('Generating outer rings');
    this.bustCaches();
    this.outerRingBase.generate(data, config, selection);
  }

  /**
   * Get the base buffer
   */
  getBaseBuffer(): CurvedLineShape<ICurvedLineData>[] {
    return this.outerRingBase.getBuffer();
  }
}
