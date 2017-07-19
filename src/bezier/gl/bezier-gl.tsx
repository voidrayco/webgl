import { BufferAttribute, BufferGeometry, Mesh, NormalBlending, Scene, ShaderMaterial, TriangleStripDrawMode } from 'three';
import { LineShape } from 'webgl-surface/drawing/line-shape';
import { QuadShape } from 'webgl-surface/drawing/quad-shape';
import { Bounds } from 'webgl-surface/primitives/bounds';
import { AttributeSize, BufferUtil, IAttributeInfo } from 'webgl-surface/util/buffer-util';
import { QuadTree } from 'webgl-surface/util/quad-tree';
import { IWebGLSurfaceProperties, WebGLSurface } from 'webgl-surface/webgl-surface';
import { ILineShapeData } from '../shape-data-types/line-shape-data';
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
  quads?: QuadShape<IQuadShapeData>[],
  lines?: LineShape<ILineShapeData>[]
}

// --[ CONSTANTS ]-------------------------------------------
// Indicate how big our buffers for vertices can be
const BASE_QUAD_DEPTH = 0;

// --[ SHADERS ]-------------------------------------------
const quadVertexShader = require('./shaders/simple-quad.vs');
const quadFragmentShader = require('./shaders/simple-quad.fs');
const lineVertextShader = require('./shaders/simple-line.vs');
const lineFragmentShader = require('./shaders/simple-line.fs');

/**
 * The base component for the communications view
 */
export class BezierGL extends WebGLSurface<IBezierGLProperties, {}> {
  quadAttributes: IAttributeInfo[];
  quadGeometry: BufferGeometry;
  quadSystem: Mesh;

  /** The current dataset that is being rendered by this component */
  quadSet: QuadShape<IQuadShapeData>[] = [];

  lineAttributes: IAttributeInfo[];
  lineGeometry: BufferGeometry;
  lineSystem2: Mesh;
  lineSet: LineShape<ILineShapeData>[] = [];

