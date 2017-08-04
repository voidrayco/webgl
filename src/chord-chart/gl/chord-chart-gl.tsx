import {
  CustomBlending,
  IUniform,
  Mesh,
  NormalBlending,
  OneFactor,
  ShaderMaterial,
  TriangleStripDrawMode,
} from 'three';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Label } from 'webgl-surface/drawing/label';
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
const BASE_QUAD_DEPTH = 0;

// --[ SHADERS ]-------------------------------------------
const fillVertexShader = require('./shaders/simple-fill.vs');
const fillFragmentShader = require('./shaders/simple-fill.fs');
const textureVertexShader = require('webgl-surface/shaders/textured-quad.vs');
const textureFragmentShader = require('webgl-surface/shaders/textured-quad.fs');

/**
 * The base component for the communications view
 */
export class ChordChartGL extends WebGLSurface<IChordChartGLProperties, {}> {
  // CURVED LINE BUFFER ITEMS
  animatedCurvedBufferItems: IBufferItems<CurvedLineShape<any>, Mesh> = BufferUtil.makeBufferItems();
  interactiveCurvedBufferItems: IBufferItems<CurvedLineShape<any>, Mesh> = BufferUtil.makeBufferItems();
  staticCurvedBufferItems: IBufferItems<CurvedLineShape<any>, Mesh> = BufferUtil.makeBufferItems();

