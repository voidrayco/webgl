import { CurvedLineShape } from 'webgl-surface/drawing/curved-line-shape';
import { IEndpoint } from '../generators/types';

export interface IOuterRingData {
  /** Stores the child endpoints shapes that are generated */
  childEndpoints: CurvedLineShape<any>[];
  /** Stores chords that are associated with the endpoint */
  chords: CurvedLineShape<any>[];
  /** Stores the source information used to build the endpoint */
  source: IEndpoint;
}
