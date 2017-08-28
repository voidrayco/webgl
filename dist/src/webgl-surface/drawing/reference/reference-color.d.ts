import { AtlasColor } from '../texture/atlas-color';
/**
 * This defines a reference to a color that has been rendered to a texture
 * (See AtlasColor). This exposes the only properties that MAY be utilized
 * in a shader to modify the existing values without altering what is rendered
 * on the texture.
 */
export declare class ReferenceColor {
    /**
     * This is the referenced color rendered on the atlas. No editing of the values
     * within the base will create a change to the rendering.
     */
    base: AtlasColor;
    /**
     * Creates an instance of ReferenceColor.
     *
     * @param {AtlasColor} base The color to be based off of
     */
    constructor(base: AtlasColor);
}
