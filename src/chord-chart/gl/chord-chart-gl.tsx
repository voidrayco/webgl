import { Mesh, NormalBlending, ShaderMaterial, TriangleStripDrawMode } from 'three';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Bounds } from 'webgl-surface/primitives/bounds';
import { AttributeSize, BufferUtil, IBufferItems } from 'webgl-surface/util/buffer-util';
import { QuadTree } from 'webgl-surface/util/quad-tree';
import { IWebGLSurfaceProperties, WebGLSurface } from 'webgl-surface/webgl-surface';
const debug = require('debug')('bezier');

// Local component properties interface
interface IChordChartGLProperties extends IWebGLSurfaceProperties {
  /** Special case lines that use specific processes to animate */
  animatedCurvedLines: any[],
  /** Lines that change frequently due to interactions */
  interactiveCurvedLines: any[],
  /** Lines that do not change often */
  staticCurvedLines: any[],
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
export class ChordChartGL extends WebGLSurface<IChordChartGLProperties, {}> {
  animatedCurvedBufferItems: IBufferItems<CurvedLineShape<any>> = BufferUtil.makeBufferItems<CurvedLineShape<any>>();
  interactiveCurvedBufferItems: IBufferItems<CurvedLineShape<any>> = BufferUtil.makeBufferItems<CurvedLineShape<any>>();
  staticCurvedBufferItems: IBufferItems<CurvedLineShape<any>> = BufferUtil.makeBufferItems<CurvedLineShape<any>>();

  /** The current dataset that is being rendered by this component */
  animatedCurvedLines: CurvedLineShape<any>[] = [];
  /** The current dataset that is being rendered by this component */
  interactiveCurvedLines: CurvedLineShape<any>[] = [];
  /** The current dataset that is being rendered by this component */
  staticCurvedLineSet: CurvedLineShape<any>[] = [];

  /**
   * Applies new props injected into this component.
   *
   * @param  props The new properties for this component
   */
  applyBufferChanges(props: IChordChartGLProperties) {
    debug('Applying props');

    const {
      staticCurvedLines,
    } = props;

    // Set to true when the quad tree needs to be updated
    let needsTreeUpdate = false;

    debug('props', props);

    // Commit static curved lines
    {
      BufferUtil.beginUpdates();

      for (const curvedLine of staticCurvedLines) {
        const numVerticesPerSegment = 6;
        const colorAttributeSize = 4;
        const strip = curvedLine.getTriangleStrip();
        let TR;
        let BR;
        let TL;
        let BL;

        needsTreeUpdate = needsTreeUpdate || BufferUtil.updateBuffer(
          staticCurvedLines, this.staticCurvedBufferItems,
          numVerticesPerSegment, strip.length,
          function(i: number, positions: Float32Array, ppos: number, colors: Float32Array, cpos: number) {
            TR = strip[i];
            BR = strip[i];
            TL = strip[i];
            BL = strip[i];

            // Copy first vertex twice for intro degenerate tri
            positions[ppos] = TR.x;
            positions[++ppos] = TR.y;
            positions[++ppos] = BASE_QUAD_DEPTH;
            // Skip over degenerate tris color
            cpos += colorAttributeSize;

            // TR
            positions[++ppos] = TR.x;
            positions[++ppos] = TR.y;
            positions[++ppos] = BASE_QUAD_DEPTH;
            colors[cpos] = curvedLine.r;
            colors[++cpos] = curvedLine.g;
            colors[++cpos] = curvedLine.b;
            colors[++cpos] = curvedLine.a;
            // BR
            positions[++ppos] = BR.x;
            positions[++ppos] = BR.y;
            positions[++ppos] = BASE_QUAD_DEPTH;
            colors[++cpos] = curvedLine.r;
            colors[++cpos] = curvedLine.g;
            colors[++cpos] = curvedLine.b;
            colors[++cpos] = curvedLine.a;
            // TL
            positions[++ppos] = TL.x;
            positions[++ppos] = TL.y;
            positions[++ppos] = BASE_QUAD_DEPTH;
            colors[++cpos] = curvedLine.r;
            colors[++cpos] = curvedLine.g;
            colors[++cpos] = curvedLine.b;
            colors[++cpos] = curvedLine.a;
            // BL
            positions[++ppos] = BL.x;
            positions[++ppos] = BL.y;
            positions[++ppos] = BASE_QUAD_DEPTH;
            colors[++cpos] = curvedLine.r;
            colors[++cpos] = curvedLine.g;
            colors[++cpos] = curvedLine.b;
            colors[++cpos] = curvedLine.a;

            // Copy last vertex again for degenerate tri
            positions[++ppos] = BL.x;
            positions[++ppos] = BL.y;
            positions[++ppos] = BASE_QUAD_DEPTH;
            // Skip over degenerate tris for color
            cpos += colorAttributeSize;
          },
        );
      }

      BufferUtil.endUpdates();

      this.staticCurvedBufferItems.geometry.setDrawRange(0, staticCurvedLines.length * 6);
      debug('Curved Line Created');
    }

    if (needsTreeUpdate) {
      if (this.quadTree) {
        this.quadTree.destroy();
        this.quadTree = null;
      }

      // Gather the items to place in the quad tree
      const toAdd: Bounds<any>[] = staticCurvedLines;

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

    // GENERATE THE QUAD BUFFER
    {
      this.staticCurvedBufferItems.attributes = [
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
      ];

      const verticesPerQuad = 6;
      const numQuads = 10000;

      this.staticCurvedBufferItems.geometry = BufferUtil.makeBuffer(numQuads * verticesPerQuad, this.staticCurvedBufferItems.attributes);
      this.staticCurvedBufferItems.system = new Mesh(this.staticCurvedBufferItems.geometry, quadMaterial);
      this.staticCurvedBufferItems.system.frustumCulled = false;
      this.staticCurvedBufferItems.system.drawMode = TriangleStripDrawMode;

      // Place the mesh in the scene
      this.scene.add(this.staticCurvedBufferItems.system);
    }
  }

  /**
   * Any uniforms tied to changes in the camera are updated here
   */
  updateCameraUniforms() {
    // NOTE: Implement if required. Leave empty to prevent any default behavior
  }
}
