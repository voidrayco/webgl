/**
 * Simple vertex shader for rendering a vertex with a custom
 * color
 */

 // These uniforms are information regarding the color atlas
uniform sampler2D colorAtlas;
uniform float colorsPerRow;
uniform vec2 firstColor;
uniform vec2 nextColor;

// Position attribute will contain the typical x, y, z position
// attribute vec3 position;
// Color pick for the vertex
attribute float colorPick;
// The vertex color we picked
varying vec4 vertexColor;

vec4 pickColor(float index) {
  float row = floor(index / colorsPerRow);
  float col = index - (row * colorsPerRow);
  return texture2D(colorAtlas, firstColor + vec2(nextColor.x * col, nextColor.y * row));
}

void main() {
  vertexColor = pickColor(colorPick);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
