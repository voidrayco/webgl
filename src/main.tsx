import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Bezier } from './bezier';
import { IQuadShapeData } from './bezier/shape-data-types/quad-shape-data';
import { ChordChart } from './chord-chart';
import { IData as IChordData, IEndpoint, IFlow } from './chord-chart/generators/types';
import { addPropertiesToEndpoints, createEndpoint, filterEndpoints, polarizeStartAndEndAngles, setEndpointFlowCounts } from './chord-chart/util/iEndpoint';
import { addEndpointToTree, generateTree, getTreeLeafNodes, removeEndpointFromTree } from './chord-chart/util/iEndpoint-tree';
import { addFlows, removeFlows } from './chord-chart/util/iFlow';

const testChordData = require('./chord-chart/test-data/chord-data.json');
const RANDOM = require('random');

/**
 * The state of the application
 */
interface IMainState {
  currentTab: number,
  flows: IFlow[];
  tree: IEndpoint[];
}

/**
 * Entry class for the Application
 */
export class Main extends React.Component<any, IMainState> {
  MINIMUM_ENDPOINT_SIZE = 0.5; // Radians
  CHORD_CHANGE_QTY = 5;

  constructor(props: IMainState){
    super(props);
    const flows = testChordData.flows;
    const endpoints = this.convertJsonData(JSON.parse(JSON.stringify(testChordData.endpoints)), JSON.parse(JSON.stringify(testChordData.flows)));
    const tree: IEndpoint[] = generateTree(endpoints, flows);
    this.state = {
      currentTab: 1,
      flows: flows,
      tree,
    };
  }

  convertJsonData(endpoints: IEndpoint[], flows: IFlow[]){
    const updatedEndpoints = addPropertiesToEndpoints( polarizeStartAndEndAngles( setEndpointFlowCounts(endpoints, flows)));
    return updatedEndpoints;
  }

  /**
   * Splits an existing leaf-level endpoint (with minimum size criteria) into two endpoints
   */
  addEndpoint = () => {
    let tree = this.state.tree;
    const flows = this.state.flows;
    // Find endpoint to break into two--------
    const leafEndpoints = getTreeLeafNodes(tree);
    const filteredEndpoints = filterEndpoints(leafEndpoints, this.MINIMUM_ENDPOINT_SIZE);
    // If no end points to remove, just exit
    if (filteredEndpoints.length < 1){
      return;
    }
    // Break endpoint into two and inject new endpoint into one side (currently start side only)
    const getRandomEndpoint = RANDOM.item(filteredEndpoints);
    const boundsEndpoint = getRandomEndpoint();
    const newEndpoint = createEndpoint(boundsEndpoint);
    boundsEndpoint.endAngle = newEndpoint.startAngle;
    boundsEndpoint.weight = boundsEndpoint.weight - newEndpoint.weight;
    tree = addEndpointToTree(newEndpoint, tree, flows);
    this.setState({
      tree,
    });
  }

  /**
   * Removes an existing leaf-level endpoint, adjusting other endpoints to fill in space
   */
  removeEndpoint = () => {
    const tree = this.state.tree;
    const flows = this.state.flows;
    // Remove endpoint--------------
    const leafEndpoints = getTreeLeafNodes(this.state.tree);
    const randomRemoveEndpoint = RANDOM.item(leafEndpoints);
    const removedEndpoint: IEndpoint = randomRemoveEndpoint();
    const updated = removeEndpointFromTree(removedEndpoint, tree, flows);
    this.setState({tree: updated.tree, flows: updated.flows});
  }

  addChords = () => {
    const tree = this.state.tree;
    const flows = this.state.flows;
    const updated = addFlows(this.CHORD_CHANGE_QTY, flows, tree);
    this.setState({flows: updated.flows, tree: updated.tree});
  }

  removeChords = () => {
    const tree = this.state.tree;
    const flows = this.state.flows;
    const updated = removeFlows(this.CHORD_CHANGE_QTY, flows, tree);
    this.setState({flows: updated.flows, tree: updated.tree});
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
    const chordData: IChordData = Object.assign({}, testChordData);
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
        <ChordChart data={chordData} />
      );
    }

    return (
      <div>
        <div>
          {component}
        </div>
        <div style={{marginTop: 4, padding: 4}}>
          <button onClick={this.handleClickTab(0)}>View Quads</button>
          <button onClick={this.handleClickTab(1)}>View Chord Demo</button>
          <span>Endpoint</span>
          <button onClick={this.addEndpoint}>+</button>
          <button onClick={this.removeEndpoint}>-</button>
          <span>Chord</span>
          <button onClick={this.addChords}>+</button>
          <button onClick={this.removeChords}>-</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'));
