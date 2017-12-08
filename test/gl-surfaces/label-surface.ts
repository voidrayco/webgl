import { ShaderMaterial, Vector2 } from 'three';
import { AnchorPosition, IWebGLSurfaceProperties, Label, ReferenceColor, SimpleStaticLabelBuffer, WebGLSurface } from '../../src/index';

const vshader = require('../../src/webgl-surface/shaders/fading-label.vs');
const fshader = require('../../src/webgl-surface/shaders/fading-label.fs');

export interface ILabelSurface extends IWebGLSurfaceProperties {

}

export class LabelSurface extends WebGLSurface<ILabelSurface, any> {
  buffer = new SimpleStaticLabelBuffer();

  // Apply properties
  applyLabelBufferChanges(props: ILabelSurface) {
    const labels = [
      new Label({
        baseLabel: props.labels[0],
        color: new ReferenceColor(props.colors[0]),
      }),
      new Label({
        baseLabel: props.labels[1],
        color: new ReferenceColor(props.colors[2]),
      }),
    ];

    labels[0].setAnchor(AnchorPosition.TopLeft);
    labels[0].setLocation({x: -150, y: 150});

    labels[1].setAnchor(AnchorPosition.TopLeft);
    labels[1].setLocation({x: -150, y: -150});

    this.buffer.update(
      labels,
      this.atlasManager,
      1,
    );
  }

  // Set up materials
  initBuffers() {
    // Start up initialization. Make materials
    const chartHeight = this.props.height || 100.0;
    const mat = new ShaderMaterial({
      fragmentShader: fshader,
      uniforms: {
        atlasTexture: { type: 't', value: this.atlasManager.getAtlasTexture(this.atlasNames.labels) },
        camera: {type: 'v3', value: this.camera.getWorldPosition()},
        colorAtlas: { type: 't', value: this.atlasManager.getAtlasTexture(this.atlasNames.colors) },
        colorsPerRow: { type: 'f', value: 0.0 },
        endFade: {type: 'f', value : 0.0 },
        firstColor: { type: 'v2', value: new Vector2(0, 0) },
        maxLabelSize: {tye: 'f', value : 20.0 / (chartHeight * 4.0) },
        nextColor: { type: 'v2', value: new Vector2(0, 0) },
        screen: { type: 'v2', value: new Vector2(0, 0) },
        startFade: {type: 'f', value: 0.0 },
        zoom: { type: 'f', value: 1 },
      },
      vertexShader: vshader,
    });

    this.buffer.init(mat, 10000);
    this.scene.add(this.buffer.bufferItems.system);
  }
}
