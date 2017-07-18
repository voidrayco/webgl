import {IPoint} from '../primitives/point';
/**
 * YoYo created
 */

/**
 *
 * @param t it should be in [0,1]
 * @param p0 first point
 * @param p1 contro point 1
 * @param p2 end point
 */
export function bezier2(t:number,p0:IPoint,p1:IPoint,p2:IPoint):IPoint{
    return {
        x:(1-t)*(1-t)*p0.x+2*t*(1-t)*p1.x+t*t*p2.x,
        y:(1-t)*(1-t)*p0.y+2*t*(1-t)*p1.y+t*t*p2.y,
    };
}

/**
 *
 * @param t in [0,1]
 * @param p0 start point
 * @param p1 control point 1
 * @param p2 control point 2
 * @param p3 end point
 */
export function bezier3(t:number,p0:IPoint,p1:IPoint,p2:IPoint,p3:IPoint):IPoint{
    return {
        x:(1-t)*(1-t)*(1-t)*p0.x+3*t*(1-t)*(1-t)*p1.x+3*t*t*(1-t)*p2.x+t*t*t*p3.x,
        y:(1-t)*(1-t)*(1-t)*p0.y+3*t*(1-t)*(1-t)*p1.y+3*t*t*(1-t)*p2.y+t*t*t*p3.y,
    };
}
