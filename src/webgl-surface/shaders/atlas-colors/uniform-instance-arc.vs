// ---- UNIFORMS ----
// These uniforms are information regarding the color atlas
uniform sampler2D colorAtlas;
uniform float colorsPerRow;
uniform vec2 firstColor;
uniform vec2 nextColor;

// This is the instance data buffer for all of our arcs. We will store all of
// the needed customizable information here per arc. This eliminates HUGE amounts
// of data that would otherwise be sent over the buffer and lets us specify
// shared specifics of a line across all of it's vertices.
// Instance data comes in vec4 blocks as using an individual uniform will
// always consume a vec4 anyways.
// TODO: We use 90 because it seems the baseline for
// webgl uniforms is around 128 for most common adopted size. It would be very
// nice to make this variable
/**
  {
    attribute float startColorPick;
    attribute float endColorPick;
    attribute float halfLinewidth;
    attribute float resolution;
  }
  {
    // (x,y) is the first point, (z,w) is the second point
    attribute vec4 endPoints;
  }
  {
    attribute float depth;
    attribute vec2 controlPoint;
  }
**/
uniform vec4 instanceData[96];

// ---- CONSTANTS ----
// This contains the number of uniform blocks an instance utilizes
int instanceSize = 3;

// These are constants the program will utilize
float PI = 3.1415926535897932384626433832795;
float PI_2 = 6.2831853072;

// ---- ATTRIBUTES ----
// The bezier interpolation time value for the current vertex
attribute float vertexIndex;
// The number of segment points along the curve
attribute float totalVertices;
// 1 or -1, used to indicate the direction the vertex will push from the
// middle of the line
attribute float normalDirection;
// This is an integer indicating which instance data block this curve will use
attribute float instance;

// This passes the calculated color of the vertex
varying vec4 vertexColor;

// ---- METHODS ----
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

vec4 getData(int block) {
  return instanceData[int(instance) * instanceSize + block];
}

void main() {
  // Get the blocks of data present in the uniform instanceData buffer
  vec4 block0 = getData(0);
  vec4 block1 = getData(1);
  vec4 block2 = getData(2);

  // Break up the block data into the components that comprise it
  vec2 controlPoint = block2.yz;
  vec4 endPoints = block1;
  float resolution = block0.w;
  float halfLinewidth = block0.z;
  float t = min(vertexIndex, resolution) / resolution;

  vertexColor = mix(pickColor(block0.x), pickColor(block0.y), t);
  vertexColor = vec4(1.0, 0.0, 0.0, 1.0);

  vec2 p1 = vec2(endPoints.x, endPoints.y);
  vec2 p2 = vec2(endPoints.z, endPoints.w);

  vec2 currentPosition = makeCircular(t, p1, p2, controlPoint);
  vec2 prePosition = makeCircular(t - (1.0 / resolution), p1, p2, controlPoint);
  vec2 nextPosition = makeCircular(t + (1.0 / resolution), p1, p2, controlPoint);

  vec2 preLine = prePosition - currentPosition;
  vec2 nextLine = nextPosition - currentPosition;

  vec2 currentNormal;

  // If we're at the start
  if (t <= 0.0) currentNormal = normalize(vec2(preLine.y, -preLine.x));
  else if (t >= 1.0) currentNormal = normalize(vec2(-nextLine.y, nextLine.x));
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
