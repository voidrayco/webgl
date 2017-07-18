import * as React from 'react';
import { Bounds } from 'webgl-surface/primitives/bounds';
import { LineGenerator } from './generators/line-generator';
import { QuadGenerator } from './generators/quad-generator';
import { BezierGL } from './gl/bezier-gl';
import { ILineShapeData } from './shape-data-types/line-shape-data';
import { IQuadShapeData } from './shape-data-types/quad-shape-data';
const debug = require('debug')('bezier');

interface IBezierProps {
  quadData: IQuadShapeData[],
  lineData: ILineShapeData[]
}

/**
 * This defines a component that will render some test results. The shapes
 * rendered will be quads or bezier curves. The quads are for sanity and
 * debugging purposes.
 */
export class Bezier extends React.Component<IBezierProps, any> {
  /** This is the generator that produces the buffers for our quads */
  quadGenerator: QuadGenerator;

  lineGenerator: LineGenerator;
  /**
   * @override
   * We initialize any needed state here
   */
  componentWillMount() {
    this.quadGenerator = new QuadGenerator();
    this.lineGenerator = new LineGenerator();
  }

  /**
   * @override
   * The react render method
   */
  render() {
    const { quadData, lineData } = this.props;

    this.quadGenerator.generate(quadData);
    debug(this.quadGenerator.getBaseBuffer());

    this.lineGenerator.generate(lineData);
    debug(this.lineGenerator.getBaseBuffer());

    return (
      <BezierGL
        quads={this.quadGenerator.getBaseBuffer()}
        lines={this.lineGenerator.getBaseBuffer()}
        height={500}
        initialViewport={new Bounds<never>(0, 500, 0, 500)}
        width={500}
      />
    );
  }
}
