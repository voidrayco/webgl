import { rgb } from 'd3-color';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection, SelectionType } from '../../selections/selection';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';

// Debug const debug = require('debug')('chord-interaction-cache');

/**
 * Responsible for generating the static chords in the system
 *
 * @export
 * @class ChordBaseCache
 * @extends {ShapeBufferCache<CurvedLineShape<ICurvedLineData>>}
 */
export class ChordInteractionsCache extends ShapeBufferCache<CurvedLineShape<ICurvedLineData>> {
  generate(selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(selection: Selection) {
    this.buffer = selection.getSelection<CurvedLineShape<any>>(SelectionType.MOUSEOVER_CHORD).map(curve => {
      // Duplicate the curves with active color
      const color = rgb(curve.r, curve.g, curve.b).brighter();
      const curvedLine = new CurvedLineShape(
        CurveType.Bezier,
        {x: curve.p1.x, y: curve.p1.y}, {x: curve.p2.x, y: curve.p2.y},
        [{x: curve.controlPoints[0].x, y: curve.controlPoints[0].y}],
        color,
      );

      curvedLine.depth = 10;
      return curvedLine;
    });
  }
}
