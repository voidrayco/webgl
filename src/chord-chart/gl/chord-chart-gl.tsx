import {
  CustomBlending,
  IUniform,
  NormalBlending,
  OneFactor,
  ShaderMaterial,
} from 'three';
import { SimpleStaticBezierLineBuffer } from 'webgl-surface/buffers/static/simple-bezier-line-buffer';
import { SimpleStaticCircularLineBuffer } from 'webgl-surface/buffers/static/simple-circular-line-buffer';
import { SimpleStaticLabelBuffer } from 'webgl-surface/buffers/static/simple-label-buffer';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Label } from 'webgl-surface/drawing/label';
import { Bounds } from 'webgl-surface/primitives/bounds';
import { IPoint } from 'webgl-surface/primitives/point';
import { IProjection } from 'webgl-surface/util/projection';
import { filterQuery } from 'webgl-surface/util/quad-tree';
import { QuadTree } from 'webgl-surface/util/quad-tree';
import { IWebGLSurfaceProperties, WebGLSurface } from 'webgl-surface/webgl-surface';

const debug = require('debug')('chord-chart:gl');

// Local component properties interface
export interface IChordChartGLProperties extends IWebGLSurfaceProperties {
  /** Special case lines that use specific processes to animate */
  animatedCurvedLines?: CurvedLineShape<any>[],
  /** Lines that change frequently due to interactions */
  interactiveCurvedLines?: CurvedLineShape<any>[],
  interactiveRingLines?: CurvedLineShape<any>[],
  /** Labels that change frequently due to interactions */
  interactiveLabels?: Label<any>[],
  /** Lines that do not change often */
  staticCurvedLines?: CurvedLineShape<any>[],
  /** It is used to seperater from curved lines */
  staticRingLines?: CurvedLineShape<any>[],
  /** These are the non-frequently changing labels */
  staticLabels?: Label<any>[],
  /** Event handlers */
  onMouseHover?(curves: CurvedLineShape<any>[], mouse: IPoint, world: IPoint, projection: IProjection): void,
  onMouseLeave?(curves: CurvedLineShape<any>[], mouse: IPoint, world: IPoint, projection: IProjection): void,
  onMouseUp?(curves: CurvedLineShape<any>[], mouse: IPoint, world: IPoint, projection: IProjection): void
}

// --[ SHADERS ]-------------------------------------------
const bezierVertexShader = require('webgl-surface/shaders/bezier.vs');
const fillVertexShader = require('./shaders/simple-fill.vs');
const fillFragmentShader = require('./shaders/simple-fill.fs');
const textureVertexShader = require('webgl-surface/shaders/textured-quad.vs');
const textureFragmentShader = require('webgl-surface/shaders/textured-quad.fs');

/**
 * The base component for the communications view
 */
export class ChordChartGL extends WebGLSurface<IChordChartGLProperties, {}> {
  // BUFFERS
  interactiveBezierBuffer: SimpleStaticBezierLineBuffer = new SimpleStaticBezierLineBuffer();
  interactiveCircularBuffer: SimpleStaticCircularLineBuffer = new SimpleStaticCircularLineBuffer();
  staticBezierBuffer: SimpleStaticBezierLineBuffer = new SimpleStaticBezierLineBuffer();
  staticCircularBuffer: SimpleStaticCircularLineBuffer = new SimpleStaticCircularLineBuffer();

  // LABELS BUFFER ITEMS
  staticLabelBuffer: SimpleStaticLabelBuffer = new SimpleStaticLabelBuffer();
  interactiveLabelBuffer: SimpleStaticLabelBuffer = new SimpleStaticLabelBuffer();

  /** The current dataset that is being rendered by this component */
  animatedCurvedLines: CurvedLineShape<any>[] = [];
  /** The current dataset that is being rendered by this component */
  interactiveCurvedLines: CurvedLineShape<any>[] = [];
  interactiveRingLines: CurvedLineShape<any>[] = [];
  /** The current dataset that is being rendered by this component */
  staticCurvedLineSet: CurvedLineShape<any>[] = [];

  // Keeps track of some maouse interaction states
  mouseHovered = new Map<any, boolean>();

