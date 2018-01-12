import { flatten } from 'ramda';
import { IUniform, Mesh, ShaderMaterial, TriangleStripDrawMode, Vector4 } from 'three';
import { ReferenceColor } from '../../drawing/reference/reference-color';
import { RibbonShape } from '../../drawing/shape/ribbon-shape';
import { AtlasManager } from '../../drawing/texture/atlas-manager';
import { AttributeSize, BufferUtil, UniformAttributeSize } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

// CONSTANT
const MAX_SEGMENTS_PER_CURVE = 100;
const VERTICES_PER_SEGMENT = 6;
const VERTICES_PER_CURVE = VERTICES_PER_SEGMENT * MAX_SEGMENTS_PER_CURVE;

/**
 * THRESHOLD sets the number of instance to render both ends of ribbon
 * In order to make both ends round
 */
const THRESHOLD = 30;

function isCluster(val: RibbonShape<any>[] | RibbonShape<any>[][]): val is RibbonShape<any>[][] {
  return Array.isArray(val[0]);
}

export class UniformRibbonBuffer extends BaseBuffer <RibbonShape<any> | RibbonShape<any>[], Mesh> {

  init(material: ShaderMaterial, unitCount: number, shared?: UniformRibbonBuffer) {
    this.bufferItems = BufferUtil.makeBufferItems();
    // Declare the structure of the uniform data in the instanceData uniform
    this.bufferItems.uniformAttributes = [
      {
        block: 0,
        name: 'controlPoint',
        size: UniformAttributeSize.FOUR,
      },
      {
        block: 1,
        name: 'endPoints1',
        size: UniformAttributeSize.FOUR,
      },
      {
        block: 2,
        name: 'endPoints2',
        size: UniformAttributeSize.FOUR,
      },
      {
        block: 3,
        name: 'centers',
        size: UniformAttributeSize.FOUR,
      },
      {
        block: 4,
        name: 'depth',
        size: UniformAttributeSize.ONE,
      },
      {
        block: 4,
        name: 'resolution',
        size: UniformAttributeSize.ONE,
      },
      {
        block: 4,
        name: 'threshold',
        size: UniformAttributeSize.TWO,
      },
      {
        block: 5,
        name: 'startColorPick',
        size: UniformAttributeSize.ONE,
      },
      {
        block: 5,
        name: 'endColorPick',
        size: UniformAttributeSize.ONE,
      },
    ];

    this.bufferItems.attributes = [
      {
        defaults: [0, 0, 0],
        name: 'position',
        size: AttributeSize.THREE,
      },
    ];

    this.bufferItems.uniformBuffer = BufferUtil.makeUniformBuffer(
      this.bufferItems.uniformAttributes,
    );

    if (shared) {
      this.bufferItems.geometry = BufferUtil.shareBuffer(
        this.bufferItems.attributes,
        shared.bufferItems.geometry,
      );
    }

    else {
      this.bufferItems.geometry = BufferUtil.makeBuffer(
        VERTICES_PER_CURVE * this.bufferItems.uniformBuffer.maxInstances,
        this.bufferItems.attributes,
      );

      BufferUtil.beginUpdates();

      for (let instance = 0; instance < this.bufferItems.uniformBuffer.maxInstances; ++instance) {
        BufferUtil.updateBuffer(
          [], this.bufferItems,
          VERTICES_PER_SEGMENT, MAX_SEGMENTS_PER_CURVE,
          function(i: number,
            positions: Float32Array, ppos: number,
          ) {
            // Copy first vertex twice for intro degenerate tri
            // Skip over degenerate tris color
            positions[ppos] = 1;
            positions[++ppos] = i + 1;
            positions[++ppos] = instance;

            // TR
            positions[++ppos] = 1;
            positions[++ppos] = i + 1;
            positions[++ppos] = instance;

            // BR
            positions[++ppos] = -1;
            positions[++ppos] = i + 1;
            positions[++ppos] = instance;

            // TL
            positions[++ppos] = 1;
            positions[++ppos] = i;
            positions[++ppos] = instance;

            // BL
            positions[++ppos] = -1;
            positions[++ppos] = i;
            positions[++ppos] = instance;

            // Copy last vertex again for degenerate tri
            // Skip over degenerate tris for color
            positions[++ppos] = -1;
            positions[++ppos] = i;
            positions[++ppos] = instance;
        },
        );
      }
      BufferUtil.endUpdates();
      this.bufferItems.geometry.setDrawRange(0, VERTICES_PER_CURVE * this.bufferItems.uniformBuffer.maxInstances);
    }

    this.bufferItems.system = new Mesh(
      this.bufferItems.geometry,
      material,
    ) as any;

    this.bufferItems.system.frustumCulled = false;
    this.bufferItems.system.drawMode = TriangleStripDrawMode;
  }

