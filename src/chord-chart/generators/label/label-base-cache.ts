import { OuterRingGenerator } from 'chord-chart/generators/outer-ring/outer-ring-generator';
import { rgb, RGBColor } from 'd3-color';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Label } from 'webgl-surface/drawing/label';
import { Line } from 'webgl-surface/primitives/line';
import { IPoint, Point } from 'webgl-surface/primitives/point';
import { AnchorPosition } from 'webgl-surface/primitives/rotateable-quad';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection } from '../../selections/selection';
import { IOuterRingData } from '../../shape-data-types/outer-ring-data';
import { IChordChartConfig, IData, IEndpoint, LabelDirectionEnum } from '../types';
const debug = require('debug')('label');

/**
 * This calculates the equivalent angle to where it is bounded between
 * 0 and 2*pi
 */
function ordinaryCircularAngle(angle: number) {
  while (angle > 2 * Math.PI) {
    angle -= 2 * Math.PI;
  }

  while (angle < 0) {
    angle += 2 * Math.PI;
  }

  return angle;
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
    (angle >= 0 && angle < Math.PI / 2) ||
    (angle > (3 * Math.PI) / 2)
  )
  ;
}

/**
 * Responsible for generating the static labels around the chart
 *
 * @export
 * @class LabelBaseCache
 * @extends {ShapeBufferCache<Label<ICurvedLineData>>}
 */
export class LabelBaseCache extends ShapeBufferCache<Label<IOuterRingData>> {
  generate(data: IData, outerRingGenerator: OuterRingGenerator, config: IChordChartConfig, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(data: IData, outerRingGenerator: OuterRingGenerator, config: IChordChartConfig, selection: Selection) {
    const inactiveOpacity: number = 0.3;
    const activeOpacity: number = 1;
    const defaultColor: RGBColor = rgb(1, 1, 1, 1);
    const labelsData = this.preProcessData(data, outerRingGenerator.getBaseBuffer(), config);

    const labels = labelsData.map((labelData) => {
      const {r, g, b} = defaultColor;
      const color = selection.getSelection('chord or ring mouse over').length > 0 ?
        rgb(r, g, b, inactiveOpacity) :
        rgb(r, g, b, activeOpacity)
      ;

      const label = new Label<any>({
        color: color,
        fontSize: 14,
        text: labelData.name,
      });

      label.width = label.text.length * label.fontSize;

      // If we're anchored at the middle left, we need to push a bit more outward
      // In order to account for the length of the text field
      if (!config.hemiSphere) {
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

    this.buffer = labels;
  }

  preProcessData(data: IData, outerRings: CurvedLineShape<IOuterRingData>[], config: IChordChartConfig) {
    const {
      radius,
      ringWidth,
      hemiSphere,
      padding,
    } = config;

    // This method is used to calculate where the anchor point location will be
    // For the label
    const calculatePoint = (endpoint: IEndpoint, direction: IPoint, center: IPoint) => {
      // Get the depth of the ring's top level end point
      const depth = data.topEndPointMaxDepth.get(
        data.topEndPointByEndPointId.get(endpoint.id),
      ) + 1;
      // How much is the label pushed out to account for all of the ring levels rendered
      const ringPadding = ringWidth * depth;
      // Quick reference to the direction of the angle
      const dx = direction.x;
      const dy = direction.y;
      // The distance from the center we should be
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

      const center = ring.controlPoints[1];

      // Make a line between the end points
      let ringLine: Line<any> = new Line<any>(ring.p1, ring.p2);

      if (hemiSphere){
        let topEndPoint = data.topEndPointByEndPointId.get(ring.d.source.id);
        while (data.topEndPointByEndPointId.get(topEndPoint.parent)){
          topEndPoint = data.topEndPointByEndPointId.get(topEndPoint.parent);
        }
        const ancestor = data.tree.filter((t) => t.id === topEndPoint.parent)[0];

        const ancRange = ancestor.endAngle - ancestor.startAngle;
        const scale = (ancRange - padding) / ancRange;

        const newStartAngle =
        ancestor.startAngle + padding / 2 + (ring.d.source.startAngle - ancestor.startAngle) * scale;
        const newEndAngle  =
        ancestor.startAngle + padding / 2 + (ring.d.source.endAngle - ancestor.startAngle) * scale;

        const p1 = {
          x: center.x + radius * Math.cos(newStartAngle),
          y: center.y + radius * Math.sin(newStartAngle),
        };
        const p2 = {
          x: center.x + radius * Math.cos(newEndAngle),
          y: center.y + radius * Math.sin(newEndAngle),
        };
        ringLine = new Line<any>(p1, p2);
        debug('ringline is %o', ringLine);
      }

      // Get the mid point and use the circle center to get the direction
      // Vector needed to find the point in the middle of the arc
      const direction = Point.getDirection(
        center,
        ringLine.mid,
        true,
      );

      // Get the angle derived from the direction we figured
      let angle = ordinaryCircularAngle(Math.atan2(direction.y, direction.x));
      // Determine the anchor position based on whether the angle is on the left or right hemisphere
      const anchor = isRightHemisphere(angle) ? AnchorPosition.MiddleRight : AnchorPosition.MiddleLeft;
      // Calculate the point the anchor of the label should be located
      const point = calculatePoint(ring.d.source, direction, center);

      // If the label is to appear on the right side of the area, then we must
      // Rotate it by 180 degrees to have it render in the right location
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
