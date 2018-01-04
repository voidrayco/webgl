import * as React from 'react';
import { WebGLRenderer } from 'three';
import { WebGLSurfaceProvider } from 'webgl-surface/webgl-surface-provider';
import { WebGLSurface } from './webgl-surface';

export interface IShareWebGLContextProps {
  /** This allows a ref to be applied to the child contexts */
  childRefs: ((n: WebGLSurface<any, any> | WebGLSurfaceProvider<any, any>) => void)[];
  /**
   * This is a rendering context that should be passed to child WebGLSurfaces OR
   * to ShareWebGLContext components. When this is available, the intent is to be
   * rendering to a specific rendering context
   */
  renderContext: WebGLSurface<any, any>;
  /**
   * When the rendering context is established, this will be called with the context
   * that this shared context will use.
   */
  onRenderContext(renderContext: WebGLSurface<any, any>): void;
}

export interface IShareWebGLContextState {
}

function isSurface(val: any): val is WebGLSurface<any, any> {
  return Boolean(val.renderer);
}

function isProvider(val: any): val is WebGLSurfaceProvider<any, any> {
  return Boolean(val.webGLSurface);
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
export default class ShareWebGLContext extends React.Component<IShareWebGLContextProps, IShareWebGLContextState> {
  sourceContext: WebGLSurface<any, any>;

  componentWillMount() {
    this.sourceContext = this.props.renderContext;
  }

  componentWillReceiveProps(nextProps: IShareWebGLContextProps) {
    this.sourceContext = nextProps.renderContext;
  }

  handleRef = (node: any, index: number) => {
    const { childRefs } = this.props;

    if (isSurface(node)) {
      if (!this.sourceContext && index === 0) {
        this.sourceContext = node;
      }

      if (childRefs[index]) {
        childRefs[index](node);
      }
    }

    if (isProvider(node)) {
      if (!this.sourceContext && index === 0) {
        this.sourceContext = node.webGlSurface;
      }

      if (childRefs[index]) {
        childRefs[index](node);
      }
    }
  }

  render() {
    const { children } = this.props;

    const toRender = React.Children.map(children, (child, index) => {
      // We only render the first element initially. Once the first element is
      // Rendered we can then render the next elements and inject the rendering
      // Context the child will need
      if (!this.sourceContext && index > 0) {
        return null;
      }

      // We clone and we do NOT preserve refs as we want to controll reffing
      // With this component
      if (React.isValidElement(child)) {
        return (
          <child.type
            {...child.props}
            {...{
              ref: this.handleRef,
              renderContext: index > 0 ? this.sourceContext : undefined,
            }}
          />
        );
      }

      return null;
    });

    return (
      <div>
        {toRender}
      </div>
    );
  }
}
