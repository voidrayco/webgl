import { IUniform, Mesh, ShaderMaterial, TriangleStripDrawMode } from 'three';
import { ReferenceColor } from '../../drawing/reference/reference-color';
import { CurvedLineShape } from '../../drawing/shape/curved-line-shape';
import { AtlasColor } from '../../drawing/texture/atlas-color';
import { AtlasManager } from '../../drawing/texture/atlas-manager';
import { IPoint } from '../../primitives/point';
import { AttributeSize, BufferUtil } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

/**
 * This renders a curved line by injecting all attributes needed to render it.
 * This naively includes all possible data in the vertex.
 *
 * This only supports atlas colors.
 */
export class UniformInstanceArcBuffer extends BaseBuffer <CurvedLineShape<any>, Mesh> {
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
    this.bufferItems = BufferUtil.makeBufferItems();

    this.bufferItems.attributes = [
      {
        defaults: [0, 0, 0],
        name: 'position',
        size: AttributeSize.THREE,
      },
      {
        defaults: [0],
        name: 'startColorPick',
        size: AttributeSize.ONE,
      },
      {
        defaults: [0],
        name: 'endColorPick',
        size: AttributeSize.ONE,
      },
      {
        defaults: [1],
        name: 'normalDirection',
        size: AttributeSize.ONE,
      },
      {
        defaults: [0, 0, 0, 0],
        name: 'endPoints',
        size: AttributeSize.FOUR,
      },
      {
        defaults: [0],
        name: 'halfLinewidth',
        size: AttributeSize.ONE,
      },
      {
        defaults: [0],
        name: 'controlPick',
        size: AttributeSize.ONE,
      },
    ];

    const verticesPerQuad = 6;
    const numQuads = unitCount;

    this.bufferItems.geometry = BufferUtil.makeBuffer(
      numQuads * verticesPerQuad,
      this.bufferItems.attributes,
    );

    this.bufferItems.system = new Mesh(
      this.bufferItems.geometry,
      material,
    );

