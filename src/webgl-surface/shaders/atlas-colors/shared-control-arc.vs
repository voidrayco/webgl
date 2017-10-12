// These uniforms are information regarding the color atlas
uniform sampler2D colorAtlas;
uniform float colorsPerRow;
uniform vec2 firstColor;
uniform vec2 nextColor;
// This is the shared control point for all of the vertices
uniform vec2 controlPoint;

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
// The picked color for the item
attribute float startColorPick;
attribute float endColorPick;
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
vec2 makeCircular(float t, float rt, vec2 p1, vec2 p2, vec2 c1) {
  // Get the direction vector from the circle center to the first end point
  vec2 direction1 = p1 - c1;
  // Get the angle of the first vector
  float theta1 = atan(direction1.y, direction1.x);
  // Get the direction vector from the circle center to the second end point
  vec2 direction2 = p2 - c1;
  // Get the angle of the second vector
  float theta2 = atan(direction2.y, direction2.x);
  // Ensure our theta's are definitely between 0 to Math.PI * 2 after the atan
  // Calculation
  theta1 -= floor(theta1 / PI_2) * PI_2;
  theta2 -= floor(theta2 / PI_2) * PI_2;

  // Ensure our path around the arc is always the shortest distance
  float dTheta = min(theta2 - theta1, theta1 - theta2);

  // We use this to calculate how far we are between the two points in radians
  // Based on the time parameter provided for the interpolation
  dTheta *= t;

  // We must have the radial distance of both points to properly calculate
  // An easing between the two radii
  float radius = length(direction1);

  return vec2(
    cos(theta1 + dTheta) * radius + c1.x,
    sin(theta1 + dTheta) * radius + c1.y,
  );
}

vec4 pickColor(float index) {
  float row = floor(index / colorsPerRow);
  float col = index - (row * colorsPerRow);
  return texture2D(colorAtlas, firstColor + vec2(nextColor.x * col, nextColor.y * row));
}

void main() {
  vertexColor = mix(pickColor(startColorPick), pickColor(endColorPick), position.x);

  vec2 p1 = vec2(endPoints.x, endPoints.y);
  vec2 p2 = vec2(endPoints.z, endPoints.w);

  vec2 currentPosition = makeCircular(position.x, p1, p2, controlPoint);
  vec2 prePosition = makeCircular(position.x - (1.0 / position.y), p1, p2, controlPoint);
  vec2 nextPosition = makeCircular(position.x + (1.0 / position.y), p1, p2, controlPoint);

  vec2 preLine = prePosition - currentPosition;
  vec2 nextLine = nextPosition - currentPosition;

  vec2 currentNormal;

  // If we're at the start
  if (position.x <= 0.0) currentNormal = normalize(vec2(preLine.y, -preLine.x));
  else if (position.x >= 1.0) currentNormal = normalize(vec2(-nextLine.y, nextLine.x));
  else {
    vec2 preNormal = vec2(preLine.y, -preLine.x);
    vec2 nextNormal = vec2(-nextLine.y, nextLine.x);
    currentNormal = normalize(preNormal + nextNormal);
  }

  float x = currentPosition.x + currentNormal.x * normalDirection * halfLinewidth;
  float y = currentPosition.y + currentNormal.y * normalDirection * halfLinewidth;

  vec4 mvPosition = modelViewMatrix * vec4(x, y, position.z, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
