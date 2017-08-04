import { color, rgb } from 'd3-color';
import { scaleOrdinal, schemeCategory20 } from 'd3-scale';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection, SelectionType } from '../../selections/selection';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';
import { IChordChartConfig, IData } from '../types';

const debug = require('debug')('chord-chart');

/**
 * Responsible for generating the static outer rings in the system
 *
 * @export
 * @class OuterRingBaseCache
 * @extends {ShapeBufferCache<CurvedLineShape<ICurvedLineData>>}
 */
export class OuterRingBaseCache extends ShapeBufferCache<CurvedLineShape<ICurvedLineData>> {
  generate(data: IData, config: IChordChartConfig, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(data: IData, config: IChordChartConfig, selection: Selection) {
    debug('Building outer rings for data: %o', data);

    const circleRadius = config.radius;
    const segmentSpace: number = config.space; // It used to seperate segments

    const segments = this.preProcessData(data, circleRadius, segmentSpace);
    const circleEdges = segments.map((segment) => {
      const {r, g, b} = segment.color;
      const d3Color = rgb(r, g, b);
      const color = selection.getSelection(SelectionType.MOUSEOVER_OUTER_RING).length > 0 ? d3Color.darker() : d3Color;

      const curve = new CurvedLineShape(
        CurveType.CircularCCW,
        {x: segment.p1.x, y: segment.p1.y},
        {x: segment.p2.x, y: segment.p2.y},
        [{x: segment.controlPoint.x, y: segment.controlPoint.y}],
        rgb(color.r, color.g, color.b, color.opacity),
        200,
      );

      curve.lineWidth = config.ringWidth;
      curve.depth = 21;

      return curve;
    });

    debug('Generated outer ring segments: %o edges: %o', segments, circleEdges);
    this.buffer = circleEdges;
  }

  // Data = d3chart.loadData();
  preProcessData(data: IData, circleRadius: number, segmentSpace: number) {
    const controlPoint = {x: 0, y: 0};

    const calculatePoint = (radianAngle: number) => {
      const x = circleRadius * Math.cos(radianAngle);
      const y = circleRadius * Math.sin(radianAngle);
      return {x, y};
    };

    const ids = data.endpoints.map((endpoint) =>
      endpoint.id);
    const calculateColor = scaleOrdinal(schemeCategory20).domain(ids);
    const segments = data.endpoints.map((endpoint) => {
      const p1 = calculatePoint(endpoint.startAngle + segmentSpace);
      const p2 = calculatePoint(endpoint.endAngle - segmentSpace);
      const colorVal = rgb(color(calculateColor(endpoint.id)));
      return {p1, p2, controlPoint, color: colorVal};
    });

    return segments;
  }
}
