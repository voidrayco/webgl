uniform vec2 screenTL;
uniform vec2 screenBR;

attribute vec4 customColor;
attribute vec2 p1;
attribute vec2 p2;

varying vec4 vColor;

const float EDGE_HIDDEN_ALPHA = 0.05;

float offscreen(vec2 p) {
  // See if off screen left
  if (p.x < screenTL.x) { return 1.0; }
  // If offscreen right
  else if(p.x > screenBR.x) { return 1.0; }
  // If offscreen top
  else if (p.y > screenTL.y) { return 1.0; }
  // If offscreen bottom
  else if (p.y < screenBR.y) { return 1.0; }

  return 0.0;
}

void main() {
  vColor = customColor;
  float check = 0.0;

  check += offscreen(p1);
  check += offscreen(p2);

  // If the check came back as a one then we fade the line
  if (check == 1.0) {
    vColor.a = EDGE_HIDDEN_ALPHA;
  }

  // If both dots are off screen then we make the line not show at all
  if (check == 2.0) {
    gl_Position = vec4(9999.0, 9999.0, 9999.0, 1.0);
  }

  // Do the normal projection if the line isn't hidden
  else {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
  }
}
