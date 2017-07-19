import { rgb } from 'd3-color';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';

const debug = require('debug')('chord-chart');

/**
 * Responsible for generating the static chords in the system
 *
 * @export
 * @class ChordBaseCache
 * @extends {ShapeBufferCache<CurvedLineShape<ICurvedLineData>>}
 */
export class ChordBaseCache extends ShapeBufferCache<CurvedLineShape<ICurvedLineData>> {
  generate() {
    super.generate.apply(this, arguments);
  }

  buildCache() {
    this.buffer = [
      new CurvedLineShape(CurveType.Bezier, {x: 0, y: 0}, {x: 100, y: 100}, [{x: 100, y: 0}], rgb(1, 0, 0, 1), 25),
    ];
  }
}
