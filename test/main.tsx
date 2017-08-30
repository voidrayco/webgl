import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as VoidGL from '../src';

/**
 * The state of the application
 */
export interface IMainState {
  currentTab: number,
  zoom: number,
}

/**
 * Entry class for the Application
 */
export class Main extends React.Component<any, IMainState> {
  // Set default state values
  state: IMainState = {
    currentTab: 2,
    zoom: 1,
  };

  handleZoomRequest = (zoom: number) => {
    this.setState({
      zoom,
    });
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
    let component;

    if (this.state.currentTab === 0) {
      component = (
        <VoidGL.WebGLSurface/>
      );
    }

    return (
      <div>
        <div>
          {component}
        </div>
        <div style={{marginTop: 4, padding: 4}}>
          <button onClick={this.handleClickTab(0)}>View Quads</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'));
