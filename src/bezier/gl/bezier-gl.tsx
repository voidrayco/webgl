import { AttributeSize, BufferUtil, IAttributeInfo } from 'webgl-surface/util/buffer-util'
import { Bounds } from 'webgl-surface/primitives/bounds'
import { BufferAttribute, BufferGeometry, InterleavedBufferAttribute, Mesh, NormalBlending, Points, Scene, ShaderMaterial, TriangleStripDrawMode } from 'three'
import { IQuadShapeData } from '../shape-data-types/quad-shape-data'
import { IWebGLSurfaceProperties, WebGLSurface } from 'webgl-surface/webgl-surface'
import { QuadTree } from 'webgl-surface/util/quad-tree'
import { QuadShape } from 'webgl-surface/drawing/quad-shape'
const debug = require('debug')('ConversationView:GPU')

// The BufferAttribute class from ThreeJS allows runtime attributes to be added,
// and actually requires this as part of its operation. However, it doesn't use
// any of the facilities in TypeScript to allow this to be clarified. Therefore,
// I'm using Declaration Merging to add the properties for type checking.
// Hopefully in the future, they will learn the dark art of Generics.
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
declare module 'three' {
  // tslint:disable-next-line interface-name
  interface BufferAttribute {
    customColor: InterleavedBufferAttribute & BufferAttribute
    customInnerColor: InterleavedBufferAttribute & BufferAttribute
    position: InterleavedBufferAttribute & BufferAttribute
    size: InterleavedBufferAttribute & BufferAttribute
    texCoord: InterleavedBufferAttribute & BufferAttribute
    p1: InterleavedBufferAttribute & BufferAttribute
    p2: InterleavedBufferAttribute & BufferAttribute
  }
}

/** Attempt to determine if BufferAttribute is really a BufferAttribute */
function isBufferAttributes(value: any): value is BufferAttribute {
  if ('customColor' in value) { return true }
  if ('customInnerColor' in value) { return true }
  if ('position' in value) { return true }
  if ('size' in value) { return true }
  if ('texCoord' in value) { return true }
  if ('p1' in value) { return true }
  if ('p2' in value) { return true }

  return false
}

// Local component properties interface
interface IBezierGLProperties extends IWebGLSurfaceProperties {
  /** The base, infrequently redrawn */
  quads?: QuadShape<IQuadShapeData>[]
}

// --[ CONSTANTS ]-------------------------------------------
// Indicate how big our buffers for vertices can be
const BASE_QUAD_DEPTH = 0

// --[ SHADERS ]-------------------------------------------
const quadVertexShader = require('./shaders/simple-quad.vs')
const quadFragmentShader = require('./shaders/simple-quad.fs')

/**
 * The base component for the communications view
 */
export class BezierGL extends WebGLSurface<IBezierGLProperties, {}> {
  quadAttributes: IAttributeInfo[]
  quadGeometry: BufferGeometry
  quadSystem: Points

  /** The current dataset that is being rendered by this component */
  quadSet: QuadShape<IQuadShapeData>[] = []

