import { Mesh } from 'three';
import { Camera, IUniform, OrthographicCamera, Points, ShaderMaterial } from 'three';
import { AtlasManager, CircleShape, ReferenceColor } from '../../drawing/index';
import { AttributeSize, BufferUtil } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

export class SimpleStaticCircleBuffer extends BaseBuffer<CircleShape<any>, Mesh> {
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
        name: 'radius',
        size: AttributeSize.ONE,
      },
      {
        defaults: [0],
        name: 'colorPick',
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
  update(shapeBuffer: CircleShape<any>[], atlasManager?: AtlasManager, camera?: OrthographicCamera): boolean {
    if (!shapeBuffer || shapeBuffer.length === 0) {
      this.bufferItems.geometry.setDrawRange(0, 0);
      return false;
    }

    if (atlasManager) {
      const colorRef: ReferenceColor = shapeBuffer[0].outerColor;
      const colorBase = colorRef.base;
      const material: ShaderMaterial = this.bufferItems.system.material as ShaderMaterial;
      const uniforms: { [k: string]: IUniform } = material.uniforms;
      const atlas = atlasManager.getAtlasTexture(colorBase.atlasReferenceID);
      uniforms.colorAtlas.value = atlas;
      uniforms.colorsPerRow.value = colorBase.colorsPerRow;
      uniforms.firstColor.value = [colorBase.firstColor.x, colorBase.firstColor.y];
      uniforms.nextColor.value = [colorBase.nextColor.x, colorBase.nextColor.y];
      atlas.needsUpdate = true;

      if (camera) {
        uniforms.zoom.value = camera.zoom;
      }
    }

    let needsUpdate = false;
    let circle: CircleShape<any>;

    needsUpdate = BufferUtil.updateBuffer(shapeBuffer, this.bufferItems, 1, shapeBuffer.length,
      function(
        i: number,
        positions: Float32Array, ppos: number,
        radius: Float32Array, rpos: number,
        color: Float32Array, cpos: number,
    ) {
        circle = shapeBuffer[i];

        // These are point sprites, so just update a single vertex
        positions[ppos] = circle._centerX;
        positions[++ppos] = circle._centerY;
        positions[++ppos] = circle.depth;
        radius[rpos] = circle._radius;
        color[cpos] = circle.outerColor.base.colorIndex;
      },
    );

    if (needsUpdate){
      this.bufferItems.geometry.setDrawRange(0, shapeBuffer.length);
    }

    else if (shapeBuffer.length === 0) {
      this.bufferItems.geometry.setDrawRange(0, 0);
    }

    return needsUpdate;
  }
}
