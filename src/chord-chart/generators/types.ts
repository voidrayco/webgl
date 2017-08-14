import { HSLColor, RGBColor } from 'd3-color';
import { IPoint } from 'webgl-surface/primitives/point';

export enum LabelDirectionEnum {
  LINEAR,
  RADIAL,
}

export interface IChordChartConfig {
  center: IPoint;
  hemiDistance: number;
  hemiSphere: boolean;
  labelDirection: LabelDirectionEnum;
  padding: number;
  radius: number;
  ringWidth: number;
  space: number;
}

export interface IData {
  tree: IEndpoint[];
  endpoints?: IEndpoint[];
  flows: IFlow[];
  endpointById: Map<string, IEndpoint>;
}

export interface IEndpoint {
  children?: IEndpoint[]
  id: string;
  name: string;
  startAngle: number;
  endAngle: number;
  outgoingCount: number;
  incomingCount: number;
  parent: string;
  totalCount: number;
  _outflowIdx?: number;  // Used for internal flow calculations
  _inflowIdx?: number;  // Used for internal flow calculations
  weight: number;
}

export interface IFlow {
  srcExpandedTarget: string;
  srcTarget: string;
  destExpandedTarget: string;
  dstTarget: string;
  srcIndex: number;
  dstIndex: number;
  baseColor: HSLColor;
}

export interface ICurveData {
  p1: IPoint;
  p2: IPoint;
  controlPoint: IPoint;
  color: RGBColor;
  endpoint: {};
  destEndpoint: {};
  source: IFlow;
}
