import { RGBColor } from 'd3-color';
import { IPoint } from 'webgl-surface/primitives/point';

export interface IChordChartConfig {
  radius: number
}

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

export interface IFlowAngle {
  angleStep: number;
  startAngle: number;
}

export interface IFlow {
  srcExpandedTarget: string;
  srcTarget: string;
  destExpandedTarget: string;
  destTarget: string;
  srcIndex: number;
  dstIndex: number;
  baseColor: RGBColor;  // Is this what the data stores?
}

export interface ICurveData {
  p1: IPoint;
  p2: IPoint;
  controlPoint: IPoint;
  color: RGBColor;
}