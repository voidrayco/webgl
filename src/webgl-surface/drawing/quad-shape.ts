import { RGBColor } from 'd3-color';
import { Line } from '../primitives/line';
import {IPoint} from '../primitives/point';
/**
 * YoYo changed the QuadShape to extend Line class
 * The class describes a quad with two points and lineWidth
 * The advantage is to render quad with different directions which could be a part of curve line
 */
export class QuadShape<T> extends Line<T> {
  r: number = 1.0;
  g: number = 0.0;
  b: number = 0.0;
  a: number = 1.0;

  p1:IPoint;
  p2:IPoint;
  p3:IPoint;
  p4:IPoint;

  lineWidth:number;

  /**
   *
   * @param p1 start point
   * @param p2 end point
   * @param lineWidth 'height' of a quad
   * @param color
   */
  constructor(p1:IPoint,p2:IPoint, lineWidth:number=1,color?: RGBColor) {
      super(p1,p2);
      this.lineWidth=lineWidth;
      // Calculate the slope and line p1-p2
      const angle:number=Math.atan((p2.y-p1.y)/(p2.x-p1.x));
      // Move the two line with the same direction to get anothet two points of the quad
      this.p3={x:p1.x+lineWidth*Math.sin(angle),y:p1.y-lineWidth*Math.cos(angle)};
      this.p4={x:p2.x+lineWidth*Math.sin(angle),y:p2.y-lineWidth*Math.cos(angle)};
      if(color){
        this.r=color.r;
        this.g=color.g;
        this.b=color.b;
      }
  }
}
