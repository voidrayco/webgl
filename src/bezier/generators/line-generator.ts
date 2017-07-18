import { LineShape } from 'webgl-surface/drawing/line-shape';
import { ILineShapeData } from '../shape-data-types/line-shape-data';

/**
 * Generator for making our quad shape buffers. This class will guarantee changes
 * to the generated shapes will produce a different array pointer to the data.
 */
export class LineGenerator {
  // BUFFERS and CACHES
  baseBuffer: LineShape<ILineShapeData>[] = [];

  // CACHE BUSTING
  bustBaseCache: boolean = true;

  // STATE
  lastData: ILineShapeData[];

  /**
   * This flags a cache or buffer for needing reconstruction
   */
  bustCaches(data: ILineShapeData[]) {
    if (data !== this.lastData) {
      this.bustBaseCache = true;
    }
  }

  /**
   * This triggers cache bust checks and re-generates the buffers as is needed.
   *
   * @param {ILineShapeData[]} data The data used and associated with each Quad Shape
   *                                that is generated
   */
  generate(data: ILineShapeData[]) {
    this.bustCaches(data);

    if (this.bustBaseCache) {
      this.generateBaseBuffer(data);
    }
  }

  /**
   * YoYo changed here with new QuadShape constructor
   * This generates the buffers needed for rendering
   */
  generateBaseBuffer(data: ILineShapeData[]) {
    this.baseBuffer = data.map(d =>
      new LineShape<ILineShapeData>(d.p1, d.p2, d, d.color1.r, d.color1.g, d.color1.b, 1, d.color2.r, d.color2.g, d.color2.b, 1),
      );
  }

  /**
   * Retrieve the base buffer. The buffer returned will be a NEW array object pointer
   * whenever anything in the buffer has changed or needed changes.
   */
  getBaseBuffer() {
    return this.baseBuffer;
  }
}
