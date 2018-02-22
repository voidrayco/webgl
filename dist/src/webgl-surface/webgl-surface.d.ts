/// <reference types="react" />
import * as React from 'react';
import { OrthographicCamera, Scene, ShaderMaterial, Vector3, WebGLRenderer } from 'three';
import { Label } from './drawing/shape/label';
import { AtlasColor } from './drawing/texture/atlas-color';
import { AtlasManager } from './drawing/texture/atlas-manager';
import { AtlasTexture } from './drawing/texture/atlas-texture';
import { Bounds } from './primitives/bounds';
import { IPoint } from './primitives/point';
import { ISize } from './primitives/size';
import { ISharedRenderContext } from './types';
import { IProjection } from './util/projection';
import { QuadTree } from './util/quad-tree';
import { IScreenContext } from './util/screen-context';
/**
 * This enum names the base methods that are passed into the applyPropsMethods
 * method. This allows subclasses to easily pick the property setting methods they need
 * from the base
 */
export declare enum BaseApplyPropsMethods {
    /** Initializes any context that needs to be set up before the props are set */
    INITIALIZE = 0,
    /** Moment when any buffer changes should be applied */
    BUFFERCHANGES = 1,
    /** Initializes camera properties to facilitate smoothe start up */
    CAMERA = 2,
    /** Generates the labels as images within the atlas manager */
    LABELS = 3,
    /** Generates the colors within the atlas manager */
    COLORS = 4,
    /** Generates images within the atlas manager */
    IMAGES = 5,
}
/**
 * This enum names the base methods that are passed into the animatedMethods
 * method. This allows subsclasses to easily pick the animated methods they need
 * from the base
 */
export declare enum BaseAnimatedMethods {
    /** Sets up the base context needed to execute most methods */
    CONTEXT = 0,
    /** Sets up the inertia method for inertial panning */
    INERTIA = 1,
    /** Animates the postion of the camera to a destination */
    POSITION = 2,
    /** Zooms the camera based on a point of focus */
    ZOOM = 3,
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
    break?: boolean;
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
    break?: boolean;
    /**
     * If this is set to true and returned, it will guarantee a redraw will happen after the animated methods
     * have finished executing
     */
    doDraw?: boolean;
    /**
     * If set to true, the system will cease to animate until some task starts up the loop again by calling
     * animate()
     */
    stop?: boolean;
}
export declare type AnimatedMethodOptions = {
    labelsReady?: boolean;
    colorsReady?: boolean;
};
export declare type AnimatedMethodWithOptions = {
    options: AnimatedMethodOptions;
    method(): IAnimatedMethodResponse;
};
export declare type AnimatedMethod = () => IAnimatedMethodResponse;
export declare type AnimatedMethodLookup = {
    [key: number]: AnimatedMethod;
};
export declare type ApplyPropsMethod<T> = (props: T) => IApplyPropsMethodResponse;
export declare type ApplyPropsMethodLookup<T> = {
    [key: number]: ApplyPropsMethod<T>;
};
export interface IWebGLSurfaceProperties {
    /**
     * Sets the renderer's background color. If the opacity is less than one at initialization,
     * it enables 'transparent' canvas rendering which is much less efficient. All color values
     * are 0 - 1
     */
    backgroundColor: {
        /** Red channel 0-1 */
        r: number;
        /** Green channel 0-1 */
        g: number;
        /** Blue channel 0-1 */
        b: number;
        /** Alpha channel 0-1 */
        opacity: number;
    };
    /** When true, will cause a camera recentering to take place when new base items are injected */
    centerOnNewItems?: boolean;
    /** All of the unique colors used in the system */
    colors?: AtlasColor[];
    /** The forced size of the render surface */
    height?: number;
    /** The unique images to be loaded into an atlas for rendering */
    images?: AtlasTexture[];
    /** All of the labels to be rendered by the system */
    labels?: Label<any>[];
    /** Provides feedback when the surface is double clicked */
    onDoubleClick?(e: React.MouseEvent<Element>): void;
    /** Provides feedback when the mouse has moved */
    onMouse?(screen: IPoint, world: IPoint, isPanning: boolean): void;
    /** When provided provides image data every frame for the screen */
    onRender?(image: string): void;
    /**
     * This is a handler that handles zoom changes the gpu-chart may request.
     * This includes moments such as initializing the camera to focus on a
     * provided viewport.
     */
    onZoomRequest(zoom: number): void;
    /**
     * When specified, this context will pan by the indicated amount once. A new object must be
     * injected in order for the pan to happen again.
     */
    pan?: Vector3;
    /**
     * If this is provided, then this will render within the rendering context provided,
     * however, this will retain it's own camera and own scene.
     */
    renderContext?: ISharedRenderContext;
    /** This will be the view the camera focuses on when the camera is initialized */
    viewport?: Bounds<any>;
    /** The forced size of the render surface */
    width?: number;
    /** The zoom level that the camera should apply */
    zoom: number;
}
/**
 * The base component for the communications view
 */
