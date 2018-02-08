import * as React from 'react';
import { ISharedRenderContext } from './types';
import { WebGLSurface } from './webgl-surface';

export interface IWebGLSurfaceProviderProps {
  /**
   * If this is provided, it should be handed to the webGLSurface being used, or
   * if a ShareWebGLContext is being used, it should be handed to it.
   */
  renderContext?: ISharedRenderContext;
}

export interface IWebGLSurfaceProviderState {
}

/**
 * This is merely a way for a component to be a valid candidate for sharing
 * a webgl context. It must extend this component class AND find a means to
 * populate the webGLSurface property with an instance of a WebGLSurface.
 */
export class WebGLSurfaceProvider<T extends IWebGLSurfaceProviderProps, U extends IWebGLSurfaceProviderState> extends React.Component<T, U> {
  webGLSurface: WebGLSurface<any, any>;
}
