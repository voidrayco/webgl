/**
 * Simple shader for merely rendering a texture to a point sprite. Point sprites
 * reduce bandwidth and memory usage significantly and also reduce vertices to be
 * processed
 */

/** The tex coordinate and opacity of the output texture {tx, ty, opacity} */
attribute vec3 texCoord;
attribute vec2 size;
attribute vec2 anchor;

/** Passes the tex coord to the FS */
varying vec2 texCoordinate;
/** Passes the projectedHeight of the image to the FS */
varying float projectHeight;

uniform vec3 camera;
uniform float maxLabelSize;

void main() {
  texCoordinate = vec2(texCoord.x, texCoord.y);

  vec4 sizeVector1 = modelViewMatrix * vec4(size.x+camera.x, size.y+camera.y, 0.0, 1.0);
  vec4 sizeVector2 = projectionMatrix * sizeVector1;

  vec4 cameraVector1 = modelViewMatrix * vec4(camera.x, camera.y, 0.0, 1.0);
  vec4 cameraVector2 = projectionMatrix * cameraVector1;

  projectHeight = sizeVector2.y - cameraVector2.y;

  float modelViewHeight = sizeVector1.y - cameraVector1.y;
  vec4 newPostion = vec4(position, 1.0);
  if ( projectHeight > maxLabelSize ) {
    float ratio = maxLabelSize / projectHeight;
    newPostion.x = anchor.x + ratio * ( position.x - anchor.x);
    newPostion.y = anchor.y + ratio * ( position.y - anchor.y);
  }

  vec4 mvPosition = modelViewMatrix * newPostion;
  gl_Position = projectionMatrix * mvPosition;
}
