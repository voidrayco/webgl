import { BufferGeometry, BufferAttribute } from 'three'
const debug = require('debug')('WebGLSurface:BufferUtil')

export enum AttributeSize {
  ONE,
  TWO,
  THREE,
  FOUR,
}

export interface IAttributeInfo {
  defaults: number[],
  name: string,
  size: AttributeSize,
}

/**
 * These are for fast look ups of the default values provided
 * Doing this fashion avoids array look ups in the defaults values
 */
let defaultsHolder0: number = 0
let defaultsHolder1: number = 0
let defaultsHolder2: number = 0
let defaultsHolder3: number = 0

/**
 * These are for fast look ups of attribute buffers that are going
 * through the update process. We do everything to mitigate array look ups
 * when and where we can
 */
let attrRegister0: number[] = []
let attrRegister1: number[] = []
let attrRegister2: number[] = []
let attrRegister3: number[] = []
let attrRegister4: number[] = []
let attrRegister5: number[] = []

let attrIndex0: number = 0
let attrIndex1: number = 0
let attrIndex2: number = 0
let attrIndex3: number = 0
let attrIndex4: number = 0
let attrIndex5: number = 0

let attrIndexIncr0: number = 0
let attrIndexIncr1: number = 0
let attrIndexIncr2: number = 0
let attrIndexIncr3: number = 0
let attrIndexIncr4: number = 0
let attrIndexIncr5: number = 0

/**
 * This takes our list of attribute buffers and applies them to the registers for rapid lookups
 *
 * @param {number[][]} attributeBuffers The buffers for each attribute to be updated
 * @param {number[]} incrementValues How much each batch increments it's lookup index
 */
function applyAttributeRegisters(attributeBuffers: number[][], incrementValues: number[]) {
  attrRegister0 = attributeBuffers[0]
  attrRegister1 = attributeBuffers[1]
  attrRegister2 = attributeBuffers[2]
  attrRegister3 = attributeBuffers[3]
  attrRegister4 = attributeBuffers[4]
  attrRegister5 = attributeBuffers[5]

  attrIndexIncr0 = incrementValues[0]
  attrIndexIncr1 = incrementValues[1]
  attrIndexIncr2 = incrementValues[2]
  attrIndexIncr3 = incrementValues[3]
  attrIndexIncr4 = incrementValues[4]
  attrIndexIncr5 = incrementValues[5]
}

/**
 * The following methods are targetted at executing the update accessor with varying number
 * of parameters while mitigating array look ups.
 *
 * @param {number} numBatches The number of batches to execute
 * @param {Function} updateAccessor The accessor function that will update the buffer values
 */
function updateBuffer1(numBatches: number, updateAccessor: Function) {
  for (let i = 0; i < numBatches; ++i) {
    attrIndex0 = i * attrIndexIncr0
    updateAccessor(i, attrRegister0, attrIndex0)
  }
}

function updateBuffer2(numBatches: number, updateAccessor: Function) {
  for (let i = 0; i < numBatches; ++i) {
    attrIndex0 = i * attrIndexIncr0
    attrIndex1 = i * attrIndexIncr1
    updateAccessor(i, attrRegister0, attrIndex0, attrRegister1, attrIndex1)
  }
}

function updateBuffer3(numBatches: number, updateAccessor: Function) {
  for (let i = 0; i < numBatches; ++i) {
    attrIndex0 = i * attrIndexIncr0
    attrIndex1 = i * attrIndexIncr1
    attrIndex2 = i * attrIndexIncr2
    updateAccessor(i, attrRegister0, attrIndex0, attrRegister1, attrIndex1, attrRegister2, attrIndex2)
  }
}

function updateBuffer4(numBatches: number, updateAccessor: Function) {
  for (let i = 0; i < numBatches; ++i) {
    attrIndex0 = i * attrIndexIncr0
    attrIndex1 = i * attrIndexIncr1
    attrIndex2 = i * attrIndexIncr2
    attrIndex3 = i * attrIndexIncr3
    updateAccessor(i, attrRegister0, attrIndex0, attrRegister1, attrIndex1, attrRegister2, attrIndex2, attrRegister3, attrIndex3)
  }
}

function updateBuffer5(numBatches: number, updateAccessor: Function) {
  for (let i = 0; i < numBatches; ++i) {
    attrIndex0 = i * attrIndexIncr0
    attrIndex1 = i * attrIndexIncr1
    attrIndex2 = i * attrIndexIncr2
    attrIndex3 = i * attrIndexIncr3
    attrIndex4 = i * attrIndexIncr4
    updateAccessor(i, attrRegister0, attrIndex0, attrRegister1, attrIndex1, attrRegister2, attrIndex2, attrRegister3, attrIndex3, attrRegister4, attrIndex4)
  }
}

