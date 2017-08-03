import { hsl } from 'd3-color';
import { IEndpoint, IFlow } from '../generators/types';
import { getFlowsByEndpoint } from './iEndpoint';

const RANDOM = require('random');
const getHslRandomHVal = RANDOM.float(193, 206);
const getHslRandomLVal = RANDOM.float(0.29, 0.54);

/**
 * Creates random flow
 *
 * @param {IEndpoint} boundsEndpoint - endpoint that is used as bounds for creating new endpoint
 */
export function createFlow(flows: IFlow[], endpoints: IEndpoint[]) {
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
