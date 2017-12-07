const vshader = require('../../src/webgl-surface/shaders/point-circle.vs');
const fshader = require('../../src/webgl-surface/shaders/point-circle.fs');
import { ShaderMaterial, Vector2, Vector4 } from 'three';
import { BufferUtil, CircleShape, CurveType, IWebGLSurfaceProperties, ReferenceColor, SimpleStaticCircleBuffer, WebGLStat, WebGLSurface } from '../../src/index';

export interface ISimpleCircleSurface extends IWebGLSurfaceProperties {

}

export class SimpleCircleSurface extends WebGLSurface<ISimpleCircleSurface, any> {
  buffer = new SimpleStaticCircleBuffer();

  // Apply properties
  applyColorBufferChanges(props: ISimpleCircleSurface) {
    this.buffer.update([ new CircleShape({
      innerRadius: 10,
      innerColor: new ReferenceColor(props.colors[0]),
      outerColor: new ReferenceColor(props.colors[1]),
      depth: 0,
      centerX: 40,
      centerY: -40,
      radius: 100,
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
