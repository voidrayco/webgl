import { rgb, RGBColor } from 'd3-color';
import { Label } from 'webgl-surface/drawing/label';
import { AnchorPosition } from 'webgl-surface/primitives/rotateable-quad';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection } from '../../selections/selection';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';
import { IChordChartConfig, IData } from '../types';
const debug = require('debug')('label');
/**
 * Responsible for generating the static outer rings in the system
 *
 * @export
 * @class LabelBaseCache
 * @extends {ShapeBufferCache<Label<ICurvedLineData>>}
 */
export class LabelBaseCache extends ShapeBufferCache<Label<ICurvedLineData>> {
  generate(data: IData, config: IChordChartConfig, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(data: IData, config: IChordChartConfig, selection: Selection){
    const inactiveOpacity: number = 0.3;
    const activeOpacity: number = 1;
    const circleRadius = config.radius;
    const defaultColor: RGBColor = rgb(1, 1, 1, 1);  // TODO: Need to calculate somehow
    const hemiSphere = config.hemiSphere;
    const hemiDistance = config.hemiDistance;

    const labelsData = this.preProcessData(data, circleRadius, hemiSphere, hemiDistance);
    const labels = labelsData.map((labelData) => {
      const {r, g, b} = defaultColor;
      const color = selection.getSelection('chord or ring mouse over').length > 0 ?
        rgb(r, g, b, inactiveOpacity) :
        rgb(r, g, b, activeOpacity)
      ;
      const point = {x: labelData.point.x, y: labelData.point.y};

      const label = new Label<any>({
        color: color,
        fontSize: 14,
        text: labelData.name,
      });
      const width = label.getSize().width + config.ringWidth;
      const height = label.fontSize;
      debug('height is %o', height);
      if (labelData.anchor === AnchorPosition.MiddleLeft){
        if (!hemiSphere){
          point.x = point.x - width * Math.cos(labelData.angle)
        - 0.5 * height * Math.cos(labelData.angle + 0.5 * Math.PI);
          point.y = point.y - width * Math.sin(labelData.angle)
        - 0.5 * height * Math.sin(labelData.angle + 0.5 * Math.PI);
        }else{
          labelData.angle -= Math.PI;
          point.x = point.x + config.ringWidth * Math.cos(labelData.angle) - width ;
          point.y = point.y + config.ringWidth * Math.sin(labelData.angle) - height / 2;
        }
      }
      if (labelData.anchor === AnchorPosition.MiddleRight){
        if (!hemiSphere){
          point.x = point.x + 0.5 * config.ringWidth * Math.cos(labelData.angle)
        - 0.5 * height * Math.cos(labelData.angle + 0.5 * Math.PI);
          point.y = point.y + 0.5 * config.ringWidth * Math.sin(labelData.angle)
        - 0.5 * height * Math.sin(labelData.angle + 0.5 * Math.PI);
        }else{
          point.x = point.x + config.ringWidth * Math.cos(labelData.angle);
          point.y = point.y + config.ringWidth * Math.sin(labelData.angle) - height / 2;
        }
      }

      label.rasterizationOffset.y = 10.5;
      label.rasterizationOffset.x = 0.5;
      label.rasterizationPadding.height = -10;
      label.rasterizationPadding.width = 4;
      label.setLocation(point);
      label.setRotation(labelData.angle);
      if (hemiSphere)label.setRotation(0);
      label.setAnchor(labelData.anchor);
      debug('label width after is %o', label.width);
      return label;
    });

    this.buffer = labels;
  }

  // Data = d3chart.loadData();
  preProcessData(data: IData, circleRadius: number, hemiSphere: boolean, hemiDistance: number) {
    // Const controlPoint = {x: 0, y: 0};

    function adjustAngle(angle: number){
      if (angle < 0)angle += 2 * Math.PI;
      else if (angle > 2 * Math.PI)angle -= 2 * Math.PI;
      return angle;
    }

    const calculatePoint = (radianAngle: number) => {
      radianAngle = adjustAngle(radianAngle);
      let x = circleRadius * Math.cos(radianAngle);
      const y = circleRadius * Math.sin(radianAngle);
      if (hemiSphere){
        if ((radianAngle >= 0 && radianAngle < Math.PI / 2) ||
           (radianAngle >= Math.PI * 3 / 2 && radianAngle < Math.PI * 2)){
            x = circleRadius * Math.cos(radianAngle) + hemiDistance;
        }else{
            x = circleRadius * Math.cos(radianAngle) - hemiDistance;
        }
      }
      return {x, y};
    };

    const labelData = data.endpoints.map((endpoint) => {
        const startAngle = endpoint.startAngle;
        debug('startAngle is %o', startAngle);
        let angle = startAngle + (endpoint.endAngle - startAngle) / 2;
        debug('angle is %o', angle);
        let angleIntersection =  angle ;
        // MiddleRight if angle in left hemisphere. else middleLeft
        if (angle > 2 * Math.PI)angle -= 2 * Math.PI;
        if (angle < 0) angle += 2 * Math.PI;
        const anchor = (angle >= 0 && angle < Math.PI / 2)
          || (angle > (3 * Math.PI) / 2) && angle <= (2 * Math.PI) ?
          AnchorPosition.MiddleRight : AnchorPosition.MiddleLeft;
        debug('anchor is %o', anchor);
        if (anchor === AnchorPosition.MiddleLeft)angleIntersection += Math.PI;
        const point = calculatePoint(angle);
        return {point, angle: angleIntersection, anchor, name: endpoint.name};
    });

    return labelData;
  }
}
