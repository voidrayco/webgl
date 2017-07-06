/**
 * Simple shader for merely rendering a texture to a point sprite. Point sprites
 * reduce bandwidth and memory usage significantly and also reduce vertices to be
 * processed
 */

/** The tex coordinate and opacity of the output texture {tx, ty, opacity} */
attribute vec3 texCoord;

/** Passes the tex coord to the FS */
varying vec2 texCoordinate;
/** Passes the specified opacity of the image to the FS */
varying float opacity;

void main() {
  texCoordinate = vec2(texCoord.x, texCoord.y);
  opacity = texCoord.z;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
