// {
//   x: t or time value of the vertex within the curve
//   y: the total number of vertices in the line
//   z: the depth of the line
//   w: the half width of the line
// }
attribute vec4 bezier;
attribute vec4 customColor;
attribute vec4 customColorEnd;
// 1 or -1, used to indicate the direction
attribute float normalDirection;
// (x,y) is the first point, (z,w) is the second point
attribute vec4 endPoints;
attribute vec2 controlPoint;

varying vec4 vertexColor;

vec2 makeBezier2(float t, vec2 p1, vec2 p2, vec2 c1) {
  float x = (1.0 - t) * (1.0 - t) * p1.x + 2.0 * t * (1.0 - t) * c1.x + t * t * p2.x;
  float y = (1.0 - t) * (1.0 - t) * p1.y + 2.0 * t * (1.0 - t) * c1.y + t * t * p2.y;
  return vec2(x, y);
}

void main() {
  vertexColor = mix(customColor, customColorEnd, bezier.x);

  vec2 p1 = vec2(endPoints.x, endPoints.y);
  vec2 p2 = vec2(endPoints.z, endPoints.w);

  vec2 currentPosition = makeBezier2(bezier.x, p1, p2, controlPoint);
  vec2 prePosition = makeBezier2(bezier.x - 1.0 / bezier.y, p1, p2, controlPoint);
  vec2 nextPosition = makeBezier2(bezier.x + 1.0 / bezier.y, p1, p2, controlPoint);

  vec2 preLine = prePosition - currentPosition;
  vec2 nextLine = nextPosition - currentPosition;

  vec2 preNormal = vec2(preLine.y, -preLine.x);
  vec2 nextNormal = vec2(-nextLine.y, nextLine.x);
  vec2 currentNormal = normalize(preNormal) + normalize(nextNormal);
  currentNormal = normalize(currentNormal);

  if (bezier.y < 0.0) currentNormal = normalize(preNormal);
  if (bezier.z > 1.0) currentNormal = normalize(nextNormal);

  float x = currentPosition.x + currentNormal.x * normalDirection * bezier.w;
  float y = currentPosition.y + currentNormal.y * normalDirection * bezier.w;

  vec4 mvPosition = modelViewMatrix * vec4(x, y, bezier.z, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
}
