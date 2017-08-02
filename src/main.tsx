import { rgb, RGBColor } from 'd3-color';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Bezier } from './bezier';
import { IQuadShapeData } from './bezier/shape-data-types/quad-shape-data';
import { ChordChart } from './chord-chart';
import { CurveShape } from './webgl-surface/drawing/curve-shape';
import { IPoint } from './webgl-surface/primitives/point';

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
    currentTab: 1,
  };

  hemiSphere: boolean = false;

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

      this.hemiSphere = false;

      component = (
        <ChordChart hemiSphere={this.hemiSphere}/>
      );
    }
    if (this.state.currentTab === 2){
      this.hemiSphere = true;

      component = (
        <ChordChart hemiSphere={this.hemiSphere}/>
      );
    }

    if (this.state.currentTab === 1){
      // Start point & end point
      const p1: IPoint = {x: 150, y: 150}, p2: IPoint = {x: 500, y: 150};

      // Control points
      const cps: IPoint[] = [];
      const c1: IPoint = {x: 325, y: 500}, c2: IPoint = {x: 400, y: 550};

      cps.push(c1);
      cps.push(c2);

      // Color
      const color: RGBColor = rgb (0, 0, 1, 1);

    /**
     * YoYo's  example: a curveshape with Tab=1
     * Start points:p1 {150,150}, p2 {500,150}
     * Control points: c1 {325,500}, c2 {400,550}
     * LindeWidth: 5
     * Number of segments: 40
     * Color: Blue
     */
      const d: CurveShape<IPoint> = new CurveShape(p1, p2, cps, 5, 40, color);

      quadData = [...new Array(d.segNum)].map((_, i: number) =>
      ({
          color: d.color,
          id: i,
          lineWidth: d.lineWidth,
          p1: d.segPoints[i],
          p2: d.segPoints[i + 1],
      }),
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
