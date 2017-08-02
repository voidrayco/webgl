
import { QuadShape } from 'webgl-surface/drawing/quad-shape';

import { IQuadShapeData } from '../shape-data-types/quad-shape-data';

const debug = require('debug')('bezier');

/**
 * Generator for making our quad shape buffers. This class will guarantee changes
 * to the generated shapes will produce a different array pointer to the data.
 */
export class QuadGenerator {
  // BUFFERS and CACHES
  baseBuffer: QuadShape<IQuadShapeData>[] = [];

  // CACHE BUSTING
  bustBaseCache: boolean = true;

  // STATE
  lastData: IQuadShapeData[];

  /**
   * This flags a cache or buffer for needing reconstruction
   */
  bustCaches(data: IQuadShapeData[]) {
    if (data !== this.lastData) {
      this.bustBaseCache = true;
    }
  }

  /**
   * This triggers cache bust checks and re-generates the buffers as is needed.
   *
   * @param {IQuadShapeData[]} data The data used and associated with each Quad Shape
   *                                that is generated
   */
  generate(data: IQuadShapeData[]) {
    this.bustCaches(data);

    if (this.bustBaseCache) {
      debug('Recreating the base buffer!');
      this.generateBaseBuffer(data);
    }
  }

  /**
   * YoYo changed here with new QuadShape constructor
   * This generates the buffers needed for rendering
   */
  generateBaseBuffer(data: IQuadShapeData[]) {
    this.baseBuffer = data.map(d =>
      new QuadShape<IQuadShapeData>(d.p1,d.p2,d.lineWidth,d.color),
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