  // LABELS BUFFER ITEMS
  staticLabelBufferItems: IBufferItems<Label<any>, Mesh> = BufferUtil.makeBufferItems();

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
      labels,
      staticCurvedLines,
    } = props;

    // Set to true when the quad tree needs to be updated
    let needsTreeUpdate = false;

    debug('props', props);

    // Commit static curved lines
    {
      const numVerticesPerSegment = 6;
      const colorAttributeSize = 4;
      let stripPos = 0;

      BufferUtil.beginUpdates();

      for (const curvedLine of staticCurvedLines) {
        debug(curvedLine);
        const strip = curvedLine.getTriangleStrip();
        let TR;
        let BR;
        let TL;
        let BL;

        needsTreeUpdate = BufferUtil.updateBuffer(
          staticCurvedLines, this.staticCurvedBufferItems,
          numVerticesPerSegment, strip.length / 4.0,
          function(i: number, positions: Float32Array, ppos: number, colors: Float32Array, cpos: number) {
            stripPos = i * 4;
            TR = strip[stripPos];
            BR = strip[stripPos + 1];
            TL = strip[stripPos + 2];
            BL = strip[stripPos + 3];

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

        // If no updating is happening, just quit the loop
        if (!needsTreeUpdate) {
          break;
        }
      }

      const numBatches = BufferUtil.endUpdates();

      // Only if updates happened, should this change
      if (needsTreeUpdate) {
        this.staticCurvedBufferItems.geometry.setDrawRange(0, numVerticesPerSegment * numBatches);
      }
      debug('Curved Lines Created. Segments drawn: %o', numBatches);
    }

    // BUFFERING LABELS
    {
      // If the labels are ready, then we buffer in their images for drawing
      if (this.labelsReady) {
        debug('Labels are ready and will be buffered in now. %o', labels);

        // Make sure the uniforms for anything using the label's atlas texture is updated
        const material: ShaderMaterial = this.staticLabelBufferItems.system.material as ShaderMaterial;
        const uniforms: { [k: string]: IUniform } = material.uniforms;
        uniforms.atlasTexture.value = this.atlasManager.getAtlasTexture(this.atlasNames.labels);
        this.atlasManager.getAtlasTexture(this.atlasNames.labels).needsUpdate = true;
        // This.atlasManager.getAtlasTexture(this.atlasNames.labels).magFilter = NearestFilter;
        // This.atlasManager.getAtlasTexture(this.atlasNames.labels).minFilter = NearestFilter;
        this.atlasManager.getAtlasTexture(this.atlasNames.labels).anisotropy = 2;

        // Make some constants and props for our buffer update loop
        const numVerticesPerQuad = 6;
        const colorAttributeSize = 3;
        const texCoordAttributeSize = 3;
        let label;
        let texture;

        BufferUtil.updateBuffer(
          labels, this.staticLabelBufferItems,
          numVerticesPerQuad, labels.length,
          function(i: number, positions: Float32Array, ppos: number, colors: Float32Array, cpos: number, texCoords: Float32Array, tpos: number) {
            label = labels[i];
            texture = label.rasterizedLabel;
            // Make sure the label is updated with it's latest metrics
            label.update();

            // Copy first vertex twice for intro degenerate tri
            positions[ppos] = label.BR.x;
            positions[++ppos] = label.BR.y;
            positions[++ppos] = BASE_QUAD_DEPTH;
            // Skip over degenerate tris color and tex
            cpos += colorAttributeSize;
            tpos += texCoordAttributeSize;

            // BR
            positions[++ppos] = label.BR.x;
            positions[++ppos] = label.BR.y;
            positions[++ppos] = BASE_QUAD_DEPTH;
            texCoords[tpos] = texture.atlasBR.x;
            texCoords[++tpos] = texture.atlasBR.y;
            texCoords[++tpos] = label.color.opacity;
            colors[cpos] = label.color.r;
            colors[++cpos] = label.color.g;
            colors[++cpos] = label.color.b;
            // TR
            positions[++ppos] = label.TR.x;
            positions[++ppos] = label.TR.y;
            positions[++ppos] = BASE_QUAD_DEPTH;
            texCoords[++tpos] = texture.atlasTR.x;
            texCoords[++tpos] = texture.atlasTR.y;
            texCoords[++tpos] = label.color.opacity;
            colors[cpos] = label.color.r;
            colors[++cpos] = label.color.g;
            colors[++cpos] = label.color.b;
            // BL
            positions[++ppos] = label.BL.x;
            positions[++ppos] = label.BL.y;
            positions[++ppos] = BASE_QUAD_DEPTH;
            texCoords[++tpos] = texture.atlasBL.x;
            texCoords[++tpos] = texture.atlasBL.y;
            texCoords[++tpos] = label.color.opacity;
            colors[++cpos] = label.color.r;
            colors[++cpos] = label.color.g;
            colors[++cpos] = label.color.b;
            // TL
            positions[++ppos] = label.TL.x;
            positions[++ppos] = label.TL.y;
            positions[++ppos] = BASE_QUAD_DEPTH;
            texCoords[++tpos] = texture.atlasTL.x;
            texCoords[++tpos] = texture.atlasTL.y;
            texCoords[++tpos] = label.color.opacity;
            colors[++cpos] = label.color.r;
            colors[++cpos] = label.color.g;
            colors[++cpos] = label.color.b;

            // Copy last vertex again for degenerate tri
            positions[++ppos] = label.TL.x;
            positions[++ppos] = label.TL.y;
            positions[++ppos] = BASE_QUAD_DEPTH;
          },
        );

        this.staticLabelBufferItems.geometry.setDrawRange(0, numVerticesPerQuad * labels.length);
      }

      // If the labels are not ready, then we do not allow labels to be drawn
      else {
        this.staticLabelBufferItems.geometry.setDrawRange(0, 0);
      }
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

    const texUniforms = {
      atlasTexture: { type: 't', value: this.atlasManager.getAtlasTexture(this.atlasNames.labels) },
    };

    const textureMaterial = new ShaderMaterial({
      blending: CustomBlending,
      depthTest: true,
      fragmentShader: textureFragmentShader,
      transparent: true,
      uniforms: texUniforms,
      vertexShader: textureVertexShader,
    });

    textureMaterial.blendSrc = OneFactor;

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

      this.staticCurvedBufferItems.geometry = BufferUtil.makeBuffer(
        numQuads * verticesPerQuad,
        this.staticCurvedBufferItems.attributes,
      );
      this.staticCurvedBufferItems.system = new Mesh(
        this.staticCurvedBufferItems.geometry,
        quadMaterial,
      );
      this.staticCurvedBufferItems.system.frustumCulled = false;
      this.staticCurvedBufferItems.system.drawMode = TriangleStripDrawMode;

      // Place the mesh in the scene
      this.scene.add(this.staticCurvedBufferItems.system);
    }

    // GENERATE THE LABEL BUFFER
    {
      this.staticLabelBufferItems.attributes = [
        {
          defaults: [0, 0, BASE_QUAD_DEPTH],
          name: 'position',
          size: AttributeSize.THREE,
        },
        {
          defaults: [0, 0, 0],
          name: 'customColor',
          size: AttributeSize.THREE,
        },
        {
          defaults: [0, 0, 1],
          name: 'texCoord',
          size: AttributeSize.THREE,
        },
      ];

      const verticesPerQuad = 6;
      const numQuads = 10000;

      this.staticLabelBufferItems.geometry = BufferUtil.makeBuffer(
        numQuads * verticesPerQuad,
        this.staticLabelBufferItems.attributes,
      );
      this.staticLabelBufferItems.system = new Mesh(this.staticLabelBufferItems.geometry, textureMaterial);
      this.staticLabelBufferItems.system.frustumCulled = false;
      this.staticLabelBufferItems.system.drawMode = TriangleStripDrawMode;

      // Place the mesh in the scene
      this.scene.add(this.staticLabelBufferItems.system);
    }
  }

  /**
   * Any uniforms tied to changes in the camera are updated here
   */
  updateCameraUniforms() {
    // NOTE: Implement if required. Leave empty to prevent any default behavior
  }
}
