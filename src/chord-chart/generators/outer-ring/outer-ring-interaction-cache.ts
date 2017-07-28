import { rgb } from 'd3-color';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection, SelectionType } from '../../selections/selection';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';
// DEBUG const debug = require('debug')('outer-ring-interaction-cache');
/**
 * Responsible for generating the static OuterRings in the system
 *
 * @export
 * @class OuterRingBaseCache
 * @extends {ShapeBufferCache<CurvedLineShape<ICurvedLineData>>}
 */
export class OuterRingInteractionsCache extends ShapeBufferCache<CurvedLineShape<ICurvedLineData>> {
  generate(selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(selection: Selection) {
    this.buffer = selection.getSelection<CurvedLineShape<any>>(SelectionType.MOUSEOVER_OUTER_RING).map(selected => {
      // Duplicate the curves with active color
      const color = rgb(selected.r, selected.g, selected.b).brighter();
      const curvedLine = new CurvedLineShape(
        CurveType.CircularCCW,
        {x: selected.p1.x, y: selected.p1.y},
        {x: selected.p2.x, y: selected.p2.y},
        [{x: selected.controlPoints[0].x, y: selected.controlPoints[0].y}],
        color,
        200,
      );

      curvedLine.lineWidth = 20;
      curvedLine.depth = 21;
      return curvedLine;
    });
  }
}
