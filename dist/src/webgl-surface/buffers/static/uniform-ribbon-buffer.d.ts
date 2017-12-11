import { Mesh, ShaderMaterial } from 'three';
import { RibbonShape } from '../../drawing/shape/ribbon-shape';
import { AtlasManager } from '../../drawing/texture/atlas-manager';
import { BaseBuffer } from '../base-buffer';
export declare class UniformRibbonBuffer extends BaseBuffer<RibbonShape<any> | RibbonShape<any>[], Mesh> {
    init(material: ShaderMaterial, unitCount: number, shared?: UniformRibbonBuffer): void;
    update(shapeBuffer: RibbonShape<any>[] | RibbonShape<any>[][], atlasManager?: AtlasManager, controlPointSource?: number): boolean;
}
