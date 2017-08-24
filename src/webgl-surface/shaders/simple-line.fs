/**
 * Simple fragment shader for rendering a with a custom
 * color
 */

varying vec4 vertexColor;

void main() {
  gl_FragColor = vertexColor * vertexColor.a;
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
