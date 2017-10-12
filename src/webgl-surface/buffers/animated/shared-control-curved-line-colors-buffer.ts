import { IUniform, Mesh, ShaderMaterial, TriangleStripDrawMode } from 'three';
import { AnimatedCurvedLineShape } from '../../drawing';
import { ReferenceColor } from '../../drawing/reference/reference-color';
import { CurvedLineShape } from '../../drawing/shape/curved-line-shape';
import { AtlasColor } from '../../drawing/texture/atlas-color';
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
        name: 'startTime',
        size: AttributeSize.ONE,
      },
      {
        defaults: [1000],
        name: 'duration',
        size: AttributeSize.ONE,
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
  update(shapeBuffer: AnimatedCurvedLineShape<any>[], atlasManager?: AtlasManager, sharedControl?: IPoint) {
    if (!shapeBuffer) {
      return false;
    }

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
      // This is the shared control point for all of the vertices
      uniforms.controlPoint.value = [sharedControl.x, sharedControl.y];
      atlas.needsUpdate = true;
    }

    // Commit static curved lines
    const colorAttributeSize = 4;
    const numVerticesPerSegment = 6;
    const startTimeAttributeSize = 1;
    const durationAttributeSize = 1;
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
      p1 = curvedLine.start;
      p2 = curvedLine.end;
      startTime = curvedLine.startTime;

      needsUpdate = BufferUtil.updateBuffer(
        shapeBuffer, this.bufferItems,
        numVerticesPerSegment, length,
        function(i: number,
          positions: Float32Array, ppos: number,
          colorPicks: Float32Array, cpos: number,
          startTimes: Float32Array, stpos: number,
          durations: Float32Array, dpos: number,
          normals: Float32Array, npos: number,
          endPoints: Float32Array, epos: number,
          halfWidth: Float32Array, wpos: number,
        ) {

          // Copy first vertex twice for intro degenerate tri
          positions[ppos] = (i + 1) / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          halfWidth[wpos] = halfWidthSize;
          // Skip over degenerate tris color
          cpos += colorAttributeSize;
          stpos += startTimeAttributeSize;
          dpos += durationAttributeSize;
          normals[npos] = 1;
          endPoints[epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;

          // TR
          positions[++ppos] = (i + 1) / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          halfWidth[++wpos] = halfWidthSize;
          normals[++npos] = 1;
          endPoints[++epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          colorPicks[cpos] = colorStart;
          colorPicks[++cpos] = colorStartStop;
          colorPicks[++cpos] = colorEnd;
          colorPicks[++cpos] = colorEndStop;
          startTimes[stpos] = startTime;
          durations[dpos] = duration;

          // BR
          positions[++ppos] = (i + 1) / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          halfWidth[++wpos] = halfWidthSize;
          normals[++npos] = -1;
          endPoints[++epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          colorPicks[++cpos] = colorStart;
          colorPicks[++cpos] = colorStartStop;
          colorPicks[++cpos] = colorEnd;
          colorPicks[++cpos] = colorEndStop;
          startTimes[++stpos] = startTime;
          durations[++dpos] = duration;

          // TL
          positions[++ppos] = i / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          halfWidth[++wpos] = halfWidthSize;
          normals[++npos] = 1;
          endPoints[++epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          colorPicks[++cpos] = colorStart;
          colorPicks[++cpos] = colorStartStop;
          colorPicks[++cpos] = colorEnd;
          colorPicks[++cpos] = colorEndStop;
          startTimes[++stpos] = startTime;
          durations[++dpos] = duration;

          // BL
          positions[++ppos] = i / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          halfWidth[++wpos] = halfWidthSize;
          normals[++npos] = -1;
          endPoints[++epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          colorPicks[++cpos] = colorStart;
          colorPicks[++cpos] = colorStartStop;
          colorPicks[++cpos] = colorEnd;
          colorPicks[++cpos] = colorEndStop;
          startTimes[++stpos] = startTime;
          durations[++dpos] = duration;

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
        },
      );

      // If no updating is happening, just quit the loop
      if (!needsUpdate) {
        break;
      }
    }

    const numBatches = BufferUtil.endUpdates();

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
