import { Mesh } from 'three';
import { ShaderMaterial } from 'three';
import { Label } from '../../drawing/shape/label';
import { AtlasManager } from '../../drawing/texture/atlas-manager';
import { BaseBuffer } from '../base-buffer';
export declare class SimpleStaticLabelBuffer extends BaseBuffer<Label<any>, Mesh> {
    /**
     * @override
     * See interface definition
     */
    init(material: ShaderMaterial, unitCount: number): void;
    /**
     * @override
     * See interface definition
     *
     * @param shapeBuffer
     */
    update(shapeBuffer: Label<any>[], atlasManager?: AtlasManager, startFade?: number, endFade?: number, labelMaxSize?: number): boolean;
}
