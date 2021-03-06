// These uniforms are information regarding the color atlas
uniform sampler2D colorAtlas;
uniform float colorsPerRow;
uniform vec2 firstColor;
uniform vec2 nextColor;
uniform float zoom;

// The location of the circle is stored in position, which inclides the z
// component where depth is stored
// The radius of the circle
attribute float radius;
// The inner radius of the circle where the inner color will be rendered
attribute float innerRadius;
// The color of the circle
attribute float colorPick;
attribute float innerColorPick;

// This passes the calculated color of the vertex
varying vec4 outerColor;
varying vec4 innerColor;
// This is the inner radius length normalized to the size of the gl Point
varying float normalizedInnerRadius;
// The larger this gets the more blurred the edge gets
// Recommended to approach the value of 0.01 the larger
// the circle gets and be somewhere around 0.5 for < 15 sizes
varying float edgeSharpness;

vec4 pickColor(float index) {
  float row = floor(index / colorsPerRow);
  float col = index - (row * colorsPerRow);
  return texture2D(colorAtlas, firstColor + vec2(nextColor.x * col, nextColor.y * row));
}

void main() {
  // Set the color of the circle
  outerColor = pickColor(colorPick);
  innerColor = pickColor(innerColorPick);
  // Set the circle size based on radius and the camera's current zoom level
  gl_PointSize = radius * 2.0 * zoom;
  // Normalize the inner radius against the radius so the fragment shader doesn't
  // need to calculate that
  normalizedInnerRadius = innerRadius / radius;
  // We want the edge to get clurrier the small the size is. This prevents our
  // circle from looking like a square when small AND prevents the edge from
  // looking like fuzz when large
  edgeSharpness = mix(0.8, 0.01, min(gl_PointSize / 45.0, 1.0));
  // Set the position of the circle
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
