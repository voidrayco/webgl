import { Color, Mesh, ShaderMaterial, TriangleStripDrawMode } from 'three';
import { CurvedLineShape } from '../../drawing/shape/curved-line-shape';
import { RibbonShape } from '../../drawing/shape/ribbon-shape';
import { CurvedLine } from '../../primitives/curved-line';
import { IPoint } from '../../primitives/point';
import { AttributeSize, BufferUtil } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

export class SimpleStaticRibbonBuffer extends BaseBuffer < RibbonShape < any >,
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
        name: 'endPoints1',
        size: AttributeSize.FOUR,
      },
      {
        defaults: [0, 0, 0, 0],
        name: 'endPoints2',
        size: AttributeSize.FOUR,
      },
      {
        defaults: [0, 0],
        name: 'controlPoint',
        size: AttributeSize.TWO,
      },
      {
        defaults: [0, 0, 0, 0],
        name: 'centers',
        size: AttributeSize.FOUR,
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
  update(shapeBuffer: RibbonShape<any>[]) {
    if (!shapeBuffer) {
      this.bufferItems.geometry.setDrawRange(0, 0);
      return false;
    }

    // Commit static curved lines
    const colorAttributeSize = 4;
    const numVerticesPerSegment = 6;
    let length = 15;
    let needsUpdate = false;

    let p1: IPoint;
    let p2: IPoint;
    let p3: IPoint;
    let p4: IPoint;

    let color: Color;
    let alpha: number;

    BufferUtil.beginUpdates();

    for (const ribbon of shapeBuffer) {
      alpha = ribbon.startColor.base.opacity;
      color = ribbon.startColor.base.color;

      length = ribbon.resolution;
      p1 = ribbon.line1.start;
      p2 = ribbon.line1.end;

      p3 = ribbon.line2.start;
      p4 = ribbon.line2.end;

      needsUpdate = BufferUtil.updateBuffer(
        shapeBuffer, this.bufferItems,
        numVerticesPerSegment, length,
        function(i: number,
          positions: Float32Array, ppos: number,
          colors: Float32Array, cpos: number,
          normals: Float32Array, npos: number,
          endPoints1: Float32Array, epos1: number,
          endPoints2: Float32Array, epos2: number,
          controlPoints: Float32Array, copos: number,
          centers: Float32Array, cepos: number,
        ) {

          // Copy first vertex twice for intro degenerate tri
          positions[ppos] = (i + 1) / length;
          positions[++ppos] = length;
          positions[++ppos] = ribbon.depth;
          // Skip over degenerate tris color
          cpos += colorAttributeSize;
          normals[npos] = 1;
          endPoints1[epos1] = p1.x;
          endPoints1[++epos1] = p1.y;
          endPoints1[++epos1] = p2.x;
          endPoints1[++epos1] = p2.y;
          endPoints2[epos2] = p3.x;
          endPoints2[++epos2] = p3.y;
          endPoints2[++epos2] = p4.x;
          endPoints2[++epos2] = p4.y;
          controlPoints[copos] = ribbon.line1.controlPoints[0].x;
          controlPoints[++copos] = ribbon.line1.controlPoints[0].y;
          centers[cepos] = ribbon.center1.x;
          centers[++cepos] = ribbon.center1.y;
          centers[++cepos] = ribbon.center2.x;
          centers[++cepos] = ribbon.center2.y;

          // TR
          positions[++ppos] = (i + 1) / length;
          positions[++ppos] = length;
          positions[++ppos] = ribbon.depth;
          normals[++npos] = 1;
          colors[cpos] = color.r;
          colors[++cpos] = color.g;
          colors[++cpos] = color.b;
          colors[++cpos] = alpha;
          endPoints1[++epos1] = p1.x;
          endPoints1[++epos1] = p1.y;
          endPoints1[++epos1] = p2.x;
          endPoints1[++epos1] = p2.y;
          endPoints2[++epos2] = p3.x;
          endPoints2[++epos2] = p3.y;
          endPoints2[++epos2] = p4.x;
          endPoints2[++epos2] = p4.y;
          controlPoints[++copos] = ribbon.line1.controlPoints[0].x;
          controlPoints[++copos] = ribbon.line1.controlPoints[0].y;
          centers[++cepos] = ribbon.center1.x;
          centers[++cepos] = ribbon.center1.y;
          centers[++cepos] = ribbon.center2.x;
          centers[++cepos] = ribbon.center2.y;

          // BR
          positions[++ppos] = (i + 1) / length;
          positions[++ppos] = length;
          positions[++ppos] = ribbon.depth;
          normals[++npos] = -1;
          colors[++cpos] = color.r;
          colors[++cpos] = color.g;
          colors[++cpos] = color.b;
          colors[++cpos] = alpha;
          endPoints1[++epos1] = p1.x;
          endPoints1[++epos1] = p1.y;
          endPoints1[++epos1] = p2.x;
          endPoints1[++epos1] = p2.y;
          endPoints2[++epos2] = p3.x;
          endPoints2[++epos2] = p3.y;
          endPoints2[++epos2] = p4.x;
          endPoints2[++epos2] = p4.y;
          controlPoints[++copos] = ribbon.line1.controlPoints[0].x;
          controlPoints[++copos] = ribbon.line1.controlPoints[0].y;
          centers[++cepos] = ribbon.center1.x;
          centers[++cepos] = ribbon.center1.y;
          centers[++cepos] = ribbon.center2.x;
          centers[++cepos] = ribbon.center2.y;

          // TL
          positions[++ppos] = i / length;
          positions[++ppos] = length;
          positions[++ppos] = ribbon.depth;
          normals[++npos] = 1;
          colors[++cpos] = color.r;
          colors[++cpos] = color.g;
          colors[++cpos] = color.b;
          colors[++cpos] = alpha;
          endPoints1[++epos1] = p1.x;
          endPoints1[++epos1] = p1.y;
          endPoints1[++epos1] = p2.x;
          endPoints1[++epos1] = p2.y;
          endPoints2[++epos2] = p3.x;
          endPoints2[++epos2] = p3.y;
          endPoints2[++epos2] = p4.x;
          endPoints2[++epos2] = p4.y;
          controlPoints[++copos] = ribbon.line1.controlPoints[0].x;
          controlPoints[++copos] = ribbon.line1.controlPoints[0].y;
          centers[++cepos] = ribbon.center1.x;
          centers[++cepos] = ribbon.center1.y;
          centers[++cepos] = ribbon.center2.x;
          centers[++cepos] = ribbon.center2.y;

          // BL
          positions[++ppos] = i / length;
          positions[++ppos] = length;
          positions[++ppos] = ribbon.depth;
          normals[++npos] = -1;
          colors[++cpos] = color.r;
          colors[++cpos] = color.g;
          colors[++cpos] = color.b;
          colors[++cpos] = alpha;
          endPoints1[++epos1] = p1.x;
          endPoints1[++epos1] = p1.y;
          endPoints1[++epos1] = p2.x;
          endPoints1[++epos1] = p2.y;
          endPoints2[++epos2] = p3.x;
          endPoints2[++epos2] = p3.y;
          endPoints2[++epos2] = p4.x;
          endPoints2[++epos2] = p4.y;
          controlPoints[++copos] = ribbon.line1.controlPoints[0].x;
          controlPoints[++copos] = ribbon.line1.controlPoints[0].y;
          centers[++cepos] = ribbon.center1.x;
          centers[++cepos] = ribbon.center1.y;
          centers[++cepos] = ribbon.center2.x;
          centers[++cepos] = ribbon.center2.y;

          // Copy last vertex again for degenerate tri
          positions[++ppos] = i / length;
          positions[++ppos] = length;
          positions[++ppos] = ribbon.depth;
          // Skip over degenerate tris for color
          cpos += colorAttributeSize;
          normals[++npos] = -1;
          endPoints1[++epos1] = p1.x;
          endPoints1[++epos1] = p1.y;
          endPoints1[++epos1] = p2.x;
          endPoints1[++epos1] = p2.y;
          endPoints2[++epos2] = p3.x;
          endPoints2[++epos2] = p3.y;
          endPoints2[++epos2] = p4.x;
          endPoints2[++epos2] = p4.y;
          controlPoints[++copos] = ribbon.line1.controlPoints[0].x;
          controlPoints[++copos] = ribbon.line1.controlPoints[0].y;
          centers[++cepos] = ribbon.center1.x;
          centers[++cepos] = ribbon.center1.y;
          centers[++cepos] = ribbon.center2.x;
          centers[++cepos] = ribbon.center2.y;
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
