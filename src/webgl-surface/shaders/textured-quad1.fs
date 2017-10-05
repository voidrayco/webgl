/**
 * Simple shader for merely rendering a textured quad that references an atlas map.
 */

uniform sampler2D atlasTexture;
uniform float startFade;
uniform float endFade;
varying vec2 texCoordinate;
varying float projectHeight;

void main() {
  vec4 color = texture2D(atlasTexture, texCoordinate);
  float opacity = 1.0;
  if ( projectHeight < startFade && projectHeight > endFade) {
    opacity = ( projectHeight - endFade ) / ( startFade - endFade ); 
  }
  else if ( projectHeight <= endFade ) {
    opacity = 0.0;
  }
  color *= opacity;
  
  gl_FragColor = color;
}