  /**
   * Applies new props injected into this component.
   *
   * @param  props The new properties for this component
   */
  applyBufferChanges(props: IBezierGLProperties) {
    debug('Applying props')

    const {
      quads,
    } = props

    // Set to true when the quad tree needs to be updated
    let needsTreeUpdate = false

    debug('props', props)

    // Commit circle changes to the GPU
    if (quads !== undefined && quads !== this.quadSet && isBufferAttributes(this.quadGeometry.attributes)) {
      let quad: QuadShape<IQuadShapeData>

      // Since we have new quads, we need to clear the camera position as well
      this.initCamera()
      this.quadSet = quads

      BufferUtil.updateBuffer(
        this.quadGeometry, this.quadAttributes, 4, quads.length,
        function (i: number, positions: Float32Array, ppos: number, colors: Float32Array, cpos: number) {
          quad = quads[i]

          // Copy first vertex twice for intro degenerate tri
          positions[ppos] = quad.right
          positions[++ppos] = quad.y
          positions[++ppos] = BASE_QUAD_DEPTH
          // Skip over degenerate tris color
          cpos += 4

          // TR
          positions[++ppos] = quad.right
          positions[++ppos] = quad.y
          positions[++ppos] = BASE_QUAD_DEPTH
          colors[cpos] = quad.r
          colors[++cpos] = quad.g
          colors[++cpos] = quad.b
          colors[++cpos] = quad.a
          // BR
          positions[++ppos] = quad.right
          positions[++ppos] = quad.bottom
          positions[++ppos] = BASE_QUAD_DEPTH
          colors[++cpos] = quad.r
          colors[++cpos] = quad.g
          colors[++cpos] = quad.b
          colors[++cpos] = quad.a
          // TL
          positions[++ppos] = quad.x
          positions[++ppos] = quad.y
          positions[++ppos] = BASE_QUAD_DEPTH
          colors[++cpos] = quad.r
          colors[++cpos] = quad.g
          colors[++cpos] = quad.b
          colors[++cpos] = quad.a
          // BL
          positions[++ppos] = quad.x
          positions[++ppos] = quad.bottom
          positions[++ppos] = BASE_QUAD_DEPTH
          colors[++cpos] = quad.r
          colors[++cpos] = quad.g
          colors[++cpos] = quad.b
          colors[++cpos] = quad.a

          // Copy last vertex again for degenerate tri
          positions[++ppos] = quad.x
          positions[++ppos] = quad.bottom
          positions[++ppos] = BASE_QUAD_DEPTH
          // Skip over degenerate tris for color
          cpos += 4
        }
      )

      this.quadGeometry.setDrawRange(0, quads.length)

      needsTreeUpdate = true
      debug('Quad Buffers Created')
    }

    if (needsTreeUpdate) {
      if (this.quadTree) {
        this.quadTree.destroy()
        this.quadTree = null
      }

      // Gather the items to place in the quad tree
      let toAdd: Bounds<any>[] = quads

      // Make the new quad tree and insert the new items
      this.quadTree = new QuadTree<Bounds<any>>(0, 0, 0, 0)
      this.quadTree.bounds.copyBounds(toAdd[0])
      this.quadTree.addAll(toAdd)
    }
  }

  /**
   * This is a hook allowing sub classes to have a place to initialize their buffers
   * and materials etc.
   */
  initBuffers() {
    // SET UP MATERIALS AND UNIFORMS
    const quadMaterial = new ShaderMaterial({
      blending: NormalBlending,
      depthTest: true,
      fragmentShader: quadFragmentShader,
      transparent: true,
      vertexShader: quadVertexShader,
    })

    // Create a scene so we can add our buffer objects to it
    this.scene = new Scene()

    // GENERATE THE QUAD BUFFER
    {
      this.quadAttributes = [
        {
          defaults: [0, 0, BASE_QUAD_DEPTH],
          name: 'position',
          size: AttributeSize.THREE,
        },
        {
          defaults: [0, 0, 0, 1],
          name: 'customColor',
          size: AttributeSize.FOUR,
        },
        {
          defaults: [0, 0, 0, 1],
          name: 'customInnerColor',
          size: AttributeSize.FOUR,
        },
        {
          defaults: [1, 1],
          name: 'size',
          size: AttributeSize.TWO,
        },
      ]

      this.quadGeometry = BufferUtil.makeBuffer(10000, this.quadAttributes)
      this.quadSystem = new Mesh(this.quadGeometry, quadMaterial)
      this.quadSystem.frustumCulled = false
      this.quadSystem.drawMode = TriangleStripDrawMode

      this.scene.add(this.quadSystem)
    }
  }

  /**
   * Any uniforms tied to changes in the camera are updated here
   */
  updateCameraUniforms() {

  }
}
