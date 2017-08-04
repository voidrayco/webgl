import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { IEndpoint } from '../generators/types';

export interface IOuterRingData {
  source: IEndpoint;
  chords: CurvedLineShape<any>[];
}