function updateBuffer6(numBatches: number, updateAccessor: Function) {
  for (let i = 0; i < numBatches; ++i) {
    attrIndex0 = i * attrIndexIncr0
    attrIndex1 = i * attrIndexIncr1
    attrIndex2 = i * attrIndexIncr2
    attrIndex3 = i * attrIndexIncr3
    attrIndex4 = i * attrIndexIncr4
    attrIndex5 = i * attrIndexIncr5
    updateAccessor(i, attrRegister0, attrIndex0, attrRegister1, attrIndex1, attrRegister2, attrIndex2, attrRegister3, attrIndex3, attrRegister4, attrIndex4, attrRegister5, attrIndex5)
  }
}

/**
 * This takes the defaults array provided and loads them into our default
 * lookup values
 *
 * @param {number[]} defaults The array with the default values in them for our buffer attribute
 */
function applyDefaultsHolders(defaults: number[]) {
  defaultsHolder0 = defaults[0] || 0
  defaultsHolder1 = defaults[1] || 0
  defaultsHolder2 = defaults[2] || 0
  defaultsHolder3 = defaults[3] || 0
}

/**
 * The following methods are rapid ways of populating the buffer without
 * setting up a generic loop. This saves on performance by not creating a loop
 * nor allocating the variables necessary for the generic loop.
 *
 * @param {Float32Array} buffer The buffer to populate
 * @param {number} start The index the data should be populated into
 */
function fillSize1(buffer: Float32Array, start: number) {
  buffer[start] = defaultsHolder0
}

function fillSize2(buffer: Float32Array, start: number) {
  buffer[start] = defaultsHolder0
  buffer[++start] = defaultsHolder1
}

function fillSize3(buffer: Float32Array, start: number) {
  buffer[start] = defaultsHolder0
  buffer[++start] = defaultsHolder1
  buffer[++start] = defaultsHolder2
}

function fillSize4(buffer: Float32Array, start: number) {
  buffer[start] = defaultsHolder0
  buffer[++start] = defaultsHolder1
  buffer[++start] = defaultsHolder2
  buffer[++start] = defaultsHolder3
}

/**
 * This is a quick lookup to find the correct filler method for the given attribute size
 */
const fillMethodLookUp = {
  [AttributeSize.ONE]: fillSize1,
  [AttributeSize.TWO]: fillSize2,
  [AttributeSize.THREE]: fillSize3,
  [AttributeSize.FOUR]: fillSize4,
}

const updateBufferLookUp: {[key: number]: (numBatches: number, updateAccessor: Function) => void} = {
  1: updateBuffer1,
  2: updateBuffer2,
  3: updateBuffer3,
  4: updateBuffer4,
  5: updateBuffer5,
  6: updateBuffer6,
}

/**
 * This provides methods for handling common buffer tasks such as construction
 * and population.
 */
export class BufferUtil {
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
  static makeBuffer(numVertices: number, attributes: IAttributeInfo[]): BufferGeometry {
    const iMax = attributes.length
    const geometry = new BufferGeometry()

    for (let i = 0; i < iMax; ++i) {
      const attribute = attributes[i]
      const attributeSize = attribute.size + 1
      const buffer = new Float32Array(attributeSize * numVertices)
      const fillMethod = fillMethodLookUp[attribute.size]
      const name = attribute.name

      // We set up our default value registers before executing the fill method
      applyDefaultsHolders(attribute.defaults)

      // Fill our buffer with the indicated default values
      for (let k = 0; k < numVertices; ++k) {
        fillMethod(buffer, k * attributeSize)
      }

      // Apply the buffer to our geometry buffer
      geometry.addAttribute(name, new BufferAttribute(buffer, attributeSize))
      debug('Made Buffer Attribute:', name, attributeSize)
    }

    return geometry
  }

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
   * @param {BufferGeometry} buffer The buffer object to be updated
   * @param {IAttributeInfo[]} attributes The attributes describing this buffer
   * @param {number} vertexBatch The number of vertices to include per update batch
   * @param {number} numBatches The number of batches to execute
   * @param {Function} updateAccessor The accessor for performing the data update to the buffer
   */
  static updateBuffer(buffer: BufferGeometry, attributes: IAttributeInfo[], vertexBatch: number, numBatches: number, updateAccessor: Function) {
    const bufferAttributes: any[] = attributes.map((attr: IAttributeInfo) => (buffer.attributes as any)[attr.name])
    const attributeBuffers: number[][] = bufferAttributes.map((attr: any) => attr.array as number[])
    const incrementValues: number[] = attributes.map((attr: IAttributeInfo) => (attr.size + 1) * vertexBatch)
    applyAttributeRegisters(attributeBuffers, incrementValues)
    const updateMethod = updateBufferLookUp[attributes.length]
    updateMethod(numBatches, updateAccessor)
    bufferAttributes.forEach(attr => attr.needsUpdate = true)
  }
}
