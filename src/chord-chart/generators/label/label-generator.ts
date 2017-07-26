import { Label } from 'webgl-surface/drawing/label';
import { Selection } from '../../selections/selection';
import { IChordChartConfig, IData } from '../types';
import { LabelBaseCache } from './label-base-cache';

const debug = require('debug')('webgl-surface:Labels');

export class LabelGenerator {
  baseCache: LabelBaseCache = new LabelBaseCache();
  allLabels: Label<any>[];

  bustCaches() {
    this.baseCache.bustCache = true;
  }

  /** */
  generate(data: IData, config: IChordChartConfig, selection: Selection) {
    debug('Generating Labels');
    this.bustCaches();
    this.baseCache.generate(data, config, selection);
  }

  getBaseBuffer() {
    return this.baseCache.getBuffer();
  }
}
