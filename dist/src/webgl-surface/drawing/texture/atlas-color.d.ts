import { Color } from 'three';
import { IPoint } from '../../primitives/point';
/**
 * Defines a color that is located on an atlas
 */
export declare class AtlasColor {
    color: Color;
    opacity: number;
    pixelWidth: number;
    pixelHeight: number;
    atlasReferenceID: string;
    firstColor: IPoint;
    colorsPerRow: number;
    nextColor: IPoint;
    colorIndex: number;
    /**
     * Generates a color that is rendered to an atlas and can be referenced via texture
     * later by a single value.
     *
     * @param {Color} color The color to be put into the atlas and be referenceable
     * @param {number} opacity The opacity of the color
     */
    constructor(color: Color, opacity: number);
    /**
     * Generates a color that is rendered to an atlas and can be referenced via texture
     * later by a single value.
     *
     * @param {number} r value of 0 to 1 for red channel
     * @param {number} g value of 0 to 1 for green channel
     * @param {number} b value of 0 to 1 for blue channel
     * @param {number} a value of 0 to 1 for alpha channel defaults to 1
     */
    constructor(r: number, g: number, b: number, a?: number);
}
