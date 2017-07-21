import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';
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
  generate() {
    debug('Generating outer rings');
    this.bustCaches();
    this.outerRingBase.generate();
  }

  /**
   * Get the base buffer
   */
  getBaseBuffer(): CurvedLineShape<ICurvedLineData>[] {
    return this.outerRingBase.getBuffer();
  }
}
