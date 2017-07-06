import { IPoint } from 'webgl-surface/primitives/point'
import { Bounds } from 'webgl-surface/primitives/bounds'
import { IQuadShapeData } from '../shape-data-types/quad-shape-data'
import { ISize } from 'webgl-surface/primitives/size'
import { QuadShape } from 'webgl-surface/drawing/quad-shape'
import { rgb } from 'd3-color'

/**
 * Generator for making our quad shape buffers. This class will guarantee changes
 * to the generated shapes will produce a different array pointer to the data.
 */
export class QuadGenerator {
  // BUFFERS and CACHES
  baseBuffer: QuadShape<IQuadShapeData>[] = []

  // CACHE BUSTING
  bustBaseCache: boolean = true

  // STATE
  lastData: IQuadShapeData[]

  /**
   * This flags a cache or buffer for needing reconstruction
   */
  bustCaches(data: IQuadShapeData[]) {
    if (data !== this.lastData) {
      this.bustBaseCache = true
    }
  }

  /**
   * This triggers cache bust checks and re-generates the buffers as is needed.
   *
   * @param {IQuadShapeData[]} data The data used and associated with each Quad Shape
   *                                that is generated
   */
  generate(data: IQuadShapeData[]) {
    this.bustCaches(data)

    if (this.bustBaseCache) {
      this.generateBaseBuffer(data)
    }
  }

  /**
   * This generates the buffers needed for rendering
   */
  generateBaseBuffer(data: IQuadShapeData[]) {
    this.baseBuffer = data.map(d => {
      return new QuadShape<IQuadShapeData>(
        new Bounds<IQuadShapeData>(d.position.x, d.position.x + d.size.width, d.position.y, d.position.y + d.size.height),
        rgb(Math.random(), Math.random(), Math.random(), 1.0)
      )
    })

    console.log(this.baseBuffer)
  }

  /**
   * Retrieve the base buffer. The buffer returned will be a NEW array object pointer
   * whenever anything in the buffer has changed or needed changes.
   */
  getBaseBuffer() {
    return this.baseBuffer
  }
}
