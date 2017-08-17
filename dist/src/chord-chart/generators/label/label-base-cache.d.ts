import { OuterRingGenerator } from 'chord-chart/generators/outer-ring/outer-ring-generator';
import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { Label } from 'webgl-surface/drawing/label';
import { IPoint } from 'webgl-surface/primitives/point';
import { AnchorPosition } from 'webgl-surface/primitives/rotateable-quad';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection } from '../../selections/selection';
import { IOuterRingData } from '../../shape-data-types/outer-ring-data';
import { IChordChartConfig, IData } from '../types';
/**
 * Responsible for generating the static labels around the chart
 *
 * @export
 * @class LabelBaseCache
 * @extends {ShapeBufferCache<Label<ICurvedLineData>>}
 */
export declare class LabelBaseCache extends ShapeBufferCache<Label<IOuterRingData>> {
    generate(data: IData, outerRingGenerator: OuterRingGenerator, config: IChordChartConfig, selection: Selection): void;
    buildCache(data: IData, outerRingGenerator: OuterRingGenerator, config: IChordChartConfig, selection: Selection): void;
    preProcessData(data: IData, outerRings: CurvedLineShape<IOuterRingData>[], config: IChordChartConfig): {
        anchor: AnchorPosition;
        angle: number;
        direction: IPoint;
        name: string;
        point: {
            x: number;
            y: number;
        };
    }[];
}
