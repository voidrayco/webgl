/**
 * Simple vertex shader for rendering a vertex with a custom
 * color
 */

attribute vec4 customColor;
varying vec4 vColor;
void main() {
  vColor = customColor;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
}
