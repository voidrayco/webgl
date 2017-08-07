import { IEndpoint, IFlow } from '../chord-chart/generators/types';
import { createEndpoint } from './iEndpoint';

const RANDOM = require('random');
// Const MINIMUM_ENDPOINT_SIZE = 0.5; // Radians

/**
 * Recursively builds up a nested tree of IEndpoints from flat set of IEndpoints, adding a children[] to each endpoint
 * Immutable
 *
 * @export
 * @param {IEndpoint[]} endpoints - graph endpoint set
 * @returns {IEndpoint[]} endpoint tree - with children[], startAngle, endAngle populated
 */
export function generateTree(endpoints: IEndpoint[], flows: IFlow[]): IEndpoint[]{
    // Builds nested subtrees under each root level IEndpoint (ie hemispheres)
    const buildSubtree = ( endpoints: IEndpoint[], parent: IEndpoint, tree: IEndpoint[] ) => {
        tree = typeof tree !== 'undefined' ? tree : [];
        parent = typeof parent !== 'undefined' ? parent : null;
        const children = endpoints.filter((child) => child.parent === parent.id);
        if (children.length > 0){
            if (_isRoot(parent)){
                tree = children;
            }else{
                parent.children = children;
            }
            children.forEach((child) => buildSubtree( endpoints, child, []));
        }
        return tree;
    };
    // Prepare top level of IEndpoint tree (typically will be 2 hemispheres but will accept anything)
    const flatTree = endpoints.map((endpoint) => {
        const node: IEndpoint = {...endpoint, children: []};
        return node;
    });
    const roots = flatTree.filter(_isRoot);
    const tree = roots.map((root) => {
        const node = {...root, children: buildSubtree(flatTree, root, [])};
        return node;
    });
    return tree;
}

/**
 * Traverses tree structure with provided algorithm path, executing callback function at each node. If callback returns true, traversal is terminated.
 *
 * @export
 * @param {IEndpoint[]} tree - tree of endpoints
 */
export function traverseSubtree(startNode: IEndpoint, callback: Function, traversalType: string){
    const visitNodeDepthFirst = (node: IEndpoint, callback: Function) => {
        if (callback) {
            callback(node);
        }
        if (node.children) node.children.forEach((child) => visitNodeDepthFirst(child, callback));
    };
    if (traversalType === 'depthFirst'){
        return visitNodeDepthFirst(startNode, callback);
    }
}

/**
 * Flatten tree to a list of endpoints
 * Immutable
 *
 * @export
 * @param {IEndpoint[]} tree - tree of endpoints
 * @returns {IEndpoint[]} endpoint list - a list of all endpoints
 */
export function flattenTree(tree: IEndpoint[]): IEndpoint[]{
    const nodes: IEndpoint[] = [];
    const pushNode = (node: IEndpoint) => {
        nodes.push(node);
    };
    tree.map((root: IEndpoint) => {
        traverseSubtree(root, pushNode, 'depthFirst');
    });
    return nodes;
}

function _isLeaf(endpoint: IEndpoint){
    if (typeof endpoint.children === 'undefined' || endpoint.children === null){
        return true;
    }
    return endpoint.children.length === 0;
}

function _isRoot(endpoint: IEndpoint){
    return endpoint.parent === '';
}

/**
 * Filters tree of endpoints down to leaf node set
 * Immutable
 *
 * @export
 * @param {IEndpoint[]} tree - tree of endpoints
 */
export function getTreeLeafNodes(tree: IEndpoint[]){
    const flatTree = flattenTree(tree);
    return flatTree.filter(_isLeaf);
}

/**
 * Create randomly generated leaf endpoint object
 * Immutable
 *
 * @export
 * @param {IEndpoint[]} endpoint - new endpoint to add
 * @param {IEndpoint[]} tree - tree of endpoints
 * @returns {newEndpoint: IEndpoint[]} a newly generated random leaf endpoint, or null if no available space (no nodes > min endpoint size)
 */
