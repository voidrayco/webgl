import { difference, union } from 'ramda';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Bezier } from './bezier';
import { IQuadShapeData } from './bezier/shape-data-types/quad-shape-data';
import { ChordChart } from './chord-chart';
import { IData as IChordData, IEndpoint, IFlow } from './chord-chart/generators/types';
import { addFlowToEndpoints, createEndpoint, filterEndpoints, getFlowsByEndpoint, removeFlowFromEndpoints, setEndpointFlowCounts } from './chord-chart/util/iEndpoint';
import { generateTree, getTreeLeafNodes } from './chord-chart/util/iEndpoint-tree';
import { createFlow } from './chord-chart/util/iFlow';

const testChordData = require('./chord-chart/test-data/chord-data.json');
const RANDOM = require('random');

/**
 * The state of the application
 */
interface IMainState {
  currentTab: number,
  leafFlows: IFlow[];
  leafEndpoints: IEndpoint[]; // To prevent redundant calculations
  tree: IEndpoint[];
}

/**
 * Entry class for the Application
 */
export class Main extends React.Component<any, IMainState> {
  CHORD_CHANGE_QTY = 5;
  MINIMUM_ENDPOINT_SIZE = 0.5; // Radians
  ROTATION = -Math.PI / 2;

  constructor(props: IMainState){
    super(props);
    const endpoints = this.convertJsonData(JSON.parse(JSON.stringify(testChordData.endpoints)), JSON.parse(JSON.stringify(testChordData.flows)));
    const tree: IEndpoint[] = generateTree(endpoints);
    const leafEndpoints = getTreeLeafNodes(tree);
    this.state = {
      currentTab: 0,
      leafEndpoints,
      leafFlows: this.buildInitialFlows(testChordData.flows, leafEndpoints),
      tree,
    };
  }

  convertJsonData(endpoints: IEndpoint[], flows: IFlow[]){
    const updatedEndpoints = setEndpointFlowCounts(endpoints, flows);
    return updatedEndpoints;
  }

  buildInitialFlows(flows: IFlow[], leafEndpoints: IEndpoint[]){
    let leafFlows: IFlow[] = [];
    leafEndpoints.forEach((endpoint) => {
      leafFlows = union(leafFlows, getFlowsByEndpoint(endpoint, flows));
    });
    return leafFlows;
  }

  /**
   * Splits an existing leaf-level endpoint (with minimum size criteria) into two endpoints
   *
   * @param {string} endpoints - list of leaf level endpoints
   */
  addEndpoint = (leafEndpoints: IEndpoint[]) => {
    // Find endpoint to break into two--------
    const filteredEndpoints = filterEndpoints(leafEndpoints, this.MINIMUM_ENDPOINT_SIZE);
    if (filteredEndpoints.length < 1){
      return leafEndpoints;
    }
    // Break endpoint into two and inject new endpoint into one side (currently start side only)
    const getRandomEndpoint = RANDOM.item(filteredEndpoints);
    const boundsEndpoint = getRandomEndpoint();
    const newEndpoint = createEndpoint(boundsEndpoint);
    boundsEndpoint.endAngle = newEndpoint.startAngle;
    boundsEndpoint.weight = boundsEndpoint.weight - newEndpoint.weight;
    return union(leafEndpoints, [newEndpoint]);
  }

  /**
   * Removes an existing leaf-level endpoint, adjusting other endpoints to fill in space
   *
   * @param {string} endpoints - list of leaf level endpoints
   * @param {string} flows - list of leaf level flows
   */
  removeEndpoint = (endpoints: IEndpoint[], flows: IFlow[]) => {
    if (endpoints.length < 2) {
      return {endpoints, flows};
    }
    // Remove endpoint--------------
    const randomRemoveEndpoint = RANDOM.item(endpoints);
    const removedEndpoint: IEndpoint = randomRemoveEndpoint();
    const newEndpoints = difference(endpoints, [removedEndpoint]);

    // Remove associated flows-------------
    const newFlows = flows.filter((flow) =>
      (removedEndpoint.id !== flow.srcTarget && removedEndpoint.id !== flow.dstTarget));

    // Adjust adjacent endpoint to fill in removed endpoint slice-------------
    const startAngle = removedEndpoint.startAngle, endAngle = removedEndpoint.endAngle;
    const trueStartAngle = startAngle > endAngle ? endAngle : startAngle;
    const isFirstEndpoint =  (trueStartAngle > (0 + this.ROTATION)) ? false : true;
    const adjacentEndpoint = endpoints.find((endpoint) =>
      isFirstEndpoint ? endpoint.startAngle === removedEndpoint.endAngle : endpoint.endAngle === removedEndpoint.startAngle);
    isFirstEndpoint ? adjacentEndpoint.startAngle = removedEndpoint.startAngle :
      adjacentEndpoint.endAngle = removedEndpoint.endAngle;
    return {endpoints: newEndpoints, flows: newFlows};
  }

  addChords = (endpoints: IEndpoint[], flows: IFlow[]) => {
    const newFlows: IFlow[] = [];
    for (let a = 0; a < this.CHORD_CHANGE_QTY; a++){
      const flow: IFlow = createFlow(flows, this.state.leafEndpoints);
      newFlows.push(flow);
      endpoints = addFlowToEndpoints(flow, endpoints);
    }
    const leafFlows = union(this.state.leafFlows, newFlows);
    this.setState({leafFlows, leafEndpoints: endpoints});
  }

  removeChords = (endpoints: IEndpoint[]) => {
    const flows = this.state.leafFlows;
    const removeQty = flows.length < this.CHORD_CHANGE_QTY ? flows.length : this.CHORD_CHANGE_QTY;
    const randomRemoveFlow = RANDOM.array(removeQty, RANDOM.item(flows));
    const removedFlows: IFlow[] = randomRemoveFlow();
    const leafFlows = difference(flows, removedFlows);
    removedFlows.forEach((flow) => {
      endpoints = removeFlowFromEndpoints(flow, endpoints);
    });
    this.setState({leafFlows, leafEndpoints: endpoints});
  }

  /**
   * Local method that updates page's internal react state for chord interactions
   *
   * @param {string} type - 'add' or 'remove' chord
   */
  updateChords = (type: string) => () => {
    if (type === '+') this.addChords(this.state.leafEndpoints, this.state.leafFlows);
    else this.removeChords(this.state.leafEndpoints);
  }

  /**
   * Local method that updates page's internal react state for endpoint interactions
   *
   * @param {string} type - 'add' or 'remove' endpoint
   */
  updateEndpoints = (type: string) => () => {
    if (type === '+'){
      const leafEndpoints = this.addEndpoint(this.state.leafEndpoints);
      this.setState({leafEndpoints});
    }else if (this.state.leafEndpoints.length > 0){
      const newData = this.removeEndpoint(this.state.leafEndpoints, this.state.leafFlows);
      if (newData){
        this.setState({leafEndpoints: newData.endpoints, leafFlows: newData.flows});
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
      chordData.flows = this.state.leafFlows;
      chordData.endpoints = this.state.leafEndpoints;
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
