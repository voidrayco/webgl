import { Mesh, ShaderMaterial } from 'three';
import { CurvedLineShape } from '../../drawing/shape/curved-line-shape';
import { BaseBuffer } from '../base-buffer';
/**
 * This renders a curved line by injecting all attributes needed to render it.
 * This naively includes all possible data in the vertex.
 *
 * This ONLY supports a single color
 */
export declare class SimpleStaticBezierLineBuffer extends BaseBuffer<CurvedLineShape<any>, Mesh> {
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
