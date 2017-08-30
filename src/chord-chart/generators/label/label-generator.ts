import { OuterRingGenerator } from 'chord-chart/generators/outer-ring/outer-ring-generator';
import { IOuterRingData } from 'chord-chart/shape-data-types/outer-ring-data';
import { Color } from 'three';
import { Label } from 'webgl-surface/drawing/label';
import { Selection, SelectionType } from '../../selections/selection';
import { IChordChartConfig, IData, IEndpoint } from '../types';
import { LabelBaseCache } from './label-base-cache';
import { LabelInteractionCache } from './label-interaction-cache';

const debug = require('debug')('label-generator');

export class LabelGenerator {
  baseCache: LabelBaseCache = new LabelBaseCache();
  interactionCache: LabelInteractionCache = new LabelInteractionCache();
  labelByString = new Map<string, Label<any>>();
  lastData: IData;
  lastSplit: boolean;
  uniqueLabels: Label<any>[];
  isHovered: boolean = false;

  bustCaches(data: IData, config: IChordChartConfig, selection: Selection) {
    const didDataChange = data !== this.lastData;
    const didSelectionChange =
      selection.didSelectionCategoryChange(SelectionType.MOUSEOVER_CHORD) ||
      selection.didSelectionCategoryChange(SelectionType.MOUSEOVER_OUTER_RING)
    ;
    const didSplitChange = this.lastSplit !== config.splitTopLevelGroups;
    const hasSelection =
      selection.getSelection(SelectionType.MOUSEOVER_CHORD).length > 0 ||
      selection.getSelection(SelectionType.MOUSEOVER_OUTER_RING).length > 0
    ;

    debug('didDataChange  %o', didDataChange);
    debug('didSelectionChange %o', didSelectionChange);
    debug('hasSelection %o, ', hasSelection);

    // Anytime the data changes or the split state changes all must be re-rendered
    if (didDataChange || didSplitChange ) {
      this.baseCache.bustCache = true;
      this.interactionCache.bustCache = true;
      this.isHovered = false;
    }

    // If the selection changes, interactions WILL change, but the base only changes
    // If the presence of a selection changes
    if (didSelectionChange) {
      if (this.isHovered && !hasSelection) {
        this.baseCache.bustCache = true;
        this.isHovered = false;
      }

      else if (!this.isHovered && hasSelection) {
        this.baseCache.bustCache = true;
        this.isHovered = true;
      }

      this.interactionCache.bustCache = true;
    }

    // If the data changed, then we have to regenerate our unique labels to work
    // With.
    if (didDataChange) {
      debug('GEnerating uniquelabels....');
      this.travelTree(data.tree);

      this.uniqueLabels = Array.from(this.labelByString.values());
    }

    this.lastData = data;
    this.lastSplit = config.splitTopLevelGroups;
  }

  travelTree(tree: IEndpoint[]) {
    if (tree.length !== 0) {
      tree.forEach((t) => {
        if (t.parent !== '') {
          if (!this.labelByString.get(t.name)) {
            this.labelByString.set(t.name, new Label({
              a: 1.0,
              color: new Color(1, 1, 1),
              fontSize: 14,
              text: t.name,
            }));
          }
        }
        this.travelTree(t.children);
       });
    }
  }

  /** */
  generate(data: IData, config: IChordChartConfig, outerRingGenerator: OuterRingGenerator, selection: Selection) {
    debug('Generating Labels.');
    debug('selection is %o', selection);
    this.bustCaches(data, config, selection);
    this.baseCache.generate(data, outerRingGenerator, config, this.labelByString, selection);
    this.interactionCache.generate(data, outerRingGenerator, config, this.labelByString, selection);
  }

  getUniqueLabels(): Label<any>[] {
    return this.uniqueLabels;
  }

  getBaseBuffer(): Label<IOuterRingData>[] {
    return this.baseCache.getBuffer();
  }

  getInteractionBuffer(): Label<IOuterRingData>[] {
    return this.interactionCache.getBuffer();
  }
}