export function createRandomLeafEndpoint(tree: IEndpoint[]){
    // Find endpoint to break into two--------
    const leafEndpoints = getTreeLeafNodes(tree);
    // Const filteredEndpoints = filterEndpoints(leafEndpoints, MINIMUM_ENDPOINT_SIZE);
    // If no end points to remove, just exit
    // If (filteredEndpoints.length < 1){
    //   Return null;
    // }
    // Break endpoint into two and inject new endpoint into one side (currently start side only)
    const getRandomEndpoint = RANDOM.item(leafEndpoints);
    const sibling = getRandomEndpoint();
    const newEndpoint = createEndpoint(sibling);
    return newEndpoint;
}

export function selectRandomLeafEndpoint(tree: IEndpoint[]){
    // Identify random endpoint to remove-----------
    const leafEndpoints = getTreeLeafNodes(tree);
    const randomLeaf = RANDOM.item(leafEndpoints);
    return randomLeaf();
}

/**
 * Add endpoint to tree
 * Immutable
 *
 * @export
 * @param {IEndpoint[]} endpoint - new endpoint to add
 * @param {IEndpoint[]} tree - tree of endpoints
 * @param {IEndpoint[]} flows - total set of flows in graph
 */
export function addEndpointToTree(endpoint: IEndpoint, tree: IEndpoint[]){
    const treeObj = tree.map(a => Object.assign({}, a));    // Deep clone for isomorphism
    if (_isRoot(endpoint)){
        treeObj.push(endpoint);
    }else{
        const parent = getEndpointById(endpoint.parent, treeObj);
        parent.children.push(endpoint);
    }
    return treeObj;
}

/**
 * Remove endpoint from tree
 * Immutable
 *
 * @export
 * @param {IEndpoint[]} endpoint - endpoint to be removed
 * @param {IEndpoint[]} tree - tree of endpoints
 * @param {IEndpoint[]} flows - total set of flows in graph
 * @returns {tree: IEndpoint[], flows: IFlow[]} recalculated endpoint tree and flows
 */
export function removeEndpointFromTree(endpoint: IEndpoint, tree: IEndpoint[], flows: IFlow[]){
    // Remove node from tree-------
    let treeObj;
    if (_isRoot(endpoint) && tree.length > 2){
        treeObj = tree.filter((root) => root.id !== endpoint.id);
    }else{
        treeObj = tree.map(a => Object.assign({}, a));   // Immutable copy of tree for mods
        const parent = getEndpointById(endpoint.parent, treeObj);
        if (parent){
            const newChildren = parent.children.filter((child) => child.id !== endpoint.id);
            parent.children = newChildren;
        }
    }
    // Remove associated flows-------------
    const newFlows = flows.filter((flow) =>
      (endpoint.id !== flow.srcTarget && endpoint.id !== flow.dstTarget));
    return {tree: treeObj, flows: newFlows};
}

/**
 * Finds endpoint by id in tree structure
 * Not immutable by design
 *
 * @export
 * @param {IEndpoint[]} id - endpoint id
 * @param {IEndpoint[]} tree - tree of endpoints
 */
export function getEndpointById(id: string, tree: IEndpoint[]): IEndpoint{
    let foundNode: IEndpoint = null;

    const searchSubtree = (root: IEndpoint) => {
        const stack: IEndpoint[] = [];
        let node: IEndpoint = null;
        stack.push(root);
        while (stack.length > 0) {
            node = stack.pop();
            if (node && node.id === id) {
                // Found it!
                foundNode = node;
                break;
            } else if (node && node.children && node.children.length) {
                node.children.every((node, i) => {
                    stack.push(node);
                    return true;
                });
            }
        }
    };

    tree.every((root) => {
        searchSubtree(root);
        if (foundNode) return false;
        return true;
    });

    return foundNode;
}
