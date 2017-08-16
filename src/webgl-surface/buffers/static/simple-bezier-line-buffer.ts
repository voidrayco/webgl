import { Mesh, TriangleStripDrawMode } from 'three';
import { ShaderMaterial } from 'three';
import { CurvedLineShape } from '../../drawing/curved-line-shape';
import { AttributeSize, BufferUtil } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

export class SimpleStaticBezierLineBuffer extends BaseBuffer<CurvedLineShape<any>, Mesh> {
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
   * @param shapeBuffer
   */
  update(shapeBuffer: CurvedLineShape<any>[]) {
    if (!shapeBuffer) {
      return false;
    }

    // Commit static curved lines
    let needsUpdate = false;
    const numVerticesPerSegment = 6;
    const colorAttributeSize = 4;
    const length = 20;

    BufferUtil.beginUpdates();

    for (const curvedLine of shapeBuffer) {
      needsUpdate = BufferUtil.updateBuffer(
        shapeBuffer, this.bufferItems,
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
