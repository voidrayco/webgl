import * as React from 'react';
import { Bounds } from 'webgl-surface/primitives/bounds';
import { LineGenerator } from './generators/line-generator';
import { QuadGenerator } from './generators/quad-generator';
import { BezierGL } from './gl/bezier-gl';
import { ILineShapeData } from './shape-data-types/line-shape-data';
import { IQuadShapeData } from './shape-data-types/quad-shape-data';
const debug = require('debug')('bezier');

interface IBezierProps {
  quadData: IQuadShapeData[],
  lineData: ILineShapeData[]
}

interface IBezierState {
  zoom: number
}

/**
 * This defines a component that will render some test results. The shapes
 * rendered will be quads or bezier curves. The quads are for sanity and
 * debugging purposes.
 */
export class Bezier extends React.Component<IBezierProps, IBezierState> {
  /** Indicates if this component has fully mounted already or not */
  initialized: boolean = false;
  /** This is the generator that produces the buffers for our quads */
  quadGenerator: QuadGenerator;

  lineGenerator: LineGenerator;
  // Sets the default state
  state: IBezierState = {
    zoom: 1,
  };

  /**
   * @override
   * We initialize any needed state here
   */
  componentWillMount() {
    this.quadGenerator = new QuadGenerator();
    this.lineGenerator = new LineGenerator();
  }

  componentDidMount() {
    this.initialized = true;
  }

  handleZoomRequest = (zoom: number) => {
    this.setState({
      zoom,
    });
  }

  /**
   * @override
   * The react render method
   */
  render() {
    const { quadData, lineData } = this.props;

    this.quadGenerator.generate(quadData);
    debug('Bezier Quad buffer created %o', this.quadGenerator.getBaseBuffer());

    this.lineGenerator.generate(lineData);
    debug('Lines buffer created %o', this.lineGenerator.getBaseBuffer());

    return (
      <BezierGL
        quads={this.quadGenerator.getBaseBuffer()}
        lines={this.lineGenerator.getBaseBuffer()}
        height={500}
        onZoomRequest={(zoom) => this.handleZoomRequest}
        viewport={new Bounds<never>(0, 500, 0, 500)}
        width={500}
        zoom={this.state.zoom}
      />
    );
  }
}
