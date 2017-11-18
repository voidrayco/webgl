import { WebGLSurface } from '../webgl-surface';
export declare class WebGLStat {
    static MAX_VERTEX_UNIFORMS: number;
    static MAX_FRAGMENT_UNIFORMS: number;
    static MAX_ATTRIBUTES: number;
    static WEBGL_SUPPORTED: boolean;
    static MAX_VERTEX_INSTANCE_DATA: number;
    static printCurrentProgramInfo(debug: any, surface: WebGLSurface<any, any>): void;
}
