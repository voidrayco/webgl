import { merge } from 'ramda';
import * as React from 'react';
import { Color, CullFaceNone, OrthographicCamera, Scene, ShaderMaterial, Vector3, WebGLRenderer } from 'three';
import { Label } from './drawing/shape/label';
import { AtlasColor } from './drawing/texture/atlas-color';
import { AtlasManager } from './drawing/texture/atlas-manager';
import { AtlasTexture } from './drawing/texture/atlas-texture';
import { Bounds } from './primitives/bounds';
import { IPoint } from './primitives/point';
import { ISize } from './primitives/size';
import { FrameInfo } from './util/frame-info';
import { eventElementPosition } from './util/mouse';
import { IProjection } from './util/projection';
import { QuadTree } from './util/quad-tree';
import { IScreenContext } from './util/screen-context';
import { WebGLStat } from './util/webgl-stat';
const debug = require('debug')('webgl-surface:GPU');
const debugCam = require('debug')('webgl-surface:Camera');
const debugLabels = require('debug')('webgl-surface:Labels');
const debugColors = require('debug')('webgl-surface:Colors');

/**
 * This enum names the base methods that are passed into the applyPropsMethods
 * method. This allows subclasses to easily pick the property setting methods they need
 * from the base
 */
export enum BaseApplyPropsMethods {
  /** Initializes any context that needs to be set up before the props are set */
  INITIALIZE,
  /** Moment when any buffer changes should be applied */
  BUFFERCHANGES,
  /** Initializes camera properties to facilitate smoothe start up */
  CAMERA,
  /** Generates the labels as images within the atlas manager */
  LABELS,
  /** Generates the colors within the atlas manager */
  COLORS,
}

/**
 * This enum names the base methods that are passed into the animatedMethods
 * method. This allows subsclasses to easily pick the animated methods they need
 * from the base
 */
export enum BaseAnimatedMethods {
  /** Sets up the base context needed to execute most methods */
  CONTEXT,
  /** Sets up the inertia method for inertial panning */
  INERTIA,
  /** Animates the postion of the camera to a destination */
  POSITION,
  /** Zooms the camera based on a point of focus */
  ZOOM,
}

/**
 * This defines a response an apply props method can return.
 *
 * If this response is empty then it assumes all items are false.
 */
export interface IApplyPropsMethodResponse {
  /**
   * If set to true, the system will not execute any remaining apply props methods for this application of props
   * and will resume executing methods next time props are applied starting from the beginning of the list
   */
  break?: boolean
}

/**
 * This defines a response that an animated method can return. This will
 * give the method some control over the flow of animated methods.
 *
 * If this response is empty then it assumes all items are false.
 */
export interface IAnimatedMethodResponse {
  /**
   * If set to true, the system will not execute any remaining animated methods for the remainder of the frame
   * and will resume executing methods next frame from the beginning of the animated method list
   */
  break?: boolean
  /**
   * If this is set to true and returned, it will guarantee a redraw will happen after the animated methods
   * have finished executing
   */
  doDraw?: boolean
  /**
   * If set to true, the system will cease to animate until some task starts up the loop again by calling
   * animate()
   */
  stop?: boolean
}

// Types for making method assignment and organizatione easier
export type AnimatedMethodOptions = { labelsReady?: boolean, colorsReady?: boolean };
export type AnimatedMethodWithOptions = { options: AnimatedMethodOptions, method(): IAnimatedMethodResponse };
export type AnimatedMethod = () => IAnimatedMethodResponse;
export type AnimatedMethodLookup = {[key: number]: AnimatedMethod};
export type ApplyPropsMethod<T> = (props: T) => IApplyPropsMethodResponse;
export type ApplyPropsMethodLookup<T> = {[key: number]: ApplyPropsMethod<T>};

function isAnimatedWithOptions(value: any): value is AnimatedMethodWithOptions {
  if (value.options) {
    return true;
  }

  return false;
}

function isAnimated(value: any): value is AnimatedMethod {
  if (!value.options) {
    return true;
  }

  return false;
}

/** This is the smallest increment the zoom can make. Anything less and nothing will happen */
const MIN_ZOOM_INCREMENT = 0.001;
const BYTE_MAX = 0xFF;
const BACKGROUND_COLOR = new Color().setRGB(38 / BYTE_MAX, 50 / BYTE_MAX, 78 / BYTE_MAX);

// Local component properties interface
export interface IWebGLSurfaceProperties {
  /**
   * Sets the renderer's background color. If the opacity is less than one at initialization,
   * it enables 'transparent' canvas rendering which is much less efficient. All color values
   * are 0 - 1
   */
  backgroundColor: {
    /** Red channel 0-1 */
    r: number,
    /** Green channel 0-1 */
    g: number,
    /** Blue channel 0-1 */
    b: number,
    /** Alpha channel 0-1 */
    opacity: number,
  }
  /** When true, will cause a camera recentering to take place when new base items are injected */
  centerOnNewItems?: boolean
  /** All of the unique colors used in the system */
  colors?: AtlasColor[]
  /** The forced size of the render surface */
  height?: number
  /** This will be the view the camera focuses on when the camera is initialized */
  viewport?: Bounds<never>
  /** All of the labels to be rendered by the system */
  labels?: Label<any>[]
  /** Provides feedback when the surface is double clicked */
  onDoubleClick?(e: React.MouseEvent<Element>): void
  /** Provides feedback when the mouse has moved */
  onMouse?(screen: IPoint, world: IPoint, isPanning: boolean): void
  /**
   * This is a handler that handles zoom changes the gpu-chart may request.
   * This includes moments such as initializing the camera to focus on a
   * provided viewport.
   */
  onZoomRequest(zoom: number): void
  /** The forced size of the render surface */
  width?: number
  /** The zoom level that the camera should apply */
  zoom: number
}

// --[ CONSTANTS ]-------------------------------------------

// Make a container vector for performing operations within
const vector = new Vector3();

// --[ SHADERS ]-------------------------------------------

/**
 * Equivalent of Math.sign, but faster, and works in all browsers
 *
 * @param {number} value The number to determine the sign
 *
 * @return {number} Returns zero if a sign can not be determined, -1 for a negative, 1 for a positive
 */
function sign(value: number): number {
  if (!value) { return 0; }
  if (value > 0) { return 1; }
  if (value < 0) { return -1; }

  return 0;
}

/**
 * The base component for the communications view
 */
