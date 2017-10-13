import { IUniform, Mesh, ShaderMaterial, TriangleStripDrawMode } from 'three';
import { AnimatedCurvedLineShape } from '../../drawing';
import { ReferenceColor } from '../../drawing/reference/reference-color';
import { CurvedLineShape } from '../../drawing/shape/curved-line-shape';
import { AtlasManager } from '../../drawing/texture/atlas-manager';
import { IPoint } from '../../primitives/point';
import { AttributeSize, BufferUtil } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

/**
 * This renders a curved line by injecting all attributes needed to render it.
 * This naively includes all possible data in the vertex.
 *
 * This only supports atlas colors.
 */
export class SharedControlCurvedLineColorsBuffer extends BaseBuffer <CurvedLineShape<any>, Mesh> {
  /**
   * @override
   * See interface definition
   */
  init(material: ShaderMaterial, unitCount: number) {
    this.bufferItems = BufferUtil.makeBufferItems();

    this.bufferItems.attributes = [
      {
        defaults: [0, 0, 0],
        name: 'position',
        size: AttributeSize.THREE,
      },
      {
        defaults: [0, 0, 0, 0],
        name: 'colorPicks',
        size: AttributeSize.FOUR,
      },
      {
        defaults: [0],
        name: 'controlPick',
        size: AttributeSize.ONE,
      },
      {
        defaults: [0, 0],
        name: 'timing',
        size: AttributeSize.TWO,
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
        defaults: [0],
        name: 'halfLinewidth',
        size: AttributeSize.ONE,
      },
    ];

    const verticesPerQuad = 6;
    const numQuads = unitCount;

    this.bufferItems.geometry = BufferUtil.makeBuffer(
      numQuads * verticesPerQuad,
      this.bufferItems.attributes,
    );

    this.bufferItems.system = new Mesh(
      this.bufferItems.geometry,
      material,
    );

    this.bufferItems.system.frustumCulled = false;
    this.bufferItems.system.drawMode = TriangleStripDrawMode;
  }

