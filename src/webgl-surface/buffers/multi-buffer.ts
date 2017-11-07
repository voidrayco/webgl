import { BaseBuffer } from './base-buffer';

export type BufferInitMethod<T> = (buffer: T) => void;
export type BufferUpdateMethod<T, U> = (buffer: T, shapeBuffer: U[]) => void;
export type BufferItemIdentifier<T> = (item: T) => any;

export interface IMultiBufferOptions<T, U> {
  /** This is the type of buffer the multibuffer manages */
  bufferType: T;
  /** This is the number of buffers the multibuffer creates */
  bufferCount: number;
  /**
   * This is when the multi buffer wants to intialize a buffer. You are
   * required to execute buffer.init() within this method.
   */
  bufferInitilizer: BufferInitMethod<T>;
  /**
   * This callback is used to uniquely identify an item so the system can determine
   * which buffers to update.
   */
  identifier: BufferItemIdentifier<U>;
  /**
   * This is when the multi buffer desires the buffer be updated. You are required
   * to execute the buffer.update(shapeBuffer, ...args) method within this callback.
   */
  bufferUpdater: BufferUpdateMethod<T, U>;
}

/**
 * This class is used to facilitate managing a single material stream of
 * shapes buffering into multiple output buffers, this creates a performance
 * hit in that it causes more draw calls, but sees significant performance
 * gains by reducing the amount of data committed for a group of changes
 *
 * @type T This is the buffer type this multibuffer will manage
 */
export class MultiBuffer<U, T extends BaseBuffer<U, any>> {
  /** This is the type of the buffer managed by this buffer */
  BufferType: any;
  /** Stores all of the buffers that we split elements against */
  buffers: T[] = [];
  /**
   * This is a lookup to identify which item is associated with a buffer.
   * The identifier for the item is specified by the identityFn.
   */
  itemToBuffer = new Map<any, T>();
  /** This is a lookup to find all of the items associated with a given buffer */
  bufferToItems = new Map<T, U[]>();
  /** This is a lookup to find if a buffer needs update or not */
  needsUpdate = new Map<T, boolean>();
  /** This is the applied method that allows one to perform buffer initialization */
  initFn: BufferInitMethod<T>;
  /** This is the applied method that allows one to perform buffer updates */
  updateFn: BufferUpdateMethod<T, U>;
  /**
   * This is an accessor or generator of a unique key for the item. This can
   * return any type of object or primitive.
   */
  identityFn: BufferItemIdentifier<U>;

  constructor(options?: IMultiBufferOptions<T, U>) {
    this.BufferType = options.bufferType;
    this.initFn = options.bufferInitilizer;
    this.updateFn = options.bufferUpdater;
    this.setNumberOfBuffers(options.bufferCount);
  }

  /**
   * THis sets how many buffers the multibuffer will manage
   * @param count
   */
  setNumberOfBuffers(count: number) {
    while (this.buffers.length < count) {
      const index = this.buffers.push(new this.BufferType());
      const buffer = this.buffers[index];
      this.bufferToItems.set(buffer, []);
      this.initFn(buffer);
    }

    if (this.buffers.length > count) {
      console.error('It is not implemented to shrink a multibuffer seamlessly.');
    }
  }

  /**
   * Adds an item to a buffer. Defaults to seeking a buffer with the least number
   * of items. If the item already exists, this will instead default to simply
   * updating the item and it's buffer.
   *
   * @param {U} item The item to add to one of the buffers
   */
  addItem(item: U) {
    const itemId = this.identityFn(item);
    const buffer = this.itemToBuffer.get(itemId);

    // If the item key already exists, we have an error, sort of
    if (buffer) {
      this.needsUpdate.set(buffer, true);
      console.warn('Attempted to add an item that already exists. Will update instead. Item ID:', itemId);
    }

    // Otherwise, we can legitimately add the item to a buffer. We seek out the first buffer that
    // Has less items than the rest of the buffers
    else {
      let length = 0;
      let pickedBuffer;

      for (const [buffer, items] of this.bufferToItems.entries()) {
        // If the items are less than the previous item's length
        // then we should add to this buffer
        if (items.length < length) {
          items.push(item);
          this.itemToBuffer.set(item, buffer);
          break;
        }

        length = items.length;
      };
    }
  }

  /**
   * This removes an item from the list of
   * @param item
   */
  removeItem(item: U) {
    const itemId = this.identityFn(item);
    const buffer = this.itemToBuffer.get(itemId);
  }

  updateItem(item: U) {
    const itemId = this.identityFn(item);
    const buffer = this.itemToBuffer.get(itemId);

    if (buffer) {
      this.needsUpdate.set(buffer, true);
    }
  }

  /**
   * This checks for any updates requested to any buffer and tells the buffer to
   * update then clears any update flags.
   */
  update() {
    this.needsUpdate.forEach((needsUpdate: boolean, buffer: T) => {
      this.updateFn(buffer, this.bufferToItems.get(buffer));
    });

    this.needsUpdate.clear();
  }
}
