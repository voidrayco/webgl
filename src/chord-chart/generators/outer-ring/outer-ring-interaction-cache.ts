import { rgb } from 'd3-color';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection, SelectionType } from '../../selections/selection';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';
import { IChordChartConfig, IData, IEndpoint } from '../types';

const color = rgb(1, 1, 1);
const debug = require('debug')('outer-ring-interaction-cache');
const depth = 21;
const lineDepth = 10;
const lineWidth = 20;

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
 * Responsible for generating the static OuterRings in the system
 *
 * @export
 * @class OuterRingBaseCache
 * @extends {ShapeBufferCache<CurvedLineShape<ICurvedLineData>>}
 */
export class OuterRingInteractionsCache extends ShapeBufferCache<CurvedLineShape<ICurvedLineData>> {
  generate(data: IData, config: IChordChartConfig, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(data: IData, config: IChordChartConfig, selection: Selection) {
    const shapes = Array<any>();

    selection.getSelection<CurvedLineShape<any>>(SelectionType.MOUSEOVER_OUTER_RING).map(selected => {
      // Duplicate the curves with active color
      const curvedLine = new CurvedLineShape(
        CurveType.CircularCCW,
        {x: selected.p1.x, y: selected.p1.y},
        {x: selected.p2.x, y: selected.p2.y},
        [{x: selected.controlPoints[0].x, y: selected.controlPoints[0].y}],
        color,
        200,
      );

      curvedLine.lineWidth = lineWidth;
      curvedLine.depth = depth;
      shapes.push(curvedLine);
      debug(selected);

      // Draw related flows
      if (selected.d){
        const curveData = Array<any>();

        // First initialize any details not set in the endpoint
        data.endpoints.forEach(end => {
          end._inflowIdx = 0;
          end._outflowIdx = 0;
        });

        selected.d.relations.forEach((flow: any) => {
          const circleRadius = config.radius;
          const circleWidth = config.ringWidth;
          const endpoint = getEndpoint(data, flow.srcTarget);
          const destEndpoint = getEndpoint(data, flow.dstTarget);
          const controlPoint = {x: 0, y: 0};

          const calculatePoint2 = (radianAngle: number) => {
            const x = circleRadius * Math.cos(radianAngle);
            const y = circleRadius * Math.sin(radianAngle);
            return {x, y};
          };
          const p1 = calculatePoint2(destEndpoint.startAngle + config.space);
          const p2 = calculatePoint2(destEndpoint.endAngle - config.space);

          const destRing = new CurvedLineShape(
            CurveType.CircularCCW,
            {x: p1.x, y: p1.y},
            {x: p2.x, y: p2.y},
            [{x: controlPoint.x, y: controlPoint.y}],
            color,
            200,
          );

          destRing.lineWidth = config.ringWidth;
          destRing.depth = depth;

          shapes.push(destRing);

          if (destEndpoint){
            const p1FlowAngle = getFlowAngle(endpoint, endpoint._outflowIdx, config.space);
            const p1 = calculatePoint(circleRadius - circleWidth / 2, p1FlowAngle);
            const p2FlowAngle = getFlowAngle(destEndpoint,
               destEndpoint.outgoingCount + destEndpoint._inflowIdx, config.space);
            const p2 = calculatePoint(circleRadius + circleWidth / 2, p2FlowAngle);
            endpoint._outflowIdx++;
            destEndpoint._inflowIdx++;
            curveData.push({p1, p2, controlPoint, color});
          }

        });
        curveData.forEach(curve => {
          const curvedLine = new CurvedLineShape(
            CurveType.Bezier,
            {x: curve.p1.x, y: curve.p1.y}, {x: curve.p2.x, y: curve.p2.y},
            [{x: curve.controlPoint.x, y: curve.controlPoint.y}],
            color,
          );

          curvedLine.depth = lineDepth;
          shapes.push(curvedLine);
        });
      }
    });

    this.buffer = shapes;
  }
}
