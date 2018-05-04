/**
  This is the current time passed as a global uniform so we can compare our line's
  start time with the current time.
**/
uniform float currentTime;

/**
 * Simple fragment shader for rendering a with a custom
 * color
 */

varying vec4 vertexColor;

/**
  This is the information necessary to render marching ants
  {
    x: start time,
    y: speed,
    z: length - gap,
    w: length,
  }
**/
varying vec4 marchingAnts;

/**
  This is the time representing 0 - 1 of how far down the line we are
**/
varying float interpolTime;

void main() {
  float speed = 1000.0 / marchingAnts.y;
  float currentTime = currentTime - marchingAnts.x;
  float offset = mod(currentTime / speed, 1.0);
  float currentTick = mod(interpolTime + offset, marchingAnts.w);

  if (currentTick > marchingAnts.z) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }

  else {
    gl_FragColor = vertexColor * vertexColor.a;
  }
}
