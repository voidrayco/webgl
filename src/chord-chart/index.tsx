import * as React from 'react';
import { Bounds } from 'webgl-surface/primitives/bounds';
import { ChordGenerator } from './generators/chord/chord-generator';
import { ChordChartGL } from './gl/chord-chart-gl';
const debug = require('debug')('bezier');

interface IChordChartProps {
}

interface IChordChartState {
  zoom: number
}

/**
 * This defines a component that will render some test results. The shapes
 * rendered will be quads or bezier curves. The quads are for sanity and
 * debugging purposes.
 */
export class ChordChart extends React.Component<IChordChartProps, IChordChartState> {
  /** Indicates if this component has fully mounted already or not */
  initialized: boolean = false;
  /** This is the generator that produces the buffers for our quads */
  chordGenerator: ChordGenerator;

  // Sets the default state
  state: IChordChartState = {
    zoom: 1,
  };

  /**
   * @override
   * We initialize any needed state here
   */
  componentWillMount() {
    this.chordGenerator = new ChordGenerator();
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
    this.chordGenerator.generate();
    debug('Bezier Quad buffer created %o', this.chordGenerator.getBaseBuffer());

    return (
      <ChordChartGL
        height={500}
        onZoomRequest={(zoom) => this.handleZoomRequest}
        staticCurvedLines={this.chordGenerator.getBaseBuffer()}
        viewport={new Bounds<never>(0, 500, 0, 500)}
        width={500}
        zoom={this.state.zoom}
      />
    );
  }
}
