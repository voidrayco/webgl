import { OuterRingGenerator } from 'chord-chart/generators/outer-ring/outer-ring-generator';
import { Color } from 'three';
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
  color: Color;
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
    const curves = this.preProcessData(data, config, outerRings);

    // Map the outer rings by id
    const ringById = new Map<string, CurvedLineShape<IOuterRingData>>();

    outerRings.getBaseBuffer().forEach(ring => {
      ringById.set(ring.d.source.id, ring);
    });

    const curveShapes = curves.map((curve) => {
      const {r, g, b} = curve.color;
      const color = new Color(r, g, b);
      const opacity = selection.getSelection(SelectionType.MOUSEOVER_CHORD).length > 0 ? FADED_ALPHA : UNFADED_ALPHA;

      // Configure the newly made curved line
      const newCurve = new CurvedLineShape<IChordData>({
        controlPoints: [{x: curve.controlPoint.x, y: curve.controlPoint.y}],
        end: {x: curve.p2.x, y: curve.p2.y},
        endColor: color,
        endOpacity: opacity,
        lineWidth: 3,
        start: {x: curve.p1.x, y: curve.p1.y},
        startColor: color,
        startOpacity: opacity,
        type: CurveType.Bezier,
      });

      // Set the relational and domain information for the chord
      newCurve.d = {
        outerRings: [
          ringById.get(curve.source.source),
          ringById.get(curve.source.target),
        ],
        source: curve.source,
      };

      // Apply the relational information to the outer rings as well
      newCurve.d.outerRings.forEach(ring => {
        ring.d.chords.push(newCurve);
      });

      return newCurve;
    });

    this.buffer = curveShapes;
  }

  /**
   * This processes the data to calculate initial needed metrics to make generating
   * shapes simpler.
   */
  preProcessData(data: IData, config: IChordChartConfig, outerRings: OuterRingGenerator) {
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
      data.chords.forEach((chord) => {
        if (chord.source === endpoint.id) {
          const destEndpoint = getEndpoint(data, chord.target);

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

            const color = outerRings.outerRingBase.shapeById.get(chord.source).color;
            endpoint._outflowIdx++;
            destEndpoint._inflowIdx++;

            curveData.push({
              color,
              controlPoint,
              destEndpoint,
              endpoint,
              p1,
              p2,
              source: chord,
            });
          }
        }
      });
    });

    return curveData;
  }
}
