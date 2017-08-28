import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { IChord } from '../generators/types';
import { IOuterRingData } from './outer-ring-data';

export interface IChordData {
  source: IChord;
  outerRings: CurvedLineShape<IOuterRingData>[];
}
