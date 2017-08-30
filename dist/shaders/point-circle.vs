/**
 * Vertex Shader for rendering our circles from point sprites
 */

uniform float zoom;

attribute vec2 size;
attribute vec4 customColor;
attribute vec4 customInnerColor;

varying vec4 vColor;
varying vec4 iColor;
varying float centerRadius;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  centerRadius = size.y / size.x;
  vColor = customColor;
  iColor = customInnerColor;
  gl_PointSize = size.x * zoom;
  gl_Position = projectionMatrix * mvPosition;
}
