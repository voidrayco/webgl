import { HSLColor, RGBColor } from 'd3-color';
import { IPoint } from 'webgl-surface/primitives/point';

export enum LabelDirectionEnum {
  LINEAR,
  RADIAL,
}

/**
 * This defines the configuration properties the chord chart uses to alter how
 * it is being rendered.
 */
export interface IChordChartConfig {
  /** This sets the center of the circle */
  center: IPoint;
  /** This sets how far from the initial circle center groupings should be pushed away */
  groupSplitDistance: number;
  /** This sets how the labels are rotated (radiating out or straight) */
  labelDirection: LabelDirectionEnum;
  /** Sets the padding between outer ring segments (in radians) */
  outerRingSegmentPadding: number;
  /** Sets the padding between rows of outer ring segments (in pixels) */
  outerRingSegmentRowPadding: number;
  /** Sets the radius of the inner circle space where chords are drawn */
  radius: number;
  /** Sets the width of an outer ring */
  ringWidth: number;
  /** When true, the top level groupings will be split out by the group split distance */
  splitTopLevelGroups: boolean;
  /** This sets the padding (in radians) of the top level groupings of items */
  topLevelGroupPadding: number;
}

/**
 * This is the base raw data calculated for the chord chart
 */
export interface IData {
  tree: IEndpoint[];
  endpoints?: IEndpoint[];
  flows: IChord[];
  /** Quick look up for an end point by it's id */
  endpointById: Map<string, IEndpoint>;
  /** Get the top level end point for a given child end point's id */
  topEndPointByEndPointId: Map<string, IEndpoint>;
  /** Stores the max depth of a given top level end point */
  topEndPointMaxDepth: Map<IEndpoint, number>;
}

/**
 * This defines the raw data needed for an end point in the chord chart
 */
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

/**
 * This defines the raw data needed to render a chord in the chord chart
 */
export interface IChord {
  srcExpandedTarget: string;
  srcTarget: string;
  destExpandedTarget: string;
  dstTarget: string;
  srcIndex: number;
  dstIndex: number;
  baseColor: HSLColor;
}
