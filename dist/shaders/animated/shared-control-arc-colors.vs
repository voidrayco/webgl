// These uniforms are information regarding the color atlas
uniform sampler2D colorAtlas;
uniform float colorsPerRow;
uniform vec2 firstColor;
uniform vec2 nextColor;
// This is the shared control point for all of the vertices
// Allows up to 10 unique control points
uniform float controlPoints[20];
uniform float currentTime;

float PI = 3.1415926535897932384626433832795;
float PI_2 = 6.2831853072;

/**
  Position contains this information:
  {
    x: the bezier time value for the current vertex
    y: the total number of vertices for the curve
    z: the z depth
  }
**/
/**
  The picked colors for the item
  {
    x: start color
    y: start color stop
    z: end color
    w: end color stop
  }
**/
attribute vec4 colorPicks;
/** This lets the line select a control point from the array of control point values in the uniform */
attribute float controlPick;
// THis is used to compare against the currentTime uniform to determine how far
// along our interpolation we are
/**
  {
    x: start time,
    y: duration,
  }
**/
attribute vec2 timing;
// 1 or -1, used to indicate the direction
attribute float normalDirection;
// (x,y) is the first point, (z,w) is the second point
attribute vec4 endPoints;
attribute float halfLinewidth;

// This passes the calculated color of the vertex
varying vec4 vertexColor;

/**
  Calculates position of a point via circular interpolation

  float t - The current time (0-1) for the interpolation value
  float rt - Current time reverse (1.0 - t)
  vec2 p1 - The start point of the arc
  vec2 p2 - The end point of the arc
  vec2 c1 - The center of the circle for the arc
**/
vec2 makeCircular(float t, vec2 p1, vec2 p2, vec2 c1) {
  // Get the direction vector from the circle center to the first end point
  vec2 direction1 = p1 - c1;
  // Get the angle of the first vector
  float theta1 = atan(direction1.y, direction1.x);
  // Get the angle of the second vector
  vec2 direction2 = p2 - c1;
  float theta2 = atan(direction2.y, direction2.x);
  // Ensure our theta's are definitely between 0 to Math.PI * 2 after the atan
  // Calculation
  theta1 -= floor(theta1 / PI_2) * PI_2;
  theta2 -= floor(theta2 / PI_2) * PI_2;

  // Ensure our path around the arc is always the shortest distance
  float smaller = min(theta1, theta2);
  float larger = max(theta1, theta2);
  float dTheta1 = (smaller + PI_2) - larger;
  float dTheta2 = larger - smaller;

  // We use this to calculate how far we are between the two points in radians
  // Based on the time parameter provided for the interpolation
  float dTheta = min(dTheta1, dTheta2) * -t;

  // We must have the radial distance of both points to properly calculate
  // An easing between the two radii
  float radius = length(direction1);

  // Now we decide the start point of the circle in respect to the dtheta
  if (dTheta1 < dTheta2) {
    theta1 = smaller;
  }

  else {
    theta1 = larger;
  }

  return vec2(cos(theta1 + dTheta) * radius + c1.x, sin(theta1 + dTheta) * radius + c1.y);
}

vec4 pickColor(float index) {
  float row = floor(index / colorsPerRow);
  float col = index - (row * colorsPerRow);
  return texture2D(colorAtlas, firstColor + vec2(nextColor.x * col, nextColor.y * row));
}

void main() {
  float time = min((currentTime - timing.x) / timing.y, 1.0);

  if (time < 0.0) {
    time = 1.0;
  }

  // Calculate the color for the vertex
  vec4 startColor = mix(pickColor(colorPicks.x), pickColor(colorPicks.y), time);
  vec4 endColor = mix(pickColor(colorPicks.z), pickColor(colorPicks.w), time);
  vertexColor = mix(startColor, endColor, position.x);

  // Get the control point for the line
  vec2 controlPoint = vec2(controlPoints[int(controlPick)], controlPoints[int(controlPick + 1.0)]);

  vec2 p1 = vec2(endPoints.x, endPoints.y);
  vec2 p2 = vec2(endPoints.z, endPoints.w);

  // Calculate the position of this bezier point for the curve
  vec2 currentPosition = makeCircular(position.x, p1, p2, controlPoint);
  // Calculate the position of the previous point on the bezier curve
  time = position.x - (1.0 / position.y);
  vec2 prePosition = makeCircular(time, p1, p2, controlPoint);
  // Calculate the next point of the bezier curve
  time = position.x + (1.0 / position.y);
  vec2 nextPosition = makeCircular(time, p1, p2, controlPoint);

  vec2 preLine = prePosition - currentPosition;
  vec2 nextLine = nextPosition - currentPosition;
  vec2 currentNormal;

  // We now calculate a normal that will result in the smoothest curve as possible
  if (position.x <= 0.0) currentNormal = normalize(vec2(preLine.y, -preLine.x));
  else if (position.x >= 1.0) currentNormal = normalize(vec2(-nextLine.y, nextLine.x));
  else {
    vec2 preNormal = vec2(preLine.y, -preLine.x);
    vec2 nextNormal = vec2(-nextLine.y, nextLine.x);
    currentNormal = normalize(preNormal + nextNormal);
  }

  // Calculate the actual position of this vertex by using the current position on the bezier
  // and pushing away from the bezier by the width of the line in the direction of the calculated
  // normal
  vec2 pos = currentPosition + (currentNormal * normalDirection * halfLinewidth);

  vec4 mvPosition = modelViewMatrix * vec4(pos, position.z, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
