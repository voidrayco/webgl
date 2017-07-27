import * as React from 'react';
import { Bounds } from 'webgl-surface/primitives/bounds';
import { ChordGenerator } from './generators/chord/chord-generator';
import { LabelGenerator } from './generators/label/label-generator';
import { OuterRingGenerator } from './generators/outer-ring/outer-ring-generator';
import { IChordChartConfig } from './generators/types';
import { ChordChartGL } from './gl/chord-chart-gl';
import { Selection, SelectionType } from './selections/selection';

// Debug const debug = require('debug')('chord-index');
const testChordData = require('./test-data/chord-data.json');

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
  /** This is the generator that produces the buffers for our labels */
  labelGenerator: LabelGenerator;
  /** This is the generator that produces the buffers for our outer rings */
  outerRingGenerator: OuterRingGenerator;
  /** Selection manager */
  selection: Selection = new Selection();
  // Make sure we don't recreate the bound object
  viewport: Bounds<never> = new Bounds<never>(-350, 350, -350, 350);

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
    this.labelGenerator = new LabelGenerator();
    this.outerRingGenerator = new OuterRingGenerator();
  }

  componentDidMount() {
    this.initialized = true;
  }

  handleZoomRequest = (zoom: number) => {
    this.setState({
      zoom,
    });
  }

  handleMouseHover = (selections: any[]) => {
    this.selection.clearSelection(SelectionType.MOUSE_OVER);
    selections.forEach(selection => {
      this.selection.select(SelectionType.MOUSE_OVER, selection);
    });

    this.forceUpdate();
  }

  /**
   * @override
   * The react render method
   */
  render() {
    const config: IChordChartConfig = {
      radius: 200,
    };

    this.chordGenerator.generate(testChordData, config, this.selection);
    this.outerRingGenerator.generate(testChordData, config, this.selection);
    this.labelGenerator.generate(testChordData, config, this.selection);

    return (
      <ChordChartGL
        height={this.viewport.height}
        labels={this.labelGenerator.getBaseBuffer()}
        onZoomRequest={(zoom) => this.handleZoomRequest}
        staticCurvedLines={this.chordGenerator.getBaseBuffer().concat(this.outerRingGenerator.getBaseBuffer())}
        interactiveCurvedLines={this.chordGenerator.getInteractionBuffer().concat(this.outerRingGenerator.getInteractionBuffer())}
        onMouseHover={(selections: any[]) => this.handleMouseHover(selections)}
        viewport={this.viewport}
        width={this.viewport.width}
        zoom={this.state.zoom}
      />
    );
  }
}
