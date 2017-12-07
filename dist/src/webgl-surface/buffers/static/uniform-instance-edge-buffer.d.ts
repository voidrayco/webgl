import { Mesh, ShaderMaterial } from 'three';
import { CurvedEdgeShape } from '../../drawing/index';
import { AtlasManager } from '../../drawing/texture/atlas-manager';
import { BaseBuffer } from '../base-buffer';
/**
 * This renders a curved line by injecting all attributes needed to render it.
 * This naively includes all possible data in the vertex.
 *
 * This only supports atlas colors.
 */
export declare class UniformInstanceEdgeBuffer extends BaseBuffer<CurvedEdgeShape<any> | CurvedEdgeShape<any>[], Mesh> {
    /**
     * @override
     * See interface definition
     */
    init(material: ShaderMaterial, unitCount: number, shared?: UniformInstanceEdgeBuffer): void;
    /**
     * @override
     * See interface definition
     *
     * @param {CurvedEdgeShape<any>[]} shapeBuffer A buffer of curved line shapes
     * @param {AtlasManager} atlasManager The Atlas Manager that contains the color atlas
     *                                    needed for rendering with color picks.
     */
    update(shapeBuffer: CurvedEdgeShape<any>[] | CurvedEdgeShape<any>[][], atlasManager?: AtlasManager, controlPointSource?: number): boolean;
}
