import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { ICurvedLineData } from '../../shape-data-types/curved-line-data';

export class ChordGenerator {
  baseBuffer: CurvedLineShape<ICurvedLineData>[];

  /**
   * Generates the buffers for static chords in the charts
   */
  generate() {
    // TODO
  }

  getBaseBuffer(): CurvedLineShape<ICurvedLineData>[] {
    return this.baseBuffer;
  }
}
