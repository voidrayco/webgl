uniform sampler2D colorAtlas;
uniform float colorsPerRow;
uniform vec2 firstColor;
uniform vec2 nextColor;

/** The tex coordinate and opacity of the output texture {tx, ty, opacity} */
attribute float colorPick;
attribute vec3 texCoord;

/** Passes the tex coord to the FS */
varying vec2 texCoordinate;
// This passes the calculated color of the vertex
varying vec4 tint;

vec4 pickColor(float index) {
  float row = floor(index / colorsPerRow);
  float col = index - (row * colorsPerRow);
  return texture2D(colorAtlas, firstColor + vec2(nextColor.x * col, nextColor.y * row));
}

void main() {
  texCoordinate = vec2(texCoord.x, texCoord.y);

  tint = pickColor(colorPick);

  /** Calculate the opacity for label */
  float opacity = texCoord.z;
  
  tint *= opacity;

  /** Calculate the new position in a label*/
  vec2 newPosition = position.xy;

  vec4 mvPosition = modelViewMatrix * vec4(newPosition, position.z, 1.0);
  gl_Position = (projectionMatrix * mvPosition);
}