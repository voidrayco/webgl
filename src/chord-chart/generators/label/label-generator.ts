import { OuterRingGenerator } from 'chord-chart/generators/outer-ring/outer-ring-generator';
import { IOuterRingData } from 'chord-chart/shape-data-types/outer-ring-data';
import { Label } from 'webgl-surface/drawing/label';
import { Selection, SelectionType } from '../../selections/selection';
import { IChordChartConfig, IData } from '../types';
import { LabelBaseCache } from './label-base-cache';
import { LabelInteractionCache } from './label-interaction-cache';

const debug = require('debug')('label-generator');

export class LabelGenerator {
  baseCache: LabelBaseCache = new LabelBaseCache();
  interactionCache: LabelInteractionCache = new LabelInteractionCache();
  allLabels: Label<any>[];
  lastData: IData;
  lastHemisphere: boolean;

  bustCaches(data: IData, config: IChordChartConfig, selection: Selection) {
    const didDataChange = data !== this.lastData;
    const didSelectionChange =
    selection.didSelectionCategoryChange(SelectionType.MOUSEOVER_CHORD)
    || selection.didSelectionCategoryChange(SelectionType.MOUSEOVER_OUTER_RING);
    const didHemisphereChange =
    this.lastHemisphere !== config.splitTopLevelGroups;

    if (didDataChange || didSelectionChange || didHemisphereChange) {
      this.baseCache.bustCache = true;
      this.interactionCache.bustCache = true;
    }

    this.lastData = data;
    this.lastHemisphere = config.splitTopLevelGroups;
  }

  /** */
  generate(data: IData, config: IChordChartConfig, outerRingGenerator: OuterRingGenerator, selection: Selection) {
    debug('Generating Labels.');
    debug('selection is %o', selection);
    this.bustCaches(data, config, selection);
    this.baseCache.generate(data, outerRingGenerator, config, selection);
    this.interactionCache.generate(data, outerRingGenerator, config, selection);
  }

  getBaseBuffer(): Label<IOuterRingData>[] {
    return this.baseCache.getBuffer();
  }

  getInteractionBuffer(): Label<IOuterRingData>[]{
    return this.interactionCache.getBuffer();
  }
}
