import { IUniform, Mesh, TriangleStripDrawMode } from 'three';
import { ShaderMaterial } from 'three';
import { ReferenceColor } from '../../drawing/reference/reference-color';
import { Label } from '../../drawing/shape/label';
import { AtlasColor } from '../../drawing/texture/atlas-color';
import { AtlasManager } from '../../drawing/texture/atlas-manager';
import { AttributeSize, BufferUtil } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

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
          defaults: [0],
          name: 'customColor',
          size: AttributeSize.ONE,
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
  update(shapeBuffer: Label<any>[], atlasManager?: AtlasManager, startFade?: number, endFade?: number, labelMaxSize?: number): boolean {
    // Make some constants and props for our buffer update loop
    const numVerticesPerQuad = 6;
    let label;
    let texture;
    let color: AtlasColor;
    let alpha: number;
    let anchor;
    let labelSize;

    if (shapeBuffer && shapeBuffer.length > 0 && atlasManager) {
      const colorRef: ReferenceColor = shapeBuffer[0].color;
      const colorBase = colorRef.base;

      let material: ShaderMaterial = this.bufferItems.system.material as ShaderMaterial;
      let uniforms: { [k: string]: IUniform } = material.uniforms;
      const atlas = atlasManager.getAtlasTexture(colorBase.atlasReferenceID);
      uniforms.colorAtlas.value = atlas;
      uniforms.colorsPerRow.value = colorBase.colorsPerRow;
      uniforms.firstColor.value = [colorBase.firstColor.x, colorBase.firstColor.y];
      uniforms.nextColor.value = [colorBase.nextColor.x, colorBase.nextColor.y];
      atlas.needsUpdate = true;

      if (startFade || endFade || labelMaxSize) {
        material = this.bufferItems.system.material as ShaderMaterial;
        uniforms = material.uniforms;
        if (startFade) uniforms.startFade.value = startFade;
        if (endFade) uniforms.endFade.value = endFade;
        if (labelMaxSize) uniforms.maxLabelSize.value = labelMaxSize;
      }
    }

    if (!shapeBuffer) {
      this.bufferItems.geometry.setDrawRange(0, 0);
      return false;
    }

    const updated = BufferUtil.updateBuffer(
      shapeBuffer, this.bufferItems,
      numVerticesPerQuad, shapeBuffer.length,
      function(i: number,
               positions: Float32Array, ppos: number,
               colors: Float32Array, cpos: number,
               texCoords: Float32Array, tpos: number,
               sizes: Float32Array, spos: number,
               anchors: Float32Array, apos: number,
              ) {
        label = shapeBuffer[i];
        texture = label.rasterizedLabel;
        color = label.color.base;
        alpha = label.color.base.opacity;
        anchor = {
                  x: label.getLocation().x + label.getSize().width * Math.cos(label.getRotation()),
                  y: label.getLocation().y + label.getSize().width * Math.sin(label.getRotation()),
                 };
        labelSize = label.getSize();
        // Make sure the label is updated with it's latest metrics
        label.update();

        // Copy first vertex twice for intro degenerate tri
        positions[ppos] = label.TR.x;
        positions[++ppos] = label.TR.y;
        positions[++ppos] = label.depth;
        texCoords[tpos] = texture.atlasTR.x;
        texCoords[++tpos] = texture.atlasTR.y;
        texCoords[++tpos] = alpha;
        colors[cpos] = color.colorIndex;
        sizes[spos] = labelSize.width;
        sizes[++spos] = labelSize.height;
        anchors[apos] = anchor.x;
        anchors[++apos] = anchor.y;

        // TR
        positions[++ppos] = label.TR.x;
        positions[++ppos] = label.TR.y;
        positions[++ppos] = label.depth;
        texCoords[++tpos] = texture.atlasTR.x;
        texCoords[++tpos] = texture.atlasTR.y;
        texCoords[++tpos] = alpha;
        colors[++cpos] = color.colorIndex;
        sizes[++spos] = labelSize.width;
        sizes[++spos] = labelSize.height;
        anchors[++apos] = anchor.x;
        anchors[++apos] = anchor.y;
        // BR
        positions[++ppos] = label.BR.x;
        positions[++ppos] = label.BR.y;
        positions[++ppos] = label.depth;
        texCoords[++tpos] = texture.atlasBR.x;
        texCoords[++tpos] = texture.atlasBR.y;
        texCoords[++tpos] = alpha;
        colors[++cpos] = color.colorIndex;
        sizes[++spos] = labelSize.width;
        sizes[++spos] = labelSize.height;
        anchors[++apos] = anchor.x;
        anchors[++apos] = anchor.y;
        // TL
        positions[++ppos] = label.TL.x;
        positions[++ppos] = label.TL.y;
        positions[++ppos] = label.depth;
        texCoords[++tpos] = texture.atlasTL.x;
        texCoords[++tpos] = texture.atlasTL.y;
        texCoords[++tpos] = alpha;
        colors[++cpos] = color.colorIndex;
        sizes[++spos] = labelSize.width;
        sizes[++spos] = labelSize.height;
        anchors[++apos] = anchor.x;
        anchors[++apos] = anchor.y;
        // BL
        positions[++ppos] = label.BL.x;
        positions[++ppos] = label.BL.y;
        positions[++ppos] = label.depth;
        texCoords[++tpos] = texture.atlasBL.x;
        texCoords[++tpos] = texture.atlasBL.y;
        texCoords[++tpos] = alpha;
        colors[++cpos] = color.colorIndex;
        sizes[++spos] = labelSize.width;
        sizes[++spos] = labelSize.height;
        anchors[++apos] = anchor.x;
        anchors[++apos] = anchor.y;

        // Copy last vertex again for degenerate tri
        positions[++ppos] = label.BL.x;
        positions[++ppos] = label.BL.y;
        positions[++ppos] = label.depth;
        texCoords[++tpos] = texture.atlasBL.x;
        texCoords[++tpos] = texture.atlasBL.y;
        texCoords[++tpos] = alpha;
        colors[++cpos] = color.colorIndex;
        sizes[++spos] = labelSize.width;
        sizes[++spos] = labelSize.height;
        anchors[++apos] = anchor.x;
        anchors[++apos] = anchor.y;
      },
    );

    this.bufferItems.geometry.setDrawRange(0, numVerticesPerQuad * shapeBuffer.length);

    return updated;
  }
}
