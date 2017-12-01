import { flatten } from 'ramda';
import { IUniform, Mesh, ShaderMaterial, TriangleStripDrawMode, Vector4 } from 'three';
import { CurvedEdgeShape } from '../../drawing/index';
import { ReferenceColor } from '../../drawing/reference/reference-color';
import { AtlasManager } from '../../drawing/texture/atlas-manager';
import { AttributeSize, BufferUtil, UniformAttributeSize } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

const MAX_SEGMENTS_PER_CURVE = 100;
const VERTICES_PER_SEGMENT = 6;
const VERTICES_PER_CURVE = VERTICES_PER_SEGMENT * MAX_SEGMENTS_PER_CURVE;

function isCluster(val: CurvedEdgeShape<any>[] | CurvedEdgeShape<any>[][]): val is CurvedEdgeShape<any>[][] {
  return Array.isArray(val[0]);
}

/**
 * This renders a curved line by injecting all attributes needed to render it.
 * This naively includes all possible data in the vertex.
 *
 * This only supports atlas colors.
 */
export class UniformInstanceEdgeBuffer extends BaseBuffer <CurvedEdgeShape<any> | CurvedEdgeShape<any>[], Mesh> {
  /**
   * @override
   * See interface definition
   */
  init(material: ShaderMaterial, unitCount: number, shared?: UniformInstanceEdgeBuffer) {
    this.bufferItems = BufferUtil.makeBufferItems();

    // Declare the structure of the uniform data in the instanceData uniform
    this.bufferItems.uniformAttributes = [
      {
        block: 0,
        name: 'controlPoint',
        size: UniformAttributeSize.TWO,
      },
      {
        block: 0,
        name: 'startColorPick',
        size: UniformAttributeSize.ONE,
      },
      {
        block: 0,
        name: 'endColorPick',
        size: UniformAttributeSize.ONE,
      },
      {
        block: 1,
        name: 'sizes',
        size: UniformAttributeSize.TWO,
      },
      {
        block: 1,
        name: 'maxResolution',
        size: UniformAttributeSize.ONE,
      },
      {
        block: 1,
        name: 'depth',
        size: UniformAttributeSize.ONE,
      },
      {
        block: 2,
        name: 'endPoints',
        size: UniformAttributeSize.FOUR,
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

      // Commit static curved lines
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

  /**
   * @override
   * See interface definition
   *
   * @param {CurvedEdgeShape<any>[]} shapeBuffer A buffer of curved line shapes
   * @param {AtlasManager} atlasManager The Atlas Manager that contains the color atlas
   *                                    needed for rendering with color picks.
   */
  update(shapeBuffer: CurvedEdgeShape<any>[] | CurvedEdgeShape<any>[][], atlasManager?: AtlasManager, controlPointSource?: number) {
    if (!shapeBuffer) {
      this.bufferItems.geometry.setDrawRange(0, 0);
      return false;
    }

    let buffer: CurvedEdgeShape<any>[];

    if (isCluster(shapeBuffer)) {
      buffer = flatten<CurvedEdgeShape<any>>(shapeBuffer);
    }

    else {
      buffer = shapeBuffer;
    }

    // This is a special case where we need to update our current item dataset to prevent
    // Re-updates for the same empty shape buffer
    if (buffer.length === 0) {
      this.bufferItems.currentData = shapeBuffer;
    }

    // This let's us know if we're maxing out the instances this buffer can handle
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

    // As this is a single material, we have to assume that the color atlas
    // For our shapes will be the same atlas for all colors. Thus, the atlas
    // Information for one color will be valid for all colors
    if (buffer.length > 0 && atlasManager) {
      const colorRef: ReferenceColor = buffer[0].startColor;
      const colorBase = colorRef.base;

      // Update all uniforms for this material to utilize the atlas metrics for
      // Picking colors
      const material: ShaderMaterial = this.bufferItems.system.material as ShaderMaterial;
      const uniforms: { [k: string]: IUniform } = material.uniforms;
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
        startColor: Vector4,
        endColor: Vector4,
        sizes: Vector4,
        maxResolution: Vector4,
        depth: Vector4,
        endpoints: Vector4,
      ) => {
        const curve = buffer[instance];
        controlPoints.x = curve.controlPoints[controlPointSource].x;
        controlPoints.y = curve.controlPoints[controlPointSource].y;
        startColor.z = curve.startColor.base.colorIndex;
        endColor.w = curve.endColor.base.colorIndex;
        sizes.x = curve.startWidth / 2.0;
        sizes.y = curve.endWidth / 2.0;
        maxResolution.z = MAX_SEGMENTS_PER_CURVE;
        depth.w = curve.depth;
        endpoints.x = curve.start.x;
        endpoints.y = curve.start.y;
        endpoints.z = curve.end.x;
        endpoints.w = curve.end.y;
      },
    );

    if (isCluster(shapeBuffer)) {
      this.bufferItems.currentData = shapeBuffer;
    }

    this.bufferItems.geometry.setDrawRange(0, VERTICES_PER_CURVE * buffer.length);

    return true;
  }
}
