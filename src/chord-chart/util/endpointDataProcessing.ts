import { IChord, IEndpoint } from '../generators/types';
const debug = require('debug')('edp');
/**
 * Recalculates tree properties startAngle and endAngle for each IEndpoint accounting for nested angles.
 * Angles calculated in radians
 * Immutable
 *
 * @export
 * @param {IEndpoint[]} endpoints - graph endpoint set
 * @returns {IEndpoint[]} endpoint tree - with children[], startAngle, endAngle populated
 */
function _recalculateEndpoint(children: IEndpoint[], flows: IChord[], startAngle: number, endAngle: number) {
  const totalChildrenWeight = _getTotalWeight(children);
  debug('childrens are %o, weight is %o', children, totalChildrenWeight);
  let currentAngle = startAngle;

  return children.map((child) => {
    const width = (child.weight / totalChildrenWeight) * (endAngle - startAngle);
    let node: IEndpoint = {...child, startAngle: currentAngle, endAngle: currentAngle + width};
    currentAngle += width;
    node = _recalculateFlowCounts(node, flows);

    return node;
  });
}

// Recalculates outgoingCount, incomingCount, totalCount for passed in tree node
// Immutable
function _recalculateFlowCounts(node: IEndpoint, flows: IChord[]) {
  const nodeObj = node;  // Immutable
  let outgoingCount = 0, incomingCount = 0, totalCount = 0;

  flows.forEach((flow) => {
    if (flow.source === nodeObj.id) outgoingCount++;
    if (flow.target === nodeObj.id) incomingCount++;
    if (flow.source === nodeObj.id || flow.target === nodeObj.id) totalCount++;
  });

  nodeObj.outgoingCount = outgoingCount;
  nodeObj.incomingCount = incomingCount;
  nodeObj.totalCount = totalCount;

  return nodeObj;
}

/**
 * Recalculates tree properties startAngle and endAngle for each IEndpoint accounting for nested angles.
 * Angles calculated in radians
 * Not immutable - parents expected to pass in immutable tree object (flows object not modified)
 *
 * @export
 * @param {IEndpoint[]} endpoints - graph endpoint set
 * @returns {IEndpoint[]} endpoint tree - with children[], startAngle, endAngle populated
 */
export function recalculateTree(endpoints: IEndpoint[], flows: IChord[]) {
  let tree: IEndpoint[] = [];
  const endpointById = new Map<string, IEndpoint>();
  endpoints.forEach(endpoint => endpointById.set(endpoint.id, endpoint));

  endpoints.forEach(endpoint => {
    // Ensure every endpoint has a child list
    endpoint.children = endpoint.children || [];

    // If the endpoint has a parent, then add it to that parent's list
    if (endpoint.parent) {
      const parent = endpointById.get(endpoint.parent);

      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(endpoint);
      }

      else {
        // There is something wrong. Endpoint must have a valid parent id or no id
        // At all
        throw new Error('Endpoint specified a parent id that does not exist in the endpoint listing.');
      }
    }

    // Otherwise, the endpoint is top level grouping
    else {
      tree.push(endpoint);
    }
  });

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
  tree = _recalculateEndpoint(tree, flows, -0.5 * Math.PI, CIRCLE_CIRCUMFERENCE - 0.5 * Math.PI);

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

function isAncestor(node: IEndpoint, parent: IEndpoint) {
    if (parent.id === node.parent)return true;
    let rst: boolean = false;

    parent.children.forEach((c) => {
      if (isAncestor(node, c)){
        rst = true;
      }
    });

    return rst;
  }

export function getAncestor(node: IEndpoint, tree: IEndpoint[]) {
  let index: number, i = 0;

  tree.forEach((t) => {
    if (isAncestor(node, t)) index = i;
    i++;
  });

  return tree[index];
}
