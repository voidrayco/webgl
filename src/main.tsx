import { rgb } from 'd3-color';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Bezier } from './bezier';
import { IQuadShapeData } from './bezier/shape-data-types/quad-shape-data';
import { ChordChart } from './chord-chart';

/**
 * The state of the application
 */
interface IMainState {
  currentTab: number
}

/**
 * Entry class for the Application
 */
export class Main extends React.Component<any, IMainState> {
  // Set the default state
  state = {
    currentTab: 0,
  };

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
  render(){
    let quadData: IQuadShapeData[] = [];
    let chordData = [];
    let component;
    let hasHemiSphere: boolean = false;

    if (this.state.currentTab === 0) {
      quadData = [...new Array(200)].map((_, i: number) =>
        ({
          color: rgb(1, 1, 1, 1),
          id: i,
          lineWidth: 1,
          p1: {x: Math.random() * 480 + 10, y: Math.random() * 480 + 10},
          p2: {x: Math.random() * 480 + 10, y: Math.random() * 480 + 10},
        }),
      );

      component = (
        <Bezier quadData={quadData}/>
      );
    }

    if (this.state.currentTab === 1) {
      chordData = [];
      hasHemiSphere = false;
      component = (
        <ChordChart hemiSphere={hasHemiSphere}/>
      );
    }
    if (this.state.currentTab === 2){
      hasHemiSphere = true;
      component = (
        <ChordChart hemiSphere={hasHemiSphere}/>
      );
    }

    return (
      <div>
        <button onClick={this.handleClickTab(0)}>View Quads</button>
        <button onClick={this.handleClickTab(1)}>View Chord Demo</button>
        <button onClick={this.handleClickTab(2)}>HemiSphere</button>
        {component}
      </div>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'));
