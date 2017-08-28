/**
 * This is the pixel shader for drawing a circle. It takes a flat gl point square
 * shape and removes any pixels outside of the radius of the circle. In gl land
 * the square dimensions range from 0 - 1 for x and y (normalized coordinates)
 * so we simply exclude anything outside of distance 0.50 to get a circle. We
 * also discard anything inside of the inner radius which is the normalized value,
 * centerRadius.
 */

varying vec4 vColor;
varying vec4 iColor;
varying float centerRadius;

void main() {
  vec2 position = gl_PointCoord.xy - vec2(0.5, 0.5);
  float l = length(position);

  if(l > 0.50) {
    discard;
  } else if(l < centerRadius) {
    if(iColor.a == 0.0) {
      discard;
    } else {
      gl_FragColor = iColor;
    }
  } else {
    if(vColor.a == 0.0) {
      discard;
    } else {
      gl_FragColor = vColor;
    }
  }
}
