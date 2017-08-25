import { clone } from 'ramda';
import * as React from 'react';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Bounds } from 'webgl-surface/primitives/bounds';
import { CurveType } from 'webgl-surface/primitives/curved-line';
import { ChordGenerator } from './generators/chord/chord-generator';
import { ColorGenerator } from './generators/color/color-generator';
import { LabelGenerator } from './generators/label/label-generator';
import { OuterRingGenerator } from './generators/outer-ring/outer-ring-generator';
import { IData, IDataAPI } from './generators/types';
import { IChord, IChordChartConfig, IEndpoint, LabelDirectionEnum } from './generators/types';
import { ChordChartGL } from './gl/chord-chart-gl';
import { Selection, SelectionType } from './selections/selection';
import { IChordData } from './shape-data-types/chord-data';
import { IOuterRingData } from './shape-data-types/outer-ring-data';
import { getTreeLeafNodes, recalculateTree } from './util/endpointDataProcessing';

export interface IChordChartProps {
  // PROPERTIES

  /** Enables the ability for the user to pan via click and drag */
  allowPan?: boolean;
  /**
   * This will be all of the properties applied to the container of the chart
   * The chart will respond by sizing itself to the size of the container
   */
  containerProps?: object;
  /** The data for the chart to render */
  data: IDataAPI;
  /** The space in pixels from the renderings edge to where the chart begins to appear */
  margin?: {top: number, left: number, bottom: number, right: number};
  /** Styling config object that adjusts visuals of the chart */
  styling?: {
    /** Total center radius area where chords appear */
    chartRadius?: number,
    /** Padding between each endpoint segment in radians */
    endpointPadding?: number,
    /** Padding between each row of endpoints */
    endpointRowPadding?: number,
    /** The width of an endpoint */
    endpointWidth?: number,
    /** The padding between main groups in radians */
    groupPadding?: number,
    /** The distance each group appeas from the initial circle center */
    groupSplitDistance?: number,
  };
  /** If true, this component renders each main group a distance away from the center */
  split?: boolean;

  // EVENTS

  /** Callback for when a chord is clicked */
  onChordClick?(chordId: string, chordData: any, screen: object, world: object): void;
  /** Callback for when an endpoint is clicked */
  onEndPointClick?(endpointId: string, endpointData: any, screen: object, world: object): void;
  /** Callback for when nothing is clicked */
  onClickNothing?(screen: object, world: object): void;
}

export interface IChordChartState {
  /** The rendered height of the chart */
  chartHeight: number,
  /** The rendered width of the chart */
  chartWidth: number,
  /** The current calculated data that the chart is working with */
  data: IData,
  /** The current zoom the chart will render with */
  zoom: number,
}

function isOuterRing(curve: any): curve is CurvedLineShape<IOuterRingData> {
  if (curve.type === CurveType.CircularCCW) return true;
  return false;
}

function isChord(curve: any): curve is CurvedLineShape<IChordData> {
  if (curve.type === CurveType.Bezier) return true;
  return false;
}

function getMutableData(data: IDataAPI): IData {
  // We do NOT want meta data cloned due to cyclic structures and extreme
  // Memory bloat.
  const endpointMeta = new Map<string, any>();
  const chordMeta = new Map<string, any>();

  data.endpoints.forEach(endpoint => {
    endpointMeta.set(endpoint.id, endpoint.metadata);
    endpoint.metadata = null;
  });

  data.chords.forEach(chord => {
    chordMeta.set(chord.id, chord.metadata);
    chord.metadata = null;
  });

  // Do the clone without meta data attached
  // We clone to prevent mutations to the source which could cause undefined
  // Behavior within the external system
  const newData: IData = clone(data);
  recalculateTreeForData(newData);

  // Now apply the meta back to the source data and the cloned data
  data.endpoints.forEach(endpoint => {
    const meta = endpointMeta.get(endpoint.id);
    endpoint.metadata = meta;
    // Also apply the meta into our data that our chart messes with
    const newEndpoint = newData.endpointById.get(endpoint.id);
    if (newEndpoint) newEndpoint.metadata = meta;
  });

  // Apply back to the chords as well
  data.chords.forEach(chord => {
    const meta = chordMeta.get(chord.id);
    chord.metadata = meta;
    // Also apply the meta into our data that our chart messes with
    const newChord = newData.chordById.get(chord.id);
    if (newChord) newChord.metadata = meta;
  });

  return newData;
}

