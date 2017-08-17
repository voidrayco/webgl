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
import { IPoint } from 'webgl-surface/primitives/point';
import { AttributeSize, BufferUtil, IBufferItems } from 'webgl-surface/util/buffer-util';
import { IProjection } from 'webgl-surface/util/projection';
import { filterQuery } from 'webgl-surface/util/quad-tree';
import { QuadTree } from 'webgl-surface/util/quad-tree';
import { IWebGLSurfaceProperties, WebGLSurface } from 'webgl-surface/webgl-surface';

const debug = require('debug')('chord-chart:gl');

// Local component properties interface
interface IChordChartGLProperties extends IWebGLSurfaceProperties {
  /** Special case lines that use specific processes to animate */
  animatedCurvedLines?: CurvedLineShape<any>[],
  /** Lines that change frequently due to interactions */
  interactiveCurvedLines?: CurvedLineShape<any>[],
  interactiveRingLines?: CurvedLineShape<any>[],
  /** Labels that change frequently due to interactions */
  interactiveLabels?: Label<any>[],
  /** Lines that do not change often */
  staticCurvedLines?: CurvedLineShape<any>[],
  /** It is used to seperater from curved lines */
  staticRingLines?: CurvedLineShape<any>[],
  /** Event handlers */
  onMouseHover?(curves: CurvedLineShape<any>[], mouse: IPoint, world: IPoint, projection: IProjection): void,
  onMouseLeave?(curves: CurvedLineShape<any>[], mouse: IPoint, world: IPoint, projection: IProjection): void,
  onMouseUp?(curves: CurvedLineShape<any>[], mouse: IPoint, world: IPoint, projection: IProjection): void
}

// --[ CONSTANTS ]-------------------------------------------
// Indicate how big our buffers for vertices can be
const BASE_QUAD_DEPTH = 0;

