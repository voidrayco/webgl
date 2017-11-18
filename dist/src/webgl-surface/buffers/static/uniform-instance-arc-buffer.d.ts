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
export declare class UniformInstanceArcBuffer extends BaseBuffer<CurvedLineShape<any> | CurvedLineShape<any>[], Mesh> {
    /**
     * @override
     * See interface definition
     *
     * @param {UniformInstanceArcBuffer} shared This should be another instance that has already
     *                                          been initialized. Providing this will greatly improve
     *                                          performance by causing sharing of relevant resources across
     *                                          buffers.
     */
    init(material: ShaderMaterial, unitCount: number, shared?: UniformInstanceArcBuffer, bufferClass?: Function, pointClass?: Function): void;
    initVertexBuffer(shared?: UniformInstanceArcBuffer): void;
    /**
     * @override
     * See interface definition
     *
     * @param {CurvedLineShape<any>[]} shapeBuffer A buffer of curved line shapes
     * @param {AtlasManager} atlasManager The Atlas Manager that contains the color atlas
     *                                    needed for rendering with color picks.
     */
    update(shapeBuffer: CurvedLineShape<any>[][] | CurvedLineShape<any>[], atlasManager?: AtlasManager, controlPointSource?: number): boolean;
}
