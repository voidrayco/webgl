import { rgb } from 'd3-color';
import { QuadShape } from 'webgl-surface/drawing/quad-shape';
import { Bounds } from 'webgl-surface/primitives/bounds';
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
      new QuadShape<IQuadShapeData>(
        new Bounds<IQuadShapeData>(d.position.x, d.position.x + d.size.width, d.position.y, d.position.y + d.size.height),
        rgb(Math.random(), Math.random(), Math.random(), 1.0),
      ),
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
