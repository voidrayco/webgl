/**
 * Vertex Shader for rendering our circles from point sprites
 */

uniform float zoom;

attribute float size;
attribute vec2 radii;
attribute vec4 color;
attribute vec4 innerColor;

varying vec4 vColor;
varying vec4 iColor;
varying float centerRadius;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  centerRadius = radii.y;
  vColor = color;
  iColor = innerColor;
  gl_PointSize = size * zoom;
  gl_Position = projectionMatrix * mvPosition;
}
