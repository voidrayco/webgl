import { flatten } from 'ramda';
import { Mesh } from 'three';
import { IUniform, OrthographicCamera, Points, ShaderMaterial } from 'three';
import { AtlasManager, IconShape, ReferenceColor } from '../../drawing/index';
import { AttributeSize, BufferUtil } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

function isCluster(value : any[]) : value is IconShape < any > [][]{
  if (Array.isArray(value[0])) return true;
  return false;
}

export class SimpleStaticIconBuffer extends BaseBuffer<IconShape<any> | IconShape<any>[], Mesh> {
  /**
   * @override
   * See interface definition
   */
  init(material: ShaderMaterial, unitCount: number) {
    this.bufferItems = BufferUtil.makeBufferItems();

    this.bufferItems.attributes = [
      {
          defaults: [0.0, 0.0, 0.0],
          name: 'position',
          size: AttributeSize.THREE,
      },
      {
          defaults: [0.0, 0.0, 0.0, 0.0],
          name: 'uvCoordinate',
          size: AttributeSize.FOUR,
      },
      {
          defaults: [1.0, 1.0],
          name: 'size',
          size: AttributeSize.TWO,
      },
      {
        defaults: [0],
        name: 'tint',
        size: AttributeSize.ONE,
      },
    ];

    const verticesPerQuad = 1;
    const numQuads = unitCount;

    this.bufferItems.geometry = BufferUtil.makeBuffer(
      numQuads * verticesPerQuad,
      this.bufferItems.attributes,
    );
    this.bufferItems.system = (new Points(this.bufferItems.geometry, material) as any);
    this.bufferItems.system.frustumCulled = false;
  }

  /**
   * @override
   * See interface definition
   *
   * @param shapeBuffer
   */
  update(shapeBuffer: IconShape<any>[] | IconShape<any>[][], atlasManager?: AtlasManager, camera?: OrthographicCamera): boolean {
    let buffer: IconShape<any>[];

    if (isCluster(shapeBuffer)) {
      buffer = flatten<IconShape<any>>(shapeBuffer);
    }

    else {
      buffer = shapeBuffer;
    }

    if (!buffer || buffer.length === 0) {
      this.bufferItems.geometry.setDrawRange(0, 0);
      return false;
    }

    if (atlasManager) {
      const colorRef: ReferenceColor = buffer[0].tint;
      const colorBase = colorRef.base;
      const material: ShaderMaterial = this.bufferItems.system.material as ShaderMaterial;
      const uniforms: { [k: string]: IUniform } = material.uniforms;
      const atlas = atlasManager.getAtlasTexture(buffer[0].texture.atlasReferenceID);
      uniforms.colorAtlas.value = atlas;
      uniforms.colorsPerRow.value = colorBase.colorsPerRow;
      uniforms.firstColor.value = [colorBase.firstColor.x, colorBase.firstColor.y];
      uniforms.nextColor.value = [colorBase.nextColor.x, colorBase.nextColor.y];
      atlas.needsUpdate = true;

      /* NOTE: not sure about here - need to check on it - commented for now
      uniforms.imageAtlas.value = atlas;
      uniforms.texture.value = atlas;
*/
      if (camera) {
        uniforms.zoom.value = camera.zoom;
      }
    }

    let needsUpdate = false;
    let icon: IconShape<any>;

    needsUpdate = BufferUtil.updateBuffer(buffer, this.bufferItems, 1, buffer.length,
      function(
        i: number,
        positions: Float32Array, ppos: number,
        uvcoordinates: Float32Array, uvpos: number,
        sizes: Float32Array, spos: number,
        tints: Float32Array, cpos: number,
        textureWidths: Float32Array, wpos: number,
        textureHeights: Float32Array, hpos: number,
      ) {
        icon = buffer[i];

        // These are point sprites, so just update a single vertex
        positions[ppos] = icon.x;
        positions[++ppos] = icon.y;
        uvcoordinates[uvpos] = icon.texture.atlasTL.x;
        uvcoordinates[++uvpos] = icon.texture.atlasTL.y;
        uvcoordinates[++uvpos] = icon.texture.atlasBR.x;
        uvcoordinates[++uvpos] = icon.texture.atlasBR.y;
        sizes[spos] = icon.size;
        tints[cpos] = icon.tint.base.colorIndex || 0;
        textureWidths[wpos] = icon.width;
        textureHeights[hpos] = icon.height;
      },
    );

    if (needsUpdate){
      this.bufferItems.geometry.setDrawRange(0, buffer.length);
    }

    // Since we have the ability to flatten the shape buffer (thus causing a new array point to
    // Come into existance) we must explicitly ensure the current data is set to the actual
    // Shape buffer that came in. This makes clusters only efficient if using a multibuffer cache
    if (isCluster(shapeBuffer)) {
      this.bufferItems.currentData = shapeBuffer;
    }

    return needsUpdate;
  }
}
