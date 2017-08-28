import { IPoint } from '../../primitives/point';
import { Label } from '../shape/label';
/**
 * Defines a texture that is located on an atlas
 */
export declare class AtlasTexture {
    imagePath: string;
    label: Label<any>;
    /** Stores the aspect ratio of the image for quick reference */
    aspectRatio: number;
    pixelWidth: number;
    pixelHeight: number;
    atlasReferenceID: string;
    atlasTL: IPoint;
    atlasTR: IPoint;
    atlasBL: IPoint;
    atlasBR: IPoint;
    /**
     * Generates a new atlas texture that points to a specific image resource.
     *
     * @param path The path to the image resource to be loaded into the atlas.
     */
    constructor(path?: string, label?: Label<any>);
}