export class WebGLSurface<T extends IWebGLSurfaceProperties, U> extends React.Component<T, U> {
  /** This is the atlas manager for managing images and labels rendered as textures */
  atlasManager: AtlasManager = new AtlasManager(2048, 2048);
  /** Tracks the names of the atlas' generated */
  atlasNames = {
    colors: 'colors',
    labels: 'labels',
  };
  /**
   * List of methods that execute within the animation loop. Makes adding and removing these methods
   * simpler to manage, as well as gives a clear and optimized way of overriding existing methods
   * or reordering their execution
   */
  animatedMethodList: (AnimatedMethod | AnimatedMethodWithOptions)[] = [];
  /**
   * If this is set to true during an animated method's lifecycle, then all subsequent animated methods
   * will not be executed for the current frame. Upon reaching the end of the frame, the break will reset
   * and the animated methods will attempt executing again
   */
  animatedMethodBreak: boolean = false;
  /**
   * This viewport is the last viewport applied to the camera.
   * If the props inject a new viewport, this is updated with that value so
   * that the viewport will only be applied once if it doesn't change again.
   */
  appliedViewport: Bounds<any>;
  /**
   * The camera that 'looks' at our world and gives us the ability to convert
   * screen coordinates to world coordinates, and vice versa
   */
  camera: OrthographicCamera | null = null;
  /** A camera that is used for projecting sizes to and from the screen to the world */
  circleMaterial: ShaderMaterial;
  /** Stores screen dimension info */
  ctx: IScreenContext;
  /**
   * While this number is positive it will be decremented every frame.
   * While positive, mouse interactions will not occur. This utilizes frame ticks
   * as SOME values and numbers settle per frame, not necessarily within timelapses.
   * More often than not, there will only be a need for 1-2 frames of mouse disable to
   * allow the camera to be positioned in a correct location before screen to world projections
   * start taking place.
   */
  disableMouseInteraction: number = 0;
  /** Used to aid in mouse interactions */
  distance = 0;
  /** When set, forces a draw next animation frame */
  forceDraw: boolean;
  /**
   * This stores the gl rendering context for reference when it's available
   */
  gl: WebGLRenderingContext;
  /** Contains the methods for projecting between screen and world spaces */
  projection: IProjection;
  /** The top level HTML element for this component */
  renderEl: HTMLElement;
  /** The threejs renderer */
  renderer: WebGLRenderer;
  scene: Scene;
  sizeCamera: OrthographicCamera | null = null;
  /** Keep track of the current zoom so it can be set in requestAnimationFrame */
  currentZoom = 1;
  /** Horizontal destination the camera will pan to */
  destinationX = 0;
  /** Vertical position the camera will pan to */
  destinationY = 0;
  /** The destination zoom level the camera used during panning */
  destinationZoom = 1;
  /** Is the camera currently in a panning state */
  isPanning = false;
  /** Last known screen position of the mouse */
  lastMousePosition = { x: 0, y: 0 };
  /** List of methods to execute when applying props */
  propsMethodList: ApplyPropsMethod<T>[] = [];
  /** Inertial values for drag panning */
  inertia: IPoint | null = null;
  inertiaBuild = 1.5;
  inertiaDecay = .9;
  inertiaMax = 100;
  /**
   * All data is put into this quad tree so we can query spatial regions for
   * items
   */
  quadTree: QuadTree<Bounds<any>> | null = null;
  /**
   * True if the shift key is currently being held
   *
   * Panning is affected by whether or not the shift key is being held down, but
   * I don't know how yet.
   */
  shiftIsDown = false;
  stop = false;
  /** The current rendered position and zoom */
  currentX = 0;
  currentY = 0;
  targetZoom = 1;
  /** The (world) position the focus will zoom in and out of */
  previousZoomToFit = 0;
  zoomTargetX = 0;
  zoomTargetY = 0;

  /** When this is set, the draw loop continues to run. Used by the draw loop to complete animations */
  animating: boolean = false;
  labels: Label<any>[] = [];
  labelsReady: boolean = false;
  /**
   * This is the latest labels loading identifier, used to determine if the labels
   * last loaded matches the labels currently needing to be rendered.
   */
  labelsCurrentLoadedId: number = 0;
  labelsLoadId: number = 0;
  /** When this is set to true, the atlas with the colors is now ready to be referenced */
  colors: AtlasColor[] = [];
  colorsReady: boolean = false;

  /** Holds the items currently hovered over */
  currentHoverItems: Bounds<any>[] = [];

  /** Mouse in stage or not */
  dragOver: boolean = true;

  /** Flag for detecting whether or not webgl is supported at all */

  /**
   * This is the update loop that operates at the requestAnimationFrame speed.
   * This updates the cameras current position and causes changes over time for
   * any property that has a start and a destination.
   */
  animate = () => {
    if (this.stop) {
      return;
    }

    FrameInfo.lastFrameTime = Date.now();
    FrameInfo.framesPlayed.set(this, (FrameInfo.framesPlayed.get(this) || 0) + 1);
    requestAnimationFrame(() => this.animate());

    let response: IAnimatedMethodResponse;
    let doDraw: boolean | undefined = false;

    const didBreak = this.animatedMethodList.some((method: AnimatedMethod | AnimatedMethodWithOptions): boolean => {
      if (isAnimatedWithOptions(method)) {
        if (method.options.labelsReady && method.options.colorsReady) {
          if (this.labelsReady && this.colorsReady) {
            response = method.method();
          }
        }

        else if (method.options.labelsReady) {
          if (this.labelsReady) {
            response = method.method();
          }
        }

        else if (method.options.colorsReady) {
          if (this.colorsReady) {
            response = method.method();
          }
        }
      }

      else if (isAnimated(method)) {
        response = method();
      }

      // Update our draw status based on response
      if (!doDraw) {
        doDraw = response.doDraw;
      }

      // Stop the system if needed
      if (response.stop) {
        this.stop = true;
      }

      // Stop performing
      if (response.break) {
        return true;
      }

      return false;
    });

    // We prevent any animation loop execution if we did break
    if (didBreak) {
      return;
    }

    // Make sure all camera related uniforms are up to date
    this.updateCameraUniforms();

    // Handle the deactivation period of mouse interactions by decrementing it
    // If it's positive
    if (this.disableMouseInteraction > 0) {
      this.disableMouseInteraction--;
    }

    if (doDraw || this.forceDraw) {
      this.forceDraw = false;
      this.emitViewport();
      this.draw();
    }
  }

