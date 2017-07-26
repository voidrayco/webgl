import { rgb } from 'd3-color';
import { Texture } from 'three';
import { Bounds } from '../../primitives/bounds';
import { IPoint } from '../../primitives/point';
import { ImageDimensions, PackNode } from '../../util/pack-node';
import { AtlasTexture } from './atlas-texture';

const debug = require('debug')('webgl-surface:Atlas');
const debugLabels = require('debug')('webgl-surface:Labels');

/**
 * Defines a manager of atlas', which includes generating the atlas and producing
 * textures defining those pieces of atlas.
 */
export class AtlasManager {
  /** Gives a reference of all of the images loaded for the atlas */
  atlasImages: {[key: string]: AtlasTexture[]} = {};
  /** Stores the current mapping of the atlas */
  atlasMap: {[key: string]: PackNode} = {};
  /** Stores all of the textures that are our atlases */
  atlasTexture: {[key: string]: Texture} = {};
  /** Stores Atlas textures dimensions. Every new atlas created will use this as it's width */
  textureWidth: number;
  /** Stores Atlas textures dimensions. Every new atlas created will use this as it's height */
  textureHeight: number;

  /**
   * Generates a new manager for atlas'. This will create and destroy atlas' and
   * ensure they have the correct settings applied. A manager will also aid in
   * packing images into the atlas indicated.
   *
   * @param {number} width The width of all atlas' generated
   * @param {number} height The height of all atlas' generated
   */
  constructor(width: number, height: number) {
    this.textureWidth = width;
    this.textureHeight = height;
  }

  /**
   * Atlas' must be created from scratch to update them. In order to properly
   * update an existing one, you must destroy it then recreate it again.
   * This is from not knowing how to update a texture via three js.
   *
   * @param atlasName The unique name of the atlas so it can be retrieved/referenced easily
   * @param images The images with their image path set to be loaded into the atlas.
   *               Images that keep an atlas ID of null indicates the image did not load
   *               correctly
   *
   * @return {Texture} The Threejs texture that is created as our atlas. The images injected
   *                   into the texture will be populated with the atlas'
   */
  async createAtlas(atlasName: string, images: AtlasTexture[]) {
    // Create a new mapping to track the packing within the texture
    const atlasMap: PackNode = new PackNode(0, 0, this.textureWidth, this.textureHeight);
    // Create the mapping element for the new atlas so we can track insertions / deletions
    this.atlasMap[atlasName] = atlasMap;

    // Generate a canvas to render our images into so we can convert it over to
    // A three-js texture
    const canvas = document.createElement('canvas').getContext('2d');

    // Size the canvas to the atlas size
    canvas.canvas.width = this.textureWidth;
    canvas.canvas.height = this.textureHeight;

    // Now we load, pack in, and draw each requested image
    for (const image of images) {
      await this.draw(image, atlasName, canvas);
    }

    // After loading we can transform the canvas to a glorious three texture to
    // Be utilized
    const texture = new Texture(canvas.canvas);

    texture.premultiplyAlpha = true;
    texture.generateMipmaps = true;

    // Store the texture as the atlas.
    this.atlasTexture[atlasName] = texture;
    // Store the images as images within the atlas
    this.atlasImages[atlasName] = [].concat(images);

    debug('Atlas Created-> texture: %o mapping: %o images: %o', texture, atlasMap, images);

    return texture;
  }

  /**
   * Disposes of the resources the atlas held and makes the atlas invalid for use
   *
   * @param atlasName
   */
  destroyAtlas(atlasName: string) {
    if (this.atlasTexture[atlasName]) {
      this.atlasTexture[atlasName].dispose();
      this.atlasTexture[atlasName] = null;
    }

    if (this.atlasMap[atlasName]) {
      this.atlasMap[atlasName].destroy();
      this.atlasMap[atlasName] = null;
    }

    if (this.atlasImages[atlasName]) {
      const none: IPoint = {x: 0, y: 0};
      this.atlasImages[atlasName].forEach(image => {
        image.atlasReferenceID = null;
        image.pixelWidth = 0;
        image.pixelHeight = 0;
        image.atlasBL = none;
        image.atlasBR = none;
        image.atlasTL = none;
        image.atlasTR = none;
      });
      this.atlasImages[atlasName] = null;
    }
  }

