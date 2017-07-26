import { rgb } from 'd3-color';
import { CurveShape } from '../../webgl-surface/drawing/curve-shape';
import { Curve } from '../../webgl-surface/primitives/curve';
import { ICurveShapeData } from '../shape-data-types/curve-shape-data';

/**
 * Generator for making our curve shape buffers. This class will guarantee changes
 * to the generated shapes will produce a different array pointer to the data.
 */
export class CurveGenerator {
  // BUFFERS and CACHES
  baseBuffer: CurveShape<ICurveShapeData>[] = [];

  // CACHE BUSTING
  bustBaseCache: boolean = true;

  // STATE
  lastData: ICurveShapeData[];

  /**
   * This flags a cache or buffer for needing reconstruction
   */
  bustCaches(data: ICurveShapeData[]) {
    if (data !== this.lastData) {
      this.bustBaseCache = true;
    }
  }

  /**
   * This triggers cache bust checks and re-generates the buffers as is needed.
   *
   * @param {ICurveShapeData[]} data The data used and associated with each curve Shape
   *                                that is generated
   */
  generate(data: ICurveShapeData[]) {
    this.bustCaches(data);

    if (this.bustBaseCache) {
      this.generateBaseBuffer(data);
    }
  }

  /**
   * This generates the buffers needed for rendering
   */
  generateBaseBuffer(data: ICurveShapeData[]) {
    this.baseBuffer = data.map(d =>
      new CurveShape<ICurveShapeData>(
        new Curve<ICurveShapeData>(d.point1, d.point2, d.anchorPoint, d.segmentNo),
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
