const vshader = require('../../src/webgl-surface/shaders/point-icon.vs');
const fshader = require('../../src/webgl-surface/shaders/point-icon.fs');
import { ShaderMaterial, Vector2, Vector4 } from 'three';
import { BufferUtil, CurveType, IconShape, IWebGLSurfaceProperties, ReferenceColor, SimpleStaticIconBuffer, WebGLStat, WebGLSurface } from '../../src/index';

export interface IPointIconSurface extends IWebGLSurfaceProperties {

}

export class PointIconSurface extends WebGLSurface<IPointIconSurface, any> {
  buffer = new SimpleStaticIconBuffer();

  // Apply properties
  applyColorBufferChanges(props: IPointIconSurface) {
    this.buffer.update([ new IconShape({
      size: 20,
      tint: new ReferenceColor(props.colors[0]),
      texture: props.textures[0],
    } ) ],
      this.atlasManager);
  }

  // Set up materials
  initBuffers() {
    // Start up initialization. Make materials
    const mat = new ShaderMaterial({
      fragmentShader: fshader,
      uniforms: {
        texture: { type: 't', value: this.atlasManager.getAtlasTexture(this.atlasNames.colors)},
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
