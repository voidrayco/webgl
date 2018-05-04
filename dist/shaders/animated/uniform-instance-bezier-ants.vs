// These uniforms are information regarding the color atlas
uniform sampler2D colorAtlas;
uniform float colorsPerRow;
uniform vec2 firstColor;
uniform vec2 nextColor;
// This is the shared control point for all of the vertices
uniform vec4 instanceData[96];

int instanceSize = 4;
float PI = 3.1415926535897932384626433832795;
float PI_2 = 6.2831853072;

/**
  Position contains this information:
  {
    x: normal
    y: vertex index
    z: instance
  }
**/

// This passes the calculated color of the vertex
varying vec4 vertexColor;
// This passes the info needed for marching ants
varying vec4 marchingAnts;
// Passes the 0 - 1 value of where we are on the line to the fragment shader
varying float interpolTime;

/**
  Calculates position of a point via bezier interpolation

  float t - The current time (0-1) for the interpolation value
  float rt - Current time reverse (1.0 - t)
  vec2 p1 - The start point of the bezier
  vec2 p2 - The end point of the bezier
  vec2 c1 - The control point of the bezier
**/
vec2 makeBezier2(float t, vec2 p1, vec2 p2, vec2 c1) {
  return vec2(
    (1.0 - t) * (1.0 - t) * p1.x + 2.0 * t * (1.0 - t) * c1.x + t * t * p2.x,
    (1.0 - t) * (1.0 - t) * p1.y + 2.0 * t * (1.0 - t) * c1.y + t * t * p2.y
  );
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
  vec4 marching = getBlock(3);

  // Get the control point for the line
  vec2 controlPoint = block0.xy;
  vertexColor = mix(pickColor(startColor), pickColor(endColor), vertexTime);

  vec2 p1 = vec2(endPoint.x, endPoint.y);
  vec2 p2 = vec2(endPoint.z, endPoint.w);

  float rt = 1.0 - vertexTime;
  vec2 currentPosition = makeBezier2(vertexTime, p1, p2, controlPoint);
  vec2 prePosition = makeBezier2(vertexTime - (1.0 / maxResolution), p1, p2, controlPoint);
  vec2 nextPosition = makeBezier2(vertexTime + (1.0 / maxResolution), p1, p2, controlPoint);

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
  marchingAnts = vec4(marching.xy, marching.w - marching.z, marching.w);
  interpolTime = vertexTime;
}
