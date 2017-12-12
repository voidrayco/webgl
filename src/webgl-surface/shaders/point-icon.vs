/**
 * Vertex Shader for rendering textured sprites
 */

uniform sampler2D colorAtlas;
uniform float colorsPerRow;
uniform vec2 firstColor;
uniform vec2 nextColor;
uniform float zoom;

attribute vec2 size;
attribute float tintPick;
attribute vec4 uvCoordinate;

varying vec4 tint;
varying vec4 UV;

vec4 pickColor(float index) {
  float row = floor(index / colorsPerRow);
  float col = index - (row * colorsPerRow);
  return texture2D(colorAtlas, firstColor + vec2(nextColor.x * col, nextColor.y * row));
}

void main(void) {
  UV = uvCoordinate;

  tint = pickColor(tintPick);

  gl_PointSize = size.x * zoom;
  vec2 newPosition = position.xy;

  vec4 mvPosition = modelViewMatrix * vec4(newPosition, position.z, 1.0);
  gl_Position = (projectionMatrix * mvPosition);
}