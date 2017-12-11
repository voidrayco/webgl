import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Color } from 'three';
import { AtlasColor, Bounds, Label, ReferenceColor } from '../src';
import { CurvedEdgesSurface } from './gl-surfaces/curved-edges-surface';
import { LabelSurface } from './gl-surfaces/label-surface';

const colors = [
  new AtlasColor(new Color(1.0, 0.0, 0.0), 1.0),
  new AtlasColor(new Color(1.0, 0.0, 1.0), 1.0),
  new AtlasColor(new Color(1.0, 1.0, 1.0), 1.0),
];

const labels = [
  new Label({
    color: new ReferenceColor(colors[2]),
    font: 'Lucida Sans Unicode',
    fontSize: 14,
    fontWeight: 400,
    rasterizationOffset: {
      x: 0,
      y: 10,
    },
    rasterizationPadding: {
      height: 2,
      width: 4,
    },
    text: 'the quick brown fox jumped over the lazy dog.',
  }),
  new Label({
    color: new ReferenceColor(colors[2]),
    font: 'Lucida Sans Unicode',
    fontSize: 14,
    fontWeight: 400,
    rasterizationOffset: {
      x: 0,
      y: 10,
    },
    rasterizationPadding: {
      height: 2,
      width: 4,
    },
    text: 'THE QUICK BROWN FOX JUMPED OVER THE LAZY DOG.',
  }),
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
  selectDropdown: HTMLSelectElement;

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
    tab = parseInt(this.selectDropdown.selectedOptions[0].value);
    this.setState({currentTab: tab});
  }

  /**
   * @override
   * The React defined render method
   */
  render() {
    let component;

    if (this.state.currentTab === 0) {
      component = (
        <LabelSurface
          backgroundColor={{r: 0.5, g: 0.5, b: 0.5, opacity: 1.0}}
          colors={colors}
          height={600}
          onZoomRequest={(zoom: number) => zoom}
          width={800}
          zoom={1.0}
          viewport={new Bounds(-400, 400, 400, -400)}
          labels={labels}
        />
      );
    }

    else if (this.state.currentTab === 1) {
      component = (
        <CurvedEdgesSurface
          backgroundColor={{r: 0.7, g: 0.7, b: 0.7, opacity: 1.0}}
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
          Select surface test:
          <select ref={n => this.selectDropdown = n} onClick={this.handleClickTab(0)}>
            <option value="0">LabelSurface</option>
            <option value="1">CurvedEdgeSurface</option>
          </select>
      </div>
    </div >
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'));
