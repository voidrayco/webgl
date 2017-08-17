/// <reference types="react" />
import * as React from 'react';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Bounds } from 'webgl-surface/primitives/bounds';
import { ChordGenerator } from './generators/chord/chord-generator';
import { LabelGenerator } from './generators/label/label-generator';
import { OuterRingGenerator } from './generators/outer-ring/outer-ring-generator';
import { IData } from './generators/types';
import { Selection } from './selections/selection';
export interface IChordChartProps {
    onEndPointClick?(curve: CurvedLineShape<any>): void;
    hemiSphere: boolean;
    data: IData;
}
export interface IChordChartState {
    zoom: number;
    data: IData;
}
/**
 * This defines a component that will render some test results. The shapes
 * rendered will be quads or bezier curves. The quads are for sanity and
 * debugging purposes.
 */
export declare class ChordChart extends React.Component<IChordChartProps, IChordChartState> {
    /** Indicates if this component has fully mounted already or not */
    initialized: boolean;
    /** This is the generator that produces the buffers for our quads */
    chordGenerator: ChordGenerator;
    /** This is the generator that produces the buffers for our labels */
    labelGenerator: LabelGenerator;
    /** This is the generator that produces the buffers for our outer rings */
    outerRingGenerator: OuterRingGenerator;
    /** Selection manager */
    selection: Selection;
    viewport: Bounds<never>;
    state: IChordChartState;
    /**
     * @override
     * We initialize any needed state here
     */
    componentWillMount(): void;
    componentWillReceiveProps(nextProps: any): void;
    componentDidMount(): void;
    handleZoomRequest: (zoom: number) => void;
    handleMouseHover: (selections: any[], mouse: any, world: any, projection: any) => void;
    handleMouseLeave: (selections: any[], mouse: any, world: any, projection: any) => void;
    handleMouseUp: (selections: any[], mouse: any, world: any, projection: any) => void;
    /**
     * @override
     * The react render method
     */
    render(): JSX.Element;
}
export default ChordChart;
