import { color, rgb, RGBColor } from 'd3-color';
import { scaleOrdinal, schemeCategory20 } from 'd3-scale';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { IPoint } from 'webgl-surface/primitives/point';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection, SelectionType } from '../../selections/selection';
import { IOuterRingData } from '../../shape-data-types/outer-ring-data';
import { IChordChartConfig, IData, IEndpoint, IFlow } from '../types';

const debug = require('debug')('outer-ring-base');

const DEPTH = 21;
const FADED_ALPHA = 0.1;
const UNFADED_ALPHA = 1.0;

interface IEndPointMetrics {
  p1: IPoint,
  p2: IPoint,
  controlPoint: IPoint,
  color: RGBColor,
  flows: IFlow[],
  source: IEndpoint,
}

/**
 * Responsible for generating the static outer rings in the system
 *
 * @export
 * @class OuterRingBaseCache
 * @extends {ShapeBufferCache<CurvedLineShape<ICurvedLineData>>}
 */
export class OuterRingBaseCache extends ShapeBufferCache<CurvedLineShape<IOuterRingData>> {
  shapeById: Map<string, CurvedLineShape<IOuterRingData>>;

  generate(data: IData, config: IChordChartConfig, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(data: IData, config: IChordChartConfig, selection: Selection) {
    // CLear out our old mapping
    this.shapeById = new Map<string, CurvedLineShape<IOuterRingData>>();

    const circleRadius = config.radius;
    const segmentSpace: number = config.space; // It used to seperate segments
    const segments = this.preProcessData(data, circleRadius, segmentSpace);

    // Check if a selection exists such that the base needs to be faded
    const hasSelection =
      selection.getSelection(SelectionType.MOUSEOVER_CHORD).length > 0 ||
      selection.getSelection(SelectionType.MOUSEOVER_OUTER_RING).length > 0
    ;

    const circleEdges = segments.map((segment: IEndPointMetrics) => {
      const {r, g, b} = segment.color;
      const color = hasSelection ? rgb(r, g, b, FADED_ALPHA) : rgb(r, g, b, UNFADED_ALPHA);

      const curve = new CurvedLineShape<IOuterRingData>(
        CurveType.CircularCCW,
        {x: segment.p1.x, y: segment.p1.y},
        {x: segment.p2.x, y: segment.p2.y},
        [{x: segment.controlPoint.x, y: segment.controlPoint.y}],
        rgb(color.r, color.g, color.b, color.opacity),
        200,
      );

      curve.lineWidth = config.ringWidth;
      curve.depth = DEPTH;
      curve.d = {
        chords: [],
        source: segment.source,
      };

      // We map our shapes to the identifiers
      this.shapeById.set(segment.source.id, curve);

      return curve;
    });

    debug('Generated outer ring segments: %o edges: %o', segments, circleEdges);
    this.buffer = circleEdges;
  }

  // Data = d3chart.loadData();
  preProcessData(data: IData, circleRadius: number, segmentSpace: number): IEndPointMetrics[] {
    const controlPoint = {x: 0, y: 0};

    const calculatePoint = (radianAngle: number) => {
      const x = circleRadius * Math.cos(radianAngle);
      const y = circleRadius * Math.sin(radianAngle);
      return {x, y};
    };

    const ids = data.endpoints.map((endpoint) => endpoint.id);
    const calculateColor = scaleOrdinal(schemeCategory20).domain(ids);

    const segments = data.endpoints.map((endpoint) => {
      const p1 = calculatePoint(endpoint.startAngle + segmentSpace);
      const p2 = calculatePoint(endpoint.endAngle - segmentSpace);
      const colorVal = rgb(color(calculateColor(endpoint.id)));
      const flows = data.flows.filter((flow) => flow.srcTarget === endpoint.id);

      return {
        color: colorVal,
        controlPoint,
        flows,
        p1,
        p2,
        source: endpoint,
      };
    });

    return segments;
  }
}
