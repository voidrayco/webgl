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

    float uvWidth = UV.b - UV.r;
    float uvHeight = UV.a - UV.g;
    float aspectRatio = uvWidth / uvHeight;
    float halfAspect;

    if(aspectRatio < 1.0)
        halfAspect = 0.5 * aspectRatio;
    else
        halfAspect = 0.5 * 1 / aspectRatio; 

    if(aspectRatio < 1.0 && 
        ((gl_PointCoord.x < (0.5 - halfAspect)) ||
        (gl.PointCoord.x > (0.5 + halfAspect)
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        
    if(aspectRatio > 1.0 && 
        ((gl_PointCoord.y < (0.5 - halfAspect)) ||
        (gl.PointCoord.y > (0.5 + halfAspect)
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);

    
    vec2 uv = vec2(((gl_PointCoord.x * uvWidth) + UV.r), ((gl_PointCoord.y * uvHeight) + UV.g));
    gl_FragColor = texture2D(texture, uv) + tint.rgba;
}