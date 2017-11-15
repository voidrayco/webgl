import { flatten } from 'ramda';
import { IUniform, Mesh, ShaderMaterial, TriangleStripDrawMode, Vector4 } from 'three';
import { ReferenceColor } from '../../drawing/reference/reference-color';
import { CurvedLineShape } from '../../drawing/shape/curved-line-shape';
import { AtlasManager } from '../../drawing/texture/atlas-manager';
import { AttributeSize, BufferUtil, UniformAttributeSize } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

const MAX_RESOLUTION = 100;
const VERTICES_PER_SEGMENT = 6;
const VERTICES_PER_CURVE = MAX_RESOLUTION * VERTICES_PER_SEGMENT;

function isCluster(value: CurvedLineShape<any>[] | CurvedLineShape<any>[][]): value is CurvedLineShape<any>[][] {
  if (Array.isArray(value[0])) return true;
  return false;
}

/**
 * This renders a curved line by injecting all attributes needed to render it.
 * This naively includes all possible data in the vertex.
 *
 * This only supports atlas colors.
 */
export class UniformInstanceArcBuffer extends BaseBuffer <CurvedLineShape<any> | CurvedLineShape<any>[], Mesh> {
  /**
   * @override
   * See interface definition
   *
   * @param {UniformInstanceArcBuffer} shared This should be another instance that has already
   *                                          been initialized. Providing this will greatly improve
   *                                          performance by causing sharing of relevant resources across
   *                                          buffers.
   */
  init(material: ShaderMaterial, unitCount: number, shared?: UniformInstanceArcBuffer) {
    if (unitCount !== 0) {
      console.warn(
        'Unit count is used for vertex buffers that are not using uniform instancing',
        'The unit count for these types of buffers are automatically calculated',
        'To disable this warning please place a ZERO for the unit count parameter',
      );
    }

    this.bufferItems = BufferUtil.makeBufferItems();

    // Declare the structure of the uniform data in the instanceData uniform
    this.bufferItems.uniformAttributes = [
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
        block: 0,
        name: 'halfLineWidth',
        size: UniformAttributeSize.ONE,
      },
      {
        block: 0,
        name: 'resolution',
        size: UniformAttributeSize.ONE,
      },
      {
        block: 1,
        name: 'endPoints',
        size: UniformAttributeSize.FOUR,
      },
      {
        block: 2,
        name: 'depth',
        size: UniformAttributeSize.ONE,
      },
      {
        block: 2,
        name: 'controlPoint',
        size: UniformAttributeSize.TWO,
      },
    ];

    // Generate the uniform buffer to express the type of data to be placed in our instanceData
    // Uniform
    this.bufferItems.uniformBuffer = BufferUtil.makeUniformBuffer(
      this.bufferItems.uniformAttributes,
    );

    // Initialize the vertex buffer, whether that be sharing resources or generating it's own
    this.initVertexBuffer(shared);

    // Generate the mesh based on the shared or generated buffer
    this.bufferItems.system = new Mesh(
      this.bufferItems.geometry,
      material,
    );

