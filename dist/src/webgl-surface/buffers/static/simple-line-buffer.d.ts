import { Mesh } from 'three';
import { ShaderMaterial } from 'three';
import { CurvedLineShape } from '../../drawing/shape/curved-line-shape';
import { BaseBuffer } from '../base-buffer';
export declare class SimpleStaticLineBuffer extends BaseBuffer<CurvedLineShape<any>, Mesh> {
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
    update(shapeBuffer: CurvedLineShape<any>[]): boolean;
}
