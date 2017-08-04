import { HSLColor, RGBColor } from 'd3-color';
import { IPoint } from 'webgl-surface/primitives/point';

export interface IChordChartConfig {
  radius: number;
  ringWidth: number;
  space: number;
}

export interface IData {
  endpoints: IEndpoint[];
  flows: IFlow[];
}

export interface IEndpoint {
  id: string;
  name: string;
  flowAngles: IFlowAngle;
  startAngle: number;
  endAngle: number;
  outgoingCount: number;
  incomingCount: number;
  totalCount: number;
  _outflowIdx?: number;  // Default to 0
  _inflowIdx?: number;
}

export interface IFlowAngle {
  angleStep: number;
  startAngle: number;
}

export interface IFlow {
  srcExpandedTarget: string;
  srcTarget: string;
  destExpandedTarget: string;
  dstTarget: string;
  srcIndex: number;
  dstIndex: number;
  baseColor: HSLColor;  // Is this what the data stores?
}

export interface ICurveData {
  p1: IPoint;
  p2: IPoint;
  controlPoint: IPoint;
  color: RGBColor;
  endpoint: {};
  destEndpoint: {};
}
