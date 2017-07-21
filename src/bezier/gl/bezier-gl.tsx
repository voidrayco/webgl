import { BufferAttribute, Mesh, NormalBlending, Scene, ShaderMaterial, TriangleStripDrawMode } from 'three';
import { QuadShape } from 'webgl-surface/drawing/quad-shape';
import { Bounds } from 'webgl-surface/primitives/bounds';
import { AttributeSize, BufferUtil, IBufferItems } from 'webgl-surface/util/buffer-util';
import { QuadTree } from 'webgl-surface/util/quad-tree';
import { IWebGLSurfaceProperties, WebGLSurface } from 'webgl-surface/webgl-surface';
import { IQuadShapeData } from '../shape-data-types/quad-shape-data';
const debug = require('debug')('bezier');

/** Attempt to determine if BufferAttribute is really a BufferAttribute */
function isBufferAttributes(value: any): value is BufferAttribute {
  if ('customColor' in value) { return true; }
  if ('customInnerColor' in value) { return true; }
  if ('position' in value) { return true; }
  if ('size' in value) { return true; }
  if ('texCoord' in value) { return true; }
  if ('p1' in value) { return true; }
  if ('p2' in value) { return true; }

  return false;
}

// Local component properties interface
interface IBezierGLProperties extends IWebGLSurfaceProperties {
  /** The base, infrequently redrawn */
  quads?: QuadShape<IQuadShapeData>[]
}

// --[ CONSTANTS ]-------------------------------------------
// Indicate how big our buffers for vertices can be
const BASE_QUAD_DEPTH = 0;

// --[ SHADERS ]-------------------------------------------
const quadVertexShader = require('./shaders/simple-quad.vs');
const quadFragmentShader = require('./shaders/simple-quad.fs');

/**
 * The base component for the communications view
 */
export class BezierGL extends WebGLSurface<IBezierGLProperties, {}> {
  quadItems: IBufferItems<QuadShape<IQuadShapeData>, Mesh> = BufferUtil.makeBufferItems();

  /** The current dataset that is being rendered by this component */
  quadSet: QuadShape<IQuadShapeData>[] = [];

  /**
   * Applies new props injected into this component.
   *
   * @param  props The new properties for this component
   */
  applyBufferChanges(props: IBezierGLProperties) {
    debug('Applying props');

    const {
      quads,
    } = props;

    // Set to true when the quad tree needs to be updated
    let needsTreeUpdate = false;

    debug('props', props);

    // Commit circle changes to the GPU
    if (quads !== undefined && quads !== this.quadSet && isBufferAttributes(this.quadItems.geometry.attributes)) {
      let quad: QuadShape<IQuadShapeData>;
      debug('Bezier Quad vertex buffer updating %o', quads);

      // Since we have new quads, we need to clear the camera position as well
      this.quadSet = quads;

      const numVerticesPerQuad = 6;
      const colorAttributeSize = 4;

      BufferUtil.updateBuffer(
        quads, this.quadItems,
        numVerticesPerQuad, quads.length,
        function(i: number, sb: Float32Array, ppos: number, colors: Float32Array, cpos: number) {
          quad = quads[i];

          // Copy first vertex twice for intro degenerate tri
          sb[ppos] = quad.right;
          sb[++ppos] = quad.bottom;
          sb[++ppos] = BASE_QUAD_DEPTH;
          // Skip over degenerate tris color
          cpos += colorAttributeSize;

          // TR
          sb[++ppos] = quad.right;
          sb[++ppos] = quad.bottom;
          sb[++ppos] = BASE_QUAD_DEPTH;
          colors[cpos] = quad.r;
          colors[++cpos] = quad.g;
          colors[++cpos] = quad.b;
          colors[++cpos] = quad.a;
          // BR
          sb[++ppos] = quad.right;
          sb[++ppos] = quad.y;
          sb[++ppos] = BASE_QUAD_DEPTH;
          colors[++cpos] = quad.r;
          colors[++cpos] = quad.g;
          colors[++cpos] = quad.b;
          colors[++cpos] = quad.a;
          // TL
          sb[++ppos] = quad.x;
          sb[++ppos] = quad.bottom;
          sb[++ppos] = BASE_QUAD_DEPTH;
          colors[++cpos] = quad.r;
          colors[++cpos] = quad.g;
          colors[++cpos] = quad.b;
          colors[++cpos] = quad.a;
          // BL
          sb[++ppos] = quad.x;
          sb[++ppos] = quad.y;
          sb[++ppos] = BASE_QUAD_DEPTH;
          colors[++cpos] = quad.r;
          colors[++cpos] = quad.g;
          colors[++cpos] = quad.b;
          colors[++cpos] = quad.a;

          // Copy last vertex again for degenerate tri
          sb[++ppos] = quad.x;
          sb[++ppos] = quad.y;
          sb[++ppos] = BASE_QUAD_DEPTH;
          // Skip over degenerate tris for color
          cpos += colorAttributeSize;
        },
      );

      this.quadItems.geometry.setDrawRange(0, quads.length * 6);

      needsTreeUpdate = true;
      debug('Quad Buffers Created');
    }

    if (needsTreeUpdate) {
      if (this.quadTree) {
        this.quadTree.destroy();
        this.quadTree = null;
      }

      // Gather the items to place in the quad tree
      const toAdd: Bounds<any>[] = quads;

      // Make the new quad tree and insert the new items
      this.quadTree = new QuadTree<Bounds<any>>(0, 0, 0, 0);
      this.quadTree.bounds.copyBounds(toAdd[0]);
      this.quadTree.addAll(toAdd);
    }

    debug('CAMERA %o', this.camera);
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
    });

    // Create a scene so we can add our buffer objects to it
    this.scene = new Scene();

    // GENERATE THE QUAD BUFFER
    {
      this.quadItems.attributes = [
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
      ];

      const verticesPerQuad = 6;
      const numQuads = 10000;

      this.quadItems.geometry = BufferUtil.makeBuffer(numQuads * verticesPerQuad, this.quadItems.attributes);
      this.quadItems.system = new Mesh(this.quadItems.geometry, quadMaterial);
      this.quadItems.system.frustumCulled = false;
      this.quadItems.system.drawMode = TriangleStripDrawMode;

      // Place the mesh in the scene
      this.scene.add(this.quadItems.system);
    }
  }

  /**
   * Any uniforms tied to changes in the camera are updated here
   */
  updateCameraUniforms() {
    // NOTE: Implement if required. Leave empty to prevent any default behavior
  }
}