    this.bufferItems.system.frustumCulled = false;
    this.bufferItems.system.drawMode = TriangleStripDrawMode;
  }

  initVertexBuffer(shared?: UniformInstanceArcBuffer) {
    // If a buffer with geometry was provided, we share that geometry to significantly
    // Reduce memory footprint and improve performance
    if (shared && shared.bufferItems && shared.bufferItems.geometry) {
      this.bufferItems.geometry = shared.bufferItems.geometry;
    }

    else {
      if (shared && !(shared.bufferItems || shared.bufferItems.geometry)) {
        console.warn('A UniformInstanceArcBuffer trying to share resources was provided a shared object that did not have the proper elements to share. Shared but lacking:', shared);
      }

      this.bufferItems.attributes = [
        {
          defaults: [0],
          name: 'vertexIndex',
          size: AttributeSize.ONE,
        },
        {
          defaults: [0],
          name: 'totalVertices',
          size: AttributeSize.ONE,
        },
        {
          defaults: [0],
          name: 'normalDirection',
          size: AttributeSize.FOUR,
        },
        {
          defaults: [0],
          name: 'instance',
          size: AttributeSize.ONE,
        },
      ];

      this.bufferItems.geometry = BufferUtil.makeBuffer(
        VERTICES_PER_CURVE * this.bufferItems.uniformBuffer.maxInstances,
        this.bufferItems.attributes,
      );

      // Now we fill the vertex buffer with whatever instancing information we need
      BufferUtil.beginUpdates();

      for (let instance = 0; instance < this.bufferItems.uniformBuffer.maxInstances; ++instance) {
        BufferUtil.updateBuffer(
          [], this.bufferItems,
          VERTICES_PER_SEGMENT, MAX_RESOLUTION,
          function(i: number,
            vertexIndex: Float32Array, vpos: number,
            totalVertices: Float32Array, tvpos: number,
            normalDirection: Float32Array, npos: number,
            instanceIndex: Float32Array, ipos: number,
          ) {
            // Copy first vertex twice for intro degenerate tri
            vertexIndex[vpos] = i + 1;
            totalVertices[tvpos] = MAX_RESOLUTION;
            normalDirection[npos] = 1;
            instanceIndex[ipos] = instance;

            // TR
            vertexIndex[++vpos] = i + 1;
            totalVertices[++tvpos] = MAX_RESOLUTION;
            normalDirection[++npos] = 1;
            instanceIndex[++ipos] = instance;

            // BR
            vertexIndex[++vpos] = i + 1;
            totalVertices[++tvpos] = MAX_RESOLUTION;
            normalDirection[++npos] = -1;
            instanceIndex[++ipos] = instance;

            // TL
            vertexIndex[++vpos] = i;
            totalVertices[++tvpos] = MAX_RESOLUTION;
            normalDirection[++npos] = 1;
            instanceIndex[++ipos] = instance;

            // BL
            vertexIndex[++vpos] = i;
            totalVertices[++tvpos] = MAX_RESOLUTION;
            normalDirection[++npos] = -1;
            instanceIndex[++ipos] = instance;

            // Copy last vertex again for degenerate tri
            vertexIndex[vpos] = i;
            totalVertices[tvpos] = MAX_RESOLUTION;
            normalDirection[npos] = -1;
            instanceIndex[ipos] = instance;
          },
        );
      }

      BufferUtil.endUpdates();
    }
  }

  /**
   * @override
   * See interface definition
   *
   * @param {CurvedLineShape<any>[]} shapeBuffer A buffer of curved line shapes
   * @param {AtlasManager} atlasManager The Atlas Manager that contains the color atlas
   *                                    needed for rendering with color picks.
   */
  update(shapeBuffer: CurvedLineShape<any>[][] | CurvedLineShape<any>[], atlasManager?: AtlasManager, controlPointSource?: number) {
    if (!shapeBuffer) {
      this.bufferItems.geometry.setDrawRange(0, 0);
      return false;
    }

    // This is a special case where we need to update our current item dataset to prevent
    // Re-updates for the same empty shape buffer
    if (shapeBuffer.length === 0) {
      this.bufferItems.currentData = shapeBuffer;
      this.bufferItems.geometry.setDrawRange(0, 0);
      return true;
    }

    let buffer: CurvedLineShape<any>[];

    if (isCluster(shapeBuffer)) {
      buffer = flatten<CurvedLineShape<any>>(shapeBuffer);
    }

    else {
      buffer = shapeBuffer;
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
    if (atlasManager) {
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

    let needsUpdate = false;

    // Commit the information to the uniform instancing group
    needsUpdate = BufferUtil.updateUniformBuffer(
      buffer, this.bufferItems,
      Math.min(buffer.length, this.bufferItems.uniformBuffer.maxInstances),
      (
        instance: number,
        startColor: Vector4,
        endColor: Vector4,
        halfLine: Vector4,
        resolution: Vector4,
        endPoints: Vector4,
        depth: Vector4,
        controlPoint: Vector4,
      ) => {
        const curve = buffer[instance];

        startColor.x = curve.startColor.base.colorIndex;
        endColor.y = curve.endColor.base.colorIndex;
        halfLine.z = curve.lineWidth / 2.0;
        resolution.w = curve.resolution;
        endPoints.x = curve.start.x;
        endPoints.y = curve.start.y;
        endPoints.z = curve.end.x;
        endPoints.w = curve.end.y;
        depth.x = curve.depth;
        controlPoint.y = curve.controlPoints[1].x;
        controlPoint.z = curve.controlPoints[1].y;
      },
    ) || needsUpdate;

    console.log('CURVE SHAPE BUFFER', buffer);
    console.log('UNIFORM BUFFER', this.bufferItems.uniformBuffer.buffer);

    // Only if updates happened, should this change
    if (needsUpdate) {
      console.log('UPDATED DRAW RANGE', buffer.length * VERTICES_PER_CURVE);
      this.bufferItems.geometry.setDrawRange(0, buffer.length * VERTICES_PER_CURVE);
    }

    return needsUpdate;
  }
}
