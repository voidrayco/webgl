import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection, SelectionType } from '../../selections/selection';
import { IChordData } from '../../shape-data-types/chord-data';
import { IChordChartConfig } from '../types';

const DEPTH = 10;

/**
 * Responsible for generating the static chords in the system
 */
export class ChordInteractionsCache extends ShapeBufferCache<CurvedLineShape<IChordData>> {
  generate(config: IChordChartConfig, selection: Selection) {
    super.generate.apply(this, arguments);
  }

  buildCache(config: IChordChartConfig, selection: Selection) {
    const shapes = Array<any>();

    selection.getSelection<CurvedLineShape<any>>(SelectionType.MOUSEOVER_CHORD).forEach(curve => {
      // Duplicate the curves with active color
      const curvedLine = curve.clone();

      curvedLine.a = 1.0;
      curvedLine.a2 = 1.0;
      curvedLine.depth = DEPTH;

      shapes.push(curvedLine);
    });

    this.buffer = shapes;
  }
}
