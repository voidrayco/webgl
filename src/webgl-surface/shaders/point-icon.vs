/**
 * Vertex Shader for rendering textured sprites
 */

precision mediump float;


uniform sampler2D colorAtlas;
uniform float colorsPerRow;
uniform vec2 firstColor;
uniform vec2 nextColor;
uniform float zoom;

attribute vec2 size;
attribute float tintPick;
attribute vec2 uvCoordinate;
attribute float height;
attribute float width;

varying vec4 tint;
varying vec2 UV;
varying float textureHeight;
varying float textureWWidth;

vec4 pickColor(float index) {
  float row = floor(index / colorsPerRow);
  float col = index - (row * colorsPerRow);
  return texture2D(colorAtlas, firstColor + vec2(nextColor.x * col, nextColor.y * row));
}

void main(void) {
    tint = pickColor(tintPick);
    textureHeight = height;
    textureWidth = width;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    tint = tintPick;
    UV = uvCoordinate;
    gl_PointSize = size.x * zoom;
    gl_Position = projectionMatrix * mvPosition;
}