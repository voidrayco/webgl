export class FrameInfo {
  /** Contains the time the previous frame started */
  static lastFrameTime: number = Date.now();
  /** Contains a theoretical approximation the next frame will start */
  static nextFrameTime: number = Date.now();
  /** Contains how many frames have been played for a given WebGLSurface context */
  static framesPlayed: Map<any, number> = new Map<any, number>();
}

/**
 * This gets an integer time value that can fit within an attribute. Be aware,
 * this only supports up to 7 digits of the millisecond time.
 */
export function getAttributeCurrentTime() {
  const time = FrameInfo.lastFrameTime / 1E7;
  return Math.floor((time - Math.floor(time)) * 1E7);
}
