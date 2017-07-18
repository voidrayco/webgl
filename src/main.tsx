import { rgb } from 'd3-color';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Bezier } from './bezier';
import { ILineShapeData } from './bezier/shape-data-types/line-shape-data';
import { IQuadShapeData } from './bezier/shape-data-types/quad-shape-data';

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
  render() {
    let quadData: IQuadShapeData[] = [];

    if (this.state.currentTab === 0) {
      quadData = [...new Array(20)].map((_, i: number) =>
        ({
          id: i,
          position: {x: Math.random() * 480 + 10, y: Math.random() * 480 + 10},
          size: {width: Math.random() * 20 + 10, height: Math.random() * 20 + 10},
        }));
    }

    let lineData: ILineShapeData[] = [];
    if (this.state.currentTab === 1) {
      lineData = [...new Array(20)].map((_, i: number) =>
        ({
          color1: rgb(1, 0, 0),
          color2: rgb(0, 0, 1),
          id: i,
          p1: {x: Math.random() * 480 + 10, y: Math.random() * 480 + 10},
          p2: {x: Math.random() * 480 + 10, y: Math.random() * 480 + 10},
          thickness: 4,
        }));
    }

    return (
      <div>
        <button onClick={this.handleClickTab(0)}>View Quads</button>
        <button onClick={this.handleClickTab(1)}>View Lines</button>
        <Bezier quadData={quadData} lineData={lineData}/>
      </div>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'));
