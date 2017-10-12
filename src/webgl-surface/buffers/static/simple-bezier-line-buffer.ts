import { Color, Mesh, ShaderMaterial, TriangleStripDrawMode } from 'three';
import { CurvedLineShape } from '../../drawing/shape/curved-line-shape';
import { IPoint } from '../../primitives/point';
import { AttributeSize, BufferUtil } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

/**
 * This renders a curved line by injecting all attributes needed to render it.
 * This naively includes all possible data in the vertex.
 *
 * This ONLY supports a single color
 */
export class SimpleStaticBezierLineBuffer extends BaseBuffer < CurvedLineShape < any >,
Mesh > {
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
   * @param shapeBuffer
   */
  update(shapeBuffer: CurvedLineShape<any>[]) {
    if (!shapeBuffer) {
      return false;
    }

    // Commit static curved lines
    const colorAttributeSize = 4;
    const numVerticesPerSegment = 6;
    let halfWidthSize = 1;
    let length = 15;
    let needsUpdate = false;
    let p1: IPoint;
    let p2: IPoint;
    let color: Color;
    let alpha: number;

    BufferUtil.beginUpdates();

    for (const curvedLine of shapeBuffer) {
      alpha = curvedLine.startColor.base.opacity;
      color = curvedLine.startColor.base.color;
      halfWidthSize = curvedLine.lineWidth / 2.0;
      length = curvedLine.resolution;
      p1 = curvedLine.start;
      p2 = curvedLine.end;

      needsUpdate = BufferUtil.updateBuffer(
        shapeBuffer, this.bufferItems,
        numVerticesPerSegment, length,
        function(i: number,
          positions: Float32Array, ppos: number,
          colors: Float32Array, cpos: number,
          normals: Float32Array, npos: number,
          endPoints: Float32Array, epos: number,
          controlPoints: Float32Array, copos: number,
          halfWidth: Float32Array, wpos: number,
        ) {

          // Copy first vertex twice for intro degenerate tri
          positions[ppos] = (i + 1) / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          halfWidth[wpos] = halfWidthSize;
          // Skip over degenerate tris color
          cpos += colorAttributeSize;
          normals[npos] = 1;
          endPoints[epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          controlPoints[copos] = curvedLine.controlPoints[0].x;
          controlPoints[++copos] = curvedLine.controlPoints[0].y;

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
          controlPoints[++copos] = curvedLine.controlPoints[0].x;
          controlPoints[++copos] = curvedLine.controlPoints[0].y;
          colors[cpos] = color.r;
          colors[++cpos] = color.g;
          colors[++cpos] = color.b;
          colors[++cpos] = alpha;

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
          controlPoints[++copos] = curvedLine.controlPoints[0].x;
          controlPoints[++copos] = curvedLine.controlPoints[0].y;
          colors[++cpos] = color.r;
          colors[++cpos] = color.g;
          colors[++cpos] = color.b;
          colors[++cpos] = alpha;

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
          controlPoints[++copos] = curvedLine.controlPoints[0].x;
          controlPoints[++copos] = curvedLine.controlPoints[0].y;
          colors[++cpos] = color.r;
          colors[++cpos] = color.g;
          colors[++cpos] = color.b;
          colors[++cpos] = alpha;

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
          controlPoints[++copos] = curvedLine.controlPoints[0].x;
          controlPoints[++copos] = curvedLine.controlPoints[0].y;
          colors[++cpos] = color.r;
          colors[++cpos] = color.g;
          colors[++cpos] = color.b;
          colors[++cpos] = alpha;

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
