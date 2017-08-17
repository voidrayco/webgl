import { color, rgb, RGBColor } from 'd3-color';
import { scaleOrdinal, schemeCategory20 } from 'd3-scale';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { IPoint } from 'webgl-surface/primitives/point';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection, SelectionType } from '../../selections/selection';
import { IOuterRingData } from '../../shape-data-types/outer-ring-data';
import { getAncestor } from '../../util/endpointDataProcessing';
import { IChord, IChordChartConfig, IData, IEndpoint } from '../types';

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
  flows: IChord[],
  source: IEndpoint,
}

/**
 * Responsible for generating the static outer rings in the system
 */
export class OuterRingBaseCache extends ShapeBufferCache<CurvedLineShape<IOuterRingData>> {
  generate(data: IData, config: IChordChartConfig, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(data: IData, config: IChordChartConfig, selection: Selection) {
    const { ringWidth } = config;

    const segments = this.preProcessData(data, config);

    // Check if a selection exists such that the base needs to be faded
    const hasSelection =
      selection.getSelection(SelectionType.MOUSEOVER_CHORD).length > 0 ||
      selection.getSelection(SelectionType.MOUSEOVER_OUTER_RING).length > 0
    ;

    const circleEdges = segments.map((segment: IEndPointMetrics) => {
      const { r, g, b } = segment.color;
      const color = hasSelection ? rgb(r, g, b, FADED_ALPHA) : rgb(r, g, b, UNFADED_ALPHA);

    const curve = new CurvedLineShape<IOuterRingData>(
        CurveType.CircularCCW,
        {x: segment.p1.x, y: segment.p1.y},
        {x: segment.p2.x, y: segment.p2.y},
        [{x: segment.controlPoint.x, y: segment.controlPoint.y}],
        rgb(color.r, color.g, color.b, color.opacity),
        200,
      );

      curve.lineWidth = ringWidth;
      curve.depth = DEPTH;
      curve.d = {
        chords: [],
        source: segment.source,
      };
      debug('curve is %o x: %o y: %o width:%o height:%o  bottom:%o', segment.source.name, curve.x, curve.y, curve.width, curve.height, curve.bottom);

      return curve;
    });

    debug('Generated outer ring segments: %o edges: %o', segments, circleEdges);
    this.buffer = circleEdges;
  }

  /**
   * This processes the data to calculate initial needed metrics to make generating
   * shapes simpler.
   */
  preProcessData(data: IData, config: IChordChartConfig) {
    const {
      groupSplitDistance,
      outerRingSegmentPadding: segmentPadding,
      outerRingSegmentRowPadding: segmentRowPadding,
      radius: circleRadius,
      ringWidth,
      splitTopLevelGroups: splitGroups,
      topLevelGroupPadding: padding,
    } = config;

    const paddedRingWidth = ringWidth + segmentRowPadding;
    let controlPoint = {x: 0, y: 0};
    debug('data is %o', data);

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

        if (depth > 1) {
          const startAngle = t.startAngle + segmentPadding;
          const endAngle = t.endAngle - segmentPadding;
          let p1 = calculatePoint(circleRadius + (depth - 1) * paddedRingWidth, startAngle);
          let p2 = calculatePoint(circleRadius + (depth - 1) * paddedRingWidth, endAngle);

          if (splitGroups) {
            const ancestor = getAncestor(t, data.tree);
            debug('ancestor is %o,t is %o', ancestor, t);

            if (ancestor !== undefined) {
              const ancRange = ancestor.endAngle - ancestor.startAngle;
              const scale = (ancRange - padding) / ancRange;

              const newStartAngle =
                ancestor.startAngle + padding / 2 + (startAngle - ancestor.startAngle) * scale;
              const newEndAngle  =
                ancestor.startAngle + padding / 2 + (endAngle - ancestor.startAngle) * scale;

              p1 = calculatePoint(circleRadius + (depth - 1) * paddedRingWidth, newStartAngle);
              p2 = calculatePoint(circleRadius + (depth - 1) * paddedRingWidth, newEndAngle);

            }

            else {
              const ancRange = t.endAngle - t.startAngle;
              const scale = (ancRange - padding) / ancRange;
              const newStartAngle = t.startAngle + padding / 2 + (startAngle - t.startAngle) * scale;
              const newEndAngle  = t.startAngle + padding / 2 + (endAngle - t.startAngle) * scale;

              p1 = calculatePoint(circleRadius + (depth - 1) * paddedRingWidth, newStartAngle);
              p2 = calculatePoint(circleRadius + (depth - 1) * paddedRingWidth, newEndAngle);
            }

            const angle = t.startAngle + segmentPadding;
            const halfAngle = getDirection(angle, data.tree);

            controlPoint = {
              x: groupSplitDistance * Math.cos(halfAngle),
              y: groupSplitDistance * Math.sin(halfAngle),
            };
          }

          const colorVal = rgb(color(calculateColor(t.id)));
          const flows: IChord[] = [];

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
          segments = segments.concat(childSegments);
        }
      });

      return segments;
    }

    const calculatePoint = (radius: number, radianAngle: number) => {
      let x = radius * Math.cos(radianAngle);
      let y = radius * Math.sin(radianAngle);
      // Change the position in hemiSphere
      if (splitGroups) {
        const halfAngle = getDirection(radianAngle, data.tree);
        x = radius * Math.cos(radianAngle) + groupSplitDistance * Math.cos(halfAngle);
        y = radius * Math.sin(radianAngle) + groupSplitDistance * Math.sin(halfAngle);
      }
      return {x, y};
    };

    const ids = data.endpoints.map((endpoint) => endpoint.id);
    const calculateColor = scaleOrdinal(schemeCategory20).domain(ids);

    const segments = data.endpoints.map((endpoint) => {
      const startAngle = endpoint.startAngle + segmentPadding;
      const endAngle = endpoint.endAngle - segmentPadding;
      let p1 = calculatePoint(circleRadius, startAngle);
      let p2 = calculatePoint(circleRadius, endAngle);

      // Change controlPoint in hemiSphere
      if (splitGroups) {
        const ancestor = getAncestor(endpoint, data.tree);

        const ancRange = ancestor.endAngle - ancestor.startAngle;
        const scale = (ancRange - padding) / ancRange;

        const newStartAngle =
        ancestor.startAngle + padding / 2 + (startAngle - ancestor.startAngle) * scale;
        const newEndAngle  =
        ancestor.startAngle + padding / 2 + (endAngle - ancestor.startAngle) * scale;

        p1 = calculatePoint(circleRadius, newStartAngle);
        p2 = calculatePoint(circleRadius, newEndAngle);

        const angle = endpoint.startAngle + segmentPadding;
        const halfAngle = getDirection(angle, data.tree);
        controlPoint = {x: groupSplitDistance * Math.cos(halfAngle), y: groupSplitDistance * Math.sin(halfAngle)};
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
