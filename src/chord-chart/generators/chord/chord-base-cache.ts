import { OuterRingGenerator } from 'chord-chart/generators/outer-ring/outer-ring-generator';
import { hsl, rgb } from 'd3-color';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection, SelectionType } from '../../selections/selection';
import { IChordData } from '../../shape-data-types/chord-data';
import { IOuterRingData } from '../../shape-data-types/outer-ring-data';
import { IChordChartConfig, ICurveData, IData, IEndpoint } from '../types';

const FADED_ALPHA = 0.1;
const UNFADED_ALPHA = 0.5;

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
    const circleRadius = config.radius;
    const circleWidth = config.ringWidth;
    const segmentSpace = config.space;
    const hemiSphere = config.hemiSphere;
    const hemiDistance = config.hemiDistance;

    const curves = this.preProcessData(
      data,
      circleRadius,
      circleWidth,
      segmentSpace,
      hemiSphere,
      hemiDistance,
    );

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

  // Data comes from catbird-ui >> d3Chart.loadData()
  preProcessData(data: IData, circleRadius: number, circleWidth: number, segmentSpace: number,
    hemiSphere: boolean, hemiDistance: number) {
    const controlPoint = {x: 0, y: 0};
    const curveData: ICurveData[] = [];

    // First initialize any details not set in the endpoint
    data.endpoints.forEach(end => {
      end._inflowIdx = 0;
      end._outflowIdx = 0;
    });

    // Decide the segments belong to left or right
    function inLeftHemi(startAngle: number, endAngle: number) {
      const halfAngle = startAngle + 0.5 * (endAngle - startAngle);
      if (halfAngle >= 0.5 * Math.PI && halfAngle <= 1.5 * Math.PI) return true;
      return false;
    }

    // Decide the moving direction of points based on segments they are in
    function getDirection(angle: number, trees: IEndpoint[]) {
      const tree = trees.find(t => t.startAngle <= angle && t.endAngle > angle);
      return tree.startAngle + 0.5 * (tree.endAngle - tree.startAngle);
    }

    function calculatePoint(radius: number, flowAngle: number, hemiSphere: boolean,
       inleft: boolean) {
      let x = radius * Math.cos(flowAngle);
      let y = radius * Math.sin(flowAngle);
      if (hemiSphere) {
        const halfAngle = getDirection(flowAngle, data.tree);
        x = radius * Math.cos(flowAngle) + hemiDistance * Math.cos(halfAngle);
        y = radius * Math.sin(flowAngle) + hemiDistance * Math.sin(halfAngle);
      }
      return {x, y};
    }
    // Loop thrugh each endpoint and analyze the flows
    data.endpoints.forEach((endpoint) => {
      data.flows.forEach((flow) => {
        if (flow.srcTarget === endpoint.id) {
          const destEndpoint = getEndpoint(data, flow.dstTarget);

          if (destEndpoint) {
            const p1FlowAngle = getFlowAngle(endpoint, endpoint._outflowIdx, segmentSpace);
            let isInLeft = inLeftHemi(
              endpoint.startAngle + segmentSpace,
              endpoint.endAngle - segmentSpace,
              );
            const p1 = calculatePoint(
              circleRadius - 0.5 * circleWidth ,
              p1FlowAngle,
              hemiSphere,
              isInLeft);

            const p2FlowAngle = getFlowAngle(
              destEndpoint,
              destEndpoint.totalCount - 1 - destEndpoint._inflowIdx,
              segmentSpace,
            );
            isInLeft = inLeftHemi(
              destEndpoint.startAngle + segmentSpace,
              destEndpoint.endAngle - segmentSpace,
            );
            const p2 = calculatePoint(
              circleRadius - 0.5 * circleWidth ,
              p2FlowAngle, hemiSphere,
              isInLeft,
            );

            const color = rgb(hsl(flow.baseColor.h, flow.baseColor.s, flow.baseColor.l));
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
