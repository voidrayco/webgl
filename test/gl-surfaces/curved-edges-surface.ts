import { ShaderMaterial, Vector2, Vector4 } from 'three';
import { BufferUtil, IWebGLSurfaceProperties, UniformInstanceArcBuffer, WebGLStat, WebGLSurface } from '../../src/index';

export interface ICurvedEdgesSurface extends IWebGLSurfaceProperties {

}

export class CurvedEdgesSurface extends WebGLSurface<ICurvedEdgesSurface, any> {
  buffer: UniformInstanceArcBuffer;

  // Apply properties
  applyColorBufferChanges() {
    this.buffer.update([/** Shapes go here */], this.atlasManager, 1);
  }

  // Set up materials
  initBuffers() {
    // Start up initialization. Make materials
    const mat = new ShaderMaterial({
      fragmentShader: '',
      uniforms: {
        colorAtlas: { type: 't', value: this.atlasManager.getAtlasTexture(this.atlasNames.colors) },
        colorsPerRow: { type: 'f', value: 0 },
        controlPoint: { type: 'v2', value: new Vector2(0, 0) },
        firstColor: { type: 'v2', value: new Vector2(0, 0) },
        instanceData: { type: 'bvec4', value: new Array(WebGLStat.MAX_VERTEX_INSTANCE_DATA).fill(0).map(() => new Vector4(0, 0, 0, 0)) },
        nextColor: { type: 'v2', value: new Vector2(0, 0) },
      },
      vertexShader: '',
    });

    this.buffer.init(mat, 10000);
  }
}
