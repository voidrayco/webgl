import { CustomSelection } from './custom-selection';
import { ShapeBufferCache } from './shape-buffer-cache';
export declare type AddMethod<T> = (item: T, buffers: IBufferTracker<T>[]) => IBufferTracker<T>[];
export declare type IDMethod<T> = (item: T) => any;
export declare type InitMethod<T> = (buffers: IBufferTracker<T>[]) => IBufferTracker<T>[];
export declare type UpdateMethod<T> = (item: T, buffer: IBufferTracker<T>, buffers: IBufferTracker<T>[]) => IBufferTracker<T>[];
export declare type RemoveMethod<T> = (item: T, buffer: IBufferTracker<T>, buffers: IBufferTracker<T>[]) => IBufferTracker<T>[];
/**
 * We make a simple buffer tracker type to reduce issues with making item to
 * buffer associations as buffers invalidated are them pointing to a whole new
 * buffer pointer.
 */
export interface IBufferTracker<T> {
    buffer: T[];
    isDirty: boolean;
}
export interface IMethodHooks<T> {
    add?: AddMethod<T>;
    id?: IDMethod<T>;
    init?: InitMethod<T>;
    remove?: RemoveMethod<T>;
    update?: UpdateMethod<T>;
}
export interface IMultiShapeBufferCacheData<T> {
    allBuffers: IBufferTracker<T>[];
    /** This is a quick way to know which item references a buffer so a buffer can be remade */
    itemToBuffer: Map<T, IBufferTracker<T>>;
    /** Maps the item by some form of identifier */
    idToItem: Map<any, T>;
    /** Tracks which selection the store is a part of */
    selection?: CustomSelection;
}
/**
 * This class helps facilitate breaking up a potentially large shape buffer into multiple buffers.
 */
export declare class MultiShapeBufferCache<T> extends ShapeBufferCache<T> {
    /** The number of buffers this multi buffer manages */
    private numBuffers;
    /** UID for storing the data for this buffer in the selection */
    private selectionUID;
    /** The current storage of this multibuffer */
    private store;
    /**
     * The method used to add to the buffers. This is changeable so one can implement geometric or
     * logical adds for invalidation. This returns a list of buffers that will be invalidated from
     * the operation. The first buffer returned in the invalidation is the strongly associated buffer
     * to the item injected. This first buffer is the most likely buffer the item is injected into.
     */
    private addMethod;
    /**
     * Gives an implentor opportunity to define the way an is is specified for a given item. It
     * defaults to searching for an 'id' property on the item.
     */
    private idMethod;
    /**
     * The method that is called right after the initial buffers get constructed. This is changeable
     * so monitors can.
     */
    private initMethod;
    /**
     * The method that is called right before a shape is removed from a buffer.
     * This let's the
     */
    private removeMethod;
    /**
     * The method that is called when an item is updated. This gives a monitor a chance to invalidate
     * a number of buffers.
     */
    private updateMethod;
    /**
     * Makes a new multi shape buffer for minimizing changes
     *
     * @param numBuffers The number of buffers this multibuffer will manage
     */
    constructor(numBuffers: number, methods?: IMethodHooks<T>);
    /**
     * Adds a shape to a buffer and invalidates it
     *
     * @param shape The shape to add to a buffer
     */
    addShape(shape: T): void;
    /**
     * Clears the multi buffer's storage
     */
    destroy(): void;
    /**
     * Empties all of the shapes this buffer manages.
     *
     * @param renew If set to true, this will make a new storage for the buffer
     *              to operate with.
     * @param selected If renew is true, you have to specify a selection to renew the
     *                 storage within.
     */
    clearStorage(renew?: boolean, selection?: CustomSelection): void;
    /**
     * Sees if there is a shape associated with this id
     *
     * @param id
     */
    containsId(id: any): boolean;
    /**
     * Sees if this shape has been added to this buffer or not
     *
     * @param shape
     */
    containsShape(shape: T): boolean;
    /**
     * This flags a list of buffers as dirty
     *
     * @param buffers
     */
    flagBuffersDirty(buffers?: IBufferTracker<T>[]): void;
    /**
     * @override
     * This is called with triggers all of the updates necessary.
     * We add in our buffer update and invalidation to this process here.
     *
     * @param args
     */
    generate(selection: CustomSelection, ...args: any[]): void;
    /**
     * @override
     * This retrieves the multibuffer for this shape buffer
     */
    getBuffer(): T[];
    /**
     * Get all of the buffers.
     * WARNING: do NOT modify the output values in any way.
     *
     * @return {T[][]} All of the buffers
     */
    getBuffers(): T[][];
    /**
     * Returns the number of buffers this MultiShapeBuffer is managing.
     */
    getNumBuffers(): number;
    /**
     * Retrieves a shape by the given id. Is undefined if the id is not recognized.
     *
     * @param id
     */
    getShapeById(id: any): T;
    /**
     * This makes all buffers a part of a new array pointer thus making sure
     * they will be committed to the gpu.
     */
    processDirtyBuffers(): void;
    /**
     * This retrieves the storage inside the selection. If it doesn't exist,
     * then the storage is created.
     *
     * @param selection
     */
    getStorage(selection: CustomSelection): IMultiShapeBufferCacheData<T>;
    /**
     * Removes a shape from the buffer it is a part of.
     *
     * @param shape
     */
    removeShape(shape: T): void;
    /**
     * This is called to indicate an update to an item has occurred.
     *
     * @param shape
     */
    updateShape(shape: T): void;
}
