import { Mesh } from 'three';
import { ShaderMaterial } from 'three';
import { AtlasManager } from '../../drawing';
import { LineShape } from '../../drawing/shape/line-shape';
import { BaseBuffer } from '../base-buffer';
export declare class SimpleStaticStraightLineBuffer extends BaseBuffer<LineShape<any> | LineShape<any>[], Mesh> {
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
    update(shapeBuffer: LineShape<any>[] | LineShape<any>[][], atlasManager?: AtlasManager): boolean;
}
