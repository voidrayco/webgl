import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Color } from 'three';
import { AtlasColor, AtlasTexture, Bounds, WebGLSurface } from '../src';
import { CurvedEdgesSurface } from './gl-surfaces/curved-edges-surface';
import { PointIconSurface } from './gl-surfaces/point-icon-surface';
import { SimpleCircleSurface } from './gl-surfaces/simple-circle-surface';
const colors = [
  new AtlasColor(new Color(1.0, 0.0, 0.0), 1.0),
  new AtlasColor(new Color(1.0, 0.0, 1.0), 1.0),
];
const textureUrl = require('./textures/uvTest.png');
const textures = [
  new AtlasTexture(textureUrl),
];

/**
 * The state of the application
 */
export interface IMainState {
  currentTab: number,
  zoom: number,
}

/*
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
  handleClickTab = (tab: number) => () => {
    const selectElement = document.getElementById('getChosenTestValueSelect');
    tab = parseInt(selectElement.selectedOptions[0].value);
    this.setState({currentTab: tab});
  }

  /**
   * @override
   * The React defined render method
   */
  render() {
    let component;

    if (this.state.currentTab === 1) {
      component = (
        <SimpleCircleSurface
          backgroundColor={{r: 0.5, g: 0.5, b: 0.5, opacity: 1.0}}
          colors={colors}
          height={600}
          onZoomRequest={(zoom: number) => zoom}
          width={800}
          zoom={1.0}
          viewport={new Bounds(-200, 200, 200, -200)}
        />
      );
    }

    else if (this.state.currentTab === 2) {
      component = (
        <CurvedEdgesSurface
          backgroundColor={{r: 0.9, g: 0.9, b: 0.9, opacity: 1.0}}
          colors={colors}
          height={600}
          onZoomRequest={(zoom: number) => zoom}
          width={800}
          zoom={1.0}
          viewport={new Bounds(-200, 200, 200, -200)}
        />
      );

    }

    else if (this.state.currentTab === 0) {
      component = (
        <PointIconSurface
          backgroundColor={{r: 0.5, g: 0.5, b: 0.5, opacity: 1.0}}
          textures={textures}
          colors={colors}
          height={600}
          onZoomRequest={(zoom: number) => zoom}
          width={800}
          zoom={1.0}
          viewport={new Bounds(-200, 200, 200, -200)}
        />
      );
    }

    return (
      <div>
        <div>
          {component}
        </div>
        <div style={{marginTop: 4, padding: 4}}>
         Select surface test: <select id = "getChosenTestValueSelect" onClick={this.handleClickTab(0)}>
            <option value="0">CurvedEdgeSurface</option>
            <option value="1">Point Circle</option>
          </select>
      </div>
    </div >
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'));
