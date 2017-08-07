import { difference, union } from 'ramda';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Bezier } from './bezier';
import { IQuadShapeData } from './bezier/shape-data-types/quad-shape-data';
import { ChordChart } from './chord-chart';
import { IData as IChordData, IEndpoint, IFlow } from './chord-chart/generators/types';
import { addPropertiesToEndpoints, polarizeStartAndEndAngles, setEndpointFlowCounts } from './util/iEndpoint';
import { addEndpointToTree, createRandomLeafEndpoint, generateTree, getTreeLeafNodes, removeEndpointFromTree, selectRandomLeafEndpoint } from './util/iEndpoint-tree';
import { createRandomFlows, selectRandomFlows } from './util/iFlow';

const testChordData = require('./chord-chart/test-data/chord-data.json');

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
  CHORD_CHANGE_QTY = 5;

  constructor(props: IMainState){
    super(props);
    const flows = JSON.parse(JSON.stringify(testChordData.flows));
    const endpoints = JSON.parse(JSON.stringify(testChordData.endpoints));
    const tree = this.buildTree(endpoints, flows);
     this.state = {
      currentTab: 1,
      flows: flows,
      tree,
    };
  }

  buildTree(endpoints: IEndpoint[], flows: IFlow[]){
    endpoints = addPropertiesToEndpoints( polarizeStartAndEndAngles( setEndpointFlowCounts(endpoints, flows)));
    const tree: IEndpoint[] = generateTree(endpoints, flows);
    return tree;
  }

  /**
   * Splits an existing leaf-level endpoint (with minimum size criteria) into two endpoints
   */
  addEndpoint = () => {
    let tree = this.state.tree;
    const newEndpoint = createRandomLeafEndpoint(tree);  // Generate random tree endpoint
    if (newEndpoint) tree = addEndpointToTree(newEndpoint, tree);
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
    const endpoint = selectRandomLeafEndpoint(tree);
    const updated = removeEndpointFromTree(endpoint, tree, flows);
    this.setState({tree: updated.tree, flows: updated.flows});
  }

  addChords = () => {
    const tree = this.state.tree;
    const flows = this.state.flows;
    const newFlows = createRandomFlows(this.CHORD_CHANGE_QTY, flows, tree); // Generate random flows
    const updatedFlows = union(flows, newFlows);
    this.setState({flows: updatedFlows});
  }

  removeChords = () => {
    const flows = this.state.flows;
    const removeFlows = selectRandomFlows(this.CHORD_CHANGE_QTY, flows);
    const updatedFlows = difference(flows, removeFlows);
    this.setState({flows: updatedFlows});
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
      testChordData.flows = this.state.flows;
      testChordData.tree = this.state.tree;
      component = (
        <ChordChart data={testChordData} />
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
