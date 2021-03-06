import { Color, Mesh, TriangleStripDrawMode } from 'three';
import { ShaderMaterial } from 'three';
import { CurvedLineShape } from '../../drawing/shape/curved-line-shape';
import { AttributeSize, BufferUtil } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

export class SimpleStaticLineBuffer extends BaseBuffer<CurvedLineShape<any>, Mesh> {
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
    ];

    const verticesPerQuad = 6;
    const numQuads = unitCount;

    this.bufferItems.geometry = BufferUtil.makeBuffer(numQuads * verticesPerQuad,
      this.bufferItems.attributes);
    this.bufferItems.system = new Mesh(this.bufferItems.geometry, material);
    this.bufferItems.system.frustumCulled = false;
    this.bufferItems.system.drawMode = TriangleStripDrawMode;
  }

  /**
   * @override
   * See interface definition
   *
   * @param shapeBuffer
   */
  update(shapeBuffer: CurvedLineShape<any>[]): boolean {
    if (!shapeBuffer) {
      this.bufferItems.geometry.setDrawRange(0, 0);
      return false;
    }

    let needsUpdate = false;
    const numVerticesPerSegment = 6;
    const colorAttributeSize = 4;
    let stripPos = 0;

    BufferUtil.beginUpdates();
    let TR;
    let BR;
    let TL;
    let BL;
    let color: Color;
    let alpha: number;

    for (const curvedLine of shapeBuffer){
      const strip = curvedLine.getTriangleStrip();
      color = curvedLine.startColor.base.color;
      alpha = curvedLine.startColor.base.opacity;

      needsUpdate = BufferUtil.updateBuffer(shapeBuffer, this.bufferItems, numVerticesPerSegment, strip.length / 4,
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
        colors[cpos] = color.r;
        colors[++cpos] = color.g;
        colors[++cpos] = color.b;
        colors[++cpos] = alpha;

        // 3
        positions[++ppos] = BR.x;
        positions[++ppos] = BR.y;
        positions[++ppos] = curvedLine.depth;
        colors[++cpos] = color.r;
        colors[++cpos] = color.g;
        colors[++cpos] = color.b;
        colors[++cpos] = alpha;

        // 4
        positions[++ppos] = TL.x;
        positions[++ppos] = TL.y;
        positions[++ppos] = curvedLine.depth;
        colors[++cpos] = color.r;
        colors[++cpos] = color.g;
        colors[++cpos] = color.b;
        colors[++cpos] = alpha;

        // 5
        positions[++ppos] = BL.x;
        positions[++ppos] = BL.y;
        positions[++ppos] = curvedLine.depth;
        colors[++cpos] = color.r;
        colors[++cpos] = color.g;
        colors[++cpos] = color.b;
        colors[++cpos] = alpha;

        // 6
        positions[++ppos] = BL.x;
        positions[++ppos] = BL.y;
        positions[++ppos] = curvedLine.depth;
        cpos += colorAttributeSize;
      },
    );

      if (!needsUpdate){
        break;
      }
    }

    const numBatches = BufferUtil.endUpdates();

    if (needsUpdate){
      this.bufferItems.geometry.setDrawRange(0, numVerticesPerSegment * numBatches);
    }

    else if (shapeBuffer.length === 0) {
      this.bufferItems.geometry.setDrawRange(0, 0);
    }

    else if (shapeBuffer.length === 0) {
      this.bufferItems.geometry.setDrawRange(0, 0);
    }

    return needsUpdate;
  }
}
