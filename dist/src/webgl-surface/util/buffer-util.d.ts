/**
 * This class and set of methods is provided to attempt to create as efficient as possible
 * methods for updating large vertex buffers with values. The first portion of the file is
 * a list of methods and registers. This is to prevent any instantiation needed for the methods
 * and registers to exist. Also, the methods have no useable parent scope to ensure nothing like
 * a 'this' is used. These methods utilize the registers and their own simple loops to pound
 * through large amounts of information while providing capabilities to edit vertices in batches.
 *
 * You will also notice there are many many similar methods with just a single extra parameter
 * here and there. This is to prevent ANY calculations on trying to determine a proper parameter set
 * while also making method calls directly without any .call or .apply.
 *
 * The number of update methods is how many differing attributes are supported. If you need more supported
 * attributes add an updateBufferN method and provide the required attributes. Insert the logic in the EXACT
 * pattern seen in the other methods. DO NOT attempt to add additional logic lest the performance be something
 * terrible.
 *
 * The BufferUtil class makes use of these methods and registers. It also provides some very handy methods
 * for working with your large buffers.
 */
import { BufferGeometry, Mesh, Vector4 } from 'three';
import { BaseBuffer } from '../buffers';
import { MultiShapeBufferCache } from './multi-shape-buffer-cache';
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
export declare enum UniformAttributeSize {
    ONE = 0,
    TWO = 1,
    THREE = 2,
    FOUR = 3,
}
/**
 * This specifies some intiialization info regarding vertex attributes.
 */
export interface IAttributeInfo {
    customFill?(buffer: Float32Array, vertex: number, start: number, defaults: number[]): void;
    defaults: number[];
    injectBuffer?: Float32Array;
    name: string;
    size: AttributeSize;
}
/**
 * This specifies some initialization info regarding attributes that are packed
 * into a uniform instance buffer.
 */
export interface IUniformAttribute {
    name: string;
    size: UniformAttributeSize;
    block: number;
}
export interface IUniformBuffer {
    blocksPerInstance: number;
    buffer: Vector4[];
    maxInstances: number;
}
/**
 * These are all of the items needed for rendering and determining if a re-render
 * is necessary
 */
export interface IBufferItems<T, U> {
    attributes: IAttributeInfo[];
    currentData: T[];
    geometry: BufferGeometry;
    system: U;
    uniformAttributes: IUniformAttribute[];
    uniformBuffer: IUniformBuffer;
}
export declare type InitVertexBufferMethod<T, U> = () => BaseBuffer<T, U>;
export declare type UpdateVertexBufferMethod<T, U> = (vertexBuffer: BaseBuffer<T, U>, shapeBuffer: T[]) => boolean;
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
     * This takes the buffer items and cleans up their use within memory as best as possible.
     *
     * @param bufferItems
     */
    static dispose<T, U>(buffers: IBufferItems<T, U>[]): void;
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
     * @param {string} message This is the message for the debug statement. There are two
     *                         predefined %o. The first is the vertex information the second
     *                         is the uniform info. Leave null for a default message.
     * @param {string} debugNamespace The namespace for the debugging info.
     */
    static examineBuffer<T, U extends Mesh>(bufferItems: IBufferItems<T, U>, message: string, debugNamespace: string): void;
    /**
     * Aids in taking in multiple multibuffers and flattening it to a single list
     *
     * @param multiShapeBuffers
     */
    static flattenMultiBuffers<T>(multiShapeBuffers: MultiShapeBufferCache<T>[]): T[];
    /**
     * @static
     * This helps aid in updating a complex multi buffer. It will establish when a new
     * buffer needs to be created and initialized and it will automatically call a BaseBuffer's
     * update when an update is detected as a need for the buffer.
     *
     * @param multiShapeBuffer
     * @param buffers
     * @param init
     *
     * @return {boolean} True if a buffer was updated
     */
    static updateMultiBuffer<T, U>(multiShapeBuffer: MultiShapeBufferCache<T> | MultiShapeBufferCache<T>[], buffers: BaseBuffer<T, U>[], init: InitVertexBufferMethod<T, U>, update: UpdateVertexBufferMethod<T, U>, forceUpdates?: boolean): boolean;
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
     *
     * @param attributes
     * @param sharedBuffer
     */
    static shareBuffer(attributes: IAttributeInfo[], sharedBuffer: BufferGeometry): BufferGeometry;
    /**
     * Generates the necessary metrics based on uniform attributes to generate a uniform buffer for
     * rendering.
     *
     * @param uniforms
     */
    static makeUniformBuffer(uniforms: IUniformAttribute[]): IUniformBuffer;
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
     * This is an alternative way to specify data for rendering. This updates information within the
     * uniform blocks to specify instancing data (the alternative is just updating a vertex buffer
     * with all of the data needed for every piece of geometry for every instance). This update method
     * CAN save massive amounts of committed data for large geometry items (ie curves). It requires a
     * different pipeline to make work (your shader must specify a uniform vec4 instanceData[], and
     * your shape buffer to vertex buffer conversion must have a static vertex buffer).
     *
     * This is like a vertex buffer update except the updateAccessor will be of this format:
     *
     * updateAccessor(instanceIndex: number, uniformBlock0: Vector4, ..., uniformBlockN: Vector4);
     *
     * Where the uniform blocks provided will appear in the same order the IUniformAttributes were in
     * when the uniform buffer was created.
     *
     */
    static updateUniformBuffer<T, U>(newData: T[], bufferItems: IBufferItems<T, U>, instanceBatchSize: number, updateAccessor: Function, force?: boolean): boolean;
    /**
     * This makes all of the typical items used in creating and managing a buffer of items rendered to the screen
     *
     * @returns {IBufferItems<T>} An empty object of the particular buffer items needed
     */
    static makeBufferItems<T, U>(): IBufferItems<T, U>;
}
