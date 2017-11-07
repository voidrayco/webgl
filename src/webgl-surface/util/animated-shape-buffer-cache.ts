import { CustomSelection } from './custom-selection';
import { MultiShapeBufferCache } from './multi-shape-buffer-cache';

export enum PlayState {
  INIT,
  PLAY,
  STOP,
}

/**
 * This defines an object that helps facilitate parts of or complete shape buffers that
 * need regenerating.
 */
export class AnimatedShapeBufferCache<T> extends MultiShapeBufferCache<T> {
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
  generate(selection: CustomSelection, ...args: any[]) {
    // Make sure the storage is established before trying to create modifications of any sort
    this.getStorage(selection);

    if (this.bustCache) {
      this.buildCache.apply(this, arguments);
      this.bustCache = false;

      if (this.playState === PlayState.INIT) {
        this.start();
        requestAnimationFrame(this.doAnimate);
      }
    }

    // We always invalidate and commit all of our buffers for animations
    this.flagBuffersDirty();
    // Make sure our buffers are updated so they will commit to vertex buffers
    this.processDirtyBuffers();
  }

  /**
   * Sub classes will implement this stub to perform what is necessary to produce
   * a newly updated version of their cache.
   */
  buildCache(selection: CustomSelection, ...args: any[]) {
    // Implemented by sub classes
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
