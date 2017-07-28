import { addIndex, difference, map, union } from 'ramda';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Bezier } from './bezier';
import { IQuadShapeData } from './bezier/shape-data-types/quad-shape-data';
import { ChordChart } from './chord-chart';
import { IData as IChordData, IFlow } from './chord-chart/generators/types';

const testChordData = require('./chord-chart/test-data/chord-data.json');
// Assign unique id to all flows for uniqueness
const mapIndexed = addIndex(map);
mapIndexed((val, idx) => val.id = idx, testChordData.flows);

const RANDOM = require('random');

/**
 * The state of the application
 */
interface IMainState {
  currentTab: number,
  visibleFlows: IFlow[];
}

/**
 * Entry class for the Application
 */
export class Main extends React.Component<any, IMainState> {
  // Set the default state
  state = {
    currentTab: 0,
    visibleFlows: testChordData.flows,
  };

  /**
   * Generates a handler to set the current tab index
   *
   * @param {number} tab
   */
  handleClickTab = (tab: number) => () => this.setState({currentTab: tab});

  /**
   * Generates a handler to set the currently viewable chords
   *
   * @param {number} tab
   */
  handleChordVisibilityClick = (type: string) => () => {
    const CHORD_CHANGE_INTERVAL = 10;
    const currentVisibleFlows = this.state.visibleFlows;
    if (type === '+'){
      const diffQty = testChordData.flows.length - currentVisibleFlows.length;
      if (diffQty === 0) return;
      const randomAddItemGenerator = RANDOM.array(diffQty < CHORD_CHANGE_INTERVAL ? diffQty : CHORD_CHANGE_INTERVAL, RANDOM.item(difference(testChordData.flows, currentVisibleFlows)));
      const newFlows: IFlow[] = randomAddItemGenerator();
      const visibleFlows = union(currentVisibleFlows, newFlows);
      this.setState({visibleFlows});
    }else {
      const randomRemoveItemGenerator = RANDOM.array(currentVisibleFlows < CHORD_CHANGE_INTERVAL ? currentVisibleFlows.length : CHORD_CHANGE_INTERVAL, RANDOM.item(currentVisibleFlows));
      const removedFlows: IFlow[] = randomRemoveItemGenerator();
      const visibleFlows = difference(currentVisibleFlows, removedFlows);
      this.setState({visibleFlows});
    }
  }

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
      // ChordData = [];
      chordData.flows = this.state.visibleFlows;
      component = (
        <ChordChart testChordData={chordData} />
      );
    }

    return (
      <div>
        <button onClick={this.handleClickTab(0)}>View Quads</button>
        <button onClick={this.handleClickTab(1)}>View Chord Demo</button>
        <button onClick={this.handleChordVisibilityClick('+')}>+</button>
        <button onClick={this.handleChordVisibilityClick('-')}>-</button>
        {component}
      </div>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'));
