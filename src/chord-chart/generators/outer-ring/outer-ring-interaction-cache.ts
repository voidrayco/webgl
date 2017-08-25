import { ColorGenerator } from 'chord-chart/generators/color/color-generator';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection, SelectionType } from '../../selections/selection';
import { IOuterRingData } from '../../shape-data-types/outer-ring-data';
import { ColorState, IChordChartConfig, IData } from '../types';

const depth = 21;

/**
 * Responsible for generating the static OuterRings in the system
 */
export class OuterRingInteractionsCache extends ShapeBufferCache<CurvedLineShape<IOuterRingData>> {
  generate(data: IData, config: IChordChartConfig, colorGenerator: ColorGenerator, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(data: IData, config: IChordChartConfig, colorGenerator: ColorGenerator, selection: Selection) {
    const shapes = Array<any>();

    selection.getSelection<CurvedLineShape<IOuterRingData>>(SelectionType.MOUSEOVER_OUTER_RING).map(selected => {
      // Highlight hovered ring
      const curvedLine = selected.clone();

      curvedLine.startColor = colorGenerator.pick(ColorState.OUTER_RING_HOVER, selected.d.source.id);
      curvedLine.endColor = curvedLine.startColor;
      curvedLine.depth = depth;

      shapes.push(curvedLine);
    });

    this.buffer = shapes;
  }
}
