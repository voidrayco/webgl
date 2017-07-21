import { rgb } from 'd3-color';
import { Label } from 'webgl-surface/drawing/label';

const debug = require('debug')('webgl-surface:Labels');

export class LabelGenerator {
  baseBuffer: Label<any>[];
  allLabels: Label<any>[];

  generate(labels: string[]) {
    debug('Generating Labels');

    this.baseBuffer = labels.map((lbl: string, i: number) => {
      const label = new Label<any>({
        color: rgb(1, 1, 1, 1),
        fontSize: 14,
        text: lbl,
      });

      label.rasterizationOffset.y = 10;
      label.rasterizationPadding.height = -10;
      label.setRotation(i * (Math.PI / 4));
      label.setLocation({x: i * 20, y: i * 20});

      return label;
    });
  }

  getBaseBuffer() {
    return this.baseBuffer;
  }
}
