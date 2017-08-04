import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection, SelectionType } from '../../selections/selection';
import { IOuterRingData } from '../../shape-data-types/outer-ring-data';
import { IChordChartConfig, IData } from '../types';

// Const debug = require('debug')('outer-ring-interaction-cache');
const depth = 21;
const ringWidth = 20;

/**
 * Responsible for generating the static OuterRings in the system
 *
 * @export
 * @class OuterRingBaseCache
 * @extends {ShapeBufferCache<CurvedLineShape<ICurvedLineData>>}
 */
export class OuterRingInteractionsCache extends ShapeBufferCache<CurvedLineShape<IOuterRingData>> {
  generate(data: IData, config: IChordChartConfig, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(data: IData, config: IChordChartConfig, selection: Selection) {
    const shapes = Array<any>();

    selection.getSelection<CurvedLineShape<IOuterRingData>>(SelectionType.MOUSEOVER_OUTER_RING).map(selected => {
      // Highlight hovered ring
      const curvedLine = selected.clone();

      curvedLine.a = 1.0;
      curvedLine.lineWidth = ringWidth;
      curvedLine.depth = depth;

      shapes.push(curvedLine);
    });

    this.buffer = shapes;
  }
}
