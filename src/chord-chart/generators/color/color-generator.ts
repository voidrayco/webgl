import { ReferenceColor } from 'webgl-surface/drawing/reference/reference-color';
import { AtlasColor } from 'webgl-surface/drawing/texture/atlas-color';
import { ColorState, IChordChartConfig, IData } from '../types';
import { ColorBaseCache } from './color-base-cache';

const debug = require('debug')('label-generator');

export class ColorGenerator {
  baseCache: ColorBaseCache = new ColorBaseCache();
  currentData: IData;

  /**
   * For colors, we only really need to figure out new colors iff the data changes.
   * The data should be plenty of information to figure out all of the colors
   * needed to render.
   */
  bustCaches(data: IData, config: IChordChartConfig) {
    if (data !== this.currentData) {
      this.baseCache.bustCache = true;
    }

    this.currentData = data;
  }

  /**
   * Generate all of the colors needed for rendering.
   */
  generate(data: IData, config: IChordChartConfig) {
    debug('Generating Labels');
    this.bustCaches(data, config);
    this.baseCache.generate(data, config);
  }

  getBaseBuffer(): AtlasColor[] {
    return this.baseCache.getBuffer();
  }

  /**
   * This looks up a color by state then endpoint id. If the state or the endpoint
   * do not exist, then null is returned.
   */
  pick(state: ColorState, endpointId: string): ReferenceColor | null {
    const idToColor = this.baseCache.pick.get(state);
    let out: ReferenceColor | null = null;

    if (idToColor) {
      out = idToColor.get(endpointId) || null;
    }

    return out;
  }
}
