import { EasingMethod } from './easing';

enum PlayState {
  PLAY,
  STOP,
}

export interface IAnimateValue {
  container: any;
  duration: number;
  easing: EasingMethod;
  end: number;
  prop: string;
  start: number;
}

export interface IAnimatePoint {
  container: any;
  duration: number;
  easing: EasingMethod;
  end: number;
  prop: string;
  start: number;
}

export class Animate {
  private static playState = PlayState.PLAY;
  private static animating = new Map<any, Map<string, any>>();

  static animate() {
    if (Animate.playState === PlayState.PLAY) {
      requestAnimationFrame(Animate.animate);
    }

    this.animating.forEach(propToItem => {
      propToItem.forEach(animate => {
        // TODO
      });
    });
  }

  static cancel(container: any, prop: string) {
    // TODO
  }

  static value(container: any, prop: string, start: number, end: number, duration: number, ease: EasingMethod) {
    // TODO
  }

  static point(container: any) {
    // TODO
  }

  static start() {
    // TODO
  }

  static stop() {
    // TODO
  }
}
