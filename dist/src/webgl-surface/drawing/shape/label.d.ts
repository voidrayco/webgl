import { Bounds } from '../../primitives';
import { IPoint } from '../../primitives/point';
import { RotateableQuad } from '../../primitives/rotateable-quad';
import { ISize } from '../../primitives/size';
import { ReferenceColor } from '../reference/reference-color';
import { AtlasTexture } from '../texture/atlas-texture';
export declare class Label<T> extends RotateableQuad<T> {
    depth: number;
    direction: string;
    font: string;
    fontSize: number;
    fontWeight: number;
    maxWidth: number;
    maxLength: number;
    text: string;
    truncatedText: string;
    id: string;
    textAlign: 'start' | 'center' | 'right';
    textBaseline: 'bottom' | 'alphabetic' | 'middle' | 'top' | 'hanging';
    allowScaling: boolean;
    /**
     * For rasterizing a label, we don't want to have duplicate labels rendered to our atlas
     * so we can base a label off another label. When this happens ONLY certain properties
     * on this label can cause notable changes (such as color and positioning)
     */
    _baseLabel: Label<any>;
    baseLabel: Label<any>;
    /** This contains the texture information that was used to rasterize the label */
    _rasterizedLabel: AtlasTexture;
    /**
     * This getter ensures the rasterized label retrieved is either this labels own rasterization
     * or from a base.
     */
    rasterizedLabel: AtlasTexture;
    /**
     * This contains an adjustment to aid in the rasterization process. Getting
     * reliable dimensions for fonts and text can be incredibly challenging,
     * thus, this allows you to offset the rasterization if you get pieces of
     * the label cut off.
     */
    rasterizationOffset: IPoint;
    /**
     * This contains an adjustment to aid in the rasterization process. Getting
     * reliable dimensions for fonts and text can be incredibly challenging,
     * thus, this allows you to pad the rasterization space if you get pieces of
     * the label cut off.
     */
    rasterizationPadding: ISize;
    color?: ReferenceColor;
    /**
     * Creates an instance of Label.
     *
     * @param {Partial<Label<T>>} [options={}]
     */
    constructor(options?: Partial<Label<T>>);
    /**
     * Copies all of the properties of a label and makes this label use them
     *
     * @param {Label} label The labels whose properties we wish to copy
     */
    copyLabel(label: Label<T>): void;
    /**
     * This gives the bounds of the label that has encapsulated the anchor point.
     * Useful for special cases where the anchor point is not a part of the label
     */
    getBoundsWithAnchor(): Bounds<T>;
    /**
     * This gets the actual text this label is capable of rendering
     */
    getText(): string;
    /**
     * Takes all of the current settings and makes a CSS font string
     */
    makeCSSFont(fontSize?: number): string;
    /**
     * Change the position this text is rendered to
     *
     * @param x X world coordinate
     * @param y Y world coordinate
     */
    position(x: number, y: number): void;
    /**
     * This sets the font size for the label based on the base text dimensions
     *
     * @param {number} fontSize
     */
    setFontSize(fontSize: number): void;
    /**
     * Change the text and the calculated bounding box for this label
     */
    setText(lbl: string): void;
    update(): void;
}
