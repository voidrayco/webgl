import * as React from 'react';
import { Bounds } from 'webgl-surface/primitives/bounds';
import { QuadGenerator } from './generators/quad-generator';
import { BezierGL } from './gl/bezier-gl';
import { IQuadShapeData } from './shape-data-types/quad-shape-data';
const debug = require('debug')('bezier');

interface IBezierProps {
  quadData: IQuadShapeData[]
}

/**
 * This defines a component that will render some test results. The shapes
 * rendered will be quads or bezier curves. The quads are for sanity and
 * debugging purposes.
 */
export class Bezier extends React.Component<IBezierProps, any> {
  /** Indicates if this component has fully mounted already or not */
  initialized: boolean = false;
  /** This is the generator that produces the buffers for our quads */
  quadGenerator: QuadGenerator;

  /**
   * @override
   * We initialize any needed state here
   */
  componentWillMount() {
    this.quadGenerator = new QuadGenerator();
  }

  componentDidMount() {
    this.initialized = true;
  }

  /**
   * @override
   * The react render method
   */
  render() {
    const { quadData } = this.props;

    this.quadGenerator.generate(quadData);
    debug('Bezier Quad buffer created %o', this.quadGenerator.getBaseBuffer());

    return (
      <BezierGL
        quads={this.quadGenerator.getBaseBuffer()}
        height={500}
        initialViewport={new Bounds<never>(0, 500, 0, 500)}
        preventCameraInit={this.initialized}
        width={500}
      />
    );
  }
}
