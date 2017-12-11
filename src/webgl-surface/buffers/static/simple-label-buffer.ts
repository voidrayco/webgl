import { flatten } from 'ramda';
import { IUniform, Mesh, TriangleStripDrawMode } from 'three';
import { ShaderMaterial } from 'three';
import { ReferenceColor } from '../../drawing/reference/reference-color';
import { Label } from '../../drawing/shape/label';
import { AtlasColor } from '../../drawing/texture/atlas-color';
import { AtlasManager } from '../../drawing/texture/atlas-manager';
import { AtlasTexture } from '../../drawing/texture/atlas-texture';
import { AttributeSize, BufferUtil } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

function isCluster(value : any[]) : value is Label < any > [][]{
  if (Array.isArray(value[0])) return true;
  return false;
}

export class SimpleStaticLabelBuffer extends BaseBuffer<Label<any> | Label<any>[], Mesh> {
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
  update(shapeBuffer: Label<any>[] | Label<any>[][], atlasManager?: AtlasManager, startFade?: number, endFade?: number, labelMaxSize?: number): boolean {
  if (!shapeBuffer || shapeBuffer.length <= 0) {
      this.bufferItems.geometry.setDrawRange(0, 0);
      return false;
    }

    let buffer: Label<any>[];

    if (isCluster(shapeBuffer)) {
      buffer = flatten<Label<any>>(shapeBuffer);
    }

    else {
      buffer = shapeBuffer;
    }

    // Make some constants and props for our buffer update loop
    const numVerticesPerQuad = 6;
    let label;
    let texture: AtlasTexture;
    let color: AtlasColor;
    let alpha: number;
    let anchor;
    let labelSize;

    if (atlasManager) {
      const colorRef: ReferenceColor = buffer[0].color;
      const colorBase = colorRef.base;

      const material: ShaderMaterial = this.bufferItems.system.material as ShaderMaterial;
      const uniforms: { [k: string]: IUniform } = material.uniforms;
      const atlasColor = atlasManager.getAtlasTexture(colorBase.atlasReferenceID);

      if (uniforms.colorAtlas.value !== atlasColor) {
        uniforms.colorAtlas.value = atlasColor;
        uniforms.colorsPerRow.value = colorBase.colorsPerRow;
        uniforms.firstColor.value = [colorBase.firstColor.x, colorBase.firstColor.y];
        uniforms.nextColor.value = [colorBase.nextColor.x, colorBase.nextColor.y];
        atlasColor.needsUpdate = true;
      }

      const atlasTexture = atlasManager.atlasTexture.labels;

      if (uniforms.atlasTexture.value !== atlasTexture) {
        uniforms.atlasTexture.value = atlasTexture;
        atlasTexture.needsUpdate = true;
      }
/*
      if (labelMaxSize) {
        const material = this.bufferItems.system.material as ShaderMaterial;
        const uniforms = material.uniforms;
        uniforms.maxLabelSize.value = labelMaxSize || 0;
      }
*/
      if (startFade || endFade || labelMaxSize) {
        const material = this.bufferItems.system.material as ShaderMaterial;
        const uniforms = material.uniforms;
        uniforms.startFade.value = startFade || 0;
        uniforms.endFade.value = endFade || 0;
        uniforms.maxLabelSize.value = labelMaxSize || 0;
      }
    }

    const updated = BufferUtil.updateBuffer(
      buffer, this.bufferItems,
      numVerticesPerQuad, buffer.length,
      function(i: number,
               positions: Float32Array, ppos: number,
               colors: Float32Array, cpos: number,
               texCoords: Float32Array, tpos: number,
               sizes: Float32Array, spos: number,
               anchors: Float32Array, apos: number,
              ) {
        label = buffer[i];
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

    this.bufferItems.geometry.setDrawRange(0, numVerticesPerQuad * buffer.length);

    // Since we have the ability to flatten the shape buffer (thus causing a new array point to
    // Come into existance) we must explicitly ensure the current data is set to the actual
    // Shape buffer that came in. This makes clusters only efficient if using a multibuffer cache
    if (isCluster(shapeBuffer)) {
      this.bufferItems.currentData = shapeBuffer;
    }

    return updated;
  }
}