  /**
   * This is a hook so subclasses can contribute animated methods to the animation loop and organize the base methods
   * as desired.
   *
   * @param {AnimatedMethodLookup} baseAnimatedMethods The base animated methods referenceable by name
   * @param {AnimatedMethod[]} orderedBaseAnimatedMethods The base animated methods in their default order for ease of use
   *
   * @return {AnimatedMethods[]} The list of animated methods in the order they are expected to be executed
   */
  animatedMethods(baseAnimatedMethods: AnimatedMethodLookup, orderedBaseAnimatedMethods: (AnimatedMethod | AnimatedMethodWithOptions)[]): (AnimatedMethod | AnimatedMethodWithOptions)[] {
    // Default functionality is to use the simple preordered list
    return orderedBaseAnimatedMethods;
  }

  /**
   * This generates the base animated methods lookup.
   * We do not make these methods a part of the class as this is the base class
   * We want the start up methods to be inconsequential to sub classes, thus allowing
   * us to override, sort, or replace the initial methods and have the method get garbage
   * collected and no longer a part of the object. It is recommended to make the sub classes
   * actually point to class methods for better clarity
   *
   * @return {ANimatedMethodLookup} The base animated methods in a lookup
   */
  private animatedMethodsBase(): AnimatedMethodLookup {
    return {
      // Context changes and early checks
      [BaseAnimatedMethods.CONTEXT]: (): IAnimatedMethodResponse => {
        const response = {
          break: false,
          doDraw: false,
        };

        if (this.resizeContext()) {
          response.doDraw = true;
        }

        // Quadtree MUST be present to do proper computations
        if (!this.quadTree) {
          response.break = true;
        }

        return response;
      },

      // Apply inertia
      [BaseAnimatedMethods.INERTIA]: (): IAnimatedMethodResponse => {
        if (!this.isPanning) {
          if (this.inertia) {
            // Disabled inertia for now
            // This.destinationX -= this.inertia.x
            // This.destinationY -= this.inertia.y

            this.inertia.x *= this.inertiaDecay;
            this.inertia.y *= this.inertiaDecay;

            if (this.inertia.x * this.inertia.x + this.inertia.y * this.inertia.y < 1) {
              this.inertia = null;
            }
          }
        }

        // A non response
        return {
          doDraw: false,
        };
      },

      // Apply position
      [BaseAnimatedMethods.POSITION]: (): IAnimatedMethodResponse => {
        // If values are transitioned rather than immediately applied, this is
        // The value you would want the minimum change to be before cutting off
        // The transition
        // Const minAdjust = 1 / this.props.zoom

        // If there is change in X apply the new position to the old
        // This is where animated values were originally placed and can be placed
        // Again if a transition is desired
        const response = {
          doDraw: (this.currentX !== this.destinationX) || (this.currentY !== this.destinationY),
        };

        this.currentX = this.destinationX;
        this.currentY = this.destinationY;

        this.positionCamera(this.currentX, this.currentY);

        return response;
      },

      // Apply zooming
      [BaseAnimatedMethods.ZOOM]: (): IAnimatedMethodResponse => {
        const response: IAnimatedMethodResponse = {
          doDraw: false,
        };

        // Apply Zoom
        // Const zoomToFitH = this.ctx.width / Math.max(this.quadTree.bounds.width, this.props.viewport.width);
        // Const zoomToFitV = this.ctx.height / Math.max(this.quadTree.bounds.height, this.props.viewport.height);
        // Const zoomToFit = Math.min(zoomToFitH, zoomToFitV);
        const zoomToFit = 1;

        const destZoom = this.destinationZoom * zoomToFit;
        const dZoom = Math.abs(destZoom - this.targetZoom);
        const minDZoom = MIN_ZOOM_INCREMENT;
        const zoomRate = 3;

        if (dZoom > minDZoom) {
          this.targetZoom = this.targetZoom + ((destZoom - this.targetZoom) / zoomRate);
          response.doDraw = true;
        }

        else if (dZoom !== 0) {
          this.targetZoom = destZoom;
          response.doDraw = true;
        }

        // Get the zoom target metrics before zooming
        const zoomTargetX = this.zoomTargetX;
        const zoomTargetY = this.zoomTargetY;
        const screenZoomTarget = this.worldToScreen(zoomTargetX, zoomTargetY);

        // Update the camera zoom level
        this.zoomCamera(this.targetZoom);

        // After we have zoomed we see how much our target location moved on screen
        const newScreenZoomTarget = this.worldToScreen(zoomTargetX, zoomTargetY);
        // Now we move our screen by the moved delta to keep it exactly where it was before hand
        const zoomDX = -(newScreenZoomTarget.x - screenZoomTarget.x) / this.targetZoom;
        const zoomDY = (newScreenZoomTarget.y - screenZoomTarget.y) / this.targetZoom;

        this.currentX -= zoomDX;
        this.currentY -= zoomDY;
        this.destinationX -= zoomDX;
        this.destinationY -= zoomDY;

        this.positionCamera(this.currentX, this.currentY);

        return response;
      },
    };
  }

  /**
   * This is a hook for subclasses to be able to apply buffer changes that rely
   * on colors rendered into the atlas after the system has prepped the colors for render.
   */
  applyColorBufferChanges(props: T) {
    // Note: For subclasses
  }

  /**
   * This is a hook for subclasses to be able to apply label buffer changes after the system has
   * prepped the labels for render.
   */
  applyLabelBufferChanges(props: T) {
    // Note: For subclasses
  }

  /**
   * Applies new props injected into this component.
   *
   * Applying new props does not entail that a re-render will happen so we
   * handle application of props as a separate concept. Here we:
   *
   * set up zoom targetting and apply quested zoom levels
   *
   * Create our quad tree and associate properties to objects if a new dataset
   * is provided
   *
   * Analyze our dataset for interesting and useful metrics such as max and mins
   * to aid in visualization normalization
   *
   * @param {T} props The new properties for this component
   */
  applyProps = (props: T) => {
    debug('Applying props');
    let response: IApplyPropsMethodResponse;

    this.propsMethodList.some(method => {
      response = method(props);

      // Stop performing
      if (response.break) {
        return true;
      }

      return false;
    });

    debugCam('current cam', this.currentX, this.currentY, this.destinationX, this.destinationY);
    debugCam('Zoom Target: [%o, %o]', this.zoomTargetX, this.zoomTargetY);
    debugCam('Last Mouse: [%o, %o]', this.lastMousePosition.x, this.lastMousePosition.y);
  }

