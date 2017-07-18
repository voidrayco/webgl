import { rgb, RGBColor } from 'd3-color';
import { Curve } from '../primitives/curve';
import { IPoint} from '../primitives/point';
/**
 * YoYo created
 * Add color and LineWidth with curve shape
 */
export class CurveShape<T> extends Curve<T>{
    r:number = 1;
    g:number = 1;
    b:number = 1;
    a:number = 1;

    // Default color
    color:RGBColor = rgb (this.r,this.g,this.b,this.a);

    lineWidth:number;

    segNum:number;

    /**
     *
     * @param p1 start point
     * @param p2 end point
     * @param controlPoints
     * @param lineWidth
     * @param segNum default is 30
     * @param color
     */
    constructor(p1:IPoint,p2:IPoint,controlPoints:IPoint[], lineWidth:number=1, segNum: number = 30,color?: RGBColor){
        super(p1,p2,controlPoints,segNum);

        this.lineWidth=lineWidth;
        this.segNum=segNum;

        if(color){
            this.color=color;
        }
    }
}