  /**
   * Applies new props injected into this component.
   *
   * @param  props The new properties for this component
   */
  applyBufferChanges(props: IChordChartGLProperties) {
    const {
      staticCurvedLines,
      staticRingLines,
      interactiveCurvedLines,
      interactiveRingLines,
    } = props;

    // Set to true when the quad tree needs to be updated
    let needsTreeUpdate = false;

    // Commit static bezier lines
    needsTreeUpdate = this.staticBezierBuffer.update(staticCurvedLines) || needsTreeUpdate;
    // Commit ring curved lines using old methods
    needsTreeUpdate = this.staticCircularBuffer.update(staticRingLines) || needsTreeUpdate;
    // Commit interactive curved lines
    this.forceDraw = this.interactiveBezierBuffer.update(interactiveCurvedLines) || this.forceDraw;
    // Commit interactive ring curves
    this.forceDraw = this.interactiveCircularBuffer.update(interactiveRingLines) || this.forceDraw;
    this.forceDraw = this.forceDraw || needsTreeUpdate;

    if (needsTreeUpdate) {
      if (this.quadTree) {
        this.quadTree.destroy();
        this.quadTree = null;
      }

      // Gather the items to place in the quad tree
      const toAdd: Bounds<any>[] = staticCurvedLines.concat(staticRingLines);

      // Make the new quad tree and insert the new items
      this.quadTree = new QuadTree<Bounds<any>>(0, 0, 0, 0);
      this.quadTree.bounds.copyBounds(toAdd[0]);
      this.quadTree.addAll(toAdd);
    }

    debug('CAMERA %o', this.camera);
  }

  /**
   * @override
   *
   * This special hook is called when the labels are ready for rendering
   *
   * @param props The newly applied props being applied to this component
   */
  applyLabelBufferChanges(props: IChordChartGLProperties) {
    const {
      interactiveLabels,
      staticLabels,
    } = props;

    // Set up any materials that needs the labels.

    {
      // Make sure the uniforms for anything using the label's atlas texture is updated
      const material: ShaderMaterial = this.staticLabelBuffer.bufferItems.system.material as ShaderMaterial;
      const uniforms: { [k: string]: IUniform } = material.uniforms;
      uniforms.atlasTexture.value = this.atlasManager.getAtlasTexture(this.atlasNames.labels);
      this.atlasManager.getAtlasTexture(this.atlasNames.labels).needsUpdate = true;
      this.atlasManager.getAtlasTexture(this.atlasNames.labels).anisotropy = 2;
    }

    // Apply static labels
    this.staticLabelBuffer.update(staticLabels);
    // Apply interactive labels
    this.interactiveLabelBuffer.update(interactiveLabels);
  }

  /**
   * This is a hook allowing sub classes to have a place to initialize their buffers
   * and materials etc.
   */
  initBuffers() {
    // SET UP MATERIALS AND UNIFORMS
    const quadMaterial = new ShaderMaterial({
      blending: NormalBlending,
      depthTest: true,
      fragmentShader: fillFragmentShader,
      transparent: true,
      uniforms: {halfLinewidth: {value: 1.5}},
      vertexShader: bezierVertexShader,
    });

    const ringMaterial = new ShaderMaterial({
      blending: NormalBlending,
      depthTest: true,
      fragmentShader: fillFragmentShader,
      transparent: true,
      vertexShader: fillVertexShader,
    });

    const texUniforms = {
      atlasTexture: { type: 't', value: this.atlasManager.getAtlasTexture(this.atlasNames.labels) },
    };

    const textureMaterial = new ShaderMaterial({
      blending: CustomBlending,
      depthTest: true,
      fragmentShader: textureFragmentShader,
      transparent: true,
      uniforms: texUniforms,
      vertexShader: textureVertexShader,
    });

    textureMaterial.blendSrc = OneFactor;

    // GENERATE THE QUAD BUFFER
    {
      // Initialize the static curve buffer
      this.staticBezierBuffer.init(quadMaterial, 100000);
      // Place the mesh in the scene
      this.scene.add(this.staticBezierBuffer.bufferItems.system);
    }

    // GENERATE RING QUAD BUFFER
    {
      // Initialize the static buffer for circular lines
      this.staticCircularBuffer.init(ringMaterial, 100000);
      // Place the mesh in the scene
      this.scene.add(this.staticCircularBuffer.bufferItems.system);
    }

    // GENERATE THE INTERACTION QUAD BUFFER
    {
      // The interactive bezier buffer
      this.interactiveBezierBuffer.init(quadMaterial, 100000);
      // Place the mesh in the scene
      this.scene.add(this.interactiveBezierBuffer.bufferItems.system);
    }

    // GENERATE THE INTERACTIVE RING BUFFER
    {
      /// Initialize the buffer for interactive circular curved lines
      this.interactiveCircularBuffer.init(ringMaterial, 100000);
      // Place the mesh in the scene
      this.scene.add(this.interactiveCircularBuffer.bufferItems.system);
    }

    // GENERATE THE LABEL BUFFER
    {
      // Initialize the buffer for base static labels
      this.staticLabelBuffer.init(textureMaterial, 10000);
      // Place the mesh in the scene
      this.scene.add(this.staticLabelBuffer.bufferItems.system);
    }

    // GENERATE THE INTERACTIVE LABEL BUFFER
    {
      // Initialize the buffer for interactive labels
      this.interactiveLabelBuffer.init(textureMaterial, 10000);
      // Place the mesh in the scene
      this.scene.add(this.interactiveLabelBuffer.bufferItems.system);
    }
  }

