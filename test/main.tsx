import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Color } from 'three';
import { AtlasColor, WebGLSurface } from '../src';
import { CurvedEdgesSurface } from './gl-surfaces/curved-edges-surface';

const colors = [
  new AtlasColor(new Color(1.0, 0.0, 0.0), 1.0),
  new AtlasColor(new Color(1.0, 0.0, 1.0), 1.0),
];

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
    currentTab: 0,
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
        <CurvedEdgesSurface
          backgroundColor={{r: 1.0, g: 1.0, b: 1.0, opacity: 1.0}}
          colors={colors}
          height={600}
          onZoomRequest={(zoom: number) => zoom}
          width={800}
          zoom={1.0}
        />
      );
    }

    return (
      <div>
        <div>
          {component}
        </div>
        <div style={{marginTop: 4, padding: 4}}>
          <button onClick={this.handleClickTab(0)}>Demo Curved Edges</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'));
