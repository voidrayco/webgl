/**
 * A canvas element wrapper that aids in tracking a canvas element along with
 * content scaling properties.
 *
 * @class Sprite
 */
export declare class Sprite {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    scaleX: number;
    scaleY: number;
    /**
     * Retrieves the content scaling of this object
     *
     * @readonly
     *
     * @memberOf Sprite
     */
    getContentScale(): {
        x: number;
        y: number;
    };
    /**
     * Retrieves the size of the content ignoring scaling
     *
     * @readonly
     *
     * @memberOf Sprite
     */
    getContentSize(): {
        height: number;
        width: number;
    };
    /**
     * Retrieves the dimensional width of the content applying scaling
     *
     * @readonly
     *
     * @memberOf Sprite
     */
    getWidth(): number;
    /**
     * Retrieves the dimensional height of the content applying scaling
     *
     * @readonly
     *
     * @memberOf Sprite
     */
    getHeight(): number;
    /**
     * Creates an instance of Sprite.
     *
     * @param w             The width of the context to create
     * @param h             The height of the context to create
     * @param contentScaleX The content scaling of the content
     * @param contentScaleY The content scaling of the content
     *
     * @memberOf Sprite
     */
    constructor(w: number, h: number, contentScaleX: number, contentScaleY: number);
}
