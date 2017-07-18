import { bezier2, bezier3 } from '../util/interpolation';
import { Bounds } from './bounds';
import { IPoint  } from './point';
/**
 * YoYo created
 */

export class Curve<T> extends Bounds<T>{
    // Store the results after calculation, connect these points to get the curve
    segPoints:IPoint[];
    // Contropoints and two end points are used to calculate the segPoints
    controlPoints:IPoint[];
    // Start point of the curve line
    p1:IPoint;
    // End point of the curve line
    p2:IPoint;
    // How many segments to render
    segNum:number;

    /**
     *
     * @param p1 start point of the curve
     * @param p2 end point  of the curve
     * @param controlPoints are used to calculate the segPoints with two end points, length is 2 or 3
     * @param segNum how many segments of the curve to render
     */
    constructor(p1:IPoint,p2:IPoint,controlPoints:IPoint[],segNum:number=30){
        super(0,0,0,0);
        // Assign start point
        this.p1=p1;
        // Assign end point
        this.p2=p2;
        // Assign control points
        this.controlPoints=controlPoints;
        // Assign segments number
        this.segNum=segNum;
        // Generate controlPoints based of length of controlPoints
        if(controlPoints.length===1){
            this.makeBezier2();
        }

        if(controlPoints.length===2){
            this.makeBezier3();
        }
    }

    // Quadratic bezier curves
    makeBezier2(){
        const segments:IPoint[]=[];
        const t=1/this.segNum;
        const p1=this.p1;
        const p2=this.p2;
        const c1=this.controlPoints[0];

        for(let i=0;i<=this.segNum;i++){
            segments.push(bezier2(t*i,p1,c1,p2));
        }
        this.segPoints=segments;
    }

    // Cubic bezier curves
    makeBezier3(){
        const segments:IPoint[]=[];
        const t=1/this.segNum;
        const p1=this.p1;
        const p2=this.p2;
        const c1=this.controlPoints[0];
        const c2=this.controlPoints[1];

        for(let i=0;i<=this.segNum;i++){
            segments.push(bezier3(t*i,p1,c1,c2,p2));
        }
        this.segPoints=segments;
    }

}
