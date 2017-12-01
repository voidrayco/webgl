/**
 * Fragment Shader for rendering textured sprites
 * vec4 uv - .r = u  .g = v  .b = size X   .a = size Y
 */

precision mediump float;
uniform sampler2D texture;
varying vec4 vColor;
varying vec4 vUvCoordinate;
varying float vWidth;
varying float vHeight;

void main(void) {
    vec2 uv = vec2(((gl_PointCoord.x * vUvCoordinate.b) + vUvCoordinate.r), ((gl_PointCoord.y * vUvCoordinate.a) + vUvCoordinate.g));\
    gl_FragColor = texture2D(texture, uv) + vColor.rgba;\
}
