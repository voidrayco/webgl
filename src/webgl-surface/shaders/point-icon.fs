/**
 * Fragment Shader for rendering textured sprites
 */

precision mediump float;
uniform sampler2D atlasTexture;
varying vec4 tint;
varying vec4 UV;

void main(void) {

  float additiveModX = UV.r;
  float additiveModY = UV.a;
  float uvWidth = UV.b - UV.r;
  float uvHeight = UV.g - UV.a;
  float aspectRatio = uvWidth / uvHeight;
  float multiplicativeMod;

  if(aspectRatio < 1.0)
		additiveModX = (additiveModX - (((uvHeight - uvWidth)) * 0.5));
	else if (aspectRatio > 1.0)
		additiveModY = (additiveModY - (((uvWidth - uvHeight)) * 0.5));

  if(aspectRatio < 1.0 && 
    ((gl_PointCoord.x < (0.5 - 0.5 * uvWidth / uvHeight)) ||
    (gl_PointCoord.x > 1.0 - (0.5 - (0.5 * uvWidth / uvHeight))))) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
  else if(aspectRatio > 1.0 && 
    ((gl_PointCoord.y < (0.5 - 0.5 * uvHeight / uvWidth)) ||
    (gl_PointCoord.y > 1.0 - (0.5 - 0.5 * uvHeight / uvWidth)))){
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
  else {
		if(aspectRatio > 1.0) {
			multiplicativeMod = uvWidth;
		}
		else if(aspectRatio < 1.0) {
			multiplicativeMod = uvHeight;
		}
		vec2 uv = vec2(additiveModX + (gl_PointCoord.x * multiplicativeMod), additiveModY + ((1.0 - gl_PointCoord.y) * multiplicativeMod));
    gl_FragColor = texture2D(atlasTexture, uv) + tint.rgba;
	}
}