  /**
   * This loads, packs, and draws the indicated image into the specified canvas
   * using the metrics that exists for the specified atlas.
   *
   * @param image The image who should have it's image path loaded
   * @param atlasName The name of the atlas to make the packing work
   * @param canvas The canvas we will be drawing into to generate the complete image
   *
   * @return {Promise<boolean>} Promise that resolves to if the image successfully was drawn or not
   */
  async draw(image: AtlasTexture, atlasName: string, canvas: CanvasRenderingContext2D): Promise<boolean> {
    // Validate the index
    if (!this.atlasMap[atlasName]) {
      debug('Can not load image, invalid Atlas Name: %o for atlasMaps: %o', atlasName, this.atlasMap);
      return false;
    }

    // First we must load the image
    // Make a buffer to hold our new image
    // Load the image into memory, default to keeping the alpha channel
    const loadedImage: HTMLImageElement = await this.loadImage(image);
    // Make sure at this point the image knows it is not affiliated with an atlas
    // If something goes wrong with loading or insertting this image, then a null
    // Atlas value will indicate the image can not be used appropriately
    image.atlasReferenceID = null;

    // Only a non-null image means the image loaded correctly
    if (loadedImage) {
      debug('Image loaded: %o', image.imagePath);
      // Now we create a Rectangle to store the image dimensions
      const rect: Bounds<never> = new Bounds<never>(0, image.pixelWidth, 0, image.pixelHeight);
      // Create ImageDimension to insert into our atlas mapper
      const dimensions: ImageDimensions = {
        first: image,
        second: rect,
      };

      // Auto add a buffer in
      dimensions.second.width += 1;
      dimensions.second.height += 1;
      // Get the atlas map node
      const node: PackNode = this.atlasMap[atlasName];
      // Store the node resulting from the insert operation
      const insertedNode: PackNode = node.insert(dimensions);

      // If the result was NULL we did not successfully insert the image into any map
      if (insertedNode) {
        debug('Atlas location determined: %o', insertedNode);

        if (image.label) {
          debugLabels('Atlas location determined. PackNode: %o Dimensions: %o', insertedNode, dimensions);
        }

        // Apply the image to the node
        insertedNode.nodeImage = image;

        // Set our image's atlas properties
        const ux = insertedNode.nodeDimensions.x / this.textureWidth;
        const uy = insertedNode.nodeDimensions.y / this.textureHeight;
        const uw = insertedNode.nodeDimensions.width / this.textureWidth;
        const uh = insertedNode.nodeDimensions.height / this.textureHeight;
        const atlasDimensions: Bounds<never> = new Bounds<never>(
          ux,
          ux + uw,
          1.0 - (uy + uh),
          1.0 - uy,
        );

        image.atlasReferenceID = atlasName;
        image.atlasTL = {x: atlasDimensions.x, y: atlasDimensions.y};
        image.atlasTR = {x: atlasDimensions.x + atlasDimensions.width, y: atlasDimensions.y};
        image.atlasBL = {x: atlasDimensions.x, y: atlasDimensions.y + atlasDimensions.height};
        image.atlasBR = {x: atlasDimensions.x + atlasDimensions.width, y: atlasDimensions.y + atlasDimensions.height};

        // Now draw the image to the indicated canvas
        canvas.drawImage(loadedImage, insertedNode.nodeDimensions.x, insertedNode.nodeDimensions.y);

        // We have finished inserting
        return true;
      }

      else {
        // Log an error
        throw new Error(`Could not fit image into atlas ${image.imagePath}`);
      }
    }

    else {
      // Log an error
      throw new Error(`Could not load image ${image.imagePath}`);
    }
  }

  /**
   * Retrieves the threejs texture for the atlas
   *
   * @param atlasName The identifier of the atlas
   */
  getAtlasTexture(atlasName: string) {
    return this.atlasTexture[atlasName];
  }

  /**
   * This reads the input path and loads the image specified by the path
   *
   * @param {AtlasTexture} texture This is an atlas texture with the path set
   *
   * @return {Promise<HTMLImageElement>} A promise to resolve to the loaded image
   *                                     or null if there was an error
   */
  loadImage(texture: AtlasTexture): Promise<HTMLImageElement | null> {
    if (texture.imagePath) {
      return new Promise((resolve, reject) => {
        const image: HTMLImageElement = new Image();

        image.onload = function() {
          texture.pixelWidth = image.width;
          texture.pixelHeight = image.height;
          texture.aspectRatio = image.width / image.height;
          resolve(image);
        };

        image.onerror = function() {
          resolve(null);
        };

        image.src = texture.imagePath;
      });
    }

    else if (texture.label) {
      return new Promise((resolve, reject) => {
        const label = texture.label;
        const labelSize = label.getSize();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set the dimensions of the canvas/texture space we will be using to rasterize
        // The label. Use the label's rasterization controls to aid in rendering the label
        canvas.width = labelSize.width + texture.label.rasterizationPadding.width;
        canvas.height = labelSize.height + texture.label.rasterizationPadding.height;

        if (ctx) {
          const fontSize = label.fontSize;

          const color = rgb(
            label.color.r * 255,
            label.color.g * 255,
            label.color.b * 255,
            label.color.opacity,
          );

          ctx.font = label.makeCSSFont(fontSize);
          ctx.textAlign = label.textAlign;
          ctx.textBaseline = label.textBaseline;
          ctx.fillStyle = color.toString();

          // Render the label to the canvas/texture space. This utilizes the label's
          // Rasterization metrics to aid in getting a clean render.
          ctx.fillText(
            label.text,
            texture.label.rasterizationOffset.x,
            texture.label.height / 2 + texture.label.rasterizationOffset.y,
          );

          const image: HTMLImageElement = new Image();

          image.onload = function() {
            // Here we use the canvas dimensions and NOT the image dimensions
            // As the image dimensions are unreliable here when setting the src
            // To a data url
            texture.pixelWidth = image.width;
            texture.pixelHeight = image.height;
            texture.aspectRatio = image.width / image.height;

            debugLabels('Applying size based on rasterization to the Label: w: %o h: %o', image.width, image.height);

            label.setSize({
              height: image.height,
              width: image.width,
            });

            resolve(image);
          };

          image.onerror = function() {
            resolve(null);
          };

          image.src = canvas.toDataURL('image/png');
        }
      });
    }

    return Promise.resolve(null);
  }
}