function recalculateTreeForData(data: IData) {
  data.tree = recalculateTree(data.endpoints, data.chords);
  data.endpoints = getTreeLeafNodes(data.tree);
  data.chordById = new Map<string, IChord>();
  data.endpointById = new Map<string, IEndpoint>();
  data.topEndPointByEndPointId = new Map<string, IEndpoint>();
  data.topEndPointMaxDepth = new Map<IEndpoint, number>();

  // Get the top level rendered elements (The very top elements does not render
  // They merely group into chunks that can be spread apart)
  const topLevel: IEndpoint[] = [];
  data.tree.forEach(top => topLevel.push(...top.children));

  // Make a quick lookup to find the top endpoint for a given endpoint id
  // Also make the maximum depth of the top endpoint available
  topLevel.forEach(top => {
    const toProcess = [...top.children];
    let depth = 0;
    let rowCount = top.children.length;

    while (toProcess.length > 0) {
      const current = toProcess.shift();
      toProcess.push(...current.children);
      data.topEndPointByEndPointId.set(current.id, top);

      if (--rowCount <= 0) {
        depth += 1;
        rowCount = toProcess.length;
      }
    }

    data.topEndPointByEndPointId.set(top.id, top);
    data.topEndPointMaxDepth.set(top, depth);
  });

  data.endpoints.forEach(endpoint => {
    data.endpointById.set(endpoint.id, endpoint);
  });

  data.chords.forEach(chord => {
    data.chordById.set(chord.id, chord);
  });
}

/**
 * This defines a component that will render some test results. The shapes
 * rendered will be quads or bezier curves. The quads are for sanity and
 * debugging purposes.
 */
export class ChordChart extends React.Component<IChordChartProps, IChordChartState> {
  /** This is the generator that produces the buffers for our chords */
  chordGenerator: ChordGenerator;
  /** This is the generator that calculates and produces all colors needed */
  colorGenerator: ColorGenerator;
  /** Top level div surrounding the chart. The chart will always try to fit the contianer */
  container: HTMLDivElement;
  /** This is the generator that produces the buffers for our labels */
  labelGenerator: LabelGenerator;
  /** This is the generator that produces the buffers for our outer rings */
  outerRingGenerator: OuterRingGenerator;
  /** Selection manager */
  selection: Selection = new Selection();
  // Make sure we don't recreate the bound object
  viewport: Bounds<never> = new Bounds<never>(-350, 350, 350, -350);

  // Sets the default state
  state: IChordChartState = {
    chartHeight: 100,
    chartWidth: 100,
    data: {
      chords: [],
      endpointById: new Map<string, IEndpoint>(),
      endpoints: [],
      topEndPointByEndPointId: new Map<string, IEndpoint>(),
      topEndPointMaxDepth: new Map<IEndpoint, number>(),
      tree: [],
    },
    zoom: 1,
  };

  /**
   * Makes the viewport centered on the chart
   */
  centerView = (width: number, height: number) => {
    this.viewport = new Bounds<never>(
      -this.state.chartWidth / 2,
      this.state.chartWidth / 2,
      this.state.chartHeight / 2,
      -this.state.chartHeight / 2,
    );
  }

  /**
   * Initial set up for the chart
   */
  componentDidMount() {
    this.sizeChart();
  }

