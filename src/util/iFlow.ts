import { hsl } from 'd3-color';
import { IChord, IEndpoint } from '../chord-chart/generators/types';
import { getFlowsByEndpoint } from './iEndpoint';
import { getTreeLeafNodes } from './iEndpoint-tree';

const RANDOM = require('random');
const getHslRandomHVal = RANDOM.float(193, 206);
const getHslRandomLVal = RANDOM.float(0.29, 0.54);

/**
 * Creates random flow
 *
 * @param {IEndpoint[]} tree - tree of endpoints
 * @param {IEndpoint[]} flows - total set of flows in graph
 */
export function createFlow(flows: IChord[], tree: IEndpoint[]) {
    const endpoints = getTreeLeafNodes(tree);
    const getRandomEndpoint = RANDOM.item(endpoints);
    const src: IEndpoint = getRandomEndpoint();
    let dst: IEndpoint = getRandomEndpoint();
    while (dst.id === src.id) dst = getRandomEndpoint();
    const color = hsl(getHslRandomHVal(), 1, getHslRandomLVal());
    const incomingFlows = getFlowsByEndpoint(dst, flows, 'incoming');
    const outgoingFlows = getFlowsByEndpoint(src, flows, 'outgoing');
    return {
        baseColor: color,
        destExpandedTarget: '',  // Future TODO
        dstIndex: incomingFlows.length ? incomingFlows.length + 1 : 1,
        dstTarget: dst.id,
        srcExpandedTarget: '',  // Future TODO
        srcIndex: outgoingFlows.length ? outgoingFlows.length + 1 : 1,
        srcTarget: src.id,
    };
}

/**
 * Creates x random flows, where x = qty
 *
 * @param {IEndpoint[]} qty - number of flows to add
 * @param {IEndpoint[]} tree - tree of endpoints
 * @param {IEndpoint[]} flows - total set of flows in graph
 * @returns {tree: IEndpoint[], flows: IFlow[]} recalculated endpoint tree and flows
 */
export function createRandomFlows(qty: number, flows: IChord[], tree: IEndpoint[]){
    const newFlows: IChord[] = [];
    for (let a = 0; a < qty; a++){
      const flow: IChord = createFlow(flows, tree);
      newFlows.push(flow);
    }
    return newFlows;
}

/**
 * Select x random flows, where x = qty
 *
 * @param {IEndpoint[]} qty - number of flows to remove
 * @param {IEndpoint[]} flows - set of flows to randomly select from
 * @returns {flows: IFlow[]} randomly selected flows
 */
export function selectRandomFlows(qty: number, flows: IChord[]){
    const removeQty = flows.length < qty ? flows.length : qty;
    const randomRemoveFlow = RANDOM.array(removeQty, RANDOM.item(flows));
    return randomRemoveFlow();
}
