/**
 * Simple fragment shader for rendering a with a custom
 * color
 */

varying vec4 vertexColor;

void main() {
  gl_FragColor = vertexColor * vertexColor.a;
}
