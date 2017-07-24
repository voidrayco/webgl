import { Mesh, NormalBlending, ShaderMaterial, TriangleStripDrawMode } from 'three';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Bounds } from 'webgl-surface/primitives/bounds';
import { AttributeSize, BufferUtil, IBufferItems } from 'webgl-surface/util/buffer-util';
import { QuadTree } from 'webgl-surface/util/quad-tree';
import { IWebGLSurfaceProperties, WebGLSurface } from 'webgl-surface/webgl-surface';
const debug = require('debug')('chord-chart');

// Local component properties interface
interface IChordChartGLProperties extends IWebGLSurfaceProperties {
  /** Special case lines that use specific processes to animate */
  animatedCurvedLines?: any[],
  /** Lines that change frequently due to interactions */
  interactiveCurvedLines?: any[],
  /** Lines that do not change often */
  staticCurvedLines?: CurvedLineShape<any>[],
}

// --[ CONSTANTS ]-------------------------------------------
// Indicate how big our buffers for vertices can be

// --[ SHADERS ]-------------------------------------------
const fillVertexShader = require('./shaders/chord_test.vs');
const fillFragmentShader = require('./shaders/chord_test.fs');

/**
 * The base component for the communications view
 */
export class ChordChartGL extends WebGLSurface<IChordChartGLProperties, {}> {
  animatedCurvedBufferItems: IBufferItems<CurvedLineShape<any>, Mesh> = BufferUtil.makeBufferItems();
  interactiveCurvedBufferItems: IBufferItems<CurvedLineShape<any>, Mesh> = BufferUtil.makeBufferItems();
  staticCurvedBufferItems: IBufferItems<CurvedLineShape<any>, Mesh> = BufferUtil.makeBufferItems();

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
      const numVerticesPerSegment = 6;
      const colorAttributeSize = 4;

      BufferUtil.beginUpdates();

      for (const curvedLine of staticCurvedLines) {

        needsTreeUpdate = needsTreeUpdate || BufferUtil.updateBuffer(
          staticCurvedLines, this.staticCurvedBufferItems,
          numVerticesPerSegment, 20,
          function(i: number, positions: Float32Array, ppos: number, colors: Float32Array, cpos: number, normalDir: Float32Array, npos: number) {
              positions[ppos] = i / 20;
              positions[++ppos] = (i - 1) / 20;
              positions[++ppos] = (i + 1) / 20;
              cpos += colorAttributeSize;
              normalDir[npos] = 0;

              positions[++ppos] = i / 20;
              positions[++ppos] = (i - 1) / 20;
              positions[++ppos] = (i + 1) / 20;
              colors[cpos] = curvedLine.r;
              colors[++cpos] = curvedLine.g;
              colors[++cpos] = curvedLine.b;
              colors[++cpos] = curvedLine.a;
              normalDir[++npos] = 0;

              positions[++ppos] = i / 20;
              positions[++ppos] = (i - 1) / 20;
              positions[++ppos] = (i + 1) / 20;
              colors[++cpos] = curvedLine.r;
              colors[++cpos] = curvedLine.g;
              colors[++cpos] = curvedLine.b;
              colors[++cpos] = curvedLine.a;
              normalDir[++npos] = 1;

              positions[++ppos] = (i + 1) / 20;
              positions[++ppos] = i / 20;
              positions[++ppos] = (i + 2) / 20;
              colors[++cpos] = curvedLine.r;
              colors[++cpos] = curvedLine.g;
              colors[++cpos] = curvedLine.b;
              colors[++cpos] = curvedLine.a;
              normalDir[++npos] = 0;

              positions[++ppos] = (i + 1) / 20;
              positions[++ppos] = i / 20;
              positions[++ppos] = (i + 2) / 20;
              colors[++cpos] = curvedLine.r;
              colors[++cpos] = curvedLine.g;
              colors[++cpos] = curvedLine.b;
              colors[++cpos] = curvedLine.a;
              normalDir[++npos] = 1;

              positions[++ppos] = (i + 1) / 20;
              positions[++ppos] = i / 20;
              positions[++ppos] = (i + 2) / 20;
              cpos += colorAttributeSize;
              normalDir[++npos] = 1;
              debug('temp i is %o', (i + 1) / 20);
          },
        );
      }

      const numBatches = BufferUtil.endUpdates();

      this.staticCurvedBufferItems.geometry.setDrawRange(0, numVerticesPerSegment * numBatches);
      debug('Curved Lines Created. Segments drawn: %o', numBatches);
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
      fragmentShader: fillFragmentShader,
      transparent: true,
      vertexShader: fillVertexShader,
    });

    // GENERATE THE QUAD BUFFER
    {
      this.staticCurvedBufferItems.attributes = [
        {
          defaults: [0, -1, -1],
          name: 'position',
          size: AttributeSize.THREE,
        },
        {
          defaults: [0, 0, 1, 1],
          name: 'customColor',
          size: AttributeSize.FOUR,
        },
        {
          defaults: [0],
          name: 'normalDirection',
          size: AttributeSize.ONE,
        },
        {
          defaults: [100, 100, 400, 100],
          name: 'endPoints',
          size: AttributeSize.FOUR,
        },
        {
          defaults: [250, 350],
          name: 'controlPoint',
          size: AttributeSize.TWO,
        },
        {
          defaults: [2],
          name: 'line_width_half',
          size: AttributeSize.ONE,
        },
      ];

      const verticesPerQuad = 6;
      const numQuads = 20;

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
