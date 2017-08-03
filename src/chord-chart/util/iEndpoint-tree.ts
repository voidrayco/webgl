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
    // Function to calculate aggregated weight for set of endpoints
    const getTotalWeight = (endpoints: IEndpoint[]) => endpoints.reduce(function(accum: number, endpoint: IEndpoint){
        return endpoint.id === '' ? accum : accum + endpoint.weight;
    }, 0);
    // Builds nested subtrees under each root level IEndpoint (ie hemispheres)
    const buildSubtree = ( endpoints: IEndpoint[], parent: IEndpoint, tree: IEndpoint[] ) => {
        tree = typeof tree !== 'undefined' ? tree : [];
        parent = typeof parent !== 'undefined' ? parent : null;
        let children = endpoints.filter((child) => child.parent === parent.id);
        if (children.length > 0){
        let currentAngle = parent.startAngle;
        const totalChildrenWeight = getTotalWeight(children);
        children = children.map((child) => {
            const width = (child.weight / totalChildrenWeight) * (parent.endAngle - parent.startAngle);
            const node = {startAngle: currentAngle, endAngle: currentAngle + width, ...child};
            currentAngle += width;
            return node;
        });
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
    const totalParentWeight = getTotalWeight(roots);
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
 * Traverses tree structure with provided algorithm path, executing callback function at each node.
 *
 * @export
 * @param {IEndpoint[]} tree - tree of endpoints
 */
export function traverseSubtree(startNode: IEndpoint, callback: Function, traversalType: string){
    const visitNodeDepthFirst = (node: IEndpoint, callback: Function) => {
        if (callback) {
            callback(node);
        }
        node.children.forEach((child) => visitNodeDepthFirst(child, callback));
    };
    if (traversalType === 'depthFirst'){
        visitNodeDepthFirst(startNode, callback);
    }
}
