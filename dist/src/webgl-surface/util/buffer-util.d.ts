import { BufferGeometry, Mesh } from 'three';
export declare enum TriangleOrientation {
    CW = 0,
    CCW = 1,
    DEGENERATE = 2,
}
export declare enum AttributeSize {
    ONE = 0,
    TWO = 1,
    THREE = 2,
    FOUR = 3,
}
export interface IAttributeInfo {
    defaults: number[];
    name: string;
    size: AttributeSize;
}
/**
 * These are all of the items needed for rendering and determining if a re-render
 * is necessary
 */
export interface IBufferItems<T, U> {
    attributes: IAttributeInfo[];
    geometry: BufferGeometry;
    system: U;
    currentData: T[];
}
/**
 * This provides methods for handling common buffer tasks such as construction
 * and population.
 */
export declare class BufferUtil {
    /**
     * This places our updateBuffer into a mode where the updates start at index 0 of the
     * buffer. Subsequent calls will start where the previous call left off. This lets
     * you stream in updates to the buffer rather than just update the entire buffer
     * all at once.
     */
    static beginUpdates(): void;
    /**
     * This stops updates streaming into the buffers and makes it where an update
     * will always just start at the beginning of the buffer.
     */
    static endUpdates(): number;
    /**
     * It is often needed to examine a given buffer and see how the triangles are packed in.
     * This is a common debugging need and will speed up debugging significantly.
     *
     * @param {IBufferItems<T, U>} bufferItems This is the buffer whose structure we want
     *                                         to examine.
     */
    static examineBuffer<T, U extends Mesh>(bufferItems: IBufferItems<T, U>, message: string, debugNamespace: string): void;
    /**
     * @static
     * This handles many of the common tasks associated with constructing a new buffer
     * such as applying the name, generating the buffer, and populating default values to
     * that buffer.
     *
     * @param {number} numVertices The number of vertices this buffer will have
     * @param {IAttributeInfo[]} attributes A description of each attribute in the buffer
     *
     * @returns {BufferGeometry} The newly made buffer
     */
    static makeBuffer(numVertices: number, attributes: IAttributeInfo[]): BufferGeometry;
    /**
     * @static
     * This handles many of the common tasks associated with updating a buffer. You specify how many vertices
     * to update in a batch and you specify how many batches are present.
     *
     * Batches are used to represent your full shape object that is being loaded from the cpu:
     *
     * IE- you have a rectangle object you wish to update in your buffer. This takes around 6 vertices typically
     * so you make your vertexBatch 6 and the numBatches the number of quads you need to update in the buffer.
     *
     * You then provide an accessor which aids in pointing to the buffer items that need updating. The accessor has
     * variable arguments depending on the attributes you inject in.
     *
     * If you have attributes like:
     * [
     *  {name: position, size: AttributeSize.Three},
     *  {name: color, size: AttributeSize.Four},
     * ]
     *
     * Then your accessor will be delievered arguments in this form:
     *
     * function(batchIndex: number, positionBuffer: number[], positionIndex: number, colorBuffer: number[], colorIndex: number)
     *
     * NOTE: The params handed in ARE ORDERED BY the attributes injected in
     *
     * You then can update the buffers based on the index information handed alongside each buffer
     *
     * @param {T[]} newData The new data that is going to be injected into the buffer. This must be a NEW REFERENCE of data
     *                      that does NOT match the reference in the bufferItems.currentData. So newData !== bufferItems.currentData
     *                      in order for the update to occur.
     * @param {BufferGeometry} bufferItems The buffer related items used to identify how to update the buffer
     * @param {number} vertexBatch The number of vertices to include per update batch
     * @param {number} numBatches The number of batches to execute
     * @param {Function} updateAccessor The accessor for performing the data update to the buffer
     * @param {boolean} force This bypasses the typical checks that determines if the buffer SHOULD update.
     *
     * @return {boolean} True if the buffer was updated with this call
     */
    static updateBuffer<T, U>(newData: T[], bufferItems: IBufferItems<T, U>, vertexBatch: number, numBatches: number, updateAccessor: Function, force?: boolean): boolean;
    /**
     * This makes all of the typical items used in creating and managing a buffer of items rendered to the screen
     *
     * @returns {IBufferItems<T>} An empty object of the particular buffer items needed
     */
    static makeBufferItems<T, U>(): IBufferItems<T, U>;
}
