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
/** Passes the opacity of the image to the FS */
varying float opacity;

uniform vec3 camera;
uniform float maxLabelSize;
uniform float startFade;
uniform float endFade;

void main() {
  texCoordinate = vec2(texCoord.x, texCoord.y);

  vec4 sizeVector1 = modelViewMatrix * vec4(size.x+camera.x, size.y+camera.y, 0.0, 1.0);
  vec4 sizeVector2 = projectionMatrix * sizeVector1;

  vec4 cameraVector1 = modelViewMatrix * vec4(camera.x, camera.y, 0.0, 1.0);
  vec4 cameraVector2 = projectionMatrix * cameraVector1;

  float projectHeight = sizeVector2.y - cameraVector2.y;

  /** Calculate the opacity for label */
  opacity = 1.0;
  if ( projectHeight < startFade && projectHeight > endFade) {
    opacity = ( projectHeight - endFade ) / ( startFade - endFade ); 
  }
  else if ( projectHeight <= endFade ) {
    opacity = 0.0;
  }

/** Calculate the new position in a label*/
  vec2 newPosition = position.xy;
  if ( projectHeight > maxLabelSize ) {
    float ratio = maxLabelSize / projectHeight;
    newPosition = anchor + ratio * ( newPosition - anchor);
  }

  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 0.0, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
