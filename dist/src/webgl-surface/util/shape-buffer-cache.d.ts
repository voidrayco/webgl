/**
 * This defines an object that helps facilitate parts of or complete shape buffers that
 * need regenerating.
 */
export declare class ShapeBufferCache<T> {
    buffer: T[];
    bustCache: boolean;
    /**
     * Tells this cache to generate what it needs to. If the cache isn't busted,
     * it will not regenerate
     */
    generate(...args: any[]): void;
    /**
     * Sub classes will implement this stub to perform what is necessary to produce
     * a newly updated version of their cache.
     */
    buildCache(...args: any[]): void;
    /**
     * Get the buffer the cache has generated
     */
    getBuffer(): T[];
}