// --[ SHADERS ]-------------------------------------------
const bezierVertexShader = require('./shaders/bezier.vs');
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
  interactiveRingBufferItems: IBufferItems<CurvedLineShape<any>, Mesh> = BufferUtil.makeBufferItems();
  staticCurvedBufferItems: IBufferItems<CurvedLineShape<any>, Mesh> = BufferUtil.makeBufferItems();
  staticRingBufferItems: IBufferItems<CurvedLineShape<any>, Mesh> = BufferUtil.makeBufferItems();

  // LABELS BUFFER ITEMS
  staticLabelBufferItems: IBufferItems<Label<any>, Mesh> = BufferUtil.makeBufferItems();
  interactiveLabelBufferItems: IBufferItems<Label<any>, Mesh> = BufferUtil.makeBufferItems();

  /** The current dataset that is being rendered by this component */
  animatedCurvedLines: CurvedLineShape<any>[] = [];
  /** The current dataset that is being rendered by this component */
  interactiveCurvedLines: CurvedLineShape<any>[] = [];
  interactiveRingLines: CurvedLineShape<any>[] = [];
  /** The current dataset that is being rendered by this component */
  staticCurvedLineSet: CurvedLineShape<any>[] = [];

  // Keeps track of some maouse interaction states
  mouseHovered = new Map<any, boolean>();

  /**
   * Applies new props injected into this component.
   *
   * @param  props The new properties for this component
   */
  applyBufferChanges(props: IChordChartGLProperties) {

    const {
      staticCurvedLines,
      staticRingLines,
      interactiveCurvedLines,
      interactiveRingLines,
    } = props;

    // Set to true when the quad tree needs to be updated
    let needsTreeUpdate = false;

    // Commit static curved lines
    {
      const numVerticesPerSegment = 6;
      const colorAttributeSize = 4;
      const length = 20;

      BufferUtil.beginUpdates();

      for (const curvedLine of staticCurvedLines) {

        needsTreeUpdate = BufferUtil.updateBuffer(
          staticCurvedLines, this.staticCurvedBufferItems,
          numVerticesPerSegment, length,
          function(i: number, positions: Float32Array, ppos: number, colors: Float32Array, cpos: number,
            normals: Float32Array, npos: number, endPoints: Float32Array, epos: number,
            controlPoints: Float32Array, copos: number) {

            // Copy first vertex twice for intro degenerate tri
            positions[ppos] = (i + 1) / length;
            positions[++ppos] = length;
            positions[++ppos] = curvedLine.depth;
            // Skip over degenerate tris color
            cpos += colorAttributeSize;
            normals[npos] = 1;
            endPoints[epos] = curvedLine.p1.x;
            endPoints[++epos] = curvedLine.p1.y;
            endPoints[++epos] = curvedLine.p2.x;
            endPoints[++epos] = curvedLine.p2.y;
            controlPoints[copos] = curvedLine.controlPoints[0].x;
            controlPoints[++copos] = curvedLine.controlPoints[0].y;

            // TR
            positions[++ppos] = (i + 1) / length;
            positions[++ppos] = length;
            positions[++ppos] = curvedLine.depth;
            colors[cpos] = curvedLine.r;
            colors[++cpos] = curvedLine.g;
            colors[++cpos] = curvedLine.b;
            colors[++cpos] = curvedLine.a;
            normals[++npos] = 1;
            endPoints[++epos] = curvedLine.p1.x;
            endPoints[++epos] = curvedLine.p1.y;
            endPoints[++epos] = curvedLine.p2.x;
            endPoints[++epos] = curvedLine.p2.y;
            controlPoints[++copos] = curvedLine.controlPoints[0].x;
            controlPoints[++copos] = curvedLine.controlPoints[0].y;

            // BR
            positions[++ppos] = (i + 1) / length;
            positions[++ppos] = length;
            positions[++ppos] = curvedLine.depth;
            colors[++cpos] = curvedLine.r;
            colors[++cpos] = curvedLine.g;
            colors[++cpos] = curvedLine.b;
            colors[++cpos] = curvedLine.a;
            normals[++npos] = -1;
            endPoints[++epos] = curvedLine.p1.x;
            endPoints[++epos] = curvedLine.p1.y;
            endPoints[++epos] = curvedLine.p2.x;
            endPoints[++epos] = curvedLine.p2.y;
            controlPoints[++copos] = curvedLine.controlPoints[0].x;
            controlPoints[++copos] = curvedLine.controlPoints[0].y;

            // TL
            positions[++ppos] = i / length;
            positions[++ppos] = length;
            positions[++ppos] = curvedLine.depth;
            colors[++cpos] = curvedLine.r;
            colors[++cpos] = curvedLine.g;
            colors[++cpos] = curvedLine.b;
            colors[++cpos] = curvedLine.a;
            normals[++npos] = 1;
            endPoints[++epos] = curvedLine.p1.x;
            endPoints[++epos] = curvedLine.p1.y;
            endPoints[++epos] = curvedLine.p2.x;
            endPoints[++epos] = curvedLine.p2.y;
            controlPoints[++copos] = curvedLine.controlPoints[0].x;
            controlPoints[++copos] = curvedLine.controlPoints[0].y;

            // BL
            positions[++ppos] = i / length;
            positions[++ppos] = length;
            positions[++ppos] = curvedLine.depth;
            colors[++cpos] = curvedLine.r;
            colors[++cpos] = curvedLine.g;
            colors[++cpos] = curvedLine.b;
            colors[++cpos] = curvedLine.a;
            normals[++npos] = -1;
            endPoints[++epos] = curvedLine.p1.x;
            endPoints[++epos] = curvedLine.p1.y;
            endPoints[++epos] = curvedLine.p2.x;
            endPoints[++epos] = curvedLine.p2.y;
            controlPoints[++copos] = curvedLine.controlPoints[0].x;
            controlPoints[++copos] = curvedLine.controlPoints[0].y;

            // Copy last vertex again for degenerate tri
            positions[++ppos] = i / length;
            positions[++ppos] = length;
            positions[++ppos] = curvedLine.depth;
            // Skip over degenerate tris for color
            cpos += colorAttributeSize;
            normals[++npos] = -1;
            endPoints[++epos] = curvedLine.p1.x;
            endPoints[++epos] = curvedLine.p1.y;
            endPoints[++epos] = curvedLine.p2.x;
            endPoints[++epos] = curvedLine.p2.y;
            controlPoints[++copos] = curvedLine.controlPoints[0].x;
            controlPoints[++copos] = curvedLine.controlPoints[0].y;
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
    }

    // Commit ring curved lines using old methods
    {
      const numVerticesPerSegment = 6;
      const colorAttributeSize = 4;
      let stripPos = 0;

      BufferUtil.beginUpdates();

      for (const curvedLine of staticRingLines){
        const strip = curvedLine.getTriangleStrip();
        let TR;
        let BR;
        let TL;
        let BL;

        needsTreeUpdate = BufferUtil.updateBuffer(staticRingLines, this.staticRingBufferItems, numVerticesPerSegment, strip.length / 4,
        function(i: number, positions: Float32Array, ppos: number, colors: Float32Array, cpos: number){
          stripPos = i * 4;
          TR = strip[stripPos];
          BR = strip[stripPos + 1];
          TL = strip[stripPos + 2];
          BL = strip[stripPos + 3];
          // 1
          positions[ppos] = TR.x;
          positions[++ppos] = TR.y;
          positions[++ppos] = curvedLine.depth;
          cpos += colorAttributeSize;

          // 2
          positions[++ppos] = TR.x;
          positions[++ppos] = TR.y;
          positions[++ppos] = curvedLine.depth;
          colors[cpos] = curvedLine.r;
          colors[++cpos] = curvedLine.g;
          colors[++cpos] = curvedLine.b;
          colors[++cpos] = curvedLine.a;

          // 3
          positions[++ppos] = BR.x;
          positions[++ppos] = BR.y;
          positions[++ppos] = curvedLine.depth;
          colors[++cpos] = curvedLine.r;
          colors[++cpos] = curvedLine.g;
          colors[++cpos] = curvedLine.b;
          colors[++cpos] = curvedLine.a;

          // 4
          positions[++ppos] = TL.x;
          positions[++ppos] = TL.y;
          positions[++ppos] = curvedLine.depth;
          colors[++cpos] = curvedLine.r;
          colors[++cpos] = curvedLine.g;
          colors[++cpos] = curvedLine.b;
          colors[++cpos] = curvedLine.a;

          // 5
          positions[++ppos] = BL.x;
          positions[++ppos] = BL.y;
          positions[++ppos] = curvedLine.depth;
          colors[++cpos] = curvedLine.r;
          colors[++cpos] = curvedLine.g;
          colors[++cpos] = curvedLine.b;
          colors[++cpos] = curvedLine.a;

          // 6
          positions[++ppos] = BL.x;
          positions[++ppos] = BL.y;
          positions[++ppos] = curvedLine.depth;
          cpos += colorAttributeSize;
        },
      );

        if (!needsTreeUpdate){
          break;
        }
      }

      const numBatches = BufferUtil.endUpdates();

      if (needsTreeUpdate){
        this.staticRingBufferItems.geometry.setDrawRange(0, numVerticesPerSegment * numBatches);
      }
    }

    // Commit interactive curved lines
    {
      const numVerticesPerSegment = 6;
      const colorAttributeSize = 4;
      let willUpdate = false;
      const length = 20;

      BufferUtil.beginUpdates();

      for (const curvedLine of interactiveCurvedLines) {
        willUpdate = BufferUtil.updateBuffer(
          interactiveCurvedLines, this.interactiveCurvedBufferItems,
          numVerticesPerSegment, length,
          function(i: number, positions: Float32Array, ppos: number, colors: Float32Array, cpos: number,
            normals: Float32Array, npos: number, endPoints: Float32Array, epos: number,
            controlPoints: Float32Array, copos: number) {

            // Copy first vertex twice for intro degenerate tri
            positions[ppos] = (i + 1) / length;
            positions[++ppos] = length;
            positions[++ppos] = curvedLine.depth;
            // Skip over degenerate tris color
            cpos += colorAttributeSize;
            normals[npos] = 1;
            endPoints[epos] = curvedLine.p1.x;
            endPoints[++epos] = curvedLine.p1.y;
            endPoints[++epos] = curvedLine.p2.x;
            endPoints[++epos] = curvedLine.p2.y;
            controlPoints[copos] = curvedLine.controlPoints[0].x;
            controlPoints[++copos] = curvedLine.controlPoints[0].y;

            // TR
            positions[++ppos] = (i + 1) / length;
            positions[++ppos] = length;
            positions[++ppos] = curvedLine.depth;
            colors[cpos] = curvedLine.r;
            colors[++cpos] = curvedLine.g;
            colors[++cpos] = curvedLine.b;
            colors[++cpos] = curvedLine.a;
            normals[++npos] = 1;
            endPoints[++epos] = curvedLine.p1.x;
            endPoints[++epos] = curvedLine.p1.y;
            endPoints[++epos] = curvedLine.p2.x;
            endPoints[++epos] = curvedLine.p2.y;
            controlPoints[++copos] = curvedLine.controlPoints[0].x;
            controlPoints[++copos] = curvedLine.controlPoints[0].y;

            // BR
            positions[++ppos] = (i + 1) / length;
            positions[++ppos] = length;
            positions[++ppos] = curvedLine.depth;
            colors[++cpos] = curvedLine.r;
            colors[++cpos] = curvedLine.g;
            colors[++cpos] = curvedLine.b;
            colors[++cpos] = curvedLine.a;
            normals[++npos] = -1;
            endPoints[++epos] = curvedLine.p1.x;
            endPoints[++epos] = curvedLine.p1.y;
            endPoints[++epos] = curvedLine.p2.x;
            endPoints[++epos] = curvedLine.p2.y;
            controlPoints[++copos] = curvedLine.controlPoints[0].x;
            controlPoints[++copos] = curvedLine.controlPoints[0].y;

            // TL
            positions[++ppos] = i / length;
            positions[++ppos] = length;
            positions[++ppos] = curvedLine.depth;
            colors[++cpos] = curvedLine.r;
            colors[++cpos] = curvedLine.g;
            colors[++cpos] = curvedLine.b;
            colors[++cpos] = curvedLine.a;
            normals[++npos] = 1;
            endPoints[++epos] = curvedLine.p1.x;
            endPoints[++epos] = curvedLine.p1.y;
            endPoints[++epos] = curvedLine.p2.x;
            endPoints[++epos] = curvedLine.p2.y;
            controlPoints[++copos] = curvedLine.controlPoints[0].x;
            controlPoints[++copos] = curvedLine.controlPoints[0].y;

            // BL
            positions[++ppos] = i / length;
            positions[++ppos] = length;
            positions[++ppos] = curvedLine.depth;
            colors[++cpos] = curvedLine.r;
            colors[++cpos] = curvedLine.g;
            colors[++cpos] = curvedLine.b;
            colors[++cpos] = curvedLine.a;
            normals[++npos] = -1;
            endPoints[++epos] = curvedLine.p1.x;
            endPoints[++epos] = curvedLine.p1.y;
            endPoints[++epos] = curvedLine.p2.x;
            endPoints[++epos] = curvedLine.p2.y;
            controlPoints[++copos] = curvedLine.controlPoints[0].x;
            controlPoints[++copos] = curvedLine.controlPoints[0].y;

            // Copy last vertex again for degenerate tri
            positions[++ppos] = i / length;
            positions[++ppos] = length;
            positions[++ppos] = curvedLine.depth;
            // Skip over degenerate tris for color
            cpos += colorAttributeSize;
            normals[++npos] = -1;
            endPoints[++epos] = curvedLine.p1.x;
            endPoints[++epos] = curvedLine.p1.y;
            endPoints[++epos] = curvedLine.p2.x;
            endPoints[++epos] = curvedLine.p2.y;
            controlPoints[++copos] = curvedLine.controlPoints[0].x;
            controlPoints[++copos] = curvedLine.controlPoints[0].y;
          },
        );

        // If no updating is happening, just quit the loop
        if (!willUpdate) {
          break;
        }
      }

      const numBatches = BufferUtil.endUpdates();

      // Only if updates happened, should this change
      if (willUpdate) {
        this.interactiveCurvedBufferItems.geometry.setDrawRange(0, numVerticesPerSegment * numBatches);
      }

      this.forceDraw = true;
    }

    // Commit interactive ring curves
    {
      const numVerticesPerSegment = 6;
      const colorAttributeSize = 4;
      let stripPos = 0;
      let willUpdate = false;

      BufferUtil.beginUpdates();

      for (const curvedLine of interactiveRingLines){
        const strip = curvedLine.getTriangleStrip();
        let TR;
        let BR;
        let TL;
        let BL;

        willUpdate = BufferUtil.updateBuffer(
          interactiveRingLines, this.interactiveRingBufferItems,
          numVerticesPerSegment, strip.length / 4.0,
          function(i: number, positions: Float32Array, ppos: number, colors: Float32Array, cpos: number){
            stripPos = i * 4;
            TR = strip[stripPos];
            BR = strip[stripPos + 1];
            TL = strip[stripPos + 2];
            BL = strip[stripPos + 3];
            // 1
            positions[ppos] = TR.x;
            positions[++ppos] = TR.y;
            positions[++ppos] = curvedLine.depth;
            cpos += colorAttributeSize;

            // 2
            positions[++ppos] = TR.x;
            positions[++ppos] = TR.y;
            positions[++ppos] = curvedLine.depth;
            colors[cpos] = curvedLine.r;
            colors[++cpos] = curvedLine.g;
            colors[++cpos] = curvedLine.b;
            colors[++cpos] = curvedLine.a;

            // 3
            positions[++ppos] = BR.x;
            positions[++ppos] = BR.y;
            positions[++ppos] = curvedLine.depth;
            colors[++cpos] = curvedLine.r;
            colors[++cpos] = curvedLine.g;
            colors[++cpos] = curvedLine.b;
            colors[++cpos] = curvedLine.a;

            // 4
            positions[++ppos] = TL.x;
            positions[++ppos] = TL.y;
            positions[++ppos] = curvedLine.depth;
            colors[++cpos] = curvedLine.r;
            colors[++cpos] = curvedLine.g;
            colors[++cpos] = curvedLine.b;
            colors[++cpos] = curvedLine.a;

            // 5
            positions[++ppos] = BL.x;
            positions[++ppos] = BL.y;
            positions[++ppos] = curvedLine.depth;
            colors[++cpos] = curvedLine.r;
            colors[++cpos] = curvedLine.g;
            colors[++cpos] = curvedLine.b;
            colors[++cpos] = curvedLine.a;

            // 6
            positions[++ppos] = BL.x;
            positions[++ppos] = BL.y;
            positions[++ppos] = curvedLine.depth;
            cpos += colorAttributeSize;
          },
        );

        if (!willUpdate){
          break;
        }
      }

      const numBatches = BufferUtil.endUpdates();

      if (willUpdate){
        this.interactiveRingBufferItems.geometry.setDrawRange(0, numVerticesPerSegment * numBatches);
      }

      this.forceDraw = true;
    }

    if (needsTreeUpdate) {
      if (this.quadTree) {
        this.quadTree.destroy();
        this.quadTree = null;
      }

      // Gather the items to place in the quad tree
      const toAdd: Bounds<any>[] = staticCurvedLines.concat(staticRingLines);

      // Make the new quad tree and insert the new items
      this.quadTree = new QuadTree<Bounds<any>>(0, 0, 0, 0);
      this.quadTree.bounds.copyBounds(toAdd[0]);
      this.quadTree.addAll(toAdd);
    }

    debug('CAMERA %o', this.camera);
  }

  /**
   * @override
   *
   * This special hook is called when the labels are ready for rendering
   *
   * @param props The newly applied props being applied to this component
   */
  applyLabelBufferChanges(props: IChordChartGLProperties) {
    const {
      labels,
      interactiveLabels,
    } = props;

    // Set up any materials that needs the labels.
    {
      // Make sure the uniforms for anything using the label's atlas texture is updated
      const material: ShaderMaterial = this.staticLabelBufferItems.system.material as ShaderMaterial;
      const uniforms: { [k: string]: IUniform } = material.uniforms;
      uniforms.atlasTexture.value = this.atlasManager.getAtlasTexture(this.atlasNames.labels);
      this.atlasManager.getAtlasTexture(this.atlasNames.labels).needsUpdate = true;
      this.atlasManager.getAtlasTexture(this.atlasNames.labels).anisotropy = 2;
    }

    // Apply static labels
    {

      // Make some constants and props for our buffer update loop
      const numVerticesPerQuad = 6;
      const colorAttributeSize = 3;
      const texCoordAttributeSize = 3;
      let label;
      let texture;

      debug('labels are %o', labels);

      BufferUtil.updateBuffer(
        labels, this.staticLabelBufferItems,
        numVerticesPerQuad, labels.length,
        function(i: number, positions: Float32Array, ppos: number, colors: Float32Array, cpos: number, texCoords: Float32Array, tpos: number) {
          label = labels[i];
          texture = label.rasterizedLabel;
          // Make sure the label is updated with it's latest metrics
          label.update();

          // Copy first vertex twice for intro degenerate tri
          positions[ppos] = label.TR.x;
          positions[++ppos] = label.TR.y;
          positions[++ppos] = label.depth;
          // Skip over degenerate tris color and tex
          cpos += colorAttributeSize;
          tpos += texCoordAttributeSize;

          // TR
          positions[++ppos] = label.TR.x;
          positions[++ppos] = label.TR.y;
          positions[++ppos] = label.depth;
          texCoords[tpos] = texture.atlasTR.x;
          texCoords[++tpos] = texture.atlasTR.y;
          texCoords[++tpos] = label.color.opacity;
          colors[cpos] = label.color.r;
          colors[++cpos] = label.color.g;
          colors[++cpos] = label.color.b;
          // BR
          positions[++ppos] = label.BR.x;
          positions[++ppos] = label.BR.y;
          positions[++ppos] = label.depth;
          texCoords[++tpos] = texture.atlasBR.x;
          texCoords[++tpos] = texture.atlasBR.y;
          texCoords[++tpos] = label.color.opacity;
          colors[cpos] = label.color.r;
          colors[++cpos] = label.color.g;
          colors[++cpos] = label.color.b;
          // TL
          positions[++ppos] = label.TL.x;
          positions[++ppos] = label.TL.y;
          positions[++ppos] = label.depth;
          texCoords[++tpos] = texture.atlasTL.x;
          texCoords[++tpos] = texture.atlasTL.y;
          texCoords[++tpos] = label.color.opacity;
          colors[++cpos] = label.color.r;
          colors[++cpos] = label.color.g;
          colors[++cpos] = label.color.b;
          // BL
          positions[++ppos] = label.BL.x;
          positions[++ppos] = label.BL.y;
          positions[++ppos] = label.depth;
          texCoords[++tpos] = texture.atlasBL.x;
          texCoords[++tpos] = texture.atlasBL.y;
          texCoords[++tpos] = label.color.opacity;
          colors[++cpos] = label.color.r;
          colors[++cpos] = label.color.g;
          colors[++cpos] = label.color.b;

          // Copy last vertex again for degenerate tri
          positions[++ppos] = label.BL.x;
          positions[++ppos] = label.BL.y;
          positions[++ppos] = label.depth;
        },
      );

      this.staticLabelBufferItems.geometry.setDrawRange(0, numVerticesPerQuad * labels.length);
    }

    // Apply interactive labels
    {
      // Make some constants and props for our buffer update loop
      const numVerticesPerQuad = 6;
      const colorAttributeSize = 3;
      const texCoordAttributeSize = 3;
      let label;
      let texture;

      BufferUtil.updateBuffer(
        interactiveLabels, this.interactiveLabelBufferItems,
        numVerticesPerQuad, labels.length,
        function(i: number, positions: Float32Array, ppos: number, colors: Float32Array, cpos: number, texCoords: Float32Array, tpos: number) {
         label = labels[i];
          texture = label.rasterizedLabel;
          // Make sure the label is updated with it's latest metrics
          label.update();

          // Copy first vertex twice for intro degenerate tri
          positions[ppos] = label.TR.x;
          positions[++ppos] = label.TR.y;
          positions[++ppos] = label.depth;
          // Skip over degenerate tris color and tex
          cpos += colorAttributeSize;
          tpos += texCoordAttributeSize;

          // TR
          positions[++ppos] = label.TR.x;
          positions[++ppos] = label.TR.y;
          positions[++ppos] = label.depth;
          texCoords[tpos] = texture.atlasTR.x;
          texCoords[++tpos] = texture.atlasTR.y;
          texCoords[++tpos] = label.color.opacity;
          colors[cpos] = label.color.r;
          colors[++cpos] = label.color.g;
          colors[++cpos] = label.color.b;
          // BR
          positions[++ppos] = label.BR.x;
          positions[++ppos] = label.BR.y;
          positions[++ppos] = label.depth;
          texCoords[++tpos] = texture.atlasBR.x;
          texCoords[++tpos] = texture.atlasBR.y;
          texCoords[++tpos] = label.color.opacity;
          colors[cpos] = label.color.r;
          colors[++cpos] = label.color.g;
          colors[++cpos] = label.color.b;
          // TL
          positions[++ppos] = label.TL.x;
          positions[++ppos] = label.TL.y;
          positions[++ppos] = label.depth;
          texCoords[++tpos] = texture.atlasTL.x;
          texCoords[++tpos] = texture.atlasTL.y;
          texCoords[++tpos] = label.color.opacity;
          colors[++cpos] = label.color.r;
          colors[++cpos] = label.color.g;
          colors[++cpos] = label.color.b;
          // BL
          positions[++ppos] = label.BL.x;
          positions[++ppos] = label.BL.y;
          positions[++ppos] = label.depth;
          texCoords[++tpos] = texture.atlasBL.x;
          texCoords[++tpos] = texture.atlasBL.y;
          texCoords[++tpos] = label.color.opacity;
          colors[++cpos] = label.color.r;
          colors[++cpos] = label.color.g;
          colors[++cpos] = label.color.b;

          // Copy last vertex again for degenerate tri
          positions[++ppos] = label.BL.x;
          positions[++ppos] = label.BL.y;
          positions[++ppos] = label.depth;
        },
      );

      this.interactiveLabelBufferItems.geometry.setDrawRange(0, numVerticesPerQuad * labels.length);
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
      fragmentShader: fillFragmentShader,
      transparent: true,
      uniforms: {halfLinewidth: {value: 1.5}},
      vertexShader: bezierVertexShader,
    });

    const ringMaterial = new ShaderMaterial({
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
        {
          defaults: [1],
          name: 'normalDirection',
          size: AttributeSize.ONE,
        },
        {
          defaults: [0, 0, 0, 0],
          name: 'endPoints',
          size: AttributeSize.FOUR,
        },
        {
          defaults: [0, 0],
          name: 'controlPoint',
          size: AttributeSize.TWO,
        },
      ];

      const verticesPerQuad = 6;
      const numQuads = 100000;

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

    // GENERATE RING QUAD BUFFER
    {
      this.staticRingBufferItems.attributes = [
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
      const numQuads = 100000;

      this.staticRingBufferItems.geometry = BufferUtil.makeBuffer(numQuads * verticesPerQuad,
        this.staticRingBufferItems.attributes);
      this.staticRingBufferItems.system = new Mesh(this.staticRingBufferItems.geometry, ringMaterial);
      this.staticRingBufferItems.system.frustumCulled = false;
      this.staticRingBufferItems.system.drawMode = TriangleStripDrawMode;

      this.scene.add(this.staticRingBufferItems.system);
    }

    // GENERATE THE INTERACTION QUAD BUFFER
    {
      this.interactiveCurvedBufferItems.attributes = [
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
          defaults: [1],
          name: 'normalDirection',
          size: AttributeSize.ONE,
        },
        {
          defaults: [0, 0, 0, 0],
          name: 'endPoints',
          size: AttributeSize.FOUR,
        },
        {
          defaults: [0, 0],
          name: 'controlPoint',
          size: AttributeSize.TWO,
        },
      ];

      const verticesPerQuad = 6;
      const numQuads = 100000;

      this.interactiveCurvedBufferItems.geometry = BufferUtil.makeBuffer(numQuads * verticesPerQuad,
         this.interactiveCurvedBufferItems.attributes);
      this.interactiveCurvedBufferItems.system = new Mesh(this.interactiveCurvedBufferItems.geometry,
         quadMaterial);
      this.interactiveCurvedBufferItems.system.frustumCulled = false;
      this.interactiveCurvedBufferItems.system.drawMode = TriangleStripDrawMode;

      // Place the mesh in the scene
      this.scene.add(this.interactiveCurvedBufferItems.system);
    }

    // GENERATE THE INTERACTIVE RING BUFFER
    {
      this.interactiveRingBufferItems.attributes = [
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
      const numQuads = 100000;

      this.interactiveRingBufferItems.geometry = BufferUtil.makeBuffer(numQuads * verticesPerQuad,
         this.interactiveRingBufferItems.attributes);
      this.interactiveRingBufferItems.system = new Mesh(this.interactiveRingBufferItems.geometry,
        ringMaterial);
      this.interactiveRingBufferItems.system.frustumCulled = false;
      this.interactiveRingBufferItems.system.drawMode = TriangleStripDrawMode;

      // Place the mesh in the scene
      this.scene.add(this.interactiveRingBufferItems.system);
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

    // GENERATE THE INTERACTIVE LABEL BUFFER
    {
      this.interactiveLabelBufferItems.attributes = [
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

      this.interactiveLabelBufferItems.geometry = BufferUtil.makeBuffer(numQuads * verticesPerQuad, this.interactiveLabelBufferItems.attributes);
      this.interactiveLabelBufferItems.system = new Mesh(this.interactiveLabelBufferItems.geometry, textureMaterial);
      this.interactiveLabelBufferItems.system.frustumCulled = false;
      this.interactiveLabelBufferItems.system.drawMode = TriangleStripDrawMode;

      // Place the mesh in the scene
      this.scene.add(this.interactiveLabelBufferItems.system);
    }
  }

  onMouseHover(hitInside: Bounds<any>[], mouse: IPoint, world: IPoint, projection: IProjection) {
    // Filter out curves that presently exist in interactiveCurvedLines
    // Includes outerRings and chords
    const hitCurvedLines = filterQuery<CurvedLineShape<any>>([CurvedLineShape], hitInside);
    // We want the user to be a specified distance in SCREEN PIXELS to interact with the lines
    const screenDistance = projection.screenSizeToWorld(1, 1).width;
    // This will keep track of all items that were hovered but are no longer hovered
    const leftItems: CurvedLineShape<any>[] = [];

    const selections = hitCurvedLines.filter((curve, idx) => {
      if (curve.distanceTo(world) < screenDistance) {
        this.mouseHovered.set(curve, true);
        return true;
      }

      else if (this.mouseHovered.get(curve)) {
        this.mouseHovered.delete(curve);
        leftItems.push(curve);
      }

      return false;
    });

    if (this.props.onMouseHover){
      this.props.onMouseHover(selections, mouse, world, projection);
    }

    if (this.props.onMouseLeave){
      this.props.onMouseLeave(leftItems, mouse, world, projection);
    }
  }

  onMouseLeave(left: Bounds<any>[], mouse: IPoint, world: IPoint, projection: IProjection) {
    // Const selections: CurvedLineShape<any>[] = [];
    const leftCurvedLines = filterQuery<CurvedLineShape<any>>([CurvedLineShape], left);
    // We want the user to be a specified distance in SCREEN PIXELS to interact with the lines
    const screenDistance = projection.screenSizeToWorld(1, 1).width;

    const selections = leftCurvedLines.filter((curve, idx) => {
      if (curve.distanceTo(world) > screenDistance) {
        if (this.mouseHovered.get(curve)) {
          this.mouseHovered.delete(curve);
          return true;
        }
      }
      return false;
    });

    if (this.props.onMouseLeave){
      this.props.onMouseLeave(selections, mouse, world, projection);
    }
  }

  onMouseUp(e: React.MouseEvent<HTMLDivElement>, hitInside: Bounds<any>[], mouse: IPoint, world: IPoint, projection: IProjection) {
    // Const selections: CurvedLineShape<any>[] = [];
    debug('ccg mouse up');
    const clickedCurvedLines = filterQuery<CurvedLineShape<any>>([CurvedLineShape], hitInside);
    // We want the user to be a specified distance in SCREEN PIXELS to interact with the lines
    const screenDistance = projection.screenSizeToWorld(1, 1).width;

    const selections = clickedCurvedLines.filter((curve, idx) => {
      if (curve.distanceTo(world) < screenDistance) {
        return true;
      }
      return false;
    });

    if (this.props.onMouseUp){
      this.props.onMouseUp(selections, mouse, world, projection);
    }
  }

  /**
   * Any uniforms tied to changes in the camera are updated here
   */
  updateCameraUniforms() {
    // NOTE: Implement if required. Leave empty to prevent any default behavior
  }
}
