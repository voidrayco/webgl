// These uniforms are information regarding the color atlas
uniform sampler2D colorAtlas;
uniform float colorsPerRow;
uniform vec2 firstColor;
uniform vec2 nextColor;
// This is the shared control point for all of the vertices
uniform vec4 instanceData[96];

int instanceSize = 3;
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

vec4 getBlock(int index) {
  return instanceData[(instanceSize * int(position.z)) + index];
}

void main() {
  vec4 block0 = getBlock(0);
  vec4 block1 = getBlock(1);
  vec4 block2 = getBlock(2);

  float normalDirection = position.x;
  float vertexIndex = position.y;
  float instance = position.z;

  float maxResolution = block1.z;
  float depth = block1.w;
  float halfLine = block1.x;
  float startColor = block0.z;
  float endColor = block0.w;
  float vertexTime = vertexIndex / maxResolution;
  vec4 endPoint = block2;

  // Get the control point for the line
  vec2 controlPoint = block0.xy;
  vertexColor = mix(pickColor(startColor), pickColor(endColor), vertexTime);

  vec2 p1 = vec2(endPoint.x, endPoint.y);
  vec2 p2 = vec2(endPoint.z, endPoint.w);

  vec2 currentPosition = makeCircular(vertexTime, p1, p2, controlPoint);
  vec2 prePosition = makeCircular(vertexTime - (1.0 / maxResolution), p1, p2, controlPoint);
  vec2 nextPosition = makeCircular(vertexTime + (1.0 / maxResolution), p1, p2, controlPoint);

  vec2 preLine = prePosition - currentPosition;
  vec2 nextLine = nextPosition - currentPosition;

  vec2 currentNormal;

  // If we're at the start
  if (vertexTime <= 0.0) currentNormal = normalize(vec2(preLine.y, -preLine.x));
  else if (vertexTime >= 1.0) currentNormal = normalize(vec2(-nextLine.y, nextLine.x));
  else {
    vec2 preNormal = vec2(preLine.y, -preLine.x);
    vec2 nextNormal = vec2(-nextLine.y, nextLine.x);
    currentNormal = normalize(preNormal + nextNormal);
  }

  float x = currentPosition.x + currentNormal.x * normalDirection * halfLine;
  float y = currentPosition.y + currentNormal.y * normalDirection * halfLine;

  vec4 mvPosition = modelViewMatrix * vec4(x, y, depth, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 5.0;
  vertexColor = vec4(abs(instanceData[0].x), abs(instanceData[0].y) + abs(instanceData[0].w), abs(instanceData[0].z), 1.0);
}
