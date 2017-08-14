import { rgb, RGBColor } from 'd3-color';
import { Label } from 'webgl-surface/drawing/label';
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
  generate(data: IData, config: IChordChartConfig, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(data: IData, config: IChordChartConfig, selection: Selection){
    const inactiveOpacity: number = 0.3;
    const activeOpacity: number = 1;
    const defaultColor: RGBColor = rgb(1, 1, 1, 1);
    const labelsData = this.preProcessData(data, config);

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

      // If we're anchored at the middle left, we need to push a bit more outward
      // In order to account for the length of the text field
      if (labelData.anchor === AnchorPosition.MiddleLeft) {
        Point.add(
          labelData.point,
          Point.scale(
            labelData.direction,
            label.width,
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

      debug('label width after is %o', label.width);

      return label;
    });

    this.buffer = labels;
  }

  preProcessData(data: IData, config: IChordChartConfig) {
    const {
      center,
      radius,
      hemiDistance,
      hemiSphere,
      ringWidth,
    } = config;

    const hemisphereSpread = hemiSphere ? hemiDistance : 0;

    // This method is used to calculate where the anchor point location will be
    // For the label
    const calculatePoint = (endpoint: IEndpoint, direction: IPoint) => {
      // Start at negative one to account for the final ring not being rendered
      let depth = 0;
      // A holder to analyze the next endpoint parent
      let next = endpoint;

      // Find out how deep the given end point is
      while (next && next.parent) {
        depth++;
        next = data.endpointById.get(endpoint.parent);
      }

      console.log(endpoint, depth, data);

      // How much is the label pushed out to account for all of the ring levels rendered
      const ringPadding = ringWidth * depth;
      // Quick reference to the direction of the angle
      const dx = direction.x;
      const dy = direction.y;

      return {
        x: (radius * dx) + (ringPadding * dx) + (hemisphereSpread * dx) + center.x,
        y: (radius * dy) + (ringPadding * dy) + (hemisphereSpread * dy) + center.y,
      };
    };

    const labelData = data.endpoints.map((endpoint) => {
      // Calculate the middle of the end point's radians
      const startAngle = endpoint.startAngle;
      let angle = startAngle + (endpoint.endAngle - startAngle) / 2;
      // Make sure the angle lies within an ordinary circular range
      angle = ordinaryCircularAngle(angle);
      // Determine the anchor position based on whether the angle is on the left or right hemisphere
      const anchor = isRightHemisphere(angle) ? AnchorPosition.MiddleRight : AnchorPosition.MiddleLeft;

      // Generate a direction vector toward where the label should be located
      const direction = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };

      const point = calculatePoint(endpoint, direction);

      // If the label is to appear on the right side of the area, then we must
      // Rotate it by 180 degrees to have it render in the right location
      if (anchor === AnchorPosition.MiddleLeft) {
        angle += Math.PI;
      }

      return {
        anchor,
        angle,
        direction,
        name: endpoint.name,
        point,
      };
    });

    return labelData;
  }
}
