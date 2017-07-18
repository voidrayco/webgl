import { rgb } from 'd3-color';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Bezier } from './bezier';
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
          color: rgb(1, 1, 1, 1),
          id: i,
          lineWidth: 4,
          p1: {x: Math.random() * 480, y: Math.random() * 480},
          p2: {x: Math.random() * 480, y: Math.random() * 480},
        }),
      );
    }

    return (
      <div>
        <button onClick={this.handleClickTab(0)}>View Quads</button>
        <button onClick={this.handleClickTab(1)}>View Lines</button>
        <Bezier quadData={quadData}/>
      </div>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'));
