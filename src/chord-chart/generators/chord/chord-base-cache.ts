import { rgb, RGBColor } from 'd3-color';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { IPoint } from 'webgl-surface/primitives/point';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';

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

  // Data comes from catbird-ui >> d3Chart.loadData()
  preProcessData(data: IData, circleRadius: number) {
    const controlPoint = {x: 0, y: 0};

    const getEndpoint = (targetName: string) => {
      function isTarget(endpoint: IEndpoint) {
        return endpoint.id === targetName;
      }
      return data.endpoints.find(isTarget);
    };
    const getFlowAngle = (endpoint: IEndpoint, flowIndex: number) => endpoint.startAngle + (endpoint.flowAngles.angleStep * flowIndex);
    const calculatePoint = (flowAngle: number) => {
      const x = circleRadius * Math.cos(flowAngle);
      const y = circleRadius * Math.sin(flowAngle);
      return {x, y};
    };

    const curveData: ICurveData[] = [];
    data.endpoints.forEach((endpoint) => {
      data.flows.forEach((flow) => {
        if (flow.srcTarget === endpoint.id){
          const p1 = calculatePoint(getFlowAngle(endpoint, endpoint._outflowIdx));
          const destEndpoint = getEndpoint(flow.destTarget);
          const p2 = calculatePoint(getFlowAngle(destEndpoint, destEndpoint.outgoingCount + destEndpoint._inflowIdx));
          const color = flow.baseColor;
          endpoint._outflowIdx++;
          endpoint._inflowIdx++;
          curveData.push({p1, p2, controlPoint, color});
        }
      });
    });

    return curveData;
  }

  buildCache(data: IData, selection: Selection) {
    const inactiveOpacity: number = 0.3;
    const activeOpacity: number = 1;
    const circleRadius = 10;

    const curves = this.preProcessData(data, circleRadius);
    const curveShapes = curves.map((curve) => {
      const {r, g, b} = curve.color;
      const color = selection ? rgb(r, g, b, inactiveOpacity) : rgb(r, g, b, activeOpacity);
      return new CurvedLineShape(CurveType.Bezier, {x: curve.p1.x, y: curve.p1.y}, {x: curve.p2.x, y: curve.p2.y},
        [{x: curve.controlPoint.x, y: curve.controlPoint.y}], color);
    });

    this.buffer = curveShapes;
  }
}
