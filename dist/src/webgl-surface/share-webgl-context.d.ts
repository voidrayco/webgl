/// <reference types="react" />
import * as React from 'react';
import { WebGLSurface } from './webgl-surface';
import { WebGLSurfaceProvider } from './webgl-surface-provider';
export interface IShareWebGLContextProps {
    /** This allows a ref to be applied to the child contexts */
    childRefs?: ((n: WebGLSurface<any, any> | WebGLSurfaceProvider<any, any>) => void)[];
    /**
     * This is a rendering context that should be passed to child WebGLSurfaces OR
     * to ShareWebGLContext components. When this is available, the intent is to be
     * rendering to a specific rendering context
     */
    renderContext?: WebGLSurface<any, any>;
    /**
     * When the rendering context is established, this will be called with the context
     * that this shared context will use.
     */
    onRenderContext?(renderContext: WebGLSurface<any, any>): void;
}
export interface IShareWebGLContextState {
}
/**
 * This is a helper component to bind webgl contexts together so the contexts
 * can be shared for rendering elements to the screen. Simply place all of the
 * contexts that are to be melded together as children to this component and they
 * all will share the context of the FIRST component injected (thus the rendering
 * size will be the first component's dimensions.) Then you can render the next
 * elements using the special 'renderOffset' to position where the context should
 * render. Width and height are still dictated by the width and height properties.
 */
export declare class ShareWebGLContext extends React.Component<IShareWebGLContextProps, IShareWebGLContextState> {
    sourceContext: WebGLSurface<any, any>;
    componentWillMount(): void;
    handleRef: (index: number) => (node: any) => void;
    render(): JSX.Element;
}
