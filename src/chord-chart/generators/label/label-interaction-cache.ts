import { OuterRingGenerator } from 'chord-chart/generators/outer-ring/outer-ring-generator';
import { Label } from 'webgl-surface/drawing/label';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { Selection } from '../../selections/selection';
import { IOuterRingData } from '../../shape-data-types/outer-ring-data';
import { IChordChartConfig, IData } from '../types';

export class LabelInteractionCache extends ShapeBufferCache<Label<IOuterRingData>>{
    generate(data: IData, outerRingGenerator: OuterRingGenerator, config: IChordChartConfig, selection: Selection){
        super.generate.apply(this, arguments);
    }

    buildCache(data: IData, outerRingGenerator: OuterRingGenerator, config: IChordChartConfig, selection: Selection){
        const labels: Label<any>[] = [];

        this.buffer = labels;
    }
}