    this.bufferItems.system.frustumCulled = false;
    this.bufferItems.system.drawMode = TriangleStripDrawMode;
  }

  /**
   * @override
   * See interface definition
   *
   * @param {CurvedLineShape<any>[]} shapeBuffer A buffer of curved line shapes
   * @param {AtlasManager} atlasManager The Atlas Manager that contains the color atlas
   *                                    needed for rendering with color picks.
   */
  update(shapeBuffer: CurvedLineShape<any>[], atlasManager?: AtlasManager, controlPointSource?: number) {
    if (!shapeBuffer) {
      this.bufferItems.geometry.setDrawRange(0, 0);
      return false;
    }

    // This is a special case where we need to update our current item dataset to prevent
    // Re-updates for the same empty shape buffer
    if (shapeBuffer.length === 0) {
      this.bufferItems.currentData = shapeBuffer;
    }

    const controlPoints: number[] = [];
    const controlReference = new Map<IPoint, number>();
    let controlUniform: IUniform;

    // As this is a single material, we have to assume that the color atlas
    // For our shapes will be the same atlas for all colors. Thus, the atlas
    // Information for one color will be valid for all colors
    if (shapeBuffer && shapeBuffer.length > 0 && atlasManager) {
      const colorRef: ReferenceColor = shapeBuffer[0].startColor;
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
      // This is the shared control points for all of the vertices
      controlUniform = uniforms.controlPoints;
      atlas.needsUpdate = true;
    }

    // Commit static curved lines
    const colorAttributeSize = 1;
    const numVerticesPerSegment = 6;
    let halfWidthSize = 1;
    let length = 15;
    let needsUpdate = false;
    let p1: IPoint;
    let p2: IPoint;
    let colorStart: AtlasColor;
    let colorEnd: AtlasColor;
    let alpha: number;
    let controlPoint: IPoint;
    let controlRef: number;

    BufferUtil.beginUpdates();

    for (const curvedLine of shapeBuffer) {
      alpha = curvedLine.startColor.base.opacity;
      colorStart = curvedLine.startColor.base;
      colorEnd = curvedLine.endColor.base;
      halfWidthSize = curvedLine.lineWidth / 2.0;
      length = curvedLine.resolution;
      p1 = curvedLine.start;
      p2 = curvedLine.end;

      controlPoint = curvedLine.controlPoints[controlPointSource];
      controlRef = controlReference.get(controlPoint);

      if (controlRef === undefined) {
        const controlLength = controlPoints.push(controlPoint.x, controlPoint.y);
        controlRef = controlLength - 2;
        controlReference.set(controlPoint, controlRef);
      }

      needsUpdate = BufferUtil.updateBuffer(
        shapeBuffer, this.bufferItems,
        numVerticesPerSegment, length,
        function(i: number,
          positions: Float32Array, ppos: number,
          startColor: Float32Array, scpos: number,
          endColor: Float32Array, ecpos: number,
          normals: Float32Array, npos: number,
          endPoints: Float32Array, epos: number,
          halfWidth: Float32Array, wpos: number,
          controlPick: Float32Array, cpos: number,
        ) {
          // Copy first vertex twice for intro degenerate tri
          positions[ppos] = (i + 1) / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          halfWidth[wpos] = halfWidthSize;
          // Skip over degenerate tris color
          scpos += colorAttributeSize;
          ecpos += colorAttributeSize;
          normals[npos] = 1;
          endPoints[epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          controlPick[cpos] = controlRef;

          // TR
          positions[++ppos] = (i + 1) / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          halfWidth[++wpos] = halfWidthSize;
          normals[++npos] = 1;
          endPoints[++epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          startColor[scpos] = colorStart.colorIndex;
          endColor[ecpos] = colorEnd.colorIndex;
          controlPick[++cpos] = controlRef;

          // BR
          positions[++ppos] = (i + 1) / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          halfWidth[++wpos] = halfWidthSize;
          normals[++npos] = -1;
          endPoints[++epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          startColor[++scpos] = colorStart.colorIndex;
          endColor[++ecpos] = colorEnd.colorIndex;
          controlPick[++cpos] = controlRef;

          // TL
          positions[++ppos] = i / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          halfWidth[++wpos] = halfWidthSize;
          normals[++npos] = 1;
          endPoints[++epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          startColor[++scpos] = colorStart.colorIndex;
          endColor[++ecpos] = colorEnd.colorIndex;
          controlPick[++cpos] = controlRef;

          // BL
          positions[++ppos] = i / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          halfWidth[++wpos] = halfWidthSize;
          normals[++npos] = -1;
          endPoints[++epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          startColor[++scpos] = colorStart.colorIndex;
          endColor[++ecpos] = colorEnd.colorIndex;
          controlPick[++cpos] = controlRef;

          // Copy last vertex again for degenerate tri
          positions[++ppos] = i / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          halfWidth[++wpos] = halfWidthSize;
          // Skip over degenerate tris for color
          scpos += colorAttributeSize;
          ecpos += colorAttributeSize;
          normals[++npos] = -1;
          endPoints[++epos] = p1.x;
          endPoints[++epos] = p1.y;
          endPoints[++epos] = p2.x;
          endPoints[++epos] = p2.y;
          controlPick[++cpos] = controlRef;
        },
      );

      // If no updating is happening, just quit the loop
      if (!needsUpdate) {
        break;
      }
    }

    const numBatches = BufferUtil.endUpdates();

    if (controlUniform) {
      controlUniform.value = controlPoints;
    }

    // Only if updates happened, should this change
    if (needsUpdate) {
      this.bufferItems.geometry.setDrawRange(0, numVerticesPerSegment * numBatches);
    }

    else if (shapeBuffer.length === 0) {
      this.bufferItems.geometry.setDrawRange(0, 0);
    }

    return needsUpdate;
  }
}
