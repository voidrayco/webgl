import { Label } from 'webgl-surface/drawing/label';
import { Selection } from '../../selections/selection';
import { IData } from '../chord/chord-base-cache';
import { LabelBaseCache } from './label-base-cache';

const debug = require('debug')('webgl-surface:Labels');

export class LabelGenerator {
  baseCache: LabelBaseCache = new LabelBaseCache();
  allLabels: Label<any>[];

  bustCaches() {
    this.baseCache.bustCache = true;
  }

  /** */
  generate(data: IData, selection: Selection) {
    debug('Generating Labels');
    this.bustCaches();
    this.baseCache.generate(data, selection);
  }

  getBaseBuffer() {
    return this.baseCache.getBuffer();
  }
}
