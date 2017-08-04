import { IEndpoint } from '../generators/types';

/**
 * Recursively builds up a nested tree of IEndpoints from flat set of IEndpoints, adding a children[] to each endpoint
 * and calculating startAngle and endAngle for each IEndpoint accounting for nested angles.
 * Root level is expected to contain a property parent = ''
 * Angles calculated in radians
 *
 * @export
 * @param {IEndpoint[]} endpoints - graph endpoint set
 * @returns {IEndpoint[]} endpoint tree - with children[], startAngle, endAngle populated
 */
export function generateTree(endpoints: IEndpoint[]): IEndpoint[]{
    // Builds nested subtrees under each root level IEndpoint (ie hemispheres)
    const buildSubtree = ( endpoints: IEndpoint[], parent: IEndpoint, tree: IEndpoint[] ) => {
        tree = typeof tree !== 'undefined' ? tree : [];
        parent = typeof parent !== 'undefined' ? parent : null;
        let children = endpoints.filter((child) => child.parent === parent.id);
        if (children.length > 0){
            children = _calculateSiblingAnglesAndWeight(children, parent.startAngle, parent.endAngle);
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

function _calculateSiblingAnglesAndWeight(children: IEndpoint[], startAngle: number, endAngle: number){
    const totalChildrenWeight = _getTotalWeight(children);
    let currentAngle = startAngle;
    return children.map((child) => {
        const width = (child.weight / totalChildrenWeight) * (endAngle - startAngle);
        const node = {...child, startAngle: currentAngle, endAngle: currentAngle + width};
        currentAngle += width;
        return node;
    });
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
 * Add endpoint to tree
 *
 * @export
 * @param {IEndpoint[]} endpoint - new endpoint to add
 */
export function addEndpointToTree(endpoint: IEndpoint, tree: IEndpoint[]){
    if (_isRoot(endpoint)){
        tree.push(endpoint);
    }else{
        const parent = getEndpointById(endpoint.parent, tree);
        parent.children.push(endpoint);
    }
    return tree;
}

/**
 * Remove endpoint from tree
 *
 * @export
 * @param {IEndpoint[]} endpoint - endpoint to be removed
 */
export function removeEndpointFromTree(endpoint: IEndpoint, tree: IEndpoint[]){
    const HEMISPHERE_SIZE = Math.PI;
    if (_isRoot(endpoint) && tree.length > 2){
        tree = tree.filter((root) => root.id !== endpoint.id);
        tree = _calculateSiblingAnglesAndWeight(tree, 0, HEMISPHERE_SIZE);
    }else{
        const parent = getEndpointById(endpoint.parent, tree);
        if (parent){
            let newChildren = parent.children.filter((child) => child.id !== endpoint.id);
            if (newChildren.length > 0){
                newChildren = _calculateSiblingAnglesAndWeight(newChildren, parent.startAngle, parent.endAngle);
            }
            parent.children = newChildren;
        }
    }
    return tree;
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
