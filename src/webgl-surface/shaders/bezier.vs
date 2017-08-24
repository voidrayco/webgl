// {
//   x: t or time value of the vertex within the curve
//   y: the total number of vertices in the line
//   z: the depth of the line
//   w: the half width of the line
// }
attribute vec4 bezier;
// attribute vec4 customColor;
// // 1 or -1, used to indicate the direction
// attribute float normalDirection;
// // (x,y) is the first point, (z,w) is the second point
// attribute vec4 endPoints;
// attribute vec2 controlPoint;

varying vec4 vertexColor;

// vec2 makeBezier2(float t, vec2 start, vec2 end, vec2 control) {
//   float x = (1.0 - t) * (1.0 - t) * start.x + 2.0 * t * (1.0 - t) * control.x + t * t * end.x;
//   float y = (1.0 - t) * (1.0 - t) * start.y + 2.0 * t * (1.0 - t) * control.y + t * t * end.y;
//   return vec2(x, y);
// }

void main() {
  // vertexColor = customColor;

  // // Get the time factor for the bezier curve this vertex is a part of
  // float t = bezier.x / bezier.y;

  // // Get the start and end endpoints of the bezier curve
  // vec2 start = vec2(endPoints.x, endPoints.y);
  // vec2 end = vec2(endPoints.z, endPoints.w);

  // // Calculate THIS vertex's position based on it's time param
  // vec2 currentPosition = makeBezier2(t, start, end, controlPoint);
  // // Get the previous vertex's position by calculating a time step one behind
  // vec2 prePosition = makeBezier2(bezier.x - 1.0 / bezier.y, start, end, controlPoint);
  // // Get the next vertex's position by calculating a time step one ahead
  // vec2 nextPosition = makeBezier2(bezier.x + 1.0 / bezier.y, start, end, controlPoint);

  // // Vector in the direction from current to previous position
  // vec2 preLine = prePosition - currentPosition;
  // // Vector in the direction from current to next position
  // vec2 nextLine = nextPosition - currentPosition;

  // vec2 currentNormal;

  // // If this is the first time step, our normal is simply between the current and the next
  // if (bezier.x == 0.0) {
  //   currentNormal = normalize(vec2(preLine.y, -preLine.x));
  // }

  // // If this is the last time step, our normal is between the current and the previous
  // else if (bezier.x >= bezier.y - 1.0) {
  //   currentNormal = vec2(-nextLine.y, nextLine.x);
  // }

  // // Otherwise:
  // // Calculate the normals between current position and neighboring positions
  // // we do this so we can get the bisecting normal to spread our segment by
  // // This gives our curved lines continuity and a cleaner line
  // else {
  //   vec2 preNormal = vec2(preLine.y, -preLine.x);
  //   vec2 nextNormal = vec2(-nextLine.y, nextLine.x);
  //   // Calculate the bisecting normal
  //   currentNormal = normalize(preNormal + nextNormal);
  // }

  // // Calculate the position of this vertex by taking the current bezier position
  // // then spread away from that position based on the calculated normal direction
  // // by the amount specified for the line width. We choose which side of the line
  // // to spread away by using the normalDirection provided.
  // float x = currentPosition.x + currentNormal.x * -normalDirection * bezier.w;
  // float y = currentPosition.y + currentNormal.y * -normalDirection * bezier.w;

  // // Perform projection calculations with the calculated vertex number
  // vec4 mvPosition = modelViewMatrix * vec4(x, y, bezier.z, 1.0 );
  // gl_Position = projectionMatrix * mvPosition;

  // DEBUGGING
  vertexColor = vec4(1.0, 1.0, 1.0, 1.0);
  float t = bezier.x / bezier.y;
  vec4 mvPosition = modelViewMatrix * vec4(t * 5.0, t * 5.0, 0.0, 1.0);
  gl_PointSize =  20.0;
  gl_Position = projectionMatrix * mvPosition;
}
