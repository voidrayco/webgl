/**
 * Fragment Shader for rendering textured sprites
 */

precision mediump float;
uniform sampler2D texture;
varying vec4 tint;
varying vec4 UV;
varying float textureWidth;
varying float textureHeight;

void main(void) {

  float addModX = UV.r;
  float addModY = UV.g;
  float uvWidth = UV.b - UV.r;
  float uvHeight = UV.a - UV.g;
  float aspectRatio = uvWidth / uvHeight;
  float multMod;

  if(aspectRatio < 1.0)
		addModX = (addModX - (((uvHeight - uvWidth)) * 0.5));
	else if (aspectRatio > 1.0)
		addModY = (addModY - (((uvWidth - uvHeight)) * 0.5));

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
			multMod = uvWidth;
		}
		else if(aspectRatio < 1.0) {
			multMod = uvHeight;
		}
		vec2 uv = vec2(addModX + (gl_PointCoord.x * multMod), addModY + (gl_PointCoord.y * multMod));
    gl_FragColor = texture2D(texture, uv) + tint.rgba;
	}