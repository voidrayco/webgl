import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { IFlow } from '../generators/types';
import { IOuterRingData } from './outer-ring-data';

export interface IChordData {
  source: IFlow;
  outerRings: CurvedLineShape<IOuterRingData>[];
}
