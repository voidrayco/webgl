/**
 * Vertex Shader for rendering textured sprites
 */

precision mediump float;

attribute vec2 size;

attribute vec4 tint;
varying vec4 vTint;

attribute vec2 uvCoordinate;
varying vec2 vUvCoordinate;

attribute float height;
varying float vHeight;
attribute float width;
varying float vWidth;
uniform float zoom;

void main(void) {
    vHeight = height;
    vWidth = width;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vTint = tint;
    vUvCoordinate = aUvCoordinate;
    gl_PointSize = size.x * zoom;
    gl_Position = projectionMatrix * mvPosition;
}