  /**
   * @override
   * This is a hook so subclasses can contribute property application methods to the applyProps process and organize the base methods
   * as desired.
   *
   * @param {ApplyPropsMethodLookup<T>} basePropsMethods The base props methods referenceable by name
   * @param {ApplyPropsMethod<T>[]} orderedBasePropsMethods The base animated methods in their default order for ease of use
   *
   * @return {ApplyPropsMethod<T>[]} The list of property application methods in the order they are expected to be executed
   */
  applyPropsMethods(basePropsMethods: ApplyPropsMethodLookup<T>, orderedBasePropsMethods: ApplyPropsMethod<T>[]): ApplyPropsMethod<T>[] {
    // Default functionality is to use the simple preordered list
    return orderedBasePropsMethods;
  }

  /**
   * This is a hook so subclasses can contribute methods to the applying props procedure and organize the base methods
   * as desired.
   *
   * @return {ApplyPropsMethodLookup<T>} The base apply props method that are indexed for ease of reference
   */
  private applyPropsMethodsBase(): ApplyPropsMethodLookup<T> {
    return {
      [BaseApplyPropsMethods.INITIALIZE]: (props: T): IApplyPropsMethodResponse => {
        const {
          backgroundColor,
          height,
          width,
        } = props;

        this.init(this.renderEl, width, height);

        if (!this.renderEl || width === 0 || height === 0) {
          return {
            break: true,
          };
        }

        // Get the target for zooming
        if (this.camera) {
          const world = this.screenToWorld(this.lastMousePosition.x, this.lastMousePosition.y);
          this.zoomTargetX = world.x;
          this.zoomTargetY = world.y;
        }

        if (this.renderer && backgroundColor) {
          const oldColor = this.props.backgroundColor || {
            b: BACKGROUND_COLOR.b,
            g: BACKGROUND_COLOR.g,
            opacity: 1.0,
            r: BACKGROUND_COLOR.r,
          };

          const same =
            oldColor.r === backgroundColor.r &&
            oldColor.g === backgroundColor.g &&
            oldColor.b === backgroundColor.b &&
            oldColor.opacity === backgroundColor.opacity
          ;

          if (!same) {
            this.renderer.setClearColor(
              new Color(
                backgroundColor.r,
                backgroundColor.g,
                backgroundColor.b,
              ),
              // Only if a transparent background is specified should we
              // Allow the parameter. We avoid the parameter to ensure
              // Transparent mode it not activated unless absolutely necessary
              backgroundColor.opacity < 1 ? backgroundColor.opacity : undefined,
            );
          }
        }

        debug('props', props);
        return {};
      },

      [BaseApplyPropsMethods.LABELS]: (props: T): IApplyPropsMethodResponse => {
        const response = {};

        // If we have a new labels reference we must regenerate the labels in our image lookup
        if (props.labels && props.labels !== this.labels) {
          debugLabels('Labels are being comitted to an Atlas %o', props.labels);
          // Flag the labels as incapable of rendering
          this.labelsReady = false;
          this.labelsLoadId++;
          // Store the set of labels we are rendering so that they do not get re-generated
          // In the atlas rapidly.
          this.labels = props.labels;

          if (this.atlasManager.getAtlasTexture(this.atlasNames.labels)) {
            this.atlasManager.destroyAtlas(this.atlasNames.labels);
          }

          const textures = props.labels.map(label => new AtlasTexture(null, label));

          debugLabels('Creating the atlas for labels based on these textures %o', textures);
          this.atlasManager.createAtlas(this.atlasNames.labels, textures)
          .then(() => {
            debugLabels('Labels rasterized within the atlas: %o', this.atlasManager.getAtlasTexture(this.atlasNames.labels));
            this.forceDraw = true;
            this.labelsCurrentLoadedId++;

            // If we are done loading AND we match up with the current load id, then labels
            // For the latest labels update are indeed ready for display
            if (this.labelsCurrentLoadedId === this.labelsLoadId) {
              this.labelsReady = true;
            }

            // Reapply the props so any buffers that were not updating can update now
            this.applyProps(this.props);
          });
        }

        return response;
      },

      [BaseApplyPropsMethods.COLORS]: (props: T): IApplyPropsMethodResponse => {
        const response = {};

        // If we have a new labels reference we must regenerate the labels in our image lookup
        if (props.colors && props.colors !== this.colors) {
          debugColors('Colors are being comitted to an Atlas %o', props.colors);
          // Flag the labels as incapable of rendering
          this.colorsReady = false;
          // Store the set of labels we are rendering so that they do not get re-generated
          // In the atlas rapidly.
          this.colors = props.colors;

          if (this.atlasManager.getAtlasTexture(this.atlasNames.colors)) {
            this.atlasManager.destroyAtlas(this.atlasNames.colors);
          }

          debugColors('Creating the atlas for colors based on these colors %o', this.colors);
          this.atlasManager.createAtlas(this.atlasNames.colors, null, this.colors)
          .then(() => {
            debugColors('Colors rasterized within the atlas: %o', this.atlasManager.getAtlasTexture(this.atlasNames.colors));
            this.forceDraw = true;
            this.colorsReady = true;
            // Reapply the props so any buffers that were not updating can update now
            this.applyProps(this.props);
          });
        }

        return response;
      },

      [BaseApplyPropsMethods.BUFFERCHANGES]: (props: T): IApplyPropsMethodResponse => {
        // Call the hook to allow sub componentry to have a place to update it's buffers
        this.applyBufferChanges(props);

        // We call the label buffering when the labels are ready to render.
        // Labels now utilize the color atlas as well, thus requiring colors
        // To be loaded
        if (this.labelsReady && this.colorsReady) {
          debugLabels('labels changed %o', props);
          this.applyLabelBufferChanges(props);
        }

        // For resources that only need the color atlas to be ready
        if (this.colorsReady) {
          this.applyColorBufferChanges(props);
        }

        return {};
      },

      [BaseApplyPropsMethods.CAMERA]: (props: T): IApplyPropsMethodResponse => {
        this.destinationZoom = props.zoom;

        // On initialization this should start with some base camera metrics
        if (props.viewport && props.viewport !== this.appliedViewport && this.quadTree) {
          debugCam('Applying viewport to camera: %o World Space Bounds: %o Screen context: %o', props.viewport, this.quadTree.bounds, {width: props.width, height: props.height});

          // Position the camera over the mid of the specified viewport
          const mid = props.viewport.mid;
          this.currentX = this.destinationX = mid.x;
          this.currentY = this.destinationY = mid.y;

          // Calculate the zoom level when the input zoom is at 1
          const zoomAtOne = 1;

          // Calculate the zoom needed for the viewport
          const zoomToFitViewH = props.width / props.viewport.width;
          const zoomToFitViewV = props.height / props.viewport.height;
          const zoomToFit = Math.min(zoomToFitViewH, zoomToFitViewV);

          // This adjusts the destination zxoom by a tiny amount so the view will redraw
          const microAdjustment = 1.001;

          // Make our destination zoom a zoom that will fit the dimensions of the viewport
          // Relative to the zoom at one level
          this.destinationZoom = zoomToFit / zoomAtOne;
          this.targetZoom = (this.destinationZoom * zoomAtOne) * microAdjustment;

          // Make sure any zooming that happens occurs over the middle of the initial viewport
          this.zoomTargetX = mid.x;
          this.zoomTargetY = mid.y;

          // Make sure mouse position doesn't mess with the zooming focus either
          this.lastMousePosition.x = props.width / 2.0;
          this.lastMousePosition.y = props.height / 2.0;

          // Apply the values immediately to the camera
          this.positionCamera(this.currentX, this.currentY);
          this.zoomCamera(this.targetZoom);
          this.updateCameraUniforms();

          // We request the calculated zoom level so adjustments on the input can be made
          if (props.onZoomRequest) {
            props.onZoomRequest(this.destinationZoom);
            debugCam('Requesting zoom level', this.destinationZoom);
          }

          // Let's disable mouse interactions for a little bit until the camera has settled into place
          const framesToDisable = 10;
          this.disableMouseInteraction = framesToDisable;
          this.appliedViewport = props.viewport;

          debugCam('init cam', this.currentX, this.currentY);
        }

        // Ensure we have our quad tree available even if it is empty
        if (!this.quadTree) {
          this.quadTree = new QuadTree<Bounds<any>>(0, 1, 1, 0);
        }

        return {};
      },
    };
  }

