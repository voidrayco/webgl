import { OuterRingGenerator } from 'chord-chart/generators/outer-ring/outer-ring-generator';
import { IOuterRingData } from 'chord-chart/shape-data-types/outer-ring-data';
import { Label } from 'webgl-surface/drawing/label';
import { Selection } from '../../selections/selection';
import { IChordChartConfig, IData } from '../types';
import { LabelBaseCache } from './label-base-cache';

const debug = require('debug')('label-generator');

export class LabelGenerator {
  baseCache: LabelBaseCache = new LabelBaseCache();
  allLabels: Label<any>[];
  currentData: IData;

  bustCaches(data: IData, config: IChordChartConfig, selection: Selection) {
    if (data !== this.currentData) {
      this.baseCache.bustCache = true;
    }

    this.currentData = data;
  }

  /** */
  generate(data: IData, config: IChordChartConfig, outerRingGenerator: OuterRingGenerator, selection: Selection) {
    debug('Generating Labels');
    this.bustCaches(data, config, selection);
    this.baseCache.generate(data, outerRingGenerator, config, selection);
  }

  getBaseBuffer(): Label<IOuterRingData>[] {
    return this.baseCache.getBuffer();
  }
}
