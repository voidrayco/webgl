import { difference, union } from 'ramda';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Bezier } from './bezier';
import { IQuadShapeData } from './bezier/shape-data-types/quad-shape-data';
import { ChordChart } from './chord-chart';
import { IData as IChordData, IEndpoint, IFlow } from './chord-chart/generators/types';
import { addFlowToEndpoints, addPropertiesToEndpoints, createEndpoint, filterEndpoints, removeFlowFromEndpoints, setEndpointFlowCounts } from './chord-chart/util/iEndpoint';
import { addEndpointToTree, generateTree, getTreeLeafNodes, removeEndpointFromTree } from './chord-chart/util/iEndpoint-tree';
import { createFlow } from './chord-chart/util/iFlow';

const testChordData = require('./chord-chart/test-data/chord-data.json');
const RANDOM = require('random');

/**
 * The state of the application
 */
interface IMainState {
  currentTab: number,
  flows: IFlow[];
  // LeafEndpoints: IEndpoint[]; // To prevent redundant calculations
  tree: IEndpoint[];
}

/**
 * Entry class for the Application
 */
export class Main extends React.Component<any, IMainState> {
  CHORD_CHANGE_QTY = 5;
  MINIMUM_ENDPOINT_SIZE = 0.5; // Radians

  constructor(props: IMainState){
    super(props);
    const endpoints = this.convertJsonData(JSON.parse(JSON.stringify(testChordData.endpoints)), JSON.parse(JSON.stringify(testChordData.flows)));
    const tree: IEndpoint[] = generateTree(endpoints);
    // Const leafEndpoints = getTreeLeafNodes(tree);
    this.state = {
      currentTab: 0,
      // LeafEndpoints,
      // LeafFlows: this.buildInitialFlows(testChordData.flows, leafEndpoints),
      flows: testChordData.flows,
      tree,
    };
  }

  convertJsonData(endpoints: IEndpoint[], flows: IFlow[]){
    const updatedEndpoints = addPropertiesToEndpoints(setEndpointFlowCounts(endpoints, flows));
    return updatedEndpoints;
  }

  /**
   * Splits an existing leaf-level endpoint (with minimum size criteria) into two endpoints
   *
   * @param {string} endpoints - list of leaf level endpoints
   */
  addEndpoint = (tree: IEndpoint[]) => {
    // Find endpoint to break into two--------
    const leafEndpoints = getTreeLeafNodes(tree);
    const filteredEndpoints = filterEndpoints(leafEndpoints, this.MINIMUM_ENDPOINT_SIZE);
    if (filteredEndpoints.length < 1){
      return tree;
    }
    // Break endpoint into two and inject new endpoint into one side (currently start side only)
    const getRandomEndpoint = RANDOM.item(filteredEndpoints);
    const boundsEndpoint = getRandomEndpoint();
    const newEndpoint = createEndpoint(boundsEndpoint);
    boundsEndpoint.endAngle = newEndpoint.startAngle;
    boundsEndpoint.weight = boundsEndpoint.weight - newEndpoint.weight;
    return addEndpointToTree(newEndpoint, tree);
  }

  /**
   * Removes an existing leaf-level endpoint, adjusting other endpoints to fill in space
   *
   * @param {string} tree - tree of endpoints
   * @param {string} flows - list of leaf level flows
   */
  removeEndpoint = (tree: IEndpoint[], flows: IFlow[]) => {
    // If (tree.length < 2) {
    //   Return {endpoints, flows};
    // }
    // Remove endpoint--------------
    const leafEndpoints = getTreeLeafNodes(this.state.tree);
    const randomRemoveEndpoint = RANDOM.item(leafEndpoints);
    const removedEndpoint: IEndpoint = randomRemoveEndpoint();
    tree = removeEndpointFromTree(removedEndpoint, tree);

    // Remove associated flows-------------
    const newFlows = flows.filter((flow) =>
      (removedEndpoint.id !== flow.srcTarget && removedEndpoint.id !== flow.dstTarget));

    return {tree, flows: newFlows};
  }

  addChords = (tree: IEndpoint[], flows: IFlow[]) => {
    const newFlows: IFlow[] = [];
    for (let a = 0; a < this.CHORD_CHANGE_QTY; a++){
      const flow: IFlow = createFlow(flows, tree);
      newFlows.push(flow);
      tree = addFlowToEndpoints(flow, tree);
    }
    const updatedFlows = union(flows, newFlows);
    this.setState({flows: updatedFlows, tree});
  }

  removeChords = (tree: IEndpoint[], flows: IFlow[]) => {
    const removeQty = flows.length < this.CHORD_CHANGE_QTY ? flows.length : this.CHORD_CHANGE_QTY;
    const randomRemoveFlow = RANDOM.array(removeQty, RANDOM.item(flows));
    const removedFlows: IFlow[] = randomRemoveFlow();
    const updatedFlows = difference(flows, removedFlows);
    removedFlows.forEach((flow) => {
      tree = removeFlowFromEndpoints(flow, tree);
    });
    this.setState({flows: updatedFlows, tree});
  }

  /**
   * Local method that updates page's internal react state for chord interactions
   *
   * @param {string} type - 'add' or 'remove' chord
   */
  updateChords = (type: string) => () => {
    if (type === '+') this.addChords(this.state.tree, this.state.flows);
    else this.removeChords(this.state.tree, this.state.flows);
  }

  /**
   * Local method that updates page's internal react state for endpoint interactions
   *
   * @param {string} type - 'add' or 'remove' endpoint
   */
  updateEndpoints = (type: string) => () => {
    if (type === '+'){
      const tree = this.addEndpoint(this.state.tree);
      this.setState({tree});
    }else{
      const leafNodes = getTreeLeafNodes(this.state.tree);
      if (leafNodes.length > 0){
        const newData = this.removeEndpoint(this.state.tree, this.state.flows);
        if (newData){
          this.setState({tree: newData.tree, flows: newData.flows});
        }
      }
    }
  }

  /**
   * Generates a handler to set the current tab index
   *
   * @param {number} tab
   */
  handleClickTab = (tab: number) => () => this.setState({currentTab: tab});

  /**
   * @override
   * The React defined render method
   */
  render() {
    let quadData: IQuadShapeData[] = [];
    const chordData: IChordData = Object.assign([], testChordData);
    let component;

    if (this.state.currentTab === 0) {
      quadData = [...new Array(200)].map((_, i: number) =>
        ({
          id: i,
          position: {x: Math.random() * 480 + 10, y: Math.random() * 480 + 10},
          size: {width: Math.random() * 20 + 10, height: Math.random() * 20 + 10},
        }),
      );

      component = (
        <Bezier quadData={quadData}/>
      );
    }

    if (this.state.currentTab === 1) {
      chordData.flows = this.state.flows;
      chordData.endpoints = getTreeLeafNodes(this.state.tree);
      component = (
        <ChordChart testChordData={chordData} />
      );
    }

    return (
      <div>
        <button onClick={this.handleClickTab(0)}>View Quads</button>
        <button onClick={this.handleClickTab(1)}>View Chord Demo</button>
        <span>Endpoint</span>
        <button onClick={this.updateEndpoints('+')}>+</button>
        <button onClick={this.updateEndpoints('-')}>-</button>
        <span>Chord</span>
        <button onClick={this.updateChords('+')}>+</button>
        <button onClick={this.updateChords('-')}>-</button>
        {component}
      </div>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'));
