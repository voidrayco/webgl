import { Color, Mesh, TriangleStripDrawMode } from 'three';
import { ShaderMaterial } from 'three';
import { Label } from '../../drawing/shape/label';
import { AttributeSize, BufferUtil } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

const debug = require('debug')('simple-label-buffer');

export class SimpleStaticLabelBuffer extends BaseBuffer<Label<any>, Mesh> {
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
          defaults: [0, 0, 0],
          name: 'customColor',
          size: AttributeSize.THREE,
        },
        {
          defaults: [0, 0, 1],
          name: 'texCoord',
          size: AttributeSize.THREE,
        },
        {
          defaults: [0, 0],
          name: 'size',
          size: AttributeSize.TWO,
        },
        {
          defaults: [0, 0],
          name: 'anchor',
          size: AttributeSize.TWO,
        },
      ];

      const verticesPerQuad = 6;
      const numQuads = unitCount;

      this.bufferItems.geometry = BufferUtil.makeBuffer(
        numQuads * verticesPerQuad,
        this.bufferItems.attributes,
      );

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
  update(shapeBuffer: Label<any>[]): boolean {
    // Make some constants and props for our buffer update loop
    const numVerticesPerQuad = 6;
    const colorAttributeSize = 3;
    const texCoordAttributeSize = 3;
    const sizeAttributSize = 2;
    let label;
    let texture;
    let color: Color;
    let alpha: number;

    debug('labels %o', shapeBuffer);

    if (!shapeBuffer) {
      return false;
    }

    const updated = BufferUtil.updateBuffer(
      shapeBuffer, this.bufferItems,
      numVerticesPerQuad, shapeBuffer.length,
      function(i: number,
               positions: Float32Array,
               ppos: number,
               colors: Float32Array,
               cpos: number,
               texCoords: Float32Array,
               tpos: number,
               sizes: Float32Array,
               spos: number,
               anchors: Float32Array,
               apos: number,
              ) {
        label = shapeBuffer[i];
        texture = label.rasterizedLabel;
        color = label.color.base.color;
        alpha = label.color.base.opacity;
        // Make sure the label is updated with it's latest metrics
        label.update();

        // Copy first vertex twice for intro degenerate tri
        positions[ppos] = label.TR.x;
        positions[++ppos] = label.TR.y;
        positions[++ppos] = label.depth;
        anchors[apos] = label.getLocation().x + label.getSize().width;
        anchors[++apos] = label.getLocation().y;
        // Skip over degenerate tris color and tex
        cpos += colorAttributeSize;
        tpos += texCoordAttributeSize;
        spos += sizeAttributSize;

        // TR
        positions[++ppos] = label.TR.x;
        positions[++ppos] = label.TR.y;
        positions[++ppos] = label.depth;
        texCoords[tpos] = texture.atlasTR.x;
        texCoords[++tpos] = texture.atlasTR.y;
        texCoords[++tpos] = alpha;
        colors[cpos] = color.r;
        colors[++cpos] = color.g;
        colors[++cpos] = color.b;
        sizes[spos] = label.getSize().width;
        sizes[++spos] = label.getSize().height;
        anchors[++apos] = label.getLocation().x + label.getSize().width;
        anchors[++apos] = label.getLocation().y;
        // BR
        positions[++ppos] = label.BR.x;
        positions[++ppos] = label.BR.y;
        positions[++ppos] = label.depth;
        texCoords[++tpos] = texture.atlasBR.x;
        texCoords[++tpos] = texture.atlasBR.y;
        texCoords[++tpos] = alpha;
        colors[++cpos] = color.r;
        colors[++cpos] = color.g;
        colors[++cpos] = color.b;
        sizes[++spos] = label.getSize().width;
        sizes[++spos] = label.getSize().height;
        anchors[++apos] = label.getLocation().x + label.getSize().width;
        anchors[++apos] = label.getLocation().y;
        // TL
        positions[++ppos] = label.TL.x;
        positions[++ppos] = label.TL.y;
        positions[++ppos] = label.depth;
        texCoords[++tpos] = texture.atlasTL.x;
        texCoords[++tpos] = texture.atlasTL.y;
        texCoords[++tpos] = alpha;
        colors[++cpos] = color.r;
        colors[++cpos] = color.g;
        colors[++cpos] = color.b;
        sizes[++spos] = label.getSize().width;
        sizes[++spos] = label.getSize().height;
        anchors[++apos] = label.getLocation().x + label.getSize().width;
        anchors[++apos] = label.getLocation().y;
        // BL
        positions[++ppos] = label.BL.x;
        positions[++ppos] = label.BL.y;
        positions[++ppos] = label.depth;
        texCoords[++tpos] = texture.atlasBL.x;
        texCoords[++tpos] = texture.atlasBL.y;
        texCoords[++tpos] = alpha;
        colors[++cpos] = color.r;
        colors[++cpos] = color.g;
        colors[++cpos] = color.b;
        sizes[++spos] = label.getSize().width;
        sizes[++spos] = label.getSize().height;
        anchors[++apos] = label.getLocation().x + label.getSize().width;
        anchors[++apos] = label.getLocation().y;

        // Copy last vertex again for degenerate tri
        positions[++ppos] = label.BL.x;
        positions[++ppos] = label.BL.y;
        positions[++ppos] = label.depth;
        anchors[++apos] = label.getLocation().x + label.getSize().width;
        anchors[++apos] = label.getLocation().y;
      },
    );

    this.bufferItems.geometry.setDrawRange(0, numVerticesPerQuad * shapeBuffer.length);

    return updated;
  }
}
