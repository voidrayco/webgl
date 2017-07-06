import {rgb, RGBColor} from 'd3-color';

/**
 * This is a utility for converting 0-1 rgb values to a d3 color object
 *
 * @param {r,g,b} {} The rgb colors to convert to an rgb d3 object
 * @param {number} bias The amount
 */
export const rgbaToD3Color = ({r2, g2, b2}: {r2: number, g2: number, b2: number}, bias = 255): RGBColor =>
  rgb(r2 * bias, g2 * bias, b2 * bias, 1);