  /**
   * This is a hook for sub components to have a location to update their buffers
   *
   * @param {T} props This is the next set of props that are going to be applied to this component
   */
  applyBufferChanges(props: T) {
    // NOTE: This will be implemented by base classes
  }

  /**
   * @override
   * Start the update loop and register any interesting listeners
   */
  componentDidMount() {
    this.animate();
  }

  /**
   * @override
   * This will set up any unchanging context as well as establish the set of methods
   * that are to be used within constructed method loops.
   */
  componentWillMount() {
    /** Create our context bound projection methods for handing to processes that may need them */
    this.projection = {
      screenSizeToWorld: this.screenSizeToWorld.bind(this),
      screenToWorld: this.screenToWorld.bind(this),
      worldSizeToScreen: this.worldSizeToScreen.bind(this),
      worldToScreen: this.worldToScreen.bind(this),
    };

    /** Generate our applying props methods to execute within our applyProps process */
    const basePropsMethods = this.applyPropsMethodsBase();
    this.propsMethodList = this.applyPropsMethods(basePropsMethods, [
      basePropsMethods[BaseApplyPropsMethods.INITIALIZE],
      basePropsMethods[BaseApplyPropsMethods.LABELS],
      basePropsMethods[BaseApplyPropsMethods.COLORS],
      basePropsMethods[BaseApplyPropsMethods.BUFFERCHANGES],
      basePropsMethods[BaseApplyPropsMethods.CAMERA],
    ]);

    /** Generate our animated methods to execute within our animation loop */
    const baseAnimatedMethods = this.animatedMethodsBase();
    this.animatedMethodList = this.animatedMethods(baseAnimatedMethods, [
      baseAnimatedMethods[BaseAnimatedMethods.CONTEXT],
      baseAnimatedMethods[BaseAnimatedMethods.INERTIA],
      baseAnimatedMethods[BaseAnimatedMethods.POSITION],
      baseAnimatedMethods[BaseAnimatedMethods.ZOOM],
    ]);
  }

  /**
   * @override
   * Simply applies the new injected props
   *
   * @param {T} props The new properties to be applied to this component
   */
  componentWillReceiveProps(props: T) {
    this.applyProps(props);
  }

  /**
   * @override
   * Release listeners and stop update loop
   */
  componentWillUnmount() {
    this.stop = true;

    if (this.quadTree) {
      this.quadTree.destroy();
    }

    this.quadTree = null;
    this.camera = null;
    this.sizeCamera = null;
    this.ctx = null;
    this.renderEl = null;
    this.renderer = null;
    this.scene = null;

    this.atlasManager.destroyAtlas(this.atlasNames.colors);
    this.atlasManager.destroyAtlas(this.atlasNames.labels);

    FrameInfo.framesPlayed.delete(this);
  }

  /**
   * This is the draw method executed from the animation loop. Everytime, this is
   * called, the webgl surface will be redrawn.
   */
  draw = () => {
    // Draw the 3D scene
    this.renderer.render(this.scene, this.camera);

    if (this.onRender && this.colorsReady && (this.labelsReady || this.labels.length === 0)) {
      const imageData = this.renderer.domElement.toDataURL();
      this.onRender(imageData);
    }
  }

  /**
   * This initializes the surface and calls for sub class classes to initialize
   * their buffers
   *
   * @param {HTMLElement} el The DOM element this component is contained in
   * @param {number} w The width of the rendering
   * @param {number} h The height of the rendering
   */
  init = (el: HTMLElement, w: number, h: number) => {
    if (!el || this.scene) {
      return;
    }

    this.renderEl = el;

    if (w === 0 || h === 0) {
      return;
    }

    debug('Initializing GPU objects el: %o width: %o height: %o', el, w, h);

    // Set up a ctx for our render space
    this.ctx = {
      height: h,
      heightHalf: h / 2.0,
      width: w,
      widthHalf: w / 2.0,
    };

    // Set up the camera now that the ctx is set up
    this.initCamera();
    // Create a scene so we can add our buffer objects to it
    // We also add the scene to the window to make threejs tools available
    (window as any).scene = this.scene = new Scene();
    // Fire our hook for starting up our specific buffer implementation
    this.initBuffers();

    // FINALIZE SET UP

    // Generate the renderer along with it's properties
    this.renderer = new WebGLRenderer({
      alpha: this.props.backgroundColor && (this.props.backgroundColor.opacity < 1.0),
      antialias: true,
      preserveDrawingBuffer: true,
    });

    // This sets the pixel ratio to handle differing pixel densities in screens
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(w, h);

    // Applies the background color and establishes whether or not the context supports
    // Alpha or not
    if (this.props.backgroundColor) {
      this.renderer.setClearColor(
        new Color(
          this.props.backgroundColor.r,
          this.props.backgroundColor.g,
          this.props.backgroundColor.b,
        ),
        this.props.backgroundColor.opacity,
      );
    }

    else {
      this.renderer.setClearColor(BACKGROUND_COLOR);
    }

    // We render shapes. We care not for culling.
    this.renderer.setFaceCulling(CullFaceNone);

    // Set up DOM interaction with the renderer
    const container = el;
    container.appendChild(this.renderer.domElement);
    // Get the gl context for queries and advanced operations
    this.gl = this.renderer.domElement.getContext('webgl');

    this.makeDraggable(document.getElementById('div'), this);
  }

