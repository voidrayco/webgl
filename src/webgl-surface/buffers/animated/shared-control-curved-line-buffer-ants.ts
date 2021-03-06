import { flatten } from 'ramda';
import { IUniform, Mesh, ShaderMaterial, TriangleStripDrawMode } from 'three';
import { ReferenceColor } from '../../drawing/reference/reference-color';
import { CurvedLineShape } from '../../drawing/shape/curved-line-shape';
import { AtlasColor } from '../../drawing/texture/atlas-color';
import { AtlasManager } from '../../drawing/texture/atlas-manager';
import { IPoint } from '../../primitives/point';
import { AttributeSize, BufferUtil } from '../../util/buffer-util';
import { BaseBuffer } from '../base-buffer';

function isCluster(val: CurvedLineShape<any>[] | CurvedLineShape<any>[][]): val is CurvedLineShape<any>[][] {
  return Array.isArray(val[0]);
}

/**
 * This renders a curved line by injecting all attributes needed to render it.
 * This naively includes all possible data in the vertex.
 *
 * This only supports atlas colors.
 */
export class SharedControlCurvedLineBufferAnts extends BaseBuffer <CurvedLineShape<any> | CurvedLineShape<any>[], Mesh > {
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
        defaults: [0, 0, 0, 0],
        name: 'marching',
        size: AttributeSize.FOUR,
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
  update(shapeBuffer: CurvedLineShape<any>[][] | CurvedLineShape<any>[], atlasManager?: AtlasManager, controlPointSource?: number) {
    if (!shapeBuffer) {
      this.bufferItems.geometry.setDrawRange(0, 0);
      return false;
    }

    let buffer;

    if (isCluster(shapeBuffer)) {
      buffer = flatten<CurvedLineShape<any>>(shapeBuffer);
    }

    else {
      buffer = shapeBuffer;
    }

    // This is a special case where we need to update our current item dataset to prevent
    // Re-updates for the same empty shape buffer
    if (buffer.length === 0) {
      this.bufferItems.currentData = shapeBuffer;
    }

    const controlPoints: number[] = [];
    const controlReference = new Map<IPoint, number>();
    let controlUniform: IUniform;

    // As this is a single material, we have to assume that the color atlas
    // For our shapes will be the same atlas for all colors. Thus, the atlas
    // Information for one color will be valid for all colors
    if (buffer && buffer.length > 0 && atlasManager) {
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
      // This is the shared control points for all of the vertices
      controlUniform = uniforms.controlPoints;
      atlas.needsUpdate = true;
    }

    // Commit static curved lines
    const colorAttributeSize = 1;
    const marchingAttributeSize = 4;
    const numVerticesPerSegment = 6;
    let halfWidthSize = 1;
    let length = 15;
    let needsUpdate = false;
    let p1: IPoint;
    let p2: IPoint;
    let colorStart: AtlasColor;
    let colorEnd: AtlasColor;
    let antLength: number;
    let antGap: number;
    let antSpeed: number;
    let controlPoint: IPoint;
    let controlRef: number;
    // We can not accurately send very large numbers via float point into the attributes
    // So we trim down our time sent to the attribute down to a number that is less than
    // 16,777,217 which means we can only reliably grab the last 7 digits of the date's time
    const antStartTime: number = 0;

    BufferUtil.beginUpdates();

    for (const curvedLine of buffer) {
      // We will not render the curved line with this buffer if the marching ants are not provided
      if (!curvedLine.marchingAnts) {
        console.error('Attempted to render a curved line shape with a marching ant buffer but provided no marching ant metrics. This curved line shape will be skipped', curvedLine);
        continue;
      }

      colorStart = curvedLine.startColor.base;
      colorEnd = curvedLine.endColor.base;
      halfWidthSize = curvedLine.lineWidth / 2.0;
      length = curvedLine.resolution;
      p1 = curvedLine.start;
      p2 = curvedLine.end;
      antGap = curvedLine.marchingAnts.gapLength;
      antSpeed = curvedLine.marchingAnts.speed;
      antLength = curvedLine.marchingAnts.strokeLength + curvedLine.marchingAnts.gapLength;

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
          marching: Float32Array, mpos: number,
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
          mpos += marchingAttributeSize;
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
          marching[mpos] = antStartTime;
          marching[++mpos] = antSpeed;
          marching[++mpos] = antGap;
          marching[++mpos] = antLength;
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
          marching[++mpos] = antStartTime;
          marching[++mpos] = antSpeed;
          marching[++mpos] = antGap;
          marching[++mpos] = antLength;
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
          marching[++mpos] = antStartTime;
          marching[++mpos] = antSpeed;
          marching[++mpos] = antGap;
          marching[++mpos] = antLength;
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
          marching[++mpos] = antStartTime;
          marching[++mpos] = antSpeed;
          marching[++mpos] = antGap;
          marching[++mpos] = antLength;
          controlPick[++cpos] = controlRef;

          // Copy last vertex again for degenerate tri
          positions[++ppos] = i / length;
          positions[++ppos] = length;
          positions[++ppos] = curvedLine.depth;
          halfWidth[++wpos] = halfWidthSize;
          // Skip over degenerate tris for color
          scpos += colorAttributeSize;
          ecpos += colorAttributeSize;
          mpos += marchingAttributeSize;
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

    // Since we have the ability to flatten the shape buffer (thus causing a new array point to
    // Come into existance) we must explicitly ensure the current data is set to the actual
    // Shape buffer that came in. This makes clusters only efficient if using a multibuffer cache
    if (isCluster(shapeBuffer)) {
      this.bufferItems.currentData = shapeBuffer;
    }

    return needsUpdate;
  }
}
