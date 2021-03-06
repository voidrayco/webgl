import { flatten } from 'ramda';
import { Mesh } from 'three';
import { IUniform, OrthographicCamera, Points, ShaderMaterial } from 'three';
import { CircleShape, ReferenceColor } from '../../drawing';
import { AtlasManager } from '../../drawing/texture/atlas-manager';
import { AttributeSize, BufferUtil } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

function isCluster(value : any[]) : value is CircleShape < any > [][] {
  return Array.isArray(value[0]);
}

export class SimpleStaticCircleBuffer extends BaseBuffer<CircleShape<any> | CircleShape<any>[], Mesh> {
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
        name: 'innerRadius',
        size: AttributeSize.ONE,
      },
      {
        defaults: [0],
        name: 'colorPick',
        size: AttributeSize.ONE,
      },
      {
        defaults: [0],
        name: 'innerColorPick',
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
  update(shapeBuffer: CircleShape<any>[] | CircleShape<any>[][], atlasManager?: AtlasManager, camera?: OrthographicCamera): boolean {
    let buffer: CircleShape<any>[];

    if (isCluster(shapeBuffer)) {
      buffer = flatten<CircleShape<any>>(shapeBuffer);
    }

    else {
      buffer = shapeBuffer;
    }

    if (!buffer || buffer.length === 0) {
      this.bufferItems.geometry.setDrawRange(0, 0);
      return false;
    }

    if (atlasManager) {
      const colorRef: ReferenceColor = buffer[0].outerColor;
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

    needsUpdate = BufferUtil.updateBuffer(buffer, this.bufferItems, 1, buffer.length,
      function(
        i: number,
        positions: Float32Array, ppos: number,
        radius: Float32Array, rpos: number,
        innerRadius: Float32Array, irpos: number,
        color: Float32Array, cpos: number,
        innerColor: Float32Array, icpos: number,
    ) {
        circle = buffer[i];

        // These are point sprites, so just update a single vertex
        positions[ppos] = circle._centerX;
        positions[++ppos] = circle._centerY;
        positions[++ppos] = circle.depth;
        radius[rpos] = circle._radius;
        innerRadius[irpos] = circle.innerRadius || 0.0;
        color[cpos] = circle.outerColor.base.colorIndex;
        innerColor[icpos] = circle.innerColor ? circle.innerColor.base.colorIndex : 0;
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