  /**
   * This is a hook allowing sub classes to have a place to initialize their buffers
   * and materials etc.
   */
  initBuffers() {
    // NOTE: This is to be implemented by subclasses
  }

  /**
   * Initializes the camera and any contexts associated with it
   */
  initCamera = () => {
    debug('Initializing Camera');
    // INITIALIZE THE CAMERA
    const h = this.ctx.height;
    const viewSize = h;
    const w = this.ctx.width;
    const aspectRatio = w / h;

    const viewport = {
      aspectRatio: aspectRatio,
      bottom: -viewSize / 2,
      far: 10000000,
      left: (-aspectRatio * viewSize) / 2,
      near: -100,
      right: (aspectRatio * viewSize) / 2,
      top: viewSize / 2,
      viewSize: viewSize,
    };

    this.camera = new OrthographicCamera(
      viewport.left,
      viewport.right,
      viewport.top,
      viewport.bottom,
      viewport.near,
      viewport.far,
    );

    this.sizeCamera = new OrthographicCamera(
      viewport.left,
      viewport.right,
      viewport.top,
      viewport.bottom,
      viewport.near,
      viewport.far,
    );

    this.camera.position.z = 300;
    this.sizeCamera.position.set(0, 0, 300);
  }

  /**
   * This is executed when our rendering surface (the canvas) changes in size in any
   * way. It will make sure our renderer matches the context to prevent scaling
   * and other deformations.
   */
  resizeContext = () => {
    const w: number = this.props.width;
    const h: number = this.props.height;

    // See if a renderer even exists yet
    if (!this.renderer) {
      return false;
    }

    const renderSize = this.renderer.getSize();

    // Check if the resize is needed
    if (renderSize.width === w && renderSize.height === h) {
      return false;
    }

    debug('RENDERER RESIZE');

    this.ctx = {
      height: h,
      heightHalf: h / 2,
      width: w,
      widthHalf: w / 2,
    };

    const zoom = this.camera.zoom;
    const position = this.camera.position.clone();
    this.initCamera();
    this.camera.zoom = zoom;
    this.camera.position.set(position.x, position.y, position.z);
    this.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.setFaceCulling(CullFaceNone);

    if (this.props.backgroundColor) {
      const { backgroundColor: color } = this.props;
      this.renderer.setClearColor(
        new Color(
          color.r,
          color.g,
          color.b,
        ),
        color.opacity < 1.0 ? color.opacity : undefined,
      );
    }

    else {
      this.renderer.setClearColor(BACKGROUND_COLOR);
    }

    return true;
  }

  /**
   * This method handles emitting the viewport and the current visible elements
   * to the subclass that needs detailed information regarding the viewport.
   */
  emitViewport = () => {
    const tl = this.screenToWorld(0, 0);
    const br = this.screenToWorld(this.ctx.width, this.ctx.height);
    this.camera.updateMatrixWorld(true);

    const visible = this.quadTree.query(
      new Bounds(
        tl.x,
        br.x,
        tl.y,
        br.y,
      ),
    );

    this.onViewport(visible, this.projection, this.ctx);
  }

  onRender(image: string) {
    // NOTE: For subclasses
  }

  /**
   * Hook for subclasses to when the mouse moves. Provides some information
   * about mouse location and interaction.
   *
   * @param {IPoint} mouse Position of the mouse relative to the canvas
   * @param {IPoint} world Position of the mouse relative to the world space
   * @param {boolean} isPanning The panning state of the mouse
   */
  onMouse(mouse: IPoint, world: IPoint, isPanning: boolean) {
    // NOTE: For subclasses
  }

  /**
   * Hook for subclasses to respond to mouse down events
   */
  onMouseDown() {
    // NOTE: For subclasses
  }

  /**
   * Hook for subclasses to respond to mouse out events
   */
  onMouseOut() {
    // NOTE: For subclasses
  }

  /**
   * Hook for subclasses to respond to mouse up events and the items that were interacted with in the process
   *
   * @param {React.MouseEvent} e The react synthetic event associated with the action
   * @param {Bounds[]} hitInside The items the mouse interacted with
   * @param {IPoint} mouse The location of the mouse on the screen
   * @param {IPoint} world The location of the mouse projected into the world
   * @param {IProjection} projection The projection methods to go between the screen and world space
   */
  onMouseUp(e: React.MouseEvent<HTMLDivElement>, hitInside: Bounds<any>[], mouse: IPoint, world: IPoint, projection: IProjection) {
    // NOTE: For subclasses
  }

  /**
   * Hook for subclasses to respond to the mouse hovering over an item included in the quadtree
   *
   * @param {Bounds[]} hitInside The items hovered over by the mouse
   * @param {IPoint} mouse The location of the mouse on the screen relative to the canvas
   * @param {IPoint} world The location of the mouse projected to the world coordinates
   * @param {IProjection} projection The projection methods to go between the screen and world space
   */
  onMouseHover(hitInside: Bounds<any>[], mouse: IPoint, world: IPoint, projection: IProjection) {
    // NOTE: For subclasses
  }

  /**
   * Hook for subclasses to respond to the mouse leaving an item included in the quadtree
   *
   * @param {Bounds[]} left The items no longer hovered over by the mouse
   * @param {IPoint} mouse The location of the mouse on the screen relative to the canvas
   * @param {IPoint} world The location of the mouse projected to the world coordinates
   * @param {IProjection} projection The projection methods to go between the screen and world space
   */
  onMouseLeave(left: Bounds<any>[], mouse: IPoint, world: IPoint, projection: IProjection) {
    // NOTE: For subclasses
  }

