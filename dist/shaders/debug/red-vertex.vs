varying vec4 vertexColor;

void main() {
  vertexColor = vec4(1.0, 0.0, 0.0, 1.0);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
