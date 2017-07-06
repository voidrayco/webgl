import * as React from 'react'
import { BezierGL } from './gl/bezier-gl'
import { IQuadShapeData } from './shape-data-types/quad-shape-data'
import { QuadGenerator } from './generators/quad-generator'
import { QuadShape } from 'webgl-surface/drawing/quad-shape'

interface IBezierProps {
  quadData: IQuadShapeData[]
}

export class Bezier extends React.Component<IBezierProps, any> {
  quadGenerator: QuadGenerator

  componentWillMount() {
    this.quadGenerator = new QuadGenerator()
  }

  render() {
    const { quadData } = this.props

    this.quadGenerator.generate(quadData)

    return (
      <BezierGL quads={this.quadGenerator.getBaseBuffer()}/>
    )
  }
}
