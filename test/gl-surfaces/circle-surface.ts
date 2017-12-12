import { CustomBlending, ShaderMaterial, Vector2, Vector4 } from 'three';
import { CircleShape, IWebGLSurfaceProperties, SimpleStaticCircleBuffer, WebGLStat, WebGLSurface } from '../../src/index';

const vshader = require('../../src/webgl-surface/shaders/point-circle.vs');
const fshader = require('../../src/webgl-surface/shaders/point-circleTEST.fs');

export interface ICircleSurface extends IWebGLSurfaceProperties {

}

export class CircleSurface extends WebGLSurface<ICircleSurface, any> {
  buffer = new SimpleStaticCircleBuffer();

  // Apply properties
  applyColorBufferChanges(props: ICircleSurface) {
    this.buffer.update([ new CircleShape({
      centerX: 10,
      centerY: 0,
      color: new Vector4(0.3, 0.5, 0.0, 1.0),
      depth: 0,
      innerColor: new Vector4(0.0, 0.0, 1.0),
      innerRadius: 0.2,
      radius: 0.9,
      size: 40.0,
    } ) ],
      this.atlasManager);
  }

  // Set up materials
  initBuffers() {
    // Start up initialization. Make materials
    const mat = new ShaderMaterial({
      blending: CustomBlending,
      depthTest: true,
      fragmentShader: fshader,
      transparent: true,

      uniforms: {
        colorAtlas: { type: 't', value: this.atlasManager.getAtlasTexture(this.atlasNames.colors) },
        colorsPerRow: { type: 'f', value: 0 },
        firstColor: { type: 'v2', value: new Vector2(0, 0) },
        instanceData: { type: 'bvec4', value: new Array(WebGLStat.MAX_VERTEX_INSTANCE_DATA).fill(0).map(() => new Vector4(0, 0, 0, 0)) },
        nextColor: { type: 'v2', value: new Vector2(0, 0) },
        zoom: { type: 'f', value: 1.0 },
      },
      vertexShader: vshader,
    });

    this.buffer.init(mat, 10000);
    this.scene.add(this.buffer.bufferItems.system);
  }
}
