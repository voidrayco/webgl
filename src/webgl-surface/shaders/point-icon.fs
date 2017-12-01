/**
 * Fragment Shader for rendering textured sprites
 * vec4 uv - .r = u  .g = v  .b = size X   .a = size Y
 */

precision mediump float;
uniform sampler2D texture;
varying vec4 vTint;
varying vec4 vUvCoordinate;
varying float vWidth;
varying float vHeight;

void main(void) {
    float textureWidth = vUvCoordinate.b - vUvCoordinate.r;
    float textureHeight = vUvCoordinate.a - vUvCoordinate.g;
    float aspectRatio = textureWidth / textureHeight;
    float halfAspect;

    if(aspectRatio < 1.0)
        halfAspect = 0.5 * aspectRatio;
    else
        halfAspect = 0.5 * 1 / aspectRatio; 

    if(aspectRatio < 1.0 && 
        ((gl_PointCoord.x < (0.5 - halfAspect)) ||
        (gl.PointCoord.x > (0.5 + halfAspect)
        discard;
        
    if(aspectRatio > 1.0 && 
        ((gl_PointCoord.y < (0.5 - halfAspect)) ||
        (gl.PointCoord.y > (0.5 + halfAspect)
        discard;

    
    vec2 uv = vec2(((gl_PointCoord.x * vUvCoordinate.b) + vUvCoordinate.r), ((gl_PointCoord.y * vUvCoordinate.a) + vUvCoordinate.g));
    gl_FragColor = texture2D(texture, uv) + vTint.rgba;
}
