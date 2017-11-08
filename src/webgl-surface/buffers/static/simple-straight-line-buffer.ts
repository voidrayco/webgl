import { flatten } from 'ramda';
import { Mesh, TriangleStripDrawMode } from 'three';
import { IUniform, ShaderMaterial } from 'three';
import { AtlasManager, ReferenceColor } from '../../drawing/index';
import { LineShape } from '../../drawing/shape/line-shape';
import { Point } from '../../primitives/point';
import { AttributeSize, BufferUtil } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

function isCluster(value : any[]) : value is LineShape < any > [][]{
  if (Array.isArray(value[0])) return true;
  return false;
}

export class SimpleStaticStraightLineBuffer extends BaseBuffer < LineShape < any > | LineShape < any > [],
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
        defaults: [0],
        name: 'colorPick',
        size: AttributeSize.ONE,
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
  update(shapeBuffer: LineShape<any>[] | LineShape<any>[][], atlasManager?: AtlasManager): boolean {
    let buffer: LineShape<any>[];

    if (!shapeBuffer || shapeBuffer.length <= 0) {
      this.bufferItems.geometry.setDrawRange(0, 0);
      return false;
    }

    if (isCluster(shapeBuffer)) {
      buffer = flatten<LineShape<any>>(shapeBuffer);
    }

    else {
      buffer = shapeBuffer;
    }

    if (atlasManager) {
      const colorRef: ReferenceColor = buffer[0].startColor;
      const colorBase = colorRef.base;

      const material: ShaderMaterial = this.bufferItems.system.material as ShaderMaterial;
      const uniforms: { [k: string]: IUniform } = material.uniforms;
      const atlas = atlasManager.getAtlasTexture(colorBase.atlasReferenceID);
      uniforms.colorAtlas.value = atlas;
      uniforms.colorsPerRow.value = colorBase.colorsPerRow;
      uniforms.firstColor.value = [colorBase.firstColor.x, colorBase.firstColor.y];
      uniforms.nextColor.value = [colorBase.nextColor.x, colorBase.nextColor.y];
      atlas.needsUpdate = true;
    }

    let needsUpdate = false;
    const numVerticesPerSegment = 6;

    const TR = Point.zero();
    const BR = Point.zero();
    const TL = Point.zero();
    const BL = Point.zero();
    let startColor = 0;
    let endColor = 0;
    let line: LineShape<any>;

    needsUpdate = BufferUtil.updateBuffer(buffer, this.bufferItems, numVerticesPerSegment, buffer.length,
      function(i: number, positions: Float32Array, ppos: number, color: Float32Array, cpos: number){
        line = buffer[i];
        startColor = line.startColor.base.colorIndex;
        endColor = line.endColor.base.colorIndex;
        Point.add(line.p2, Point.scale(line.perpendicular, -line.thickness / 2.0), TR);
        Point.add(line.p2, Point.scale(line.perpendicular, line.thickness / 2.0), BR);
        Point.add(line.p1, Point.scale(line.perpendicular, -line.thickness / 2.0), TL);
        Point.add(line.p1, Point.scale(line.perpendicular, line.thickness / 2.0), BL);

        // 1
        positions[ppos] = TR.x;
        positions[++ppos] = TR.y;
        positions[++ppos] = line.depth;
        cpos += 1.0;

        // 2
        positions[++ppos] = TR.x;
        positions[++ppos] = TR.y;
        positions[++ppos] = line.depth;
        color[cpos] = endColor;

        // 3
        positions[++ppos] = BR.x;
        positions[++ppos] = BR.y;
        positions[++ppos] = line.depth;
        color[++cpos] = endColor;

        // 4
        positions[++ppos] = TL.x;
        positions[++ppos] = TL.y;
        positions[++ppos] = line.depth;
        color[++cpos] = startColor;

        // 5
        positions[++ppos] = BL.x;
        positions[++ppos] = BL.y;
        positions[++ppos] = line.depth;
        color[++cpos] = startColor;

        // 6
        positions[++ppos] = BL.x;
        positions[++ppos] = BL.y;
        positions[++ppos] = line.depth;
      },
    );

    const numBatches = BufferUtil.endUpdates();

    if (needsUpdate){
      this.bufferItems.geometry.setDrawRange(0, numVerticesPerSegment * numBatches);
    }

    return needsUpdate;
  }
}
