import { CustomSelection } from './custom-selection';
import { MultiShapeBufferCache } from './multi-shape-buffer-cache';
export declare enum PlayState {
    INIT = 0,
    PLAY = 1,
    STOP = 2,
}
/**
 * This defines an object that helps facilitate parts of or complete shape buffers that
 * need regenerating.
 */
export declare class AnimatedShapeBufferCache<T> extends MultiShapeBufferCache<T> {
    playState: PlayState;
    buffer: T[];
    bustCache: boolean;
    /**
     * This is the internal control for managing execution of the animate method
     */
    private doAnimate;
    /**
     * This is the method that will execute with the frame rate. Subclasses can
     * override this to implement animated changes
     */
    animate(): void;
    /**
     * Tells this cache to generate what it needs to. If the cache isn't busted,
     * it will not regenerate
     */
    generate(selection: CustomSelection, ...args: any[]): void;
    /**
     * Sub classes will implement this stub to perform what is necessary to produce
     * a newly updated version of their cache.
     */
    buildCache(selection: CustomSelection, ...args: any[]): void;
    /**
     * Begins executing the animate method every frame
     */
    start(): void;
    /**
     * Ceases the animate method every frame
     */
    stop(): void;
}