export declare class WebGLSurface<T extends IWebGLSurfaceProperties, U> extends React.Component<T, U> {
    /** This is the atlas manager for managing images and labels rendered as textures */
    atlasManager: AtlasManager;
    /** Tracks the names of the atlas' generated */
    atlasNames: {
        colors: string;
        images: string;
        labels: string;
    };
    /**
     * List of methods that execute within the animation loop. Makes adding and removing these methods
     * simpler to manage, as well as gives a clear and optimized way of overriding existing methods
     * or reordering their execution
     */
    animatedMethodList: (AnimatedMethod | AnimatedMethodWithOptions)[];
    /**
     * If this is set to true during an animated method's lifecycle, then all subsequent animated methods
     * will not be executed for the current frame. Upon reaching the end of the frame, the break will reset
     * and the animated methods will attempt executing again
     */
    animatedMethodBreak: boolean;
    /**
     * This is the last external panning operation applied to the camera. When a new pan
     * is applied that is not this pan object
     */
    appliedPan: IPoint;
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
    camera: OrthographicCamera;
    /** A camera that is used for projecting sizes to and from the screen to the world */
    circleMaterial: ShaderMaterial;
    /**
     * This is the latest colors loading identifier, used to determine if the colors
     * last loaded matches the colors currently needing to be rendered. Fixes asynchronous
     * Issue where a new set of colors is requested before the previous set(s) have completed
     */
    colorsCurrentLoadedId: number;
    /** This is the is of the current and most recent color group being loaded in */
    colorsLoadId: number;
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
    disableMouseInteraction: number;
    /** Used to aid in mouse interactions */
    distance: number;
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
    sizeCamera: OrthographicCamera | null;
    /** Keep track of the current zoom so it can be set in requestAnimationFrame */
    currentZoom: number;
    /** Horizontal destination the camera will pan to */
    destinationX: number;
    /** Vertical position the camera will pan to */
    destinationY: number;
    /** The destination zoom level the camera used during panning */
    destinationZoom: number;
    /** Is the camera currently in a panning state */
    isPanning: boolean;
    /** Last known screen position of the mouse */
    lastMousePosition: {
        x: number;
        y: number;
    };
    /** List of methods to execute when applying props */
    propsMethodList: ApplyPropsMethod<T>[];
    /** Inertial values for drag panning */
    inertia: IPoint | null;
    inertiaBuild: number;
    inertiaDecay: number;
    inertiaMax: number;
    /**
     * All data is put into this quad tree so we can query spatial regions for
     * items
     */
    quadTree: QuadTree<Bounds<any>> | null;
    /**
     * True if the shift key is currently being held
     *
     * Panning is affected by whether or not the shift key is being held down, but
     * I don't know how yet.
     */
    shiftIsDown: boolean;
    stop: boolean;
    /** The current rendered position and zoom */
    currentX: number;
    currentY: number;
    targetZoom: number;
    /** The (world) position the focus will zoom in and out of */
    previousZoomToFit: number;
    zoomTargetX: number;
    zoomTargetY: number;
    /** When this is set, the draw loop continues to run. Used by the draw loop to complete animations */
    animating: boolean;
    labels: Label<any>[];
    labelsReady: boolean;
    /**
     * This is the latest labels loading identifier, used to determine if the labels
     * last loaded matches the labels currently needing to be rendered.
     */
    labelsCurrentLoadedId: number;
    labelsLoadId: number;
    /** When this is set to true, the atlas with the colors is now ready to be referenced */
    colors: AtlasColor[];
    colorsReady: boolean;
    /** This is a flag that allows some extra control over when an onRender can fire */
    isRenderReady: boolean;
    /** Holds the items currently hovered over */
    currentHoverItems: Bounds<any>[];
    /** Mouse in stage or not */
    dragOver: boolean;
    /**
     * If this is true, we are waiting for the rendering context to become available
     * within this.props.renderContext
     */
    waitForContext: boolean;
    images: AtlasTexture[];
    imagesReady: boolean;
    /**
     * This is the latest images loading identifier, used to determine if the images
     * last loaded matches the images currently needing to be rendered.
     */
    imagesCurrentLoadedId: number;
    imagesLoadId: number;
    /**
     * This is the update loop that operates at the requestAnimationFrame speed.
     * This updates the cameras current position and causes changes over time for
     * any property that has a start and a destination.
     */
    animate: () => void;
    /**
     * This is a hook so subclasses can contribute animated methods to the animation loop and organize the base methods
     * as desired.
     *
     * @param {AnimatedMethodLookup} baseAnimatedMethods The base animated methods referenceable by name
     * @param {AnimatedMethod[]} orderedBaseAnimatedMethods The base animated methods in their default order for ease of use
     *
     * @return {AnimatedMethods[]} The list of animated methods in the order they are expected to be executed
     */
    animatedMethods(baseAnimatedMethods: AnimatedMethodLookup, orderedBaseAnimatedMethods: (AnimatedMethod | AnimatedMethodWithOptions)[]): (AnimatedMethod | AnimatedMethodWithOptions)[];
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
    private animatedMethodsBase();
    /**
     * This is a hook for subclasses to be able to apply buffer changes that rely
     * on colors rendered into the atlas after the system has prepped the colors for render.
     */
    applyColorBufferChanges(props: T): void;
    /**
     * This is a hook for subclasses to be able to apply buffer changes that rely
     * on images rendered into the atlas after the system has prepped the images for render.
     */
    applyImageBufferChanges(props: T): void;
    /**
     * This is a hook for subclasses to be able to apply label buffer changes after the system has
     * prepped the labels for render.
     */
    applyLabelBufferChanges(props: T): void;
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
    applyProps: (props: T) => void;
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
    applyPropsMethods(basePropsMethods: ApplyPropsMethodLookup<T>, orderedBasePropsMethods: ApplyPropsMethod<T>[]): ApplyPropsMethod<T>[];
    /**
     * This is a hook so subclasses can contribute methods to the applying props procedure and organize the base methods
     * as desired.
     *
     * @return {ApplyPropsMethodLookup<T>} The base apply props method that are indexed for ease of reference
     */
    private applyPropsMethodsBase();
    /**
     * This is a hook for sub components to have a location to update their buffers
     *
     * @param {T} props This is the next set of props that are going to be applied to this component
     */
    applyBufferChanges(props: T): void;
    /**
     * @override
     * Start the update loop and register any interesting listeners
     */
    componentDidMount(): void;
    /**
     * @override
     * This will set up any unchanging context as well as establish the set of methods
     * that are to be used within constructed method loops.
     */
    componentWillMount(): void;
    /**
     * @override
     * Simply applies the new injected props
     *
     * @param {T} props The new properties to be applied to this component
     */
    componentWillReceiveProps(props: T): void;
    /**
     * @override
     * Release listeners and stop update loop
     */
    componentWillUnmount(): void;
    /**
     * This is the draw method executed from the animation loop. Everytime, this is
     * called, the webgl surface will be redrawn.
     */
    draw(): void;
    /**
     * This initializes the surface and calls for sub class classes to initialize
     * their buffers
     *
     * @param {HTMLElement} el The DOM element this component is contained in
     * @param {number} w The width of the rendering
     * @param {number} h The height of the rendering
     */
    init: (el: HTMLElement, w: number, h: number) => void;
    /**
     * This is a hook allowing sub classes to have a place to initialize their buffers
     * and materials etc.
     */
    initBuffers(): void;
    /**
     * Initializes the camera and any contexts associated with it
     */
    initCamera: () => void;
    /**
     * This is executed when our rendering surface (the canvas) changes in size in any
     * way. It will make sure our renderer matches the context to prevent scaling
     * and other deformations.
     */
    resizeContext: () => boolean;
    /**
     * This method handles emitting the viewport and the current visible elements
     * to the subclass that needs detailed information regarding the viewport.
     */
    emitViewport: () => void;
    /**
     * Hook for subclasses to when the mouse moves. Provides some information
     * about mouse location and interaction.
     *
     * @param {IPoint} mouse Position of the mouse relative to the canvas
     * @param {IPoint} world Position of the mouse relative to the world space
     * @param {boolean} isPanning The panning state of the mouse
     */
    onMouse(mouse: IPoint, world: IPoint, isPanning: boolean): void;
    /**
     * Hook for subclasses to respond to mouse down events
     */
    onMouseDown(): void;
    /**
     * Hook for subclasses to respond to mouse out events
     */
    onMouseOut(): void;
    /**
     * Hook for subclasses to respond to mouse up events and the items that were interacted with in the process
     *
     * @param {React.MouseEvent} e The react synthetic event associated with the action
     * @param {Bounds[]} hitInside The items the mouse interacted with
     * @param {IPoint} mouse The location of the mouse on the screen
     * @param {IPoint} world The location of the mouse projected into the world
     * @param {IProjection} projection The projection methods to go between the screen and world space
     */
    onMouseUp(e: React.MouseEvent<HTMLDivElement>, hitInside: Bounds<any>[], mouse: IPoint, world: IPoint, projection: IProjection): void;
    /**
     * Hook for subclasses to respond to the mouse hovering over an item included in the quadtree
     *
     * @param {Bounds[]} hitInside The items hovered over by the mouse
     * @param {IPoint} mouse The location of the mouse on the screen relative to the canvas
     * @param {IPoint} world The location of the mouse projected to the world coordinates
     * @param {IProjection} projection The projection methods to go between the screen and world space
     */
    onMouseHover(hitInside: Bounds<any>[], mouse: IPoint, world: IPoint, projection: IProjection): void;
    /**
     * Hook for subclasses to respond to the mouse leaving an item included in the quadtree
     *
     * @param {Bounds[]} left The items no longer hovered over by the mouse
     * @param {IPoint} mouse The location of the mouse on the screen relative to the canvas
     * @param {IPoint} world The location of the mouse projected to the world coordinates
     * @param {IProjection} projection The projection methods to go between the screen and world space
     */
    onMouseLeave(left: Bounds<any>[], mouse: IPoint, world: IPoint, projection: IProjection): void;
    /**
     * Hook for subclasses to respond to changes in the viewport and currently visible items
     *
     * @param {Bounds[]} visible
     * @param {IProjection} projection The projection methods to go between the screen and world space
     * @param {IScreenContext} ctx
     */
    onViewport(visible: Bounds<any>[], projection: IProjection, ctx: IScreenContext): void;
    makeDraggable(element: HTMLElement, stage: WebGLSurface<any, any>): void;
    /**
     * Handles mouse interactions when the mouse is pressed on the canvas. This
     * engages panning.
     *
     * @param {React.MouseEvent<HTMLDivElement>} e The mouse event from React
     */
    handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * Handles mouse interactions when the mouse is release or left the canvas. This
     * stops panning.
     *
     * @param {React.MouseEvent<HTMLDivElement>} e The mouse event from React
     */
    handleMouseOut: (e: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * Handles mouse interactions when the mouse is released on the canvas. This
     * stops panning and engages click events.
     *
     * @param {React.MouseEvent<HTMLDivElement>} e The mouse event from React
     */
    handleMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * Handles mouse interactions when the mouse is moving on the canvas. This
     * causes panning and hover events.
     *
     * @param {React.MouseEvent<HTMLDivElement>} e The mouse event from React
     */
    handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * Places the camera at a given location in world space
     *
     * @param {number} x The x-coordinate for the camera in world space
     * @param {number} y The x-coordinate for the camera in world space
     */
    positionCamera(x: number, y: number): void;
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
    screenToWorld(x: number, y: number, obj?: IPoint): IPoint;
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
    screenSizeToWorld(w: number, h: number, obj?: ISize): ISize;
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
    worldToScreen(x: number, y: number, obj?: IPoint): IPoint;
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
    worldSizeToScreen(w: number, h: number, obj?: ISize): ISize;
    /**
     * Sets the zoom level the camera will view the world with
     *
     * @param {number} zoom The zoom level. Must be > 0
     */
    zoomCamera(zoom: number): void;
    /**
     * This is a hook allowing a sub class to update uniforms when the camera is changed in
     * any way
     */
    updateCameraUniforms(): void;
    /**
     * We make the ref application be a declared function so react does not find the need to execute the
     * application numerous times for a detected changed method
     *
     * @param {HTMLElement} n This is the canvas element from the dom
     */
    applyRef: (n: HTMLElement) => void;
    /**
     * @override
     * Only re-render if the dimensions of the component have changed. All other
     * internal render updates are handled internally
     *
     * @param {T} nextProps The next properties injected
     */
    shouldComponentUpdate(nextProps: T): boolean;
    /**
     * Hook to allow subclasses some control over panning distances
     *
     * @param {number} distanceX The distance to pan in the x direction
     * @param {number} distanceY The distance to pan in the y direction
     *
     * @return {Vector3} The vector indicating the direction to pan
     */
    willPan(distanceX: number, distanceY: number): Vector3;
    /**
     * This should only attempt rendering when the canvas DOM element needs to be resized.
     * You will note shouldComponentUpdate helps facilitate this.
     */
    render(): JSX.Element;
}
