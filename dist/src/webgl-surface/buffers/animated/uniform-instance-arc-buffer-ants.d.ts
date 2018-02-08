import { Mesh, ShaderMaterial } from 'three';
import { CurvedLineShape } from '../../drawing/shape/curved-line-shape';
import { AtlasManager } from '../../drawing/texture/atlas-manager';
import { BaseBuffer } from '../base-buffer';
/**
 * This renders a curved line by injecting all attributes needed to render it.
 * This naively includes all possible data in the vertex.
 *
 * This only supports atlas colors.
 */
export declare class UniformInstanceArcBufferAnts extends BaseBuffer<CurvedLineShape<any> | CurvedLineShape<any>[], Mesh> {
    /**
     * @override
     * See interface definition
     */
    init(material: ShaderMaterial, unitCount: number, shared?: UniformInstanceArcBufferAnts): void;
    /**
     * @override
     * See interface definition
     *
     * @param {CurvedLineShape<any>[]} shapeBuffer A buffer of curved line shapes
     * @param {AtlasManager} atlasManager The Atlas Manager that contains the color atlas
     *                                    needed for rendering with color picks.
     */
    update(shapeBuffer: CurvedLineShape<any>[] | CurvedLineShape<any>[][], atlasManager?: AtlasManager, controlPointSource?: number): boolean;
}
