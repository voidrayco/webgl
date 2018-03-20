import { Texture } from 'three';
import { AtlasColor } from '../../drawing/texture/atlas-color';
import { PackNode } from '../../util/pack-node';
import { AtlasTexture } from './atlas-texture';
/**
 * Defines a manager of atlas', which includes generating the atlas and producing
 * textures defining those pieces of atlas.
 */
export declare class AtlasManager {
    /** Gives a reference of all of the images loaded for the atlas */
    atlasImages: {
        [key: string]: AtlasTexture[];
    };
    /** Stores the current mapping of the atlas */
    atlasMap: {
        [key: string]: PackNode;
    };
    /** Stores all of the textures that are our atlases */
    atlasTexture: {
        [key: string]: Texture;
    };
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
    constructor(width: number, height: number);
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
    createAtlas(atlasName: string, images: AtlasTexture[], colors?: AtlasColor[]): Promise<Texture>;
    /**
     * Disposes of the resources the atlas held and makes the atlas invalid for use
     *
     * @param atlasName
     */
    destroyAtlas(atlasName: string): void;
    isValidImage(image: AtlasTexture): boolean;
    setDefaultImage(image: AtlasTexture, atlasName: string): AtlasTexture;
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
    draw(image: AtlasTexture, atlasName: string, canvas: CanvasRenderingContext2D): Promise<boolean>;
    /**
     * This renders a list of colors to the canvas. This using the same packing
     * algorithm as any image so the rendering is placed correctly or determines
     * if enough space is not available.
     *
     * @param {AtlasColor[]} colors The list of colors to be rendered to the atlas
     * @param {string} atlasName The name of the atlas being rendered to
     * @param {CanvasRenderingContext2D} canvas The canvas of the atlas being rendered to
     *
     * @returns {Promise<boolean>} Resolves to true if the operation was successful
     */
    drawColors(colors: AtlasColor[], atlasName: string, canvas: CanvasRenderingContext2D): Promise<AtlasTexture>;
    /**
     * Retrieves the threejs texture for the atlas
     *
     * @param atlasName The identifier of the atlas
     */
    getAtlasTexture(atlasName: string): Texture;
    /**
     * HACK: This method is a hack that will execute a loop
     */
    waitForValidCanvasRendering(): Promise<void>;
    /**
     * This reads the input path and loads the image specified by the path
     *
     * @param {AtlasTexture} texture This is an atlas texture with the path set
     *
     * @return {Promise<HTMLImageElement>} A promise to resolve to the loaded image
     *                                     or null if there was an error
     */
    loadImage(texture: AtlasTexture): Promise<HTMLImageElement | null>;
}
