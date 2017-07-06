import {rgb, RGBColor} from 'd3-color'

export const rgbaToD3Color = ({r2, g2, b2}: {r2: number, g2: number, b2: number}, bias = 255): RGBColor =>
  rgb(r2 * bias, g2 * bias, b2 * bias, 1)