  /**
   * Hook for subclasses to respond to changes in the viewport and currently visible items
   *
   * @param {Bounds[]} visible
   * @param {IProjection} projection The projection methods to go between the screen and world space
   * @param {IScreenContext} ctx
   */
  onViewport(visible: Bounds<any>[], projection: IProjection, ctx: IScreenContext) {
    // NOTE: For subclasses
  }

  makeDraggable(element: HTMLElement, stage: WebGLSurface<any, any>) {
    element.onmousedown = function(event) {
      debug('DRAG~');
      stage.dragOver = false;
      document.onmousemove = function(event) {
        debug('Move');
          const mouseX = event.clientX;
          const mouseY = event.clientY + window.scrollY;

          const distanceX = (mouseX - stage.lastMousePosition.x) / stage.targetZoom;
          const distanceY = (mouseY - stage.lastMousePosition.y) / stage.targetZoom;
          stage.destinationX -= distanceX;
          stage.destinationY += distanceY;
          stage.lastMousePosition.x = mouseX;
          stage.lastMousePosition.y = mouseY;
      };

      document.onmouseup = function() {
        debug('Up');
        document.onmousemove = null;
        stage.isPanning = false;
        stage.dragOver = true;
      };

      document.onmouseover = function() {
        debug('Over');
        if (stage.dragOver === false) stage.isPanning = true;
      };

      element.onmouseup = function() {
        stage.dragOver = true;
      };

      // Text will not be selected when it is being dragged
      element.onselectstart = function(){return false; };

    };

  }

  /**
   * Handles mouse interactions when the mouse is pressed on the canvas. This
   * engages panning.
   *
   * @param {React.MouseEvent<HTMLDivElement>} e The mouse event from React
   */
  handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Quick quit if mouse interactions are disabled

    if (this.disableMouseInteraction > 0) {
      return;
    }
    this.isPanning = true;
    this.distance = 0;

