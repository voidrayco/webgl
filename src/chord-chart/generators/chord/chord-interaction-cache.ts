import { rgb } from 'd3-color';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection, SelectionType } from '../../selections/selection';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';
import { IChordChartConfig } from '../types';

const color = rgb(1, 1, 1);
const debug = require('debug')('chord-interaction-cache');
const depth = 10;
const lineWidth = 3;
const ringDepth = 21;

/**
 * Responsible for generating the static chords in the system
 *
 * @export
 * @class ChordBaseCache
 * @extends {ShapeBufferCache<CurvedLineShape<ICurvedLineData>>}
 */
export class ChordInteractionsCache extends ShapeBufferCache<CurvedLineShape<ICurvedLineData>> {
  generate(config: IChordChartConfig, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(config: IChordChartConfig, selection: Selection) {
    const shapes = Array<any>();
    selection.getSelection<CurvedLineShape<any>>(SelectionType.MOUSEOVER_CHORD).forEach(curve => {
      // Duplicate the curves with active color
      const curvedLine = new CurvedLineShape(
        CurveType.Bezier,
        {x: curve.p1.x, y: curve.p1.y}, {x: curve.p2.x, y: curve.p2.y},
        [{x: curve.controlPoints[0].x, y: curve.controlPoints[0].y}],
        color,
      );
      curvedLine.depth = depth;
      curvedLine.lineWidth = lineWidth;

      shapes.push(curvedLine);

      // Draw related outer rings
      if (curve.d){
        const controlPoint = {x: 0, y: 0};
        const calculatePoint = (radianAngle: number) => {
          const x = config.radius * Math.cos(radianAngle);
          const y = config.radius * Math.sin(radianAngle);
          return {x, y};
        };

        // Highlight outer rings
        curve.d.relations.forEach((point: any) => {
          const p1 = calculatePoint(point.startAngle + config.space);
          const p2 = calculatePoint(point.endAngle - config.space);
          const segment = {p1, p2, controlPoint, color: color};

          const rings = new CurvedLineShape(
            CurveType.CircularCCW,
            {x: segment.p1.x, y: segment.p1.y},
            {x: segment.p2.x, y: segment.p2.y},
            [{x: segment.controlPoint.x, y: segment.controlPoint.y}],
            rgb(color.r, color.g, color.b, color.opacity),
            200,
          );

          rings.depth = ringDepth;
          rings.lineWidth = config.ringWidth;
          shapes.push(rings);
        });
      }
    });
    debug(shapes);
    this.buffer = shapes;
  }
}
