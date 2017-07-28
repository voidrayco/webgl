import { hsl, rgb } from 'd3-color';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection } from '../../selections/selection';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';
import { IChordChartConfig, ICurveData, IData, IEndpoint } from '../types';

const debug = require('debug')('chords');

function getEndpoint(data: IData, targetName: string) {
  function isTarget(endpoint: IEndpoint) {
    return endpoint.id === targetName;
  }
  return data.endpoints.find(isTarget);
}

function calculatePoint(radius: number, flowAngle: number) {
  const x = radius * Math.cos(flowAngle);
  const y = radius * Math.sin(flowAngle);
  return {x, y};
}

function getFlowAngle(endpoint: IEndpoint, flowIndex: number, segmentSpace: number) {
  const angleStep: number = (endpoint.endAngle - endpoint.startAngle
    - 2 * segmentSpace) / endpoint.totalCount;
  return endpoint.startAngle + 2 * segmentSpace + (angleStep * flowIndex);
}

/**
 * Responsible for generating the static chords in the system
 *
 * @export
 * @class ChordBaseCache
 * @extends {ShapeBufferCache<CurvedLineShape<ICurvedLineData>>}
 */
export class ChordBaseCache extends ShapeBufferCache<CurvedLineShape<ICurvedLineData>> {
  generate(data: IData, config: IChordChartConfig, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(data: IData, config: IChordChartConfig, selection: Selection) {
    const inactiveOpacity: number = 0.3;
    const activeOpacity: number = 1;
    const circleRadius = config.radius;
    const circleWidth = config.ringWidth;
    const segmentSpace = config.space;

    const curves = this.preProcessData(data, circleRadius, circleWidth, segmentSpace);
    const curveShapes = curves.map((curve) => {
      const {r, g, b} = curve.color;
      const color = selection.getSelection('chord or ring mouse over').length > 0 ?
        rgb(r, g, b, inactiveOpacity) :
        rgb(r, g, b, activeOpacity)
      ;
      const curve1 = new CurvedLineShape(
        CurveType.Bezier,
        {x: curve.p1.x, y: curve.p1.y},
        {x: curve.p2.x, y: curve.p2.y},
        [{x: curve.controlPoint.x, y: curve.controlPoint.y}],
        color);

      curve1.lineWidth = 3;
       return curve1;
    });

    this.buffer = curveShapes;
    debug('Generated CurvedLines for base chord cache: %o', curveShapes);
  }

  // Data comes from catbird-ui >> d3Chart.loadData()
  preProcessData(data: IData, circleRadius: number, circleWidth: number, segmentSpace: number) {
    const controlPoint = {x: 0, y: 0};
    const curveData: ICurveData[] = [];

    // First initialize any details not set in the endpoint
    data.endpoints.forEach(end => {
      end._inflowIdx = 0;
      end._outflowIdx = 0;
    });

    // Loop thrugh each endpoint and analyze the flows
    data.endpoints.forEach((endpoint) => {
      data.flows.forEach((flow) => {
        if (flow.srcTarget === endpoint.id){
          const destEndpoint = getEndpoint(data, flow.dstTarget);
          debug('source is %o,destination is %o', flow.srcTarget, destEndpoint);
          if (destEndpoint){
            const p1FlowAngle = getFlowAngle(endpoint, endpoint._outflowIdx, segmentSpace);
            const p1 = calculatePoint(circleRadius - circleWidth / 2, p1FlowAngle);
            const p2FlowAngle = getFlowAngle(destEndpoint,
               destEndpoint.outgoingCount + destEndpoint._inflowIdx, segmentSpace);
            const p2 = calculatePoint(circleRadius + circleWidth / 2, p2FlowAngle);
            const color = rgb(hsl(flow.baseColor.h, flow.baseColor.s, flow.baseColor.l));
            endpoint._outflowIdx++;
            destEndpoint._inflowIdx++;
            curveData.push({p1, p2, controlPoint, color});
          }
        }
      });
    });

    return curveData;
  }
}
