import { IChord, IEndpoint } from '../generators/types';
/**
 * Recalculates tree properties startAngle and endAngle for each IEndpoint accounting for nested angles.
 * Angles calculated in radians
 * Not immutable - parents expected to pass in immutable tree object (flows object not modified)
 *
 * @export
 * @param {IEndpoint[]} endpoints - graph endpoint set
 * @returns {IEndpoint[]} endpoint tree - with children[], startAngle, endAngle populated
 */
export declare function recalculateTree(tree: IEndpoint[], flows: IChord[]): IEndpoint[];
/**
 * Traverses tree structure with provided algorithm path, executing callback function at each node. If callback returns true, traversal is terminated.
 *
 * @export
 * @param {IEndpoint[]} tree - tree of endpoints
 */
export declare function traverseSubtree(startNode: IEndpoint, callback: Function, traversalType: string): void;
/**
 * Flatten tree to a list of endpoints
 * Immutable
 *
 * @export
 * @param {IEndpoint[]} tree - tree of endpoints
 * @returns {IEndpoint[]} endpoint list - a list of all endpoints
 */
export declare function flattenTree(tree: IEndpoint[]): IEndpoint[];
/**
 * Filters tree of endpoints down to leaf node set
 * Immutable
 *
 * @export
 * @param {IEndpoint[]} tree - tree of endpoints
 */
export declare function getTreeLeafNodes(tree: IEndpoint[]): IEndpoint[];
export declare function getAncestor(node: IEndpoint, tree: IEndpoint[]): IEndpoint;
