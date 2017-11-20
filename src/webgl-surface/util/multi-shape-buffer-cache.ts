import { CustomSelection } from './custom-selection';
import { ShapeBufferCache } from './shape-buffer-cache';

export type AddMethod<T> = (item: T, buffers: IBufferTracker<T>[]) => IBufferTracker<T>[];
export type IDMethod<T> = (item: T) => any;
export type InitMethod<T> = (buffers: IBufferTracker<T>[]) => IBufferTracker<T>[];
export type UpdateMethod<T> = (item: T, buffer: IBufferTracker<T>, buffers: IBufferTracker<T>[]) => IBufferTracker<T>[];
export type RemoveMethod<T> = (item: T, buffer: IBufferTracker<T>, buffers: IBufferTracker<T>[]) => IBufferTracker<T>[];

/** This is a part of the identifier that is used to retrieve a multibuffer's storage */
const multiBufferSelectionPrefix = '__mb__';
/** This is to ensure each multibuffer gets it's own unique selection identifier */
let multiBufferSelectionKeyUID = 0;

/**
 * We make a simple buffer tracker type to reduce issues with making item to
 * buffer associations as buffers invalidated are them pointing to a whole new
 * buffer pointer.
 */
export interface IBufferTracker<T> {
  buffer: T[],
  isDirty: boolean,
}

export interface IMethodHooks<T> {
  add?: AddMethod<T>;
  id?: IDMethod<T>;
  init?: InitMethod<T>;
  remove?: RemoveMethod<T>;
  update?: UpdateMethod<T>;
}

export interface IMultiShapeBufferCacheData<T> {
  // This contains all of the buffers this multibuffer will manage
  allBuffers: IBufferTracker<T>[];
  /** This is a quick way to know which item references a buffer so a buffer can be remade */
  itemToBuffer: Map<T, IBufferTracker<T>>;
  /** Maps the item by some form of identifier */
  idToItem: Map<any, T>;
  /** Tracks which selection the store is a part of */
  selection?: CustomSelection;
}

function getIDProp<T>(item: T) {
  return (item as any).id;
}

function evenRoundRobinBufferAdd<T>(item: T, buffers: IBufferTracker<T>[]): IBufferTracker<T>[] {
  const smallest = buffers[0].buffer.length;
  let found: IBufferTracker<T> = buffers[0];

  // Look for the next buffer that has the smallest length
  // To fill it up
  buffers.some(tracker => {
    if (tracker.buffer.length < smallest) {
      found = tracker;
      return true;
    }

    return false;
  });

  found.buffer.push(item);

  return [found];
}

function noop(...args: any[]): any {
  // NO-OP
}

function echoBuffer<T>(item: T, buffer: IBufferTracker<T>, buffers: IBufferTracker<T>[]): IBufferTracker<T>[] {
  return [buffer];
}

/**
 * This class helps facilitate breaking up a potentially large shape buffer into multiple buffers.
 */
export class MultiShapeBufferCache<T> extends ShapeBufferCache<T> {
  /** The number of buffers this multi buffer manages */
  private numBuffers: number = 0;
  /** UID for storing the data for this buffer in the selection */
  private selectionUID: string = multiBufferSelectionPrefix + (++multiBufferSelectionKeyUID);
  /** The current storage of this multibuffer */
  private store: IMultiShapeBufferCacheData<T>;

  /**
   * The method used to add to the buffers. This is changeable so one can implement geometric or
   * logical adds for invalidation. This returns a list of buffers that will be invalidated from
   * the operation. The first buffer returned in the invalidation is the strongly associated buffer
   * to the item injected. This first buffer is the most likely buffer the item is injected into.
   */
  private addMethod: AddMethod<T> = evenRoundRobinBufferAdd;

  /**
   * Gives an implentor opportunity to define the way an is is specified for a given item. It
   * defaults to searching for an 'id' property on the item.
   */
  private idMethod: IDMethod<T> = getIDProp;

  /**
   * The method that is called right after the initial buffers get constructed. This is changeable
   * so monitors can.
   */
  private initMethod: InitMethod<T> = noop;

  /**
   * The method that is called right before a shape is removed from a buffer.
   * This let's the
   */
  private removeMethod: RemoveMethod<T> = echoBuffer;

  /**
   * The method that is called when an item is updated. This gives a monitor a chance to invalidate
   * a number of buffers.
   */
  private updateMethod: UpdateMethod<T> = echoBuffer;

  /**
   * Makes a new multi shape buffer for minimizing changes
   *
   * @param numBuffers The number of buffers this multibuffer will manage
   */
  constructor(numBuffers: number, methods?: IMethodHooks<T>) {
    super();

    // Store the number of buffers that are created when the buffers are initialized
    this.numBuffers = numBuffers;

    // Set the hook methods if any are specified
    if (methods) {
      this.addMethod = methods.add || this.addMethod;
      this.idMethod = methods.id || this.idMethod;
      this.initMethod = methods.init || this.initMethod;
      this.removeMethod = methods.remove || this.removeMethod;
      this.updateMethod = methods.update || this.updateMethod;
    }
  }

