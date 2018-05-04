attribute vec4 customColor;
// 1 or -1, used to indicate the direction
attribute float normalDirection;
// (x,y) is the first point, (z,w) is the second point
attribute vec4 endPoints;
attribute vec2 controlPoint;
attribute float halfLinewidth;

varying vec4 vertexColor;

vec2 makeBezier2(float t, vec2 p1, vec2 p2, vec2 c1) {
  return vec2(
    (1.0 - t) * (1.0 - t) * p1.x + 2.0 * t * (1.0 - t) * c1.x + t * t * p2.x,
    (1.0 - t) * (1.0 - t) * p1.y + 2.0 * t * (1.0 - t) * c1.y + t * t * p2.y
  );
}

void main() {
  vertexColor = customColor;

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
}
