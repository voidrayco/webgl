import { color, rgb } from 'd3-color';
import { scaleOrdinal, schemeCategory20 } from 'd3-scale';
import { ReferenceColor } from 'webgl-surface/drawing/reference/reference-color';
import { AtlasColor } from 'webgl-surface/drawing/texture/atlas-color';
import { ShapeBufferCache } from 'webgl-surface/util/shape-buffer-cache';
import { ColorState, IChordChartConfig, IData, IEndpoint } from '../types';

const CHORD_DEFAULT_ALPHA = 0.4;
const CHORD_HOVER_ALPHA = 0.8;
const CHORD_INACTIVE_ALPHA = 0.15;
const OUTER_RING_DEFAULT_ALPHA = 1.0;
const OUTER_RING_HOVER_ALPHA = 1.0;
const OUTER_RING_INACTIVE_ALPHA = 0.1;

/**
 * Responsible for generating all of the unique colors that will be needed within
 * the render
 */
export class ColorBaseCache extends ShapeBufferCache<AtlasColor> {
  // Pick a reference color via Color state, endpoint id
  pick = new Map<ColorState, Map<string, ReferenceColor>>();

  generate(data: IData, config: IChordChartConfig) {
    super.generate.apply(this, arguments);
  }

  buildLookUp(state: ColorState, endpointId: string, color: AtlasColor) {
    let map1 = this.pick.get(state);

    if (!map1) {
      map1 = new Map<string, ReferenceColor>();
      this.pick.set(state, map1);
    }

    map1.set(endpointId, new ReferenceColor(color));
  }

  buildCache(data: IData, config: IChordChartConfig) {
    this.pick = new Map<ColorState, Map<string, ReferenceColor>>();

    const allColors: AtlasColor[] = [];
    const ids = data.endpoints.map((endpoint) => endpoint.id);
    const calculateColor = scaleOrdinal(schemeCategory20).domain(ids);

    const toProcess = [...data.tree];

    while (toProcess.length > 0) {
      const endpoint: IEndpoint = toProcess.shift();
      toProcess.push(...endpoint.children);
      let { r, g, b } = rgb(color(calculateColor(endpoint.id)));
      r /= 255.0;
      g /= 255.0;
      b /= 255.0;

      // Generate all of the colors desired
      const chordDefault = new AtlasColor(r, g, b, CHORD_DEFAULT_ALPHA);
      const chordHover = new AtlasColor(r, g, b, CHORD_HOVER_ALPHA);
      const chordInactive = new AtlasColor(r, g, b, CHORD_INACTIVE_ALPHA);
      const outerRingDefault = new AtlasColor(r, g, b, OUTER_RING_DEFAULT_ALPHA);
      const outerRingHover = new AtlasColor(r, g, b, OUTER_RING_HOVER_ALPHA);
      const outerRingInactive = new AtlasColor(r, g, b, OUTER_RING_INACTIVE_ALPHA);

      // Make a lookup for the color references
      this.buildLookUp(ColorState.OUTER_RING_DEFAULT, endpoint.id, outerRingDefault);
      this.buildLookUp(ColorState.OUTER_RING_HOVER, endpoint.id, outerRingHover);
      this.buildLookUp(ColorState.OUTER_RING_INACTIVE, endpoint.id, outerRingInactive);
      this.buildLookUp(ColorState.CHORD_DEFAULT, endpoint.id, chordDefault);
      this.buildLookUp(ColorState.CHORD_HOVER, endpoint.id, chordHover);
      this.buildLookUp(ColorState.CHORD_INACTIVE, endpoint.id, chordInactive);

      // Add the colors to our all colors
      allColors.push(
        chordDefault,
        chordHover,
        chordInactive,
        outerRingDefault,
        outerRingHover,
        outerRingInactive,
      );
    }

    this.buffer = allColors;
  }
}
