/**
 * Simple fragment shader for rendering a with a custom
 * color
 */

varying vec4 vColor;

void main() {
  gl_FragColor = vec4(vColor.a*vColor.r,vColor.a*vColor.g,vColor.a*vColor.b,vColor.a);
}
