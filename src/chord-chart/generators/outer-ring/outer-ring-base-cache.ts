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
  id: string,
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
  generate(data: IData, config: IChordChartConfig, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(data: IData, config: IChordChartConfig, selection: Selection) {
    const circleRadius = config.radius;
    const segmentSpace: number = config.space; // It used to seperate segments
    const hemiSphere: boolean = config.hemiSphere;
    const hemiDistance: number = config.hemiDistance;
    const width: number = config.ringWidth;

    debug('data tree angles are %o  %o', data.tree[0].endAngle, data.tree[1].endAngle);

    debug('hemiSphere is %o', hemiSphere);

    const segments = this.preProcessData(data, circleRadius, segmentSpace, hemiSphere, hemiDistance, width);

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

      curve.lineWidth = width;
      curve.depth = DEPTH;
      curve.d = {
        chords: [],
        source: segment.source,
      };

      return curve;
    });

    debug('Generated outer ring segments: %o edges: %o', segments, circleEdges);
    this.buffer = circleEdges;
  }

  // Data = d3chart.loadData();
  preProcessData(
    data: IData,
    circleRadius: number,
    segmentSpace: number,
    hemiSphere: boolean,
    hemiDistance: number,
    width: number,
  ) {
    let controlPoint = {x: 0, y: 0};
    debug('data is %o', data);

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

    // Get depth of tree in order to render layers
    function getDepthOfTree(tree: IEndpoint) {
      if (tree.children === undefined || tree.children.length === 0) return 1;
      let max = 0;
      tree.children.forEach((c) => {
        const temp = getDepthOfTree(c);
        if (temp > max) max = temp;
      });
      return max + 1;
    }

    // Travel the tree to render three layers of ring
    function traverseTree(tree: IEndpoint[]) {
      let segments: IEndPointMetrics[] = [];

      tree.forEach((t) => {
        const depth = getDepthOfTree(t);
        debug('dept of %o is %o, start is %o, end is %o, parent is %o', t.id, depth, t.startAngle, t.endAngle, t.parent);
        if (depth > 1) {
          const startAngle = t.startAngle + segmentSpace;
          const endAngle = t.endAngle - segmentSpace;
          const isInLeft = inLeftHemi(startAngle, endAngle);

          const p1 = calculatePoint(circleRadius + (depth - 1) * (width + 2), startAngle, isInLeft);
          const p2 = calculatePoint(circleRadius + (depth - 1) * (width + 2), endAngle, isInLeft);

          if (hemiSphere) {
            const angle = t.startAngle + segmentSpace;
            const halfAngle = getDirection(angle, data.tree);
            controlPoint = {x: hemiDistance * Math.cos(halfAngle), y: hemiDistance * Math.sin(halfAngle)};
          }

          const colorVal = rgb(color(calculateColor(t.id)));
          const flows: IFlow[] = [];
          if (depth >= 2 && t.parent !== '') {
            segments.push({
              color: colorVal,
              controlPoint,
              flows,
              id: t.id,
              p1,
              p2,
              source: t,
            });
          }

          const childSegments = traverseTree(t.children);
          debug('childsegment are %o, parents are %o', childSegments, t.id);
          segments = segments.concat(childSegments);
        }
      });

      return segments;

    }

    const calculatePoint = (radius: number, radianAngle: number, inLeft: boolean) => {
      let x = radius * Math.cos(radianAngle);
      let y = radius * Math.sin(radianAngle);
      // Change the position in hemiSphere
      if (hemiSphere) {
        const halfAngle = getDirection(radianAngle, data.tree);
        x = radius * Math.cos(radianAngle) + hemiDistance * Math.cos(halfAngle);
        y = radius * Math.sin(radianAngle) + hemiDistance * Math.sin(halfAngle);
      }
      return {x, y};
    };

    const ids = data.endpoints.map((endpoint) => endpoint.id);
    const calculateColor = scaleOrdinal(schemeCategory20).domain(ids);

    const segments = data.endpoints.map((endpoint) => {
      const startAngle = endpoint.startAngle + segmentSpace;
      const endAngle = endpoint.endAngle - segmentSpace;
      const isInLeft = inLeftHemi(startAngle, endAngle);
      const p1 = calculatePoint(circleRadius, startAngle, isInLeft);
      const p2 = calculatePoint(circleRadius, endAngle, isInLeft);
      // Change controlPoint in hemiSphere
      debug('id is %o', endpoint.id);
      if (hemiSphere) {
        const angle = endpoint.startAngle + segmentSpace;
        const halfAngle = getDirection(angle, data.tree);
        controlPoint = {x: hemiDistance * Math.cos(halfAngle), y: hemiDistance * Math.sin(halfAngle)};
      }
      const colorVal = rgb(color(calculateColor(endpoint.id)));
      const flows = data.flows.filter((flow) => flow.srcTarget === endpoint.id);

      return {
        color: colorVal,
        controlPoint,
        flows,
        id: endpoint.id,
        p1,
        p2,
        source: endpoint,
      };
    });

    const segments2 = traverseTree(data.tree);

    return segments.concat(segments2);
  }
}
