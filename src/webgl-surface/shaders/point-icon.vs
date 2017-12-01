/**
 * Vertex Shader for rendering textured sprites
 */

precision mediump float;

attribute vec2 size;

attribute vec4 customColor;
varying vec4 vColor;

attribute vec2 uvCoordinates;
varying vec2 vUvCoordinates;

attribute float height;
varying float vHeight;
attribute float width;
varying float vWidth;
uniform float zoom;

void main(void) {
    vHeight = height;
    vWidth = width;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vColor = customColor;
    vUv = aUv;
    gl_PointSize = size.x * zoom;
    gl_Position = projectionMatrix * mvPosition;
}