import { Mesh } from 'three';
import { OrthographicCamera, ShaderMaterial } from 'three';
import { CircleShape } from '../../drawing';
import { AtlasManager } from '../../drawing/texture/atlas-manager';
import { BaseBuffer } from '../base-buffer';
export declare class SimpleStaticCircleBuffer extends BaseBuffer<CircleShape<any> | CircleShape<any>[], Mesh> {
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
    update(shapeBuffer: CircleShape<any>[] | CircleShape<any>[][], atlasManager?: AtlasManager, camera?: OrthographicCamera): boolean;
}
