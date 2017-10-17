// These uniforms are information regarding the color atlas
uniform sampler2D colorAtlas;
uniform float colorsPerRow;
uniform vec2 firstColor;
uniform vec2 nextColor;
// This is the shared control point for all of the vertices
uniform vec2 controlPoint;
uniform float currentTime;

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
// THis is used to compare against the currentTime uniform to determine how far
// along our interpolation we are
attribute float startTime;
// This is used to help determine how far along our
attribute float duration;
// 1 or -1, used to indicate the direction
attribute float normalDirection;
// (x,y) is the first point, (z,w) is the second point
attribute vec4 endPoints;
attribute float halfLinewidth;

// This passes the calculated color of the vertex
varying vec4 vertexColor;

/**
  Calculates position of a point via bezier interpolation

  float t - The current time (0-1) for the interpolation value
  float rt - Current time reverse (1.0 - t)
  vec2 p1 - The start point of the bezier
  vec2 p2 - The end point of the bezier
  vec2 c1 - The control point of the bezier
**/
vec2 makeBezier2(float t, float rt, vec2 p1, vec2 p2, vec2 c1) {
  return (rt * rt * p1) + (2.0 * t * rt * c1) + (t * t * p2);
}

vec4 pickColor(float index) {
  float row = floor(index / colorsPerRow);
  float col = index - (row * colorsPerRow);
  return texture2D(colorAtlas, firstColor + vec2(nextColor.x * col, nextColor.y * row));
}

void main() {
  float time = (currentTime - startTime) / duration;

  // Calculate the color for the vertex
  vec4 startColor = mix(pickColor(colorPicks.x), pickColor(colorPicks.y), time);
  vec4 endColor = mix(pickColor(colorPicks.z), pickColor(colorPicks.w), time);
  vertexColor = mix(startColor, endColor, position.x);

  vec2 p1 = vec2(endPoints.x, endPoints.y);
  vec2 p2 = vec2(endPoints.z, endPoints.w);

  // Calculate the position of this bezier point for the curve
  float reverseTime = 1.0 - position.x;
  vec2 currentPosition = makeBezier2(position.x, reverseTime, p1, p2, controlPoint);
  // Calculate the position of the previous point on the bezier curve
  time = position.x - (1.0 / position.y);
  reverseTime = 1.0 - time;
  vec2 prePosition = makeBezier2(time, reverseTime, p1, p2, controlPoint);
  // Calculate the next point of the bezier curve
  time = position.x + (1.0 / position.y);
  reverseTime = 1.0 - time;
  vec2 nextPosition = makeBezier2(time, reverseTime, p1, p2, controlPoint);

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
