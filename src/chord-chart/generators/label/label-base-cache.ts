import { rgb, RGBColor } from 'd3-color';
import { Label } from 'webgl-surface/drawing/label';
import { AnchorPosition } from 'webgl-surface/primitives/rotateable-quad';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection } from '../../selections/selection';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';
import { IChordChartConfig, IData } from '../types';

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
    const circleRadius = 10;
    const defaultColor: RGBColor = rgb(1, 1, 1, 1);  // TODO: Need to calculate somehow

    const labelsData = this.preProcessData(data, circleRadius);
    const labels = labelsData.map((labelData) => {
      const {r, g, b} = defaultColor;
      const color = selection ? rgb(r, g, b, inactiveOpacity) : rgb(r, g, b, activeOpacity);
      const point = {x: labelData.point.x, y: labelData.point.y};

      const label = new Label<any>({
        color: color,
        fontSize: 14,
        text: 'TEXT',
      });

      label.rasterizationOffset.y = 10.5;
      label.rasterizationOffset.x = 0.5;
      label.rasterizationPadding.height = -10;
      label.setLocation(point);
      label.setRotation(labelData.angle);
      label.setAnchor(labelData.anchor);

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

    const labelData = data.endpoints.map((endpoint) => {
        const startAngle = endpoint.startAngle;
        const angle = startAngle + (endpoint.endAngle - startAngle);
        const angleIntersection =  angle - (Math.PI / 2);
        // MiddleRight if angle in left hemisphere. else middleLeft
        const anchor = (angle > 0 && angle < Math.PI / 2)
          || (angle > (3 * Math.PI) / 2) && angle < (2 * Math.PI) ? AnchorPosition.MiddleRight : AnchorPosition.MiddleLeft;
        const point = calculatePoint(angle);
        return {point, angle: angleIntersection, anchor};
    });

    return labelData;
  }
}
