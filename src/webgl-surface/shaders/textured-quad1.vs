/**
 * Simple shader for merely rendering a texture to a point sprite. Point sprites
 * reduce bandwidth and memory usage significantly and also reduce vertices to be
 * processed
 */

// These uniforms are information regarding the color atlas
uniform sampler2D colorAtlas;
uniform float colorsPerRow;
uniform vec2 firstColor;
uniform vec2 nextColor;

/** The tex coordinate and opacity of the output texture {tx, ty, opacity} */
attribute vec3 texCoord;
attribute vec2 size;
attribute vec2 anchor;
attribute float colorPick;

/** Passes the tex coord to the FS */
varying vec2 texCoordinate;
/** Passes the opacity of the image to the FS */
varying float opacity;
// This passes the calculated color of the vertex
varying vec4 labelColorPick;

uniform vec3 camera;
uniform float maxLabelSize;
uniform float startFade;
uniform float endFade;

vec4 pickColor(float index) {
  float row = floor(index / colorsPerRow);
  float col = index - (row * colorsPerRow);
  return texture2D(colorAtlas, firstColor + vec2(nextColor.x * col, nextColor.y * row));
}

void main() {
  texCoordinate = vec2(texCoord.x, texCoord.y);

  labelColorPick = mix(pickColor(colorPick),pickColor(colorPick),position.x);

  vec4 sizeVector1 = modelViewMatrix * vec4(size.x+camera.x, size.y+camera.y, 0.0, 1.0);
  vec4 sizeVector2 = projectionMatrix * sizeVector1;

  vec4 cameraVector1 = modelViewMatrix * vec4(camera.x, camera.y, 0.0, 1.0);
  vec4 cameraVector2 = projectionMatrix * cameraVector1;

  float height = sizeVector2.y - cameraVector2.y;

  /** Calculate the opacity for label */
  opacity = 1.0;
  if ( height < startFade && height > endFade) {
    opacity = ( height - endFade ) / ( startFade - endFade ); 
  }
  else if ( height <= endFade ) {
    opacity = 0.0;
  }

  /** Calculate the new position in a label*/
  vec2 newPosition = position.xy;
  if ( height > maxLabelSize ) {
    float ratio = maxLabelSize / height;
    newPosition = anchor + ratio * ( newPosition - anchor);
  }

  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 0.0, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
