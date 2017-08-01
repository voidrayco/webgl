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

  buildCache(data: IData, config: IChordChartConfig, selection: Selection){
    const circleRadius = config.radius;
    const segmentSpace: number = config.space; // It used to seperate segments
    const hemiSphere: boolean = config.hemiSphere;
    const hemiDistance: number = config.hemiDistance;

    const segments = this.preProcessData(data, circleRadius, segmentSpace, hemiSphere, hemiDistance);
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
  preProcessData(data: IData, circleRadius: number, segmentSpace: number, hemiSphere: boolean,
     hemiDistance: number) {
    let controlPoint = {x: 0, y: 0};

    // Keep the angle in the range from 0 to 2*Pi
    function adjustAngle(angle: number){
      if (angle < 0)angle += 2 * Math.PI;
      else if (angle > 2 * Math.PI)angle -= 2 * Math.PI;
      return angle;
    }

    const calculatePoint = (radianAngle: number) => {
      radianAngle = adjustAngle(radianAngle);
      let x = circleRadius * Math.cos(radianAngle);
      const y = circleRadius * Math.sin(radianAngle);
      // Change the position in hemiSphere
      if (hemiSphere){
        if ((radianAngle >= 0 && radianAngle < Math.PI / 2) ||
           (radianAngle >= Math.PI * 3 / 2 && radianAngle < Math.PI * 2)){
            x = circleRadius * Math.cos(radianAngle) + hemiDistance;
        }else{
            x = circleRadius * Math.cos(radianAngle) - hemiDistance;
        }
      }
      return {x, y};
    };

    const ids = data.endpoints.map((endpoint) =>
      endpoint.id);
    const calculateColor = scaleOrdinal(schemeCategory20).domain(ids);
    const segments = data.endpoints.map((endpoint) => {
      const p1 = calculatePoint(endpoint.startAngle + segmentSpace);
      const p2 = calculatePoint(endpoint.endAngle - segmentSpace);
      // Change controlPoint in hemiSphere
      if (hemiSphere){
        const angle = adjustAngle(endpoint.startAngle + segmentSpace);
        if ((angle >= 0 && angle < Math.PI / 2) ||
           (angle >= (3 * Math.PI ) / 2 && angle < Math.PI * 2)){
             controlPoint = {x: hemiDistance, y: 0};
        }else{
             controlPoint = {x: -hemiDistance, y: 0};
        }
      }
      const colorVal = rgb(color(calculateColor(endpoint.id)));
      return {p1, p2, controlPoint, color: colorVal};
    });

    return segments;
  }
}
