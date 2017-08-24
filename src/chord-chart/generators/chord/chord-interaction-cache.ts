import { ColorGenerator } from 'chord-chart/generators/color/color-generator';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection, SelectionType } from '../../selections/selection';
import { IChordData } from '../../shape-data-types/chord-data';
import { ColorState, IChordChartConfig } from '../types';

const DEPTH = 10;

/**
 * Responsible for generating the static chords in the system
 */
export class ChordInteractionsCache extends ShapeBufferCache<CurvedLineShape<IChordData>> {
  generate(config: IChordChartConfig, colorGenerator: ColorGenerator, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(config: IChordChartConfig, colorGenerator: ColorGenerator, selection: Selection) {
    const shapes = Array<any>();
    const hoveredChords = selection.getSelection<CurvedLineShape<any>>(SelectionType.MOUSEOVER_CHORD);

    hoveredChords.forEach((curve: CurvedLineShape<IChordData>) => {
      // Duplicate the curves with active color
      const curvedLine = curve.clone();

      curvedLine.startColor = colorGenerator.pick(ColorState.CHORD_HOVER, curve.d.source.srcTarget);
      curvedLine.endColor = colorGenerator.pick(ColorState.CHORD_HOVER, curve.d.source.dstTarget);
      curvedLine.depth = DEPTH;

      shapes.push(curvedLine);
    });

    this.buffer = shapes;
  }
}