  update(shapeBuffer: RibbonShape<any>[] | RibbonShape<any>[][], atlasManager?: AtlasManager) {
    if (!shapeBuffer) {
      this.bufferItems.geometry.setDrawRange(0, 0);
      return false;
    }
    let buffer: RibbonShape<any>[];

    if (isCluster(shapeBuffer)) {
      buffer = flatten<RibbonShape<any>>(shapeBuffer);
    }

    else {
      buffer = shapeBuffer;
    }

    if (buffer.length === 0) {
      this.bufferItems.currentData = shapeBuffer;
    }

    if (buffer.length > this.bufferItems.uniformBuffer.maxInstances) {
      console.warn(
        'Too many shapes provided for a uniform instancing buffer.',
        'Max supported:',
        this.bufferItems.uniformBuffer.maxInstances,
        'Shapes provided:',
        buffer.length,
        'This shape buffer should be split across more uniform instancing buffers to render correctly.',
        'Consider using the MultiShapeBufferCache. If this is already in use:',
        'Consider raising the number of buffers it splits across',
      );
    }

    if (buffer.length > 0 && atlasManager) {
      const colorRef: ReferenceColor = buffer[0].startColor;
      const colorBase = colorRef.base;
      const material: ShaderMaterial = this.bufferItems.system.material as ShaderMaterial;
      const uniforms: { [k: string]: IUniform} = material.uniforms;
      const atlas = atlasManager.getAtlasTexture(colorBase.atlasReferenceID);
      uniforms.colorAtlas.value = atlas;
      uniforms.colorsPerRow.value = colorBase.colorsPerRow;
      uniforms.firstColor.value = [colorBase.firstColor.x, colorBase.firstColor.y];
      uniforms.nextColor.value = [colorBase.nextColor.x, colorBase.nextColor.y];
      atlas.needsUpdate = true;
    }

    BufferUtil.updateUniformBuffer(
      buffer, this.bufferItems, buffer.length,
      (
        instance: number,
        controlPoints: Vector4,
        endPoints1: Vector4,
        endPoints2: Vector4,
        centers: Vector4,
        depth: Vector4,
        resolution: Vector4,
        threshold: Vector4,
        startColor: Vector4,
        endColor: Vector4,
      ) => {
        const ribbon = buffer[instance];

        controlPoints.x = ribbon.controlPoints[0].x;
        controlPoints.y = ribbon.controlPoints[0].y;
        controlPoints.z = ribbon.controlPoints[1].x;
        controlPoints.w = ribbon.controlPoints[1].y;

        endPoints1.x = ribbon.start.x;
        endPoints1.y = ribbon.start.y;
        endPoints1.z = ribbon.start2.x;
        endPoints1.w = ribbon.start2.y;

        endPoints2.x = ribbon.end.x;
        endPoints2.y = ribbon.end.y;
        endPoints2.z = ribbon.end2.x;
        endPoints2.w = ribbon.end2.y;

        centers.x = ribbon.center1.x;
        centers.y = ribbon.center1.y;
        centers.z = ribbon.center2.x;
        centers.w = ribbon.center2.y;

        depth.x = ribbon.depth;
        resolution.y = MAX_SEGMENTS_PER_CURVE;
        threshold.z = THRESHOLD;
        threshold.w = THRESHOLD;

        startColor.x = ribbon.startColor.base.colorIndex;
        endColor.y = ribbon.endColor.base.colorIndex;
      },
    );

    if (isCluster(shapeBuffer)) {
      this.bufferItems.currentData = shapeBuffer;
    }

    this.bufferItems.geometry.setDrawRange(0, VERTICES_PER_CURVE * buffer.length);

    return true;
  }
}
