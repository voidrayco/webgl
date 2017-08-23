import { OuterRingGenerator } from 'chord-chart/generators/outer-ring/outer-ring-generator';
import { Color } from 'three';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Label } from 'webgl-surface/drawing/label';
import { Line } from 'webgl-surface/primitives/line';
import { IPoint, Point } from 'webgl-surface/primitives/point';
import { AnchorPosition } from 'webgl-surface/primitives/rotateable-quad';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection, SelectionType } from '../../selections/selection';
import { IOuterRingData } from '../../shape-data-types/outer-ring-data';
import { IChordChartConfig, IData, IEndpoint, LabelDirectionEnum } from '../types';
const debug =  require('debug')('label_interactive_cache');

const defaultColor: Color = new Color(1, 1, 1);

function ordinaryCircularAngle(angle: number) {
  while (angle > 2 * Math.PI) {
    angle -= 2 * Math.PI;
  }

  while (angle < 0) {
    angle += 2 * Math.PI;
  }

  return angle;
}

function isRightHemisphere(angle: number) {
  return (
    (angle >= 0 && angle < Math.PI / 2) ||
    (angle > (3 * Math.PI) / 2)
  )
  ;
}

export class LabelInteractionCache extends ShapeBufferCache<Label<IOuterRingData>>{
    generate(data: IData, outerRingGenerator: OuterRingGenerator, config: IChordChartConfig, labelLookup: Map<string, Label<any>>, selection: Selection){
        super.generate.apply(this, arguments);
    }

    buildCache(data: IData, outerRingGenerator: OuterRingGenerator, config: IChordChartConfig, labelLookup: Map<string, Label<any>>, selection: Selection){
        debug('selection is %o', selection);

        const selectedCurve =
        selection.getSelection<CurvedLineShape<IOuterRingData>>(SelectionType.MOUSEOVER_OUTER_RING);

        const labelsData = this.preProcessData(data, selectedCurve, config);

        const labels = labelsData.map((labelData) => {
            const {r, g, b} = defaultColor;
            const color = new Color(r, g, b);
            const label = new Label<any>({
                a: 1.0,
                baseLabel: labelLookup.get(labelData.name),
                color: color,
            });

            label.width = label.text.length * label.fontSize;

            if (!config.splitTopLevelGroups) {
                if (labelData.anchor === AnchorPosition.MiddleLeft) {
                    Point.add(
                    labelData.point,
                    Point.scale(
                        labelData.direction,
                        label.width / 2,
                    ),
                labelData.point,
                );
                }
                else {
                    Point.add(
                    labelData.point,
                    Point.scale(
                        labelData.direction,
                        - label.width / 2,
                    ),
                    labelData.point,
                );
                }
            }
            else {
                Point.add(
                labelData.point,
                Point.scale(
                    Point.make(-1, 0),
                    label.width / 2,
                ),
                labelData.point,
            );
        }

      label.rasterizationOffset.y = 10.5;
      label.rasterizationOffset.x = 0.5;
      label.rasterizationPadding.height = -10;
      label.rasterizationPadding.width = 4;
      label.setAnchor(labelData.anchor);
      label.setLocation(labelData.point);
      label.setRotation(labelData.angle);

      if (config.labelDirection === LabelDirectionEnum.LINEAR) {
        label.setRotation(0);
      }

      return label;
        });
        debug('selectedCurve is %o', selectedCurve);
        this.buffer = labels;
    }

    preProcessData(data: IData, outerRings: CurvedLineShape<IOuterRingData>[], config: IChordChartConfig){
        const {
            outerRingSegmentRowPadding: rowPadding,
            radius,
            ringWidth,
            splitTopLevelGroups,
            topLevelGroupPadding,
        } = config;

        const paddedRingWidth = ringWidth + rowPadding;

        const calculatePoint = (endpoint: IEndpoint, direction: IPoint, center: IPoint) => {
         const depth = data.topEndPointMaxDepth.get(
             data.topEndPointByEndPointId.get(endpoint.id),
         ) + 1;

         const ringPadding = paddedRingWidth * depth;

         const dx = direction.x;
         const dy = direction.y;

         const distance = radius + ringPadding;

         return {
             x: (distance * dx) + center.x,
             y: (distance * dy) + center.y,
         };
        };

        const labelData = outerRings.map((ring: CurvedLineShape<IOuterRingData>) => {
            // Do not render children that have children
            if (ring.d.source.children.length > 0) {
            return null;
        }

      const center = ring.controlPoints[0];

      let ringLine: Line<any> = new Line<any>(ring.p1, ring.p2);

      if (splitTopLevelGroups){
        let topEndPoint = data.topEndPointByEndPointId.get(ring.d.source.id);
        while (data.topEndPointByEndPointId.get(topEndPoint.parent)){
          topEndPoint = data.topEndPointByEndPointId.get(topEndPoint.parent);
        }
        const ancestor = data.tree.filter((t) => t.id === topEndPoint.parent)[0];

        const ancRange = ancestor.endAngle - ancestor.startAngle;
        const scale = (ancRange - topLevelGroupPadding) / ancRange;

        const newStartAngle =
        ancestor.startAngle + topLevelGroupPadding / 2 + (ring.d.source.startAngle - ancestor.startAngle) * scale;
        const newEndAngle  =
        ancestor.startAngle + topLevelGroupPadding / 2 + (ring.d.source.endAngle - ancestor.startAngle) * scale;

        const p1 = {
          x: center.x + radius * Math.cos(newStartAngle),
          y: center.y + radius * Math.sin(newStartAngle),
        };
        const p2 = {
          x: center.x + radius * Math.cos(newEndAngle),
          y: center.y + radius * Math.sin(newEndAngle),
        };
        ringLine = new Line<any>(p1, p2);
      }

      const direction = Point.getDirection(
        center,
        ringLine.mid,
        true,
      );

      let angle = ordinaryCircularAngle(Math.atan2(direction.y, direction.x));
      const anchor = isRightHemisphere(angle) ? AnchorPosition.MiddleRight : AnchorPosition.MiddleLeft;
      const point = calculatePoint(ring.d.source, direction, center);

      if (anchor === AnchorPosition.MiddleLeft) {
        angle += Math.PI;
      }

      return {
        anchor,
        angle,
        direction,
        name: ring.d.source.name,
        point,
      };
    })
    // Clean out null values
    .filter(Boolean)
    ;

    return labelData;
  }
}
