import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Bezier } from '../src/bezier';
import { IQuadShapeData } from '../src/bezier/shape-data-types/quad-shape-data';
import { ChordChart } from '../src/chord-chart';
import { IChord, IEndpoint } from '../src/chord-chart/generators/types';

const testChordData = require('./chord-test-data/two.json');
const chords: IChord[] = testChordData.flows;
const endpoints: IEndpoint[] = testChordData.endpoints;

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
    currentTab: 1,
    zoom: 1,
  };

  handleEndPointClicked = (selection : string) => {
    const endpoint: IEndpoint = endpoints.find(end => end.id === selection);
    const startChords: IChord[] = chords.filter(chord => chord.srcTarget === selection);
    const endChords: IChord[] = chords.filter(chord => chord.dstTarget === selection);
    const childrenNumber = 2 + Math.floor(4 * Math.random());
    const shiftStartNumber = Math.floor(startChords.length / childrenNumber);
    const shiftEndNumber = Math.floor(endChords.length / childrenNumber);

    let newEndpoint: IEndpoint;

    // Generate new child endpoints for the endpoint and shift any chords
    // Pointing to it, to it's children (evenly dispersed)
    for (let i = 0; i < childrenNumber; ++i) {
      newEndpoint = {
        id: `${endpoint.id}_${i}`,
        name: `${endpoint.name}_${i}`,
        parent: endpoint.id,
        weight: endpoint.weight / childrenNumber,
      };

      if (startChords.length > 0) {
        for (let k = 0; k < shiftStartNumber; ++k) {
          const chord = startChords.pop();
          chord.srcTarget = newEndpoint.id;
        }
      }

      if (endChords.length > 0) {
        for (let k = 0; k < shiftEndNumber; ++k) {
          const chord = endChords.pop();
          chord.dstTarget = newEndpoint.id;
        }
      }

      endpoints.push(newEndpoint);
    }

    // Push any remaining chords to the last new endpoint
    if (newEndpoint) {
      while (startChords.length > 0) {
        const chord = startChords.pop();
        chord.srcTarget = newEndpoint.id;
      }

      while (endChords.length > 0) {
        const chord = endChords.pop();
        chord.dstTarget = newEndpoint.id;
      }
    }

    this.forceUpdate();
  }

  handleZoomRequest = (zoom: number) => {
    this.setState({
      zoom,
    });
  }

  /**
   * Splits an existing leaf-level endpoint (with minimum size criteria) into two endpoints
   */
  addEndpoint = () => {
    const endpoint: IEndpoint = {
      id: `New Endpoint ${Math.floor((Math.random() * 1000000))}`,
      name: `New Endpoint ${Math.floor((Math.random() * 1000000))}`,
      parent: endpoints[Math.floor(Math.random() * endpoints.length)].id,
      weight: Math.random() * 100 + 10,
    };

    endpoints.push(endpoint);

    this.forceUpdate();
  }

  /**
   * Removes an existing leaf-level endpoint, adjusting other endpoints to fill in space
   */
  removeEndpoint = () => {
    if (endpoints.length > 1) {
      endpoints.splice(
        Math.floor(endpoints.length * Math.random()),
        1,
      );

      this.forceUpdate();
    }
  }

  /**
   * Adds random chords to existing end points
   */
  addChords = () => {
    for (let i = 0; i < 10; ++i) {
      const start = endpoints[Math.floor(Math.random() * endpoints.length)];
      let end = start;

      while (end.id === start.id) {
        end = endpoints[Math.floor(Math.random() * endpoints.length)];
      }

      const chord: IChord = {
        dstTarget: end.id,
        srcTarget: start.id,
      };

      chords.push(chord);
    }

    this.forceUpdate();
  }

  /**
   * Removes chords from existing end points
   */
  removeChords = () => {
    for (let i = 0; i < 10 && chords.length > 1; ++i) {
      chords.splice(Math.floor(Math.random() * chords.length), 1);
    }

    this.forceUpdate();
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
  render(){
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
      component = (
        <ChordChart
          onEndPointClick={this.handleEndPointClicked}
          hemiSphere={false}
          data={testChordData}
        />
      );
    }

    if (this.state.currentTab === 2) {
      component = (
        <ChordChart
          onEndPointClick={this.handleEndPointClicked}
          hemiSphere={true}
          data={testChordData}
        />
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
          <button onClick={this.handleClickTab(2)}>HemiSphere</button>
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
