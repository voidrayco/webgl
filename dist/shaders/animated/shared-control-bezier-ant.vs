// These uniforms are information regarding the color atlas
uniform sampler2D colorAtlas;
uniform float colorsPerRow;
uniform vec2 firstColor;
uniform vec2 nextColor;
// This is the shared control point for all of the vertices
// Allows up to 10 unique control points
uniform float controlPoints[20];
// This is the current time the rendering is at
uniform float currentTime;

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

/**
  This is the information necessary to render marching ants
  {
    x: start time,
    y: speed,
    z: gap,
    w: length,
  }
**/
attribute vec4 marching;
// This picks which control point to utilize
attribute float controlPick;

/**
  This is the information necessary to render marching ants
  {
    x: start time,
    y: speed,
    z: length - gap,
    w: length,
  }
**/
// Pass the marching ant info to the fragment shader
varying vec4 marchingAnts;
// This passes the calculated color of the vertex
varying vec4 vertexColor;
// Passes the 0 - 1 value of where we are on the line to the fragment shader
varying float interpolTime;

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

void main() {
  // Get the control point for the line
  vec2 controlPoint = vec2(controlPoints[int(controlPick)], controlPoints[int(controlPick + 1.0)]);
  // Determine the color for the line
  vertexColor = mix(pickColor(startColorPick), pickColor(endColorPick), position.x);

  vec2 p1 = vec2(endPoints.x, endPoints.y);
  vec2 p2 = vec2(endPoints.z, endPoints.w);

  vec2 currentPosition = makeBezier2(position.x, p1, p2, controlPoint);
  vec2 prePosition = makeBezier2(position.x - (1.0 / position.y), p1, p2, controlPoint);
  vec2 nextPosition = makeBezier2(position.x + (1.0 / position.y), p1, p2, controlPoint);

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
  marchingAnts = vec4(marching.xy, marching.w - marching.z, marching.w);
  interpolTime = position.x;
}
