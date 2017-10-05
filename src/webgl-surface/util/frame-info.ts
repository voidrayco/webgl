export class FrameInfo {
  static lastFrameTime: number = Date.now();
  static framesPlayed: Map<any, number> = new Map<any, number>();
}