    this.onMouseDown();
  }

  /**
   * Handles mouse interactions when the mouse is release or left the canvas. This
   * stops panning.
   *
   * @param {React.MouseEvent<HTMLDivElement>} e The mouse event from React
   */
  handleMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
    // Quick quit if mouse interactions are disabled
    if (this.disableMouseInteraction > 0) {
      return;
    }

    this.isPanning = false;
    this.distance = 0;

    this.onMouseOut();
  }

  /**
   * Handles mouse interactions when the mouse is released on the canvas. This
   * stops panning and engages click events.
   *
   * @param {React.MouseEvent<HTMLDivElement>} e The mouse event from React
   */
  handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    // Quick quit if mouse interactions are disabled
    if (this.disableMouseInteraction > 0) {
      return;
    }

    this.isPanning = false;

    const mouse = eventElementPosition(e);
    const world = this.screenToWorld(mouse.x, mouse.y);

    // Handle mouse interaction
    if (this.distance < 5) {
      const hitInside: Bounds<any>[] = [];

      // Circle Interaction
      const hitItems = this.quadTree.query(world);

      for (const item of hitItems) {
        // Fine tuning for interaction
        if (item.pointInside(world)) {
          hitInside.push(item);
        }
      }

      // Tell the listener that the user clicked on some items
      if (hitInside.length) {
        this.onMouseUp(e, hitInside, mouse, world, this.projection);
      }

      // Tell the listener that the user clicked on nothing
      else {
        this.onMouseUp(e, null, mouse, world, this.projection);
      }
    }
  }

  /**
   * Handles mouse interactions when the mouse is moving on the canvas. This
   * causes panning and hover events.
   *
   * @param {React.MouseEvent<HTMLDivElement>} e The mouse event from React
   */
  handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Quick quit if mouse interactions are disabled
    if (this.disableMouseInteraction > 0) {
      return;
    }

    const {
      onMouse,
    } = this.props;

    const zoom: number = this.props.zoom;

    const mouse = eventElementPosition(e);
    const world = this.screenToWorld(mouse.x, mouse.y);
    this.distance++;

    debug('mouse X %o Y %o', mouse.x, mouse.y);

    // Handle panning
    if (this.isPanning) {
      debug('down and moving ~~');
      let xDistance = (mouse.x - this.lastMousePosition.x) / this.targetZoom;
      let yDistance = -(mouse.y - this.lastMousePosition.y) / this.targetZoom;

      // Execute the hook to allow subclasses
      const pan: Vector3 = this.willPan(xDistance, yDistance);
      xDistance = pan.x;
      yDistance = pan.y;

      this.destinationX -= xDistance;
      this.destinationY -= yDistance;

      this.inertia = this.inertia || { x: 0, y: 0 };

      if (sign(xDistance) !== sign(this.inertia.x)) {
        this.inertia.x = 0;
      }

      if (sign(yDistance) !== sign(this.inertia.y)) {
        this.inertia.y = 0;
      }

      this.inertia.x = xDistance * this.inertiaBuild;
      this.inertia.y = yDistance * this.inertiaBuild;

      const maxInertia = this.inertiaMax / zoom;
      const mag = Math.sqrt(this.inertia.x * this.inertia.x + this.inertia.y * this.inertia.y);

      // Make sure the magnitude of the inertia is less than our max allowed
      if (mag > maxInertia) {
        // Since it's greater, let's confine the inertia's magnitude to the max magnitude
        // By normalizing the intertia vector and multilying it by the max
        this.inertia.x = (this.inertia.x / mag) * maxInertia;
        this.inertia.y = (this.inertia.y / mag) * maxInertia;
      }
    }

    if (this.quadTree && !this.isPanning) {
      // Empty the last hovered items to populate a new list
      const currentHoverItems: Bounds<any>[] = [];

      // Handle mouse interaction with items
      // Interaction with circles
      const hitItems = this.quadTree.query(world);
      const hitInside: Bounds<any>[] = [];

      for (const item of hitItems) {
        // Fine tuning for interaction
        if (item.pointInside(world)) {
          hitInside.push(item);
          currentHoverItems.push(item);
        }
      }

      // Inform of all items hit or hovered
      this.onMouseHover(hitInside, mouse, world, this.projection);

      // Diff the currently hovered items with the old ones to see what is
      // No longer hit
      const left: Bounds<any>[] = [];

      for (const item of this.currentHoverItems) {
        if (currentHoverItems.indexOf(item) < 0) {
          left.push(item);
        }
      }

      // Inform of all items no longer hovered
      this.onMouseLeave(left, mouse, world, this.projection);

      this.currentHoverItems = currentHoverItems;
    }

    if (onMouse) {
      this.onMouse(mouse, world, this.isPanning);
    }

    this.lastMousePosition = mouse;
  }

  /**
   * Places the camera at a given location in world space
   *
   * @param {number} x The x-coordinate for the camera in world space
   * @param {number} y The x-coordinate for the camera in world space
   */
  positionCamera(x: number, y: number) {
    if (this.camera) {
      this.camera.position.set(x, y, this.camera.position.z);
    }
  }

  /**
   * Projects a screen coordinate to a world coordinate
   *
   * @param {number} x The x coord within the screen to project into the world
   * @param {number} y The y coord within the screen to project into the world
   * @param {object} obj An optional object in which the projected dimensions will
   *                     be injected to
   *
   * @return {object} Either a new object with the projected dimensions or the object
   *                  Insertted as a param that has the properties injected into
   */
  screenToWorld(x: number, y: number, obj?: IPoint): IPoint {
    // Get the coordinates in normalized screen space
    vector.set(
      (x / this.ctx.width) * 2 - 1,
      - (y / this.ctx.height) * 2 + 1,
      0.0,
    );

    // Unproject the normalized space to the world. It will project
    // The vector to a REALLY far away z coordinate, but it does not matter
    // Since we are utilizing an orthographic camera (no perspective distortion)
    vector.unproject(this.camera);

    obj = obj || { x: 0, y: 0 };
    obj.x = vector.x;
    obj.y = vector.y;

    return obj;
  }

  /**
   * Projects a size on the screen to the size represented in the world
   *
   * @param {number} w The size of the width on the screen to project to the world
   * @param {number} h The size of the height on the screen to project to the world
   * @param {object} obj An optional object in which the projected dimensions will
   *                     be injected to
   *
   * @return {object} Either a new object with the projected dimensions or the object
   *                  Insertted as a param that has the properties injected into
   */
  screenSizeToWorld(w: number, h: number, obj?: ISize): ISize {
    obj = obj || new Bounds(0, 0, 0, 0);
    obj.width = w / (this.sizeCamera ? this.sizeCamera.zoom : 1);
    obj.height = h / (this.sizeCamera ? this.sizeCamera.zoom : 1);

    return obj;
  }

  /**
   * Projects a world coordinate to the screen
   *
   * @param {number} x The x coord in the world to project to the screen
   * @param {number} y The y coord in the world to project to the screen
   * @param {object} obj An optional object in which the projected dimensions will
   *                     be injected to
   *
   * @return {IPoint} Either a new object with the projected dimensions or the object
   *                  Insertted as a param that has the properties injected into
   */
  worldToScreen(x: number, y: number, obj?: IPoint): IPoint {
    // This projects to NORMALIZED screen space (-1, 1) range for x and y
    vector.set(x, y, 0);
    vector.project(this.camera);

    // Use the window dimensions to denormalize the vector
    obj = merge(obj || {}, {
      x: (vector.x * this.ctx.widthHalf) + this.ctx.widthHalf,
      y: - (vector.y * this.ctx.heightHalf) + this.ctx.heightHalf,
    });

    return obj;
  }

  /**
   * Projects a size within the world to how it would appear on the screen
   *
   * @param {number} w The size of the width on the screen to project to the world
   * @param {number} h The size of the height on the screen to project to the world
   * @param {object} obj An optional object in which the projected dimensions will
   *                     be injected to
   *
   * @return {object} Either a new object with the projected dimensions or the object
   *                  Insertted as a param that has the properties injected into
   */
  worldSizeToScreen(w: number, h: number, obj?: ISize): ISize {
    obj = obj || new Bounds(0, 0, 0, 0);
    obj.width = w * this.sizeCamera.zoom;
    obj.height = h * this.sizeCamera.zoom;

    return obj;
  }

  /**
   * Sets the zoom level the camera will view the world with
   *
   * @param {number} zoom The zoom level. Must be > 0
   */
  zoomCamera(zoom: number) {
    this.camera.zoom = zoom;
    this.sizeCamera.zoom = zoom;
    this.camera.updateProjectionMatrix();
    this.sizeCamera.updateProjectionMatrix();
  }

  /**
   * This is a hook allowing a sub class to update uniforms when the camera is changed in
   * any way
   */
  updateCameraUniforms() {
    // NOTE: For subclasses
  }

  /**
   * We make the ref application be a declared function so react does not find the need to execute the
   * application numerous times for a detected changed method
   *
   * @param {HTMLElement} n This is the canvas element from the dom
   */
  applyRef = (n: HTMLElement) => {
    this.init(n, this.props.width, this.props.height);
    this.applyProps(this.props);
  }

  /**
   * @override
   * Only re-render if the dimensions of the component have changed. All other
   * internal render updates are handled internally
   *
   * @param {T} nextProps The next properties injected
   */
  shouldComponentUpdate(nextProps: T) {
    return this.props.width !== nextProps.width || this.props.height !== nextProps.height;
  }

  /**
   * Hook to allow subclasses some control over panning distances
   *
   * @param {number} distanceX The distance to pan in the x direction
   * @param {number} distanceY The distance to pan in the y direction
   *
   * @return {Vector3} The vector indicating the direction to pan
   */
  willPan(distanceX: number, distanceY: number): Vector3 {
    return new Vector3(distanceX, distanceY, 0.0);
  }

  // -----[ Render ]---------------------------------------------
  //
  // In a React app, it's nice to put the render function at the bottom of the
  // File

  /**
   * This should only attempt rendering when the canvas DOM element needs to be resized.
   * You will note shouldComponentUpdate helps facilitate this.
   */
  render() {
    const { width, height } = this.props;

    if (!WebGLStat.WEBGL_SUPPORTED) {
      return <div>{this.props.children || 'Web GL not supported'}</div>;
    }

    return (
      <div
        id="div"
        onMouseDown={this.handleMouseDown}
        onMouseOut={this.handleMouseOut}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseOut}
        onMouseMove={this.handleMouseMove}
        onDoubleClick={e => {
          if (this.props.onDoubleClick) {
            this.props.onDoubleClick(e);
          }
        }}
        style={{ position: 'relative', width: width, height: height}}>
        <div ref={this.applyRef} />
      </div>
    );
  }
}
