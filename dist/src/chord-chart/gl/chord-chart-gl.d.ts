/// <reference types="react" />
import { Mesh } from 'three';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Label } from 'webgl-surface/drawing/label';
import { Bounds } from 'webgl-surface/primitives/bounds';
import { IPoint } from 'webgl-surface/primitives/point';
import { IBufferItems } from 'webgl-surface/util/buffer-util';
import { IProjection } from 'webgl-surface/util/projection';
import { IWebGLSurfaceProperties, WebGLSurface } from 'webgl-surface/webgl-surface';
export interface IChordChartGLProperties extends IWebGLSurfaceProperties {
    /** Special case lines that use specific processes to animate */
    animatedCurvedLines?: CurvedLineShape<any>[];
    /** Lines that change frequently due to interactions */
    interactiveCurvedLines?: CurvedLineShape<any>[];
    interactiveRingLines?: CurvedLineShape<any>[];
    /** Labels that change frequently due to interactions */
    interactiveLabels?: Label<any>[];
    /** Lines that do not change often */
    staticCurvedLines?: CurvedLineShape<any>[];
    /** It is used to seperater from curved lines */
    staticRingLines?: CurvedLineShape<any>[];
    /** Event handlers */
    onMouseHover?(curves: CurvedLineShape<any>[], mouse: IPoint, world: IPoint, projection: IProjection): void;
    onMouseLeave?(curves: CurvedLineShape<any>[], mouse: IPoint, world: IPoint, projection: IProjection): void;
    onMouseUp?(curves: CurvedLineShape<any>[], mouse: IPoint, world: IPoint, projection: IProjection): void;
}
/**
 * The base component for the communications view
 */
export declare class ChordChartGL extends WebGLSurface<IChordChartGLProperties, {}> {
    animatedCurvedBufferItems: IBufferItems<CurvedLineShape<any>, Mesh>;
    interactiveCurvedBufferItems: IBufferItems<CurvedLineShape<any>, Mesh>;
    interactiveRingBufferItems: IBufferItems<CurvedLineShape<any>, Mesh>;
    staticCurvedBufferItems: IBufferItems<CurvedLineShape<any>, Mesh>;
    staticRingBufferItems: IBufferItems<CurvedLineShape<any>, Mesh>;
    staticLabelBufferItems: IBufferItems<Label<any>, Mesh>;
    interactiveLabelBufferItems: IBufferItems<Label<any>, Mesh>;
    /** The current dataset that is being rendered by this component */
    animatedCurvedLines: CurvedLineShape<any>[];
    /** The current dataset that is being rendered by this component */
    interactiveCurvedLines: CurvedLineShape<any>[];
    interactiveRingLines: CurvedLineShape<any>[];
    /** The current dataset that is being rendered by this component */
    staticCurvedLineSet: CurvedLineShape<any>[];
    mouseHovered: Map<any, boolean>;
    /**
     * Applies new props injected into this component.
     *
     * @param  props The new properties for this component
     */
    applyBufferChanges(props: IChordChartGLProperties): void;
    /**
     * @override
     *
     * This special hook is called when the labels are ready for rendering
     *
     * @param props The newly applied props being applied to this component
     */
    applyLabelBufferChanges(props: IChordChartGLProperties): void;
    /**
     * This is a hook allowing sub classes to have a place to initialize their buffers
     * and materials etc.
     */
    initBuffers(): void;
    onMouseHover(hitInside: Bounds<any>[], mouse: IPoint, world: IPoint, projection: IProjection): void;
    onMouseLeave(left: Bounds<any>[], mouse: IPoint, world: IPoint, projection: IProjection): void;
    onMouseUp(e: React.MouseEvent<HTMLDivElement>, hitInside: Bounds<any>[], mouse: IPoint, world: IPoint, projection: IProjection): void;
    /**
     * Any uniforms tied to changes in the camera are updated here
     */
    updateCameraUniforms(): void;
}
