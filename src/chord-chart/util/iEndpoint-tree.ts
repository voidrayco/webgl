import { IEndpoint, IFlow } from '../generators/types';
import { createEndpoint, filterEndpoints } from './iEndpoint';

const RANDOM = require('random');
const MINIMUM_ENDPOINT_SIZE = 0.5; // Radians

/**
 * Recursively builds up a nested tree of IEndpoints from flat set of IEndpoints, adding a children[] to each endpoint
 * and calculating startAngle and endAngle for each IEndpoint accounting for nested angles.
 * Angles calculated in radians
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
        let children = endpoints.filter((child) => child.parent === parent.id);
        if (children.length > 0){
            children = _recalculateEndpoint(children, flows, parent.startAngle, parent.endAngle);
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
    let roots = flatTree.filter(_isRoot);
    let currentAngle = 0;
    const totalParentWeight = _getTotalWeight(roots);
    roots = roots.map((root) => {
        const width = (root.weight / totalParentWeight) * 2 * Math.PI;
        const newRoot = {...root, startAngle: currentAngle, endAngle: currentAngle + width };
        currentAngle += width;
        return newRoot;
    });
    const tree = roots.map((root) => {
        const node = {...root, children: buildSubtree(flatTree, root, [])};
        return node;
    });
    return tree;
}

/**
 * Recalculates tree properties startAngle and endAngle for each IEndpoint accounting for nested angles.
 * Angles calculated in radians
 *
 * @export
 * @param {IEndpoint[]} endpoints - graph endpoint set
 * @returns {IEndpoint[]} endpoint tree - with children[], startAngle, endAngle populated
 */
function _recalculateEndpoint(children: IEndpoint[], flows: IFlow[], startAngle: number, endAngle: number){
    const totalChildrenWeight = _getTotalWeight(children);
    let currentAngle = startAngle;
    return children.map((child) => {
        const width = (child.weight / totalChildrenWeight) * (endAngle - startAngle);
        let node = {...child, startAngle: currentAngle, endAngle: currentAngle + width};
        currentAngle += width;
        node = _recalculateFlowCounts(node, flows);
        return node;
    });
}

// Recalculates outgoingCount, incomingCount, totalCount  for passed in tree node
function _recalculateFlowCounts(node: IEndpoint, flows: IFlow[]){
    let outgoingCount = 0, incomingCount = 0, totalCount = 0;
    flows.forEach((flow) => {
        if (flow.srcTarget === node.id) outgoingCount++;
        if (flow.dstTarget === node.id) incomingCount++;
        if (flow.srcTarget === node.id || flow.dstTarget === node.id) totalCount++;
    });
    node.outgoingCount = outgoingCount;
    node.incomingCount = incomingCount;
    node.totalCount = totalCount;
    return node;
}

/**
 * Recalculates tree properties startAngle and endAngle for each IEndpoint accounting for nested angles.
 * Angles calculated in radians
 *
 * @export
 * @param {IEndpoint[]} endpoints - graph endpoint set
 * @returns {IEndpoint[]} endpoint tree - with children[], startAngle, endAngle populated
 */
export function recalculateTree(tree: IEndpoint[], flows: IFlow[]){
    // Recalculates subtree for passed in tree node -- modifies passed in object
    const _recalculateSubtree = (parent: IEndpoint) => {
        parent = typeof parent !== 'undefined' ? parent : null;
        let children = parent.children;
        if (children && children.length > 0){
            children = _recalculateEndpoint(children, flows, parent.startAngle, parent.endAngle);
            parent.children = children;
            children.forEach(_recalculateSubtree);
        }
    };
    const CIRCLE_CIRCUMFERENCE = 2 * Math.PI;
    tree = _recalculateEndpoint(tree, flows, 0, CIRCLE_CIRCUMFERENCE);
    tree.map((root: IEndpoint) => {
        _recalculateSubtree(root);
    });
    return tree;
}

// Function to calculate aggregated weight for set of endpoints
function _getTotalWeight(endpoints: IEndpoint[]){
    return endpoints.reduce(function(accum: number, endpoint: IEndpoint){
        return endpoint.id === '' ? accum : accum + endpoint.weight;
    }, 0);
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
 *
 * @export
 * @param {IEndpoint[]} tree - tree of endpoints
 */
export function getTreeLeafNodes(tree: IEndpoint[]){
    const flatTree = flattenTree(tree);
    return flatTree.filter(_isLeaf);
}

/**
 * Create randomly genereated leaf endpoint object
 *
 * @export
 * @param {IEndpoint[]} endpoint - new endpoint to add
 * @param {IEndpoint[]} tree - tree of endpoints
 * @param {IEndpoint[]} flows - total set of flows in graph
 * @returns {newEndpoint: IEndpoint[]} a newly generated random leaf endpoint, or null if no available space (no nodes > min endpoint size)
 */
export function createLeafEndpoint(tree: IEndpoint[], flows: IFlow[]){
    // Find endpoint to break into two--------
    const leafEndpoints = getTreeLeafNodes(tree);
    const filteredEndpoints = filterEndpoints(leafEndpoints, MINIMUM_ENDPOINT_SIZE);
    // If no end points to remove, just exit
    if (filteredEndpoints.length < 1){
      return null;
    }
    // Break endpoint into two and inject new endpoint into one side (currently start side only)
    const getRandomEndpoint = RANDOM.item(filteredEndpoints);
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
 *
 * @export
 * @param {IEndpoint[]} endpoint - new endpoint to add
 * @param {IEndpoint[]} tree - tree of endpoints
 * @param {IEndpoint[]} flows - total set of flows in graph
 */
export function addEndpointToTree(endpoint: IEndpoint, tree: IEndpoint[], flows: IFlow[]){
    if (_isRoot(endpoint)){
        tree.push(endpoint);
    }else{
        const parent = getEndpointById(endpoint.parent, tree);
        parent.children.push(endpoint);
    }
    return recalculateTree(tree, flows);
}

/**
 * Remove endpoint from tree
 *
 * @export
 * @param {IEndpoint[]} endpoint - endpoint to be removed
 * @param {IEndpoint[]} tree - tree of endpoints
 * @param {IEndpoint[]} flows - total set of flows in graph
 * @returns {tree: IEndpoint[], flows: IFlow[]} recalculated endpoint tree and flows
 */
export function removeEndpointFromTree(endpoint: IEndpoint, tree: IEndpoint[], flows: IFlow[]){
    // Remove node from tree-------
    if (_isRoot(endpoint) && tree.length > 2){
        tree = tree.filter((root) => root.id !== endpoint.id);
    }else{
        const parent = getEndpointById(endpoint.parent, tree);
        if (parent){
            const newChildren = parent.children.filter((child) => child.id !== endpoint.id);
            parent.children = newChildren;
        }
    }
    // Remove associated flows-------------
    const newFlows = flows.filter((flow) =>
      (endpoint.id !== flow.srcTarget && endpoint.id !== flow.dstTarget));
    // Recalculate tree properties after removal-------
    tree = recalculateTree(tree, newFlows);
    return {tree, flows: newFlows};
}

/**
 * Finds endpoint by id in tree structure
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
