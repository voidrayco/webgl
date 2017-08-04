import * as React from 'react';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Bounds } from 'webgl-surface/primitives/bounds';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { ChordGenerator } from './generators/chord/chord-generator';
import { LabelGenerator } from './generators/label/label-generator';
import { OuterRingGenerator } from './generators/outer-ring/outer-ring-generator';
import { IData } from './generators/types';
import { IChordChartConfig } from './generators/types';
import { ChordChartGL } from './gl/chord-chart-gl';
import { Selection, SelectionType } from './selections/selection';
import { IChordData } from './shape-data-types/chord-data';
import { IOuterRingData } from './shape-data-types/outer-ring-data';

interface IChordChartProps {
  data: IData;
}

interface IChordChartState {
  zoom: number
}

function isOuterRing(curve: any): curve is CurvedLineShape<IOuterRingData> {
  if (curve.type === CurveType.CircularCCW) return true;
  return false;
}

function isChord(curve: any): curve is CurvedLineShape<IChordData> {
  if (curve.type === CurveType.Bezier) return true;
  return false;
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

  handleMouseHover = (selections: any[], mouse: any, world: any, projection: any) => {
    this.selection.clearSelection(SelectionType.MOUSEOVER_CHORD);
    this.selection.clearSelection(SelectionType.MOUSEOVER_OUTER_RING);

    if (selections.length > 0) {
      let selection;
      // If has outer ring thing grab it instead
      const filteredSelections = selections.filter(s => s.type === CurveType.CircularCCW);

      if (filteredSelections.length > 0) {
        selection = filteredSelections.reduce((prev, current) => (current.distanceTo(world) < prev.distanceTo(world)) ? current : prev);
      }

      else {
        selection = selections.reduce((prev, current) => (current.distanceTo(world) < prev.distanceTo(world)) ? current : prev);
      }

      // Select the chord and it's related outer rings
      if (isChord(selection)) {
        this.selection.select(SelectionType.MOUSEOVER_CHORD, selection);

        selection.d.outerRings.forEach((ring: CurvedLineShape<IOuterRingData>) => {
          this.selection.select(SelectionType.MOUSEOVER_OUTER_RING, ring);
        });
      }

      // Select the outer ring and it's related chords
      else if (isOuterRing(selection)) {
        this.selection.select(SelectionType.MOUSEOVER_OUTER_RING, selection);

        selection.d.chords.forEach((chord: CurvedLineShape<IChordData>) => {
          this.selection.select(SelectionType.MOUSEOVER_CHORD, chord);

          // Make sure both ends of each chord are selected
          chord.d.outerRings.forEach((ring: CurvedLineShape<IOuterRingData>) => {
            this.selection.select(SelectionType.MOUSEOVER_OUTER_RING, ring);
          });
        });
      }

      this.forceUpdate();
    }
  }

  handleMouseLeave = (selections: any[], mouse: any, world: any, projection: any) => {
    selections.forEach(curve => {
      if (curve.type === CurveType.Bezier) {
        this.selection.deselect(SelectionType.MOUSEOVER_CHORD, curve);
      }

      else if (curve.type === CurveType.CircularCCW) {
        this.selection.deselect(SelectionType.MOUSEOVER_OUTER_RING, curve);
      }
    });

    if (selections.length > 0) {
      this.forceUpdate();
    }
  }

  /**
   * @override
   * The react render method
   */
  render() {
    const config: IChordChartConfig = {
      radius: 200,
      ringWidth: 20,
      space: 0.005,
    };

    this.outerRingGenerator.generate(this.props.data, config, this.selection);
    this.chordGenerator.generate(this.props.data, config, this.outerRingGenerator, this.selection);
    this.labelGenerator.generate(this.props.data, config, this.selection);

    let staticCurves: CurvedLineShape<any>[] = this.chordGenerator.getBaseBuffer();
    staticCurves = staticCurves.concat(this.outerRingGenerator.getBaseBuffer());

    let interactiveCurves: CurvedLineShape<any>[] = this.chordGenerator.getInteractionBuffer();
    interactiveCurves = interactiveCurves.concat(this.outerRingGenerator.getInteractionBuffer());

    return (
      <ChordChartGL
        height={this.viewport.height}
        labels={this.labelGenerator.getBaseBuffer()}
        onZoomRequest={(zoom) => this.handleZoomRequest}
        staticCurvedLines={staticCurves}
        interactiveCurvedLines={interactiveCurves}
        onMouseHover={this.handleMouseHover}
        onMouseLeave={this.handleMouseLeave}
        viewport={this.viewport}
        width={this.viewport.width}
        zoom={this.state.zoom}
      />
    );
  }
}