  /**
   * @override
   * We initialize any needed state here
   * Set up any external event listeners here.
   */
  componentWillMount() {
    this.chordGenerator = new ChordGenerator();
    this.colorGenerator = new ColorGenerator();
    this.labelGenerator = new LabelGenerator();
    this.outerRingGenerator = new OuterRingGenerator();
    // This ensures as best as possible that the component attempts to render
    // Within it's bounds should the user resize the component.
    window.addEventListener('resize', this.sizeChart);

    // Make sure our data is mutable and has all the metrics calculated
    const data = getMutableData(this.props.data);
    this.setState({data});
  }

  /**
   * @override
   * This ensures the injected data has the necessary initial calculated metrics
   */
  componentWillReceiveProps(nextProps: any) {
    if (nextProps.data) {
      const data = getMutableData(nextProps.data);
      this.setState({data});
    }
  }

  /**
   * @override
   * We free any external resources here
   * We also remove any external listeners here
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.sizeChart);
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
        // We will select any child endpoints of the selection as well as select
        // The chords of those children
        const toProcess = [selection];
        const allChords = [];

        while (toProcess.length > 0) {
          const endpoint = toProcess.shift();
          toProcess.push(...endpoint.d.childEndpoints);
          allChords.push(...endpoint.d.chords);
          this.selection.select(SelectionType.MOUSEOVER_OUTER_RING, endpoint);
        }

        allChords.forEach((chord: CurvedLineShape<IChordData>) => {
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

  handleMouseUp = (selections: any[], mouse: any, world: any, projection: any) => {
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

      if (this.props.onEndPointClick && selection.d.source.id) {
        this.props.onEndPointClick(selection.d.source.id, selection.d.source.metadata, {}, {});
      }
    }
  }

  /**
   * This attempts to examine the container of this chart and tries to size the
   * chart to fit the container.
   */
  sizeChart = () => {
    const rect = this.container.getBoundingClientRect();
    this.centerView(rect.width, rect.height);

    this.setState({
      chartHeight: rect.height,
      chartWidth: rect.width,
    });
  }

  /**
   * @override
   * The react render method
   */
  render() {
    const config: IChordChartConfig = {
      center: {x: 0, y: 0},
      groupSplitDistance: 50,
      labelDirection: this.props.split ? LabelDirectionEnum.LINEAR : LabelDirectionEnum.RADIAL,
      outerRingSegmentPadding: 0.005,
      outerRingSegmentRowPadding: 2,
      radius: 200,
      ringWidth: 10,
      splitTopLevelGroups: this.props.split,
      topLevelGroupPadding: Math.PI / 4,
    };

    this.colorGenerator.generate(this.state.data, config);
    this.outerRingGenerator.generate(this.state.data, config, this.colorGenerator, this.selection);
    this.chordGenerator.generate(this.state.data, config, this.colorGenerator, this.outerRingGenerator, this.selection);
    this.labelGenerator.generate(this.state.data, config, this.outerRingGenerator, this.selection);

    return (
      <div ref={n => this.container = n} {...this.props.containerProps}>
        <ChordChartGL
          colors={this.colorGenerator.getBaseBuffer()}
          height={this.state.chartHeight}
          labels={this.labelGenerator.getUniqueLabels()}
          onZoomRequest={(zoom) => this.handleZoomRequest}
          staticCurvedLines={this.chordGenerator.getBaseBuffer()}
          staticLabels={this.labelGenerator.getBaseBuffer()}
          staticRingLines={this.outerRingGenerator.getBaseBuffer()}
          interactiveCurvedLines={this.chordGenerator.getInteractionBuffer()}
          interactiveLabels={this.labelGenerator.getInteractionBuffer()}
          interactiveRingLines={this.outerRingGenerator.getInteractionBuffer()}
          onMouseHover={this.handleMouseHover}
          onMouseLeave={this.handleMouseLeave}
          onMouseUp={this.handleMouseUp}
          viewport={this.viewport}
          width={this.state.chartWidth}
          zoom={this.state.zoom}
        />
      </div>
    );
  }
}
