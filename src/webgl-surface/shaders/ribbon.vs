attribute vec4 customColor;
// 1 or -1, used to indicate the direction
attribute float normalDirection;
// (x,y) is the first start point, (z,w) is the second start point
attribute vec4 endPoints1;
// (x,y) is the first end point, (z,w) is the second end point
attribute vec4 endPoints2;
attribute vec2 controlPoint;
attribute vec4 centers;

uniform vec2 threshold;

varying vec4 vertexColor;

vec2 makeBezier2(float t, vec2 p1, vec2 p2, vec2 c1) {
  return vec2(
    (1.0 - t) * (1.0 - t) * p1.x + 2.0 * t * (1.0 - t) * c1.x + t * t * p2.x,
    (1.0 - t) * (1.0 - t) * p1.y + 2.0 * t * (1.0 - t) * c1.y + t * t * p2.y
  );
}


vec2 getMiddle(vec2 p1, vec2 p2) {
  return vec2((p1.x + p2.x) / 2.0, (p1.y + p2.y) / 2.0);
}

void main() {
  vertexColor = customColor;

  vec2 start1 = vec2(endPoints1.x, endPoints1.y);
  vec2 start2 = vec2(endPoints1.z, endPoints1.w);

  vec2 end1 = vec2(endPoints2.x, endPoints2.y);
  vec2 end2 = vec2(endPoints2.z, endPoints2.w);


  vec2 currentPosition;

  if (position.x < threshold.x / position.y) {
    vec2 c1 = vec2(centers.x, centers.y);

    // radius of hemiSphere where endpoints are in
    float r1 = distance(c1, start1);

    // mid of two end lines
    vec2 mid1 = getMiddle(start1, start2);

    // distance from center to getMiddle;
    float d1 = distance(c1, mid1);

    // radius - distance
    float l1 = r1 - d1;

    // angle between line(middle, center) and line(currentPosition, center)
    float cosRadian = acos((r1 - l1 * position.x) / r1);

    // rotation angle of line(middle, center)
    float radian = atan((mid1.y - c1.y) / (mid1.x - c1.x));

    if (normalDirection == 1.0) {
      currentPosition = c1 + d1 * vec2(cos(radian - cosRadian), sin(radian - cosRadian));
    }
    else if (normalDirection == -1.0) {
      currentPosition = c1 + d1 * vec2(cos(radian + cosRadian), sin(radian + cosRadian));
    }
  }
  else if(position.x >= threshold.x / position.y && position.x <= threshold.y /position.y) {


    if (normalDirection == 1.0) {
      currentPosition = makeBezier2(position.x, start1, end1, controlPoint);
    }
    else if (normalDirection == -1.0) {
      currentPosition = makeBezier2(position.x, start2, end2, controlPoint);
    }

    vertexColor.a *= abs((position.x * 2.0) - 1.0);
  }
  else if(position.x > threshold.y / position.y) {
    vec2 c2 = vec2(centers.z, centers.w);

    float r2 = distance(c2, end1);

    vec2 mid2 = getMiddle(end1, end2);

    float d2 = distance(c2, mid2);

    float l2 = r2 - d2;

    float cosRadian = acos((r2 - l2 * (1.0 - position.x)) / r2);
    float radian = atan((mid2.y - c2.y) / (mid2.x - c2.x));

    if (normalDirection == 1.0) {
      currentPosition = c2 + d2 * vec2(cos(radian - cosRadian), sin(radian - cosRadian));
    }
    else if (normalDirection == -1.0) {
      currentPosition = c2 + d2 * vec2(cos(radian + cosRadian), sin(radian + cosRadian));
    }
  }

  vec4 mvPosition = modelViewMatrix * vec4(currentPosition, position.z, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