  /**
   * Applies new props injected into this component.
   *
   * @param  props The new properties for this component
   */
  applyBufferChanges(props: IBezierGLProperties) {
    debug('Applying props');

    const {
      quads,
      lines,
    } = props;

    // Set to true when the quad tree needs to be updated
    let needsTreeUpdate = false;

    debug('props', this.props);

    // Commit circle changes to the GPU
    if (quads !== undefined && quads !== this.quadSet && isBufferAttributes(this.quadGeometry.attributes)) {
      let quad: QuadShape<IQuadShapeData>;
      debug('Bezier Quad vertex buffer updating %o', quads);

      // Since we have new quads, we need to clear the camera position as well
      this.initCamera();
      this.quadSet = quads;

      const numVerticesPerQuad = 6;
      const colorAttributeSize = 4;

      BufferUtil.updateBuffer(
        this.quadGeometry, this.quadAttributes, numVerticesPerQuad, quads.length,
        function(i: number, positions: Float32Array, ppos: number, colors: Float32Array, cpos: number) {
          quad = quads[i];

          // Copy first vertex twice for intro degenerate tri
          positions[ppos] = quad.right;
          positions[++ppos] = quad.bottom;
          positions[++ppos] = BASE_QUAD_DEPTH;
          // Skip over degenerate tris color
          cpos += colorAttributeSize;

          // TR
          positions[++ppos] = quad.right;
          positions[++ppos] = quad.bottom;
          positions[++ppos] = BASE_QUAD_DEPTH;
          colors[cpos] = quad.r;
          colors[++cpos] = quad.g;
          colors[++cpos] = quad.b;
          colors[++cpos] = quad.a;
          // BR
          positions[++ppos] = quad.right;
          positions[++ppos] = quad.y;
          positions[++ppos] = BASE_QUAD_DEPTH;
          colors[++cpos] = quad.r;
          colors[++cpos] = quad.g;
          colors[++cpos] = quad.b;
          colors[++cpos] = quad.a;
          // TL
          positions[++ppos] = quad.x;
          positions[++ppos] = quad.bottom;
          positions[++ppos] = BASE_QUAD_DEPTH;
          colors[++cpos] = quad.r;
          colors[++cpos] = quad.g;
          colors[++cpos] = quad.b;
          colors[++cpos] = quad.a;
          // BL
          positions[++ppos] = quad.x;
          positions[++ppos] = quad.y;
          positions[++ppos] = BASE_QUAD_DEPTH;
          colors[++cpos] = quad.r;
          colors[++cpos] = quad.g;
          colors[++cpos] = quad.b;
          colors[++cpos] = quad.a;

          // Copy last vertex again for degenerate tri
          positions[++ppos] = quad.x;
          positions[++ppos] = quad.y;
          positions[++ppos] = BASE_QUAD_DEPTH;
          // Skip over degenerate tris for color
          cpos += colorAttributeSize;
        },
      );

      this.quadGeometry.setDrawRange(0, quads.length * 6);

      needsTreeUpdate = true;
      debug('Quad Buffers Created');
    }

    if (lines !== undefined && lines !== this.lineSet && isBufferAttributes(this.lineGeometry.attributes)) {
      let line: LineShape<ILineShapeData>;

      debug('lines buffer updating %o', lines);

      // Since we have new quads, we need to clear the camera position as well
      this.initCamera();
      this.lineSet = lines;

      const numVerticesPerLine = 3;

      BufferUtil.updateBuffer(
        this.lineGeometry, this.lineAttributes, numVerticesPerLine, lines.length,
        function(i: number, positions: Float32Array, ppos: number, colors: Float32Array, cpos: number) {
          line = lines[i];
          // First point
          debug('line is %o', line);
          positions[ppos] = line.p1.x;
          positions[++ppos] = line.p1.y;
          positions[++ppos] = BASE_QUAD_DEPTH;
          colors[cpos] = 1;
          colors[++cpos] = 1;
          colors[++cpos] = 1;
          colors[++cpos] = 1;

          // Second point
          positions[++ppos] = line.p2.x;
          positions[++ppos] = line.p2.y;
          positions[++ppos] = BASE_QUAD_DEPTH;
          colors[++cpos] = 1;
          colors[++cpos] = 1;
          colors[++cpos] = 1;
          colors[++cpos] = 1;

          // Third point
          positions[++ppos] = line.p1.x;
          positions[++ppos] = line.p2.y;
          positions[++ppos] = BASE_QUAD_DEPTH;
          colors[++cpos] = 1;
          colors[++cpos] = 1;
          colors[++cpos] = 1;
          colors[++cpos] = 1;
        },
      );
      this.lineGeometry.setDrawRange(0, lines.length * 3);
      debug('lines buffer created');
    }

    if (needsTreeUpdate){
      if (this.quadTree){
        this.quadTree.destroy();
        this.quadTree = null;
      }

      const aggregate: Bounds<any>[] = [];
      const toAdd = aggregate.concat(quads).concat(lines);

      this.quadTree = new QuadTree<Bounds<any>>(0, 0, 0, 0);
      if ( toAdd.length > 0) this.quadTree.bounds.copyBounds(toAdd[0]);
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

    const lineMaterial = new ShaderMaterial({
      blending: NormalBlending,
      depthTest: true,
      fragmentShader: lineFragmentShader,
      transparent: true,
      vertexShader: lineVertextShader,
    });

    // Create a scene so we can add our buffer objects to it
    this.scene = new Scene();

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
      ];

      this.lineAttributes = [
        {
          defaults: [0, 0, BASE_QUAD_DEPTH],
          name: 'position',
          size: AttributeSize.THREE,
        },
        {
          defaults: [0, 0, 1, 1],
          name: 'customColor',
          size: AttributeSize.FOUR,
        },
      ];

      const verticesPerLine = 3;
      const numLines = 20;

      this.lineGeometry = BufferUtil.makeBuffer(numLines * verticesPerLine, this.lineAttributes);
      this.lineSystem2 = new Mesh(this.lineGeometry, lineMaterial);
      this.lineSystem2.frustumCulled = false;
      this.lineSystem2.drawMode = TriangleStripDrawMode;
      this.scene.add(this.lineSystem2);

      const verticesPerQuad = 6;
      const numQuads = 20;

      this.quadGeometry = BufferUtil.makeBuffer(numQuads * verticesPerQuad, this.quadAttributes);
      this.quadSystem = new Mesh(this.quadGeometry, quadMaterial);
      this.quadSystem.frustumCulled = false;
      this.quadSystem.drawMode = TriangleStripDrawMode;
      // Place the mesh in the scene
      this.scene.add(this.quadSystem);
    }
  }

  /**
   * Any uniforms tied to changes in the camera are updated here
   */
  updateCameraUniforms() {
    // NOTE: Implement if required. Leave empty to prevent any default behavior
  }
}
