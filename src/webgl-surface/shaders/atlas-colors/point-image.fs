/**
 * Simple shader for merely rendering a textured quad that references an atlas map.
 */
uniform sampler2D atlasTexture;

varying vec2 texCoordinate;
varying float opacity;
varying float aspect;

void main() {
  vec4 color = texture2D(atlasTexture, texCoordinate);
  color *= opacity;
  gl_FragColor = color;
}
