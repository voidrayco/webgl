import { rgb, RGBColor } from 'd3-color';
import { Label } from 'webgl-surface/drawing/label';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';
import { IData } from '../chord/chord-base-cache';

/**
 * Responsible for generating the static outer rings in the system
 *
 * @export
 * @class LabelBaseCache
 * @extends {ShapeBufferCache<Label<ICurvedLineData>>}
 */
export class LabelBaseCache extends ShapeBufferCache<Label<ICurvedLineData>> {
  generate() {
    super.generate.apply(this, arguments);
  }

  // Data = d3chart.loadData();
  preProcessData(data: IData, circleRadius: number) {
    const controlPoint = {x: 0, y: 0};

    const calculatePoint = (radianAngle: number) => {
      const x = circleRadius * Math.cos(radianAngle);
      const y = circleRadius * Math.sin(radianAngle);
      return {x, y};
    };

    const labelPoints = data.endpoints.map((endpoint) => {
        const startAngle = endpoint.startAngle;
        const endAngle = endpoint.endAngle;
        const point = calculatePoint(startAngle + (endAngle - startAngle));
        return {point};
    });

    return labelPoints;
  }

  buildCache(data: IData, selection: Selection){
    const inactiveOpacity: number = 0.3;
    const activeOpacity: number = 1;
    const circleRadius = 10;
    const defaultColor: RGBColor = rgb(1, 1, 1, 1);  // TODO: Need to calculate somehow

    const labelPoints = this.preProcessData(data, circleRadius);
    const labels = labelPoints.map((labelPoint) => {
      const {r, g, b} = defaultColor;
      const color = selection ? rgb(r, g, b, inactiveOpacity) : rgb(r, g, b, activeOpacity);
      const point = {x: labelPoint.x, y: labelPoint.y};
      return new Label(point, rgb(color.r, color.g, color.b, color.opacity));
    });

    this.buffer = labels;
  }
}
