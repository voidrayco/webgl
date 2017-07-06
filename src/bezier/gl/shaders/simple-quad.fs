/**
 * Simple fragment shader for rendering a with a custom
 * color
 */

varying vec4 vColor;

void main() {
  gl_FragColor = vColor;
}
