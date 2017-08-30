import { Color } from 'three';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Label } from 'webgl-surface/drawing/label';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { IPoint } from 'webgl-surface/primitives/point';
import { AnchorPosition } from 'webgl-surface/primitives/rotateable-quad';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection, SelectionType } from '../../selections/selection';
import { IOuterRingData } from '../../shape-data-types/outer-ring-data';
import { OuterRingGenerator } from '../outer-ring/outer-ring-generator';
import { IChordChartConfig, IData, IEndpoint } from '../types';
import { LabelGenerator } from './label-generator';

const debug = require('debug')('label-line-base-cache');

const DEPTH = 30;

function getDepthOfTree(tree: IEndpoint) {
  if (tree.children === undefined || tree.children.length === 0) return 1;
  let max = 0;
  tree.children.forEach((c) => {
    const temp = getDepthOfTree(c);
    if (temp > max) max = temp;
  });
  return max + 1;
}

/**
 * This takes in a ordinary circular angle and determines if the angle lies on
 * the right side of a circle.
 *
 * @param {number} angle The angle to test which hemisphere it lies on.
 *
 * @returns {boolean} True if the angle lies within the right hemisphere
 */
function isRightHemisphere(angle: number) {
  return (
    (angle >= -Math.PI / 2 && angle < Math.PI / 2) ||
    (angle > (3 * Math.PI) / 2)
  )
  ;
}