  onMouseHover(hitInside: Bounds<any>[], mouse: IPoint, world: IPoint, projection: IProjection) {
    // Filter out curves that presently exist in interactiveCurvedLines
    // Includes outerRings and chords
    const hitCurvedLines = filterQuery<CurvedLineShape<any>>([CurvedLineShape], hitInside);
    // We want the user to be a specified distance in SCREEN PIXELS to interact with the lines
    const screenDistance = projection.screenSizeToWorld(1, 1).width;
    // This will keep track of all items that were hovered but are no longer hovered
    const leftItems: CurvedLineShape<any>[] = [];

    const selections = hitCurvedLines.filter((curve, idx) => {
      if (curve.distanceTo(world) < screenDistance) {
        this.mouseHovered.set(curve, true);
        return true;
      }

      else if (this.mouseHovered.get(curve)) {
        this.mouseHovered.delete(curve);
        leftItems.push(curve);
      }

      return false;
    });

    if (this.props.onMouseHover){
      this.props.onMouseHover(selections, mouse, world, projection);
    }

    if (this.props.onMouseLeave){
      this.props.onMouseLeave(leftItems, mouse, world, projection);
    }
  }

  onMouseLeave(left: Bounds<any>[], mouse: IPoint, world: IPoint, projection: IProjection) {
    // Const selections: CurvedLineShape<any>[] = [];
    const leftCurvedLines = filterQuery<CurvedLineShape<any>>([CurvedLineShape], left);
    // We want the user to be a specified distance in SCREEN PIXELS to interact with the lines
    const screenDistance = projection.screenSizeToWorld(1, 1).width;

    const selections = leftCurvedLines.filter((curve, idx) => {
      if (curve.distanceTo(world) > screenDistance) {
        if (this.mouseHovered.get(curve)) {
          this.mouseHovered.delete(curve);
          return true;
        }
      }
      return false;
    });

    if (this.props.onMouseLeave){
      this.props.onMouseLeave(selections, mouse, world, projection);
    }
  }

  onMouseUp(e: React.MouseEvent<HTMLDivElement>, hitInside: Bounds<any>[], mouse: IPoint, world: IPoint, projection: IProjection) {
    // Const selections: CurvedLineShape<any>[] = [];
    debug('ccg mouse up');
    const clickedCurvedLines = filterQuery<CurvedLineShape<any>>([CurvedLineShape], hitInside);
    // We want the user to be a specified distance in SCREEN PIXELS to interact with the lines
    const screenDistance = projection.screenSizeToWorld(1, 1).width;

    const selections = clickedCurvedLines.filter((curve, idx) => {
      if (curve.distanceTo(world) < screenDistance) {
        return true;
      }
      return false;
    });

    if (this.props.onMouseUp){
      this.props.onMouseUp(selections, mouse, world, projection);
    }
  }

  /**
   * Any uniforms tied to changes in the camera are updated here
   */
  updateCameraUniforms() {
    // NOTE: Implement if required. Leave empty to prevent any default behavior
  }
}
