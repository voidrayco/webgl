import { rgb, RGBColor } from 'd3-color';
import { Label } from 'webgl-surface/drawing/label';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection } from '../../selections/selection';
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
  generate(data: IData, selection: Selection) {
    super.generate.apply(this, arguments);
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

      const label = new Label<any>({
        color: color,
        fontSize: 14,
        text: 'TEXT',
      });

      label.rasterizationOffset.y = 10.5;
      label.rasterizationOffset.x = 0.5;
      label.rasterizationPadding.height = -10;
      label.setRotation(Math.PI / 4);
      label.setLocation(point);

      return label;
    });

    this.buffer = labels;
  }

  // Data = d3chart.loadData();
  preProcessData(data: IData, circleRadius: number) {
    // Const controlPoint = {x: 0, y: 0};

    const calculatePoint = (radianAngle: number) => {
      const x = circleRadius * Math.cos(radianAngle);
      const y = circleRadius * Math.sin(radianAngle);
      return {x, y};
    };

    const labelPoints = data.endpoints.map((endpoint) => {
        const startAngle = endpoint.startAngle;
        const endAngle = endpoint.endAngle;
        const point = calculatePoint(startAngle + (endAngle - startAngle));
        return point;
    });

    return labelPoints;
  }
}
