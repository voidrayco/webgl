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
// The color of the circle
attribute float colorPick;

// This passes the calculated color of the vertex
varying vec4 vertexColor;

vec4 pickColor(float index) {
  float row = floor(index / colorsPerRow);
  float col = index - (row * colorsPerRow);
  return texture2D(colorAtlas, firstColor + vec2(nextColor.x * col, nextColor.y * row));
}

void main() {
  // Set the color of the circle
  vertexColor = pickColor(colorPick);

  // Set the circle size based on radius and the camera's current zoom level
  gl_PointSize = radius * 2.0;

  // Set the position of the circle
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
