import { ShapeBufferCache } from './shape-buffer-cache';

export enum PlayState {
  INIT,
  PLAY,
  STOP,
}

/**
 * This defines an object that helps facilitate parts of or complete shape buffers that
 * need regenerating.
 */
export class AnimatedShapeBufferCache<T> extends ShapeBufferCache<T> {
  playState: PlayState = PlayState.INIT;
  buffer: T[] = [];
  bustCache: boolean = true;

  /**
   * This is the internal control for managing execution of the animate method
   */
  private doAnimate = () => {
    if (this.playState === PlayState.PLAY) {
      requestAnimationFrame(this.doAnimate);
    }

    this.animate();
  }

  /**
   * This is the method that will execute with the frame rate. Subclasses can
   * override this to implement animated changes
   */
  animate() {
    // Implemented by subclasses
  }

  /**
   * Tells this cache to generate what it needs to. If the cache isn't busted,
   * it will not regenerate
   */
  generate(...args: any[]) {
    if (this.bustCache) {
      this.buildCache.apply(this, args);
      this.bustCache = false;

      if (this.playState === PlayState.INIT) {
        this.start();
        requestAnimationFrame(this.doAnimate);
      }
    }
  }

  /**
   * Sub classes will implement this stub to perform what is necessary to produce
   * a newly updated version of their cache.
   */
  buildCache(...args: any[]) {
    // Implemented by sub classes
  }

  /**
   * Animated buffers are ALWAYS new every frame if playing
   * Get the buffer the cache has generated
   */
  getBuffer(): T[] {
    if (this.playState === PlayState.PLAY) {
      return [].concat(this.buffer);
    }

    return this.buffer;
  }

  /**
   * Begins executing the animate method every frame
   */
  start() {
    this.playState = PlayState.PLAY;
  }

  /**
   * Ceases the animate method every frame
   */
  stop() {
    this.playState = PlayState.STOP;
  }
}
