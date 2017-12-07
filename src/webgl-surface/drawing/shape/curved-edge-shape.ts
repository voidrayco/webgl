 import { CurvedLineShape, ICurvedLineShapeOptions } from './curved-line-shape';

 export interface ICurvedEdgeShapeOptions extends ICurvedLineShapeOptions {
   endWidth: number;
   startWidth: number;
 }

 /**
  * A curved edge will be the same as a curved line, but it will have the properties to properly
  * define a curved shape that interpolates between two widths from start to end.
  */
export class CurvedEdgeShape<T> extends CurvedLineShape<T> {
  /** How wide the edge is at end */
  endWidth: number;
  /** How wide the edge is at start */
  startWidth: number;

  constructor(options: ICurvedEdgeShapeOptions) {
    super(options);

    this.startWidth = options.startWidth;
    this.endWidth = options.endWidth;
  }
}
