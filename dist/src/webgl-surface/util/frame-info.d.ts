export declare class FrameInfo {
    /** Contains the time the previous frame started */
    static lastFrameTime: number;
    /** Contains a theoretical approximation the next frame will start */
    static nextFrameTime: number;
    /** Contains how many frames have been played for a given WebGLSurface context */
    static framesPlayed: Map<any, number>;
}
/**
 * This gets an integer time value that can fit within an attribute. Be aware,
 * this only supports up to 7 digits of the millisecond time.
 */
export declare function getAttributeCurrentTime(): number;
