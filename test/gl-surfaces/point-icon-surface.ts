import { CustomBlending, ShaderMaterial, SrcAlphaFactor, Vector2, Vector4 } from 'three';
import { AnimatedMethod, AnimatedMethodLookup, IconShape, IWebGLSurfaceProperties, ReferenceColor, SimpleStaticIconBuffer, WebGLStat, WebGLSurface } from '../../src/index';

const vshader = require('../../src/webgl-surface/shaders/point-icon.vs');
const fshader = require('../../src/webgl-surface/shaders/point-icon.fs');

export interface IPointIconSurface extends IWebGLSurfaceProperties {

}

export class PointIconSurface extends WebGLSurface<IPointIconSurface, any> {
  buffer = new SimpleStaticIconBuffer();

  // Apply properties
  applyImageBufferChanges(props: IPointIconSurface) {
    if (this.imagesReady) {
      const images = [
        new IconShape({
          atlasTexture: props.images[0],
          size: 400,
          tint: new ReferenceColor(props.colors[3]),
        } ),
        new IconShape({
          atlasTexture: props.images[1],
          size: 100,
          tint: new ReferenceColor(props.colors[3]),
        } ),
        new IconShape({
          atlasTexture: props.images[2],
          size: 400,
          tint: new ReferenceColor(props.colors[3]),

        } ),
      ];
      images[0].centerOn(0, -200, -1);
      images[1].centerOn(-300, 0, -1);
      images[2].centerOn(200, 0, -1);

      this.buffer.update(images,
        this.atlasManager);
    }
  }

  animatedMethods(baseAnimatedMethods: AnimatedMethodLookup, orderedBaseAnimatedMethods: AnimatedMethod[]): AnimatedMethod[] {
    orderedBaseAnimatedMethods.push(() =>
      ({
        doDraw: true,
      }));

    return orderedBaseAnimatedMethods;
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
        atlasTexture: { type: 't', value: this.atlasManager.getAtlasTexture(this.atlasNames.images)},
        colorAtlas: { type: 't', value: this.atlasManager.getAtlasTexture(this.atlasNames.colors) },
        colorsPerRow: { type: 'f', value: 0 },
        firstColor: { type: 'v2', value: new Vector2(0, 0) },
        instanceData: { type: 'bvec4', value: new Array(WebGLStat.MAX_VERTEX_INSTANCE_DATA).fill(0).map(() => new Vector4(0, 0, 0, 0)) },
        nextColor: { type: 'v2', value: new Vector2(0, 0) },
        zoom: { type: 'f', value: 1 },
      },
      vertexShader: vshader,
    });
    mat.blendSrc = SrcAlphaFactor;
    this.buffer.init(mat, 10000);
    this.scene.add(this.buffer.bufferItems.system);
  }
}