  /**
   * @override
   * See interface definition
   *
   * @param {CurvedLineShape<any>[]} shapeBuffer A buffer of curved line shapes
   * @param {AtlasManager} atlasManager The Atlas Manager that contains the color atlas
   *                                    needed for rendering with color picks.
   */
  update(shapeBuffer: AnimatedCurvedLineShape<any>[], atlasManager?: AtlasManager) {
    if (!shapeBuffer) {
      return false;
    }

    const controlPoints: number[] = [];
    const controlReference = new Map<IPoint, number>();
    let controlUniform: IUniform;

    // As this is a single material, we have to assume that the color atlas
    // For our shapes will be the same atlas for all colors. Thus, the atlas
    // Information for one color will be valid for all colors
    if (shapeBuffer && shapeBuffer.length > 0 && atlasManager) {
      const colorRef: ReferenceColor = shapeBuffer[0].startColor;
      const colorBase = colorRef.base;

      // Update all uniforms for this material to utilize the atlas metrics for
      // Picking colors
      const material: ShaderMaterial = this.bufferItems.system.material as ShaderMaterial;
      const uniforms: { [k: string]: IUniform } = material.uniforms;
      const atlas = atlasManager.getAtlasTexture(colorBase.atlasReferenceID);
      uniforms.colorAtlas.value = atlas;
      uniforms.colorsPerRow.value = colorBase.colorsPerRow;
      uniforms.firstColor.value = [colorBase.firstColor.x, colorBase.firstColor.y];
      uniforms.nextColor.value = [colorBase.nextColor.x, colorBase.nextColor.y];
      // This is the shared control points for all of the vertices
      controlUniform = uniforms.controlPoints;
      atlas.needsUpdate = true;
    }

    // Commit static curved lines
    const colorAttributeSize = 4;
    const numVerticesPerSegment = 6;
    const timingAttributeSize = 2;
    let halfWidthSize = 1;
    let length = 15;
    let needsUpdate = false;
    let p1: IPoint;
    let p2: IPoint;
    let colorStart: number;
    let colorStartStop: number;
    let colorEnd: number;
    let colorEndStop: number;
    let alpha: number;
    let startTime: number;
    let duration: number;
    let controlRef: number;
    let controlPoint: IPoint;

    BufferUtil.beginUpdates();

    for (const curvedLine of shapeBuffer) {
      alpha = curvedLine.startColor.base.opacity;
      colorEnd = curvedLine.endColor.base.colorIndex;
      colorEndStop = curvedLine.endColorStop.base.colorIndex;
      colorStart = curvedLine.startColor.base.colorIndex;
      colorStartStop = curvedLine.startColorStop.base.colorIndex;
      duration = curvedLine.duration;
      halfWidthSize = curvedLine.lineWidth / 2.0;
      length = curvedLine.resolution;
      p1 = curvedLine.currentStart;
      p2 = curvedLine.currentEnd;
      startTime = curvedLine.startTime;
      controlPoint = curvedLine.controlPoints[1];
      controlRef = controlReference.get(controlPoint);

      if (controlRef === undefined) {
        const length = controlPoints.push(controlPoint.x, controlPoint.y);
        controlRef = length - 2;
        controlReference.set(controlPoint, controlRef);
      }

      needsUpdate = BufferUtil.updateBuffer(
        shapeBuffer, this.bufferItems,
        numVerticesPerSegment, length,
        function(i: number,
          positions: Float32Array, ppos: number,
          colorPicks: Float32Array, cpos: number,
          controlPick: Float32Array, ctpos: number,
          timing: Float32Array, tpos: number,
          normals: Float32Array, npos: number,
          endPoints: Float32Array, epos: number,
          halfWidth: Float32Array, wpos: number,
        ) {

          // Copy first vertex twice for intro degenerate tri
          controlPick[ctpos] = controlRef;
          cpos += colorAttributeSize;
          endPoints[epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          halfWidth[wpos] = halfWidthSize;
          normals[npos] = 1;
          positions[ppos] = (i + 1) / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          tpos += timingAttributeSize;

          // TR
          colorPicks[cpos] = colorStart;
          colorPicks[++cpos] = colorStartStop;
          colorPicks[++cpos] = colorEnd;
          colorPicks[++cpos] = colorEndStop;
          controlPick[++ctpos] = controlRef;
          endPoints[++epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          halfWidth[++wpos] = halfWidthSize;
          normals[++npos] = 1;
          positions[++ppos] = (i + 1) / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          timing[tpos] = startTime;
          timing[++tpos] = duration;

          // BR
          colorPicks[++cpos] = colorStart;
          colorPicks[++cpos] = colorStartStop;
          colorPicks[++cpos] = colorEnd;
          colorPicks[++cpos] = colorEndStop;
          controlPick[++ctpos] = controlRef;
          endPoints[++epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          halfWidth[++wpos] = halfWidthSize;
          normals[++npos] = -1;
          positions[++ppos] = (i + 1) / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          timing[++tpos] = startTime;
          timing[++tpos] = duration;

          // TL
          colorPicks[++cpos] = colorStart;
          colorPicks[++cpos] = colorStartStop;
          colorPicks[++cpos] = colorEnd;
          colorPicks[++cpos] = colorEndStop;
          controlPick[++ctpos] = controlRef;
          endPoints[++epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          halfWidth[++wpos] = halfWidthSize;
          normals[++npos] = 1;
          positions[++ppos] = i / length;
          positions[++ppos] = curvedLine.depth;
          positions[++ppos] = length;
          timing[++tpos] = startTime;
          timing[++tpos] = duration;

          // BL
          colorPicks[++cpos] = colorStart;
          colorPicks[++cpos] = colorStartStop;
          colorPicks[++cpos] = colorEnd;
          colorPicks[++cpos] = colorEndStop;
          controlPick[++ctpos] = controlRef;
          endPoints[++epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          halfWidth[++wpos] = halfWidthSize;
          normals[++npos] = -1;
          positions[++ppos] = i / length;
          positions[++ppos] = curvedLine.depth;
          positions[++ppos] = length;
          timing[++tpos] = startTime;
          timing[++tpos] = duration;

          // Copy last vertex again for degenerate tri
          positions[++ppos] = i / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          halfWidth[++wpos] = halfWidthSize;
          // Skip over degenerate tris for color
          cpos += colorAttributeSize;
          normals[++npos] = -1;
          endPoints[++epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          controlPick[++ctpos] = controlRef;
        },
        // We force updates for this buffer since it has animated properties
        // such as currentStartStop and currentEndStop which calculates
        // animations on the CPU side.
        true,
      );

      // If no updating is happening, just quit the loop
      if (!needsUpdate) {
        break;
      }
    }

    const numBatches = BufferUtil.endUpdates();

    if (controlUniform) {
      controlUniform.value = controlPoints;

      const material: ShaderMaterial = this.bufferItems.system.material as ShaderMaterial;
      const uniforms: { [k: string]: IUniform } = material.uniforms;
    }

    // Only if updates happened, should this change
    if (needsUpdate) {
      this.bufferItems.geometry.setDrawRange(0, numVerticesPerSegment * numBatches);
    }

    else if (shapeBuffer.length === 0) {
      this.bufferItems.geometry.setDrawRange(0, 0);
    }

    return needsUpdate;
  }
}
