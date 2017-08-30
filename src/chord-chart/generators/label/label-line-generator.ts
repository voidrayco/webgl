import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Selection, SelectionType } from '../../selections/selection';
import { OuterRingGenerator } from '../outer-ring/outer-ring-generator';
import { IChordChartConfig, IData as IChordData } from '../types';
import { LabelGenerator } from './label-generator';
import { LabelLineBaseCache } from './label-line-base-cache';
const debug = require('debug')('label_line_cache');

/**
 * Responsible for generating the static labels around the chart
 *
 * @export
 * @class LabelBaseCache
 * @extends {ShapeBufferCache<Label<ICurvedLineData>>}
 */
export class LabelLineGenerator {
  labelLineBase: LabelLineBaseCache = new LabelLineBaseCache();

   /** Tracks last data set that was rendered */
  lastData: IChordData;
  lastSplit: boolean;

  bustCaches(data: IChordData,  config: IChordChartConfig, selection: Selection) {
    const didDataChange = data !== this.lastData;

    const didSplitChange = this.lastSplit !== config.splitTopLevelGroups;

    if (didDataChange || didSplitChange ) {
      this.labelLineBase.bustCache = true;
    }

    const didSelectionChange =
    selection.didSelectionCategoryChange(SelectionType.MOUSEOVER_CHORD) ||
    selection.didSelectionCategoryChange(SelectionType.MOUSEOVER_OUTER_RING)
    ;

    if (didSelectionChange) {
      this.labelLineBase.bustCache = true;
    }
    this.lastData = data;
    this.lastSplit = config.splitTopLevelGroups;
  }

  generate(data: IChordData, config: IChordChartConfig, outerRingGenerator: OuterRingGenerator, labelGenerator: LabelGenerator, selection: Selection) {
    debug('data is %o', data);
    this.bustCaches(data, config, selection);
    this.labelLineBase.generate(data, outerRingGenerator, labelGenerator, config, selection);
  }

  getBaseBuffer(): CurvedLineShape<any>[] {
    return this.labelLineBase.getBuffer();
  }

  getInteractiveBaseBuffer(): CurvedLineShape<any>[] {
    return [];
  }
}