export class LabelLineBaseCache extends ShapeBufferCache<CurvedLineShape<IOuterRingData>> {
  generate(data: IData, outerRingGenerator: OuterRingGenerator, labelGenerator: LabelGenerator, config: IChordChartConfig, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(data: IData, outerRingGenerator: OuterRingGenerator, labelGenerator: LabelGenerator, config: IChordChartConfig, selection: Selection) {
    const {
      outerRingSegmentRowPadding: rowPadding,
      radius,
      ringWidth,
      splitTopLevelGroups,
      topLevelGroupPadding,
    } = config;

    const lines: CurvedLineShape<IOuterRingData>[] = [];
    const rings =  outerRingGenerator.getBaseBuffer();
    const labelLookup = labelGenerator.labelByString;
    const color = new Color(1, 1, 1);
    debug('rings are %o', rings);
    rings.forEach(ring => {
      const children = this.getChildrenFromTree(ring.d.source.name, data.tree);

      if (children.length > 0) {
        const maxOffset = this.getOffsetByName(ring.d.source.name, data.tree, labelLookup);

        const depth = data.topEndPointMaxDepth.get(
          data.topEndPointByEndPointId.get(ring.d.source.id),
        ) + 1;

        const padding = ringWidth + rowPadding;

        let p1: IPoint;

        if (splitTopLevelGroups) {
          const center = ring.controlPoints[1];

          let topEndPoint = data.topEndPointByEndPointId.get(ring.d.source.id);
          while (data.topEndPointByEndPointId.get(topEndPoint.parent)) {
            topEndPoint = data.topEndPointByEndPointId.get(topEndPoint.parent);
          }
          const ancestor = data.tree.filter((t) => t.id === topEndPoint.parent)[0];

          const ancRange = ancestor.endAngle - ancestor.startAngle;
          const scale = (ancRange - topLevelGroupPadding) / ancRange;

          const newStartAngle =
          ancestor.startAngle
          + topLevelGroupPadding / 2 + (ring.d.source.startAngle - ancestor.startAngle) * scale;
          const newEndAngle  =
          ancestor.startAngle
          + topLevelGroupPadding / 2 + (ring.d.source.endAngle - ancestor.startAngle) * scale;

          const anchor = isRightHemisphere((newStartAngle + newEndAngle) / 2) ? AnchorPosition.MiddleRight : AnchorPosition.MiddleLeft;

          if (anchor === AnchorPosition.MiddleRight) {
            p1 = {
              x: center.x + maxOffset + (padding * depth + radius) * Math.cos((newStartAngle + newEndAngle) / 2),
              y: center.y +  (padding * depth + radius) * Math.sin((newStartAngle + newEndAngle) / 2),
            };
          }
          else {
            p1 = {
              x: center.x - maxOffset + (padding * depth + radius) * Math.cos((newStartAngle + newEndAngle) / 2),
              y: center.y +  (padding * depth + radius) * Math.sin((newStartAngle + newEndAngle) / 2),
            };
          }

        }
        else {
          p1 = {
            x: (padding * depth + radius + maxOffset)
            * Math.cos((ring.d.source.startAngle + ring.d.source.endAngle) / 2),
            y: (padding * depth  + radius + maxOffset)
            * Math.sin((ring.d.source.startAngle + ring.d.source.endAngle) / 2),
          };
        }

        children.forEach(c => {
          const cLabel = new Label({baseLabel: labelLookup.get(c.name)});
          cLabel.setText(c.name);
          const offset = cLabel.width + this.getOffsetByName(c.name, data.tree, labelLookup);
          const childRing = rings.filter(r => r.d.source.name === c.name)[0];

          let p2: IPoint;

          if (splitTopLevelGroups) {
            const center = childRing.controlPoints[1];

            let topEndPoint = data.topEndPointByEndPointId.get(childRing.d.source.id);
            while (data.topEndPointByEndPointId.get(topEndPoint.parent)) {
              topEndPoint = data.topEndPointByEndPointId.get(topEndPoint.parent);
            }
            const ancestor = data.tree.filter((t) => t.id === topEndPoint.parent)[0];

            const ancRange = ancestor.endAngle - ancestor.startAngle;
            const scale = (ancRange - topLevelGroupPadding) / ancRange;

            const newStartAngle =
            ancestor.startAngle
            + topLevelGroupPadding / 2 + (childRing.d.source.startAngle - ancestor.startAngle) * scale;
            const newEndAngle  =
            ancestor.startAngle
            + topLevelGroupPadding / 2 + (childRing.d.source.endAngle - ancestor.startAngle) * scale;

            const anchor = isRightHemisphere((newStartAngle + newEndAngle) / 2) ? AnchorPosition.MiddleRight : AnchorPosition.MiddleLeft;

            if (anchor === AnchorPosition.MiddleRight) {
              p2 = {
                x: center.x + offset + (padding * depth + radius) * Math.cos((newStartAngle + newEndAngle) / 2),
                y: center.y +  (padding * depth + radius) * Math.sin((newStartAngle + newEndAngle) / 2),
              };
            }
            else {
              p2 = {
                x: center.x - offset + (padding * depth + radius) * Math.cos((newStartAngle + newEndAngle) / 2),
                y: center.y +  (padding * depth + radius) * Math.sin((newStartAngle + newEndAngle) / 2),
              };
            }
          }
          else {
            p2 = {
              x: (padding * depth + radius + offset)
              * Math.cos((childRing.d.source.startAngle + childRing.d.source.endAngle) / 2),
              y: (padding * depth + radius + offset)
              * Math.sin((childRing.d.source.startAngle + childRing.d.source.endAngle) / 2),
            };
          }

          const hasSelection =
          selection.getSelection(SelectionType.MOUSEOVER_CHORD).length > 0 ||
          selection.getSelection(SelectionType.MOUSEOVER_OUTER_RING).length > 0
        ;
          const opacity = hasSelection ? 0.3 : 1.0;
          const curve = new CurvedLineShape<IOuterRingData>({
            controlPoints: [],
            depth: DEPTH,
            end: {x: p2.x, y: p2.y},
            endOpacity: opacity,
            lineWidth: 1,
            start: {x: p1.x, y: p1.y},
            startColor: color,
            startOpacity: opacity,
            type: CurveType.Straight,
          });

          lines.push(curve);

        });

      }
    });

    debug('lines are %o', lines);
    this.buffer = lines;
  }

  // Get children of a node by name
  getChildrenFromTree(name: string, tree: IEndpoint[]) {
    const queue: IEndpoint[] = [];

    tree.forEach(t => queue.push(t));
    // BFS
    while (queue.length !== 0) {
      const q = queue.shift();
      if (q.name === name && q.children.length !== 0) {
        return q.children;
      }
      else {
        q.children.forEach(c => queue.push(c));
      }
    }
    return [];
  }

  // Get the max offset from all the children of the tree as its offset
  getOffsetByTree(tree: IEndpoint, labelLookup: Map<string, Label<any>>) {
    if (tree.children.length === 0) return 0;
    let max = 0;
    tree.children.forEach(c => {
      const label = new Label({baseLabel: labelLookup.get(c.name)});
      label.setText(c.name);
      const offset = label.width + this.getOffsetByTree(c, labelLookup) + 10;
      if (offset > max) max = offset;
    });
    return max;
  }

  // Get extra width added to a parent label by getting its children
  getOffsetByName(name: string, tree: IEndpoint[], labelLookup: Map<string, Label<any>>) {
    const queue: IEndpoint[] = [];
    tree.forEach(t => queue.push(t));
    // BFS
    while (queue.length !== 0) {
      const q = queue.shift();
      if (q.name === name && q.children.length !== 0) {
        return this.getOffsetByTree(q, labelLookup);
      }
      else {
        q.children.forEach(c => queue.push(c));
      }
    }
    return 0;
  }

}
