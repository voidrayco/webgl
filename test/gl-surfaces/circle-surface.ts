import { ShaderMaterial, Vector2, Vector4 } from 'three';
import { CircleShape, IWebGLSurfaceProperties, ReferenceColor, SimpleStaticCircleBuffer, WebGLStat, WebGLSurface } from '../../src/index';

const vshader = require('../../src/webgl-surface/shaders/point-circle.vs');
const fshader = require('../../src/webgl-surface/shaders/point-circle.fs');

export interface ICircleSurface extends IWebGLSurfaceProperties {

}

export class CircleSurface extends WebGLSurface<ICircleSurface, any> {
  buffer = new SimpleStaticCircleBuffer();

  // Apply properties
  applyColorBufferChanges(props: ICircleSurface) {
    this.buffer.update([ new CircleShape({
      centerX: 10,
      centerY: 0,
      depth: 0,
      innerColor: new ReferenceColor(props.colors[1]),
      innerRadius: 0.2,
      outerColor: new ReferenceColor(props.colors[0]),
      radius: 0.9,
    } ) ],
      this.atlasManager);
  }

  // Set up materials
  initBuffers() {
    // Start up initialization. Make materials
    const mat = new ShaderMaterial({
      fragmentShader: fshader,
      uniforms: {
        colorAtlas: { type: 't', value: this.atlasManager.getAtlasTexture(this.atlasNames.colors) },
        colorsPerRow: { type: 'f', value: 0 },
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
