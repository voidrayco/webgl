/** @jsx h */
import { Component, h } from 'preact';
import { ISharedRenderContext } from './types';
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

function isSurface(val: any): val is WebGLSurface<any, any> {
  return val.renderer !== undefined;
}

function isProvider(val: any): val is WebGLSurfaceProvider<any, any> {
  return val.webGLSurface !== undefined;
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
export class ShareWebGLContext extends Component<IShareWebGLContextProps, IShareWebGLContextState> {
  sourceContext: WebGLSurface<any, any>;

  componentWillMount() {
    this.sourceContext = this.props.renderContext;

    if (this.sourceContext && this.props.onRenderContext) {
      this.props.onRenderContext(this.sourceContext);
    }
  }

  handleRef = (index: number) => (node: any) => {
    const { childRefs } = this.props;

    if (node) {
      if (isSurface(node)) {
        if (!this.sourceContext && index === 0) {
          this.sourceContext = node;
          // When the source context is set via a ref, we must force update to now
          // Ensure all of the children are rendered. When the source context is set
          // Via props, then the children will be rendered already.
          setTimeout(() => this.forceUpdate(), 1);
        }
      }

      else {
        if (!this.sourceContext && index === 0) {
          // We must wait for all mountings to settle to ensure the context has
          // Been established
          setTimeout(() => {
            if (isProvider(node)) {
              this.sourceContext = node.webGLSurface;
              // When the source context is set via a ref, we must force update to now
              // Ensure all of the children are rendered. When the source context is set
              // Via props, then the children will be rendered already.
              this.forceUpdate();
            }
          }, 5);
        }
      }

      if (childRefs && childRefs[index]) {
        childRefs[index](node);
      }
    }
  }

  render() {
    let { children, renderContext } = this.props;

    children = Array.isArray(children) ? children : [children];
    const toRender = children.map((child, index) => {
      // We only render the first element initially. Once the first element is
      // Rendered we can then render the next elements and inject the rendering
      // Context the child will need
      if (!this.sourceContext && index > 0) {
        return null;
      }

      // We clone and we do NOT preserve refs as we want to controll reffing
      // With this component
      if (child instanceof Component) {
        return (
          <child.nodeName
            {...child.props}
            {...{
              ref: this.handleRef(index),
              renderContext: index > 0 || renderContext ? {
                context: this.sourceContext,
                position: child.props.renderContext && child.props.renderContext.position,
                size: child.props.renderContext && child.props.renderContext.size,
              } as ISharedRenderContext : undefined,
            }}
          />
        );
      }

      return null;
    });

    return (
      <div className="sharing-context">
        {toRender}
      </div>
    );
  }
}
