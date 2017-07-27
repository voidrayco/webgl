import { difference } from 'lodash';
import { Label } from 'webgl-surface/drawing/label';
import { Selection } from '../../selections/selection';
import { IChordChartConfig, IData } from '../types';
import { LabelBaseCache } from './label-base-cache';

const debug = require('debug')('label-generator');

export class LabelGenerator {
  baseCache: LabelBaseCache = new LabelBaseCache();
  allLabels: Label<any>[];
  cachedBuffer: Label<any>[];

  bustCaches() {
    debug(this.baseCache);
    debug(this.cachedBuffer);
    debug(difference(this.baseCache.buffer, this.cachedBuffer));
    if (difference(this.baseCache.buffer, this.cachedBuffer).length > 0) {
      this.cachedBuffer = this.baseCache.buffer;
      this.baseCache.bustCache = true;
    }
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
