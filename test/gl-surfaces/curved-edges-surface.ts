const vshader = require('../../src/webgl-surface/shaders/atlas-colors/uniform-instance-edge.vs');
const fshader = require('../../src/webgl-surface/shaders/simple-line.fs');
import { ShaderMaterial, Vector2, Vector4 } from 'three';
import { BufferUtil, CurvedEdgeShape, CurveType, IWebGLSurfaceProperties, ReferenceColor, UniformInstanceEdgeBuffer, WebGLStat, WebGLSurface } from '../../src/index';
 // Comment import { BufferUtil, CurvedEdgeShape, IWebGLSurfaceProperties, ReferenceColor, UniformInstanceArcBuffer, UniformInstanceEdgeBuffer, WebGLStat, WebGLSurface } from '../../src/index';

export interface ICurvedEdgesSurface extends IWebGLSurfaceProperties {

}

export class CurvedEdgesSurface extends WebGLSurface<ICurvedEdgesSurface, any> {
  buffer = new UniformInstanceEdgeBuffer();

  // Apply properties
  applyColorBufferChanges(props: ICurvedEdgesSurface) {
    this.buffer.update([ new CurvedEdgeShape({
      type: CurveType.CircularCCW,
      startColor: new ReferenceColor(props.colors[0]),
      endColor: new ReferenceColor(props.colors[0]),
      start: {x: 0, y: 0},
      end: {x: 0, y: -150},
      controlPoints: [{x: 100, y: -75}],
      endWidth: 5,
      startWidth: 5,
    } ) ],
      this.atlasManager, 1);
  }

  // Set up materials
  initBuffers() {
    // Start up initialization. Make materials
    const mat = new ShaderMaterial({
      fragmentShader: fshader,
      uniforms: {
        colorAtlas: { type: 't', value: this.atlasManager.getAtlasTexture(this.atlasNames.colors) },
        colorsPerRow: { type: 'f', value: 0 },
        controlPoint: { type: 'v2', value: new Vector2(0, 0) },
        firstColor: { type: 'v2', value: new Vector2(0, 0) },
        instanceData: { type: 'bvec4', value: new Array(WebGLStat.MAX_VERTEX_INSTANCE_DATA).fill(0).map(() => new Vector4(0, 0, 0, 0)) },
        nextColor: { type: 'v2', value: new Vector2(0, 0) },
      },
      vertexShader: vshader,
    });

    this.buffer.init(mat, 10000);
    this.scene.add(this.buffer.bufferItems.system);
  }
}
