import { rgb, RGBColor } from 'd3-color';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { IPoint } from 'webgl-surface/primitives/point';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection } from '../../selections/selection';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';

const debug = require('debug')('chords');

export interface IData {
  endpoints: IEndpoint[];
  flows: IFlow[];
}

export interface IEndpoint {
  id: string;
  flowAngles: IFlowAngle;
  startAngle: number;
  endAngle: number;
  outgoingCount: number;
  incomingCount: number;
  _outflowIdx?: number;  // Default to 0
  _inflowIdx?: number;
}

interface IFlowAngle {
  angleStep: number;
  startAngle: number;
}

interface IFlow {
  srcExpandedTarget: string;
  srcTarget: string;
  destExpandedTarget: string;
  destTarget: string;
  srcIndex: number;
  dstIndex: number;
  baseColor: RGBColor;  // Is this what the data stores?
}

interface ICurveData {
  p1: IPoint;
  p2: IPoint;
  controlPoint: IPoint;
  color: RGBColor;
}

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

function getFlowAngle(endpoint: IEndpoint, flowIndex: number) {
  return endpoint.startAngle + (endpoint.flowAngles.angleStep * flowIndex);
}

/**
 * Responsible for generating the static chords in the system
 *
 * @export
 * @class ChordBaseCache
 * @extends {ShapeBufferCache<CurvedLineShape<ICurvedLineData>>}
 */
export class ChordBaseCache extends ShapeBufferCache<CurvedLineShape<ICurvedLineData>> {
  generate(data: IData, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(data: IData, selection: Selection) {
    const inactiveOpacity: number = 0.3;
    const activeOpacity: number = 1;
    const circleRadius = 200;

    const curves = this.preProcessData(data, circleRadius);
    const curveShapes = curves.map((curve) => {
      const {r, g, b} = curve.color;
      const color = selection ? rgb(r, g, b, inactiveOpacity) : rgb(r, g, b, activeOpacity);
      return new CurvedLineShape(CurveType.Bezier, {x: curve.p1.x, y: curve.p1.y}, {x: curve.p2.x, y: curve.p2.y},
        [{x: curve.controlPoint.x, y: curve.controlPoint.y}], color);
    });

    this.buffer = curveShapes;
    debug('Generated CurvedLines for base chord cache: %o', curveShapes);
  }

  // Data comes from catbird-ui >> d3Chart.loadData()
  preProcessData(data: IData, circleRadius: number) {
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
          const p1FlowAngle = getFlowAngle(endpoint, endpoint._outflowIdx);
          const p1 = calculatePoint(circleRadius, p1FlowAngle);
          const destEndpoint = getEndpoint(data, flow.destTarget);
          const p2FlowAngle = getFlowAngle(destEndpoint, destEndpoint.outgoingCount + destEndpoint._inflowIdx);
          const p2 = calculatePoint(circleRadius, p2FlowAngle);
          const color = flow.baseColor;
          endpoint._outflowIdx++;
          endpoint._inflowIdx++;
          curveData.push({p1, p2, controlPoint, color});
        }
      });
    });

    return curveData;
  }
}
