/**
 * Simple shader for merely rendering a texture to a point sprite. Point sprites
 * reduce bandwidth and memory usage significantly and also reduce vertices to be
 * processed
 */

/** The tex coordinate and opacity of the output texture {tx, ty, opacity} */
attribute vec3 texCoord;
/** The size of the largest side of the image */
attribute float size;
/** The aspect ratio of the image */
attribute float aspectRatio;

/** Passes the tex coord to the FS */
varying vec2 texCoordinate;
/** Passes the specified opacity of the image to the FS */
varying float opacity;
/** Passes the aspect ratio of the image to the FS */
varying float aspect;

void main() {
  texCoordinate = texCoord.xy;
  opacity = texCoord.z;
  aspect = aspectRatio;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size;
}