  /**
   * Adds a shape to a buffer and invalidates it
   *
   * @param shape The shape to add to a buffer
   */
  addShape(shape: T) {
    // Perform the custom add opearation
    const buffers = this.addMethod(shape, this.store.allBuffers);
    // Stores the shape for lookup via id
    this.store.idToItem.set(this.idMethod(shape), shape);
    // Stores the shape for lookup to buffer. We count the
    // First dirty buffer as the buffer the item is the closest to
    // Association.
    this.store.itemToBuffer.set(shape, buffers[0]);
    // Flag all of the touched buffers as dirty
    this.flagBuffersDirty(buffers);
  }

  /**
   * Clears the multi buffer's storage
   */
  destroy() {
    if (this.store) {
      this.store.selection.clearSelection(this.selectionUID);
      this.store = null;
    }
  }

  /**
   * Sees if there is a shape associated with this id
   *
   * @param id
   */
  containsId(id: any): boolean {
    return Boolean(this.store.idToItem.get(id));
  }

  /**
   * Sees if this shape has been added to this buffer or not
   *
   * @param shape
   */
  containsShape(shape: T): boolean {
    // Check if this multibuffer has the shape or no
    return Boolean(this.store.itemToBuffer.get(shape));
  }

  /**
   * This flags a list of buffers as dirty
   *
   * @param buffers
   */
  flagBuffersDirty(buffers?: IBufferTracker<T>[]) {
    // Flag provided buffers as dirty
    if (buffers) {
      // This flags the indicated buffers as dirty
      buffers.forEach(buffer => buffer.isDirty = true);
    }

    // No buffers provided, flag all dirty
    else {
      this.store.allBuffers.forEach(buffer => buffer.isDirty = true);
    }
  }

  /**
   * @override
   * This is called with triggers all of the updates necessary.
   * We add in our buffer update and invalidation to this process here.
   *
   * @param args
   */
  generate(selection: CustomSelection, ...args: any[]) {
    // Make sure the storage is established before trying to create modifications of any sort
    this.getStorage(selection);
    // Run the generation which will trigger cache building and modding
    super.generate.apply(this, arguments);
    // We now invalidate any buffers that have been flagged
    this.processDirtyBuffers();
  }

  /**
   * @override
   * This retrieves the multibuffer for this shape buffer
   */
  getBuffer(): T[] {
    console.warn('A multishape buffer should have getBuffers called instead');
    return [];
  }

  /**
   * Get all of the buffers.
   * WARNING: do NOT modify the output values in any way.
   *
   * @return {T[][]} All of the buffers
   */
  getBuffers() {
    if (this.store) {
      return this.store.allBuffers.map(tracker => tracker.buffer);
    }

    return [];
  }

  /**
   * Returns the number of buffers this MultiShapeBuffer is managing.
   */
  getNumBuffers(): number {
    return this.store.allBuffers.length;
  }

  /**
   * Retrieves a shape by the given id. Is undefined if the id is not recognized.
   *
   * @param id
   */
  getShapeById(id: any) {
    return this.store.idToItem.get(id);
  }

  /**
   * This makes all buffers a part of a new array pointer thus making sure
   * they will be committed to the gpu.
   */
  processDirtyBuffers() {
    this.store.allBuffers.forEach((tracker: IBufferTracker<T>) => {
      if (tracker.isDirty) {
        tracker.isDirty = false;
        tracker.buffer = [].concat(tracker.buffer);
      }
    });
  }

  /**
   * This retrieves the storage inside the selection. If it doesn't exist,
   * then the storage is created.
   *
   * @param selection
   */
  getStorage(selection: CustomSelection) {
    // Get the storage from the selection
    let storage: IMultiShapeBufferCacheData<T> = (selection.getSelection<IMultiShapeBufferCacheData<T>>(this.selectionUID) || [])[0];

    // If the storage is not stored in the selection, then we create a storage and update the selection with that storage
    if (!storage) {
      storage = {
        allBuffers: [],
        idToItem: new Map<any, T>(),
        itemToBuffer: new Map<T, IBufferTracker<T>>(),
        selection,
      };

      // Generate the buffers indicated
      for (let i = 0; i < this.numBuffers; ++i) {
        storage.allBuffers.push({
          buffer: [],
          isDirty: false,
        });
      }

      // Initialize anything that may be monitoring the buffers
      this.initMethod(storage.allBuffers);
      // Add the storage to the selection
      selection.select(this.selectionUID, storage);
    }

    // Make sure our internal pointer to the storage is set correctly
    return (this.store = storage);
  }

  /**
   * Removes a shape from the buffer it is a part of.
   *
   * @param shape
   */
  removeShape(shape: T) {
    // This is the buffer associated with the shape
    const buffer = this.store.itemToBuffer.get(shape);
    // Get the buffers invalidated by the remove
    const buffers = this.removeMethod(shape, buffer, this.store.allBuffers);
    // Clear the shape out from the buffer
    buffer.buffer.splice(buffer.buffer.indexOf(shape), 1);
    // Delete the item from the id lookup
    this.store.idToItem.delete(this.idMethod(shape));
    // Flag all of the touched buffers as dirty
    this.flagBuffersDirty(buffers);
  }

  /**
   * This is called to indicate an update to an item has occurred.
   *
   * @param shape
   */
  updateShape(shape: T) {
    // Flag each element that needs updating
    const buffers = this.updateMethod(shape, this.store.itemToBuffer.get(shape), this.store.allBuffers);
    // Flag all of the touched buffers as dirty
    this.flagBuffersDirty(buffers);
  }
}
