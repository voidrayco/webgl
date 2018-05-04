/**
 * Simple shader for merely rendering a textured quad that references an atlas map.
 */

uniform sampler2D atlasTexture;
varying vec2 texCoordinate;
varying vec4 tint;


void main() {
  vec4 color = texture2D(atlasTexture, texCoordinate);
  color *= tint;
  gl_FragColor = color;
}
