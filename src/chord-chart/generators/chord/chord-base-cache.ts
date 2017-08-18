import { OuterRingGenerator } from 'chord-chart/generators/outer-ring/outer-ring-generator';
import { rgb, RGBColor } from 'd3-color';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { IPoint } from 'webgl-surface/primitives/point';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection, SelectionType } from '../../selections/selection';
import { IChordData } from '../../shape-data-types/chord-data';
import { IOuterRingData } from '../../shape-data-types/outer-ring-data';
import { getAncestor } from '../../util/endpointDataProcessing';
import { IChord, IChordChartConfig, IData, IEndpoint } from '../types';

const FADED_ALPHA = 0.1;
const UNFADED_ALPHA = 0.5;

export interface ICurveData {
  color: RGBColor;
  controlPoint: IPoint;
  destEndpoint: {};
  endpoint: {};
  p1: IPoint;
  p2: IPoint;
  source: IChord;
}

function getEndpoint(data: IData, targetName: string) {
  function isTarget(endpoint: IEndpoint) {
    return endpoint.id === targetName;
  }
  return data.endpoints.find(isTarget);
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
export class ChordBaseCache extends ShapeBufferCache<CurvedLineShape<IChordData>> {
  generate(data: IData, config: IChordChartConfig, outerRings: OuterRingGenerator, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(data: IData, config: IChordChartConfig, outerRings: OuterRingGenerator, selection: Selection) {
    const curves = this.preProcessData(data, config);

    // Map the outer rings by id
    const ringById = new Map<string, CurvedLineShape<IOuterRingData>>();

    outerRings.getBaseBuffer().forEach(ring => {
      ringById.set(ring.d.source.id, ring);
    });

    const curveShapes = curves.map((curve) => {
      const {r, g, b} = curve.color;
      const color = selection.getSelection(SelectionType.MOUSEOVER_CHORD).length > 0 ?
      rgb(r, g, b, FADED_ALPHA) :
      rgb(r, g, b, UNFADED_ALPHA);

      const newCurve = new CurvedLineShape<IChordData>(
        CurveType.Bezier,
        {x: curve.p1.x, y: curve.p1.y},
        {x: curve.p2.x, y: curve.p2.y},
        [{x: curve.controlPoint.x, y: curve.controlPoint.y}],
        color);

      // Set the relational and domain information for the chord
      newCurve.d = {
        outerRings: [
          ringById.get(curve.source.srcTarget),
          ringById.get(curve.source.dstTarget),
        ],
        source: curve.source,
      };

      // Apply the relational information to the outer rings as well
      newCurve.d.outerRings.forEach(ring => {
        ring.d.chords.push(newCurve);
      });

      newCurve.lineWidth = 3;

      return newCurve;
    });

    this.buffer = curveShapes;
  }

  /**
   * This processes the data to calculate initial needed metrics to make generating
   * shapes simpler.
   */
  preProcessData(data: IData, config: IChordChartConfig) {
    const {
      groupSplitDistance,
      outerRingSegmentPadding: segmentSpace,
      outerRingSegmentRowPadding: segmentRowPadding,
      radius: circleRadius,
      ringWidth,
      splitTopLevelGroups,
      topLevelGroupPadding: padding,
    } = config;

    const controlPoint = {x: 0, y: 0};
    const curveData: ICurveData[] = [];

    // First initialize any details not set in the endpoint
    data.endpoints.forEach(end => {
      end._inflowIdx = 0;
      end._outflowIdx = 0;
    });

    // Decide the moving direction of points based on segments they are in
    function getDirection(angle: number, trees: IEndpoint[]) {
      const tree = trees.find(t => t.startAngle <= angle && t.endAngle > angle);
      return tree.startAngle + 0.5 * (tree.endAngle - tree.startAngle);
    }

    function calculatePoint(radius: number, flowAngle: number, split: boolean) {
      let x = radius * Math.cos(flowAngle);
      let y = radius * Math.sin(flowAngle);

      if (split) {
        const halfAngle = getDirection(flowAngle, data.tree);
        x = radius * Math.cos(flowAngle) + groupSplitDistance * Math.cos(halfAngle);
        y = radius * Math.sin(flowAngle) + groupSplitDistance * Math.sin(halfAngle);
      }

      return {x, y};
    }

    // Loop thrugh each endpoint and analyze the flows
    data.endpoints.forEach((endpoint) => {
      data.flows.forEach((flow) => {
        if (flow.srcTarget === endpoint.id) {
          const destEndpoint = getEndpoint(data, flow.dstTarget);

          if (destEndpoint) {
            let p1FlowAngle = getFlowAngle(endpoint, endpoint._outflowIdx, segmentSpace);

            if (splitTopLevelGroups){
              const ancestor1 = getAncestor(endpoint, data.tree);
              const ancRange1 = ancestor1.endAngle - ancestor1.startAngle;
              const scale1 = (ancRange1 - padding) / ancRange1;

              p1FlowAngle =
              ancestor1.startAngle + padding / 2 + (p1FlowAngle - ancestor1.startAngle) * scale1;
            }

            const p1 = calculatePoint(
              circleRadius - 0.5 * ringWidth - segmentRowPadding,
              p1FlowAngle,
              splitTopLevelGroups,
            );

            // P2, destEnd
            let p2FlowAngle = getFlowAngle(
              destEndpoint,
              destEndpoint.totalCount - 1 - destEndpoint._inflowIdx,
              segmentSpace,
            );

            if (splitTopLevelGroups){
              const ancestor2 = getAncestor(destEndpoint, data.tree);
              const ancRange2 = ancestor2.endAngle - ancestor2.startAngle;
              const scale2 = (ancRange2 - padding) / ancRange2;

              p2FlowAngle =
              ancestor2.startAngle + padding / 2 + (p2FlowAngle - ancestor2.startAngle) * scale2;
            }

            const p2 = calculatePoint(
              circleRadius - 0.5 * ringWidth - segmentRowPadding,
              p2FlowAngle,
              splitTopLevelGroups,
            );

            const color = rgb(0.2, 0.3, 1.0, 1.0);
            endpoint._outflowIdx++;
            destEndpoint._inflowIdx++;

            curveData.push({
              color,
              controlPoint,
              destEndpoint,
              endpoint,
              p1,
              p2,
              source: flow,
            });
          }
        }
      });
    });

    return curveData;
  }
}
