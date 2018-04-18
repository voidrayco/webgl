/** @jsx h */
import { Component, h, render } from 'preact';

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
export class Main extends Component<any, IMainState> {
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
      component = null;
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

render(<Main/>, document.getElementById('main'));
