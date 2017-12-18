// These uniforms are information regarding the color atlas
uniform sampler2D colorAtlas;
uniform float colorsPerRow;
uniform vec2 firstColor;
uniform vec2 nextColor;

//  This is the shared control point for all of the vertices
uniform vec4 instanceData[96];
int instanceSize = 4;
varying vec4 vertexColor;

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


vec2 getMiddle(vec2 p1, vec2 p2) {
  return vec2((p1.x + p2.x) / 2.0, (p1.y + p2.y) / 2.0);
}

void main() {
  vec4 block0 = getBlock(0);
  vec4 block1 = getBlock(1);
  vec4 block2 = getBlock(2);
  vec4 block3 = getBlock(3);
  vec4 block4 = getBlock(4);
  float startColor = block0.z;
  float endColor = block0.w;
  vec2 start1 = block1.xy;
  vec2 start2 = block1.zw;
  vec2 end1 = block2.xy;
  vec2 end2 = block2.zw;
  vec2 c1 = block3.xy;
  vec2 c2 = block3.zw;
  float depth = block4.x;
  float resolution = block4.y;
  vec2 threshold = block4.zw;
  float normalDirection = position.x;
  float vertexIndex = position.y;
  float instance = position.z;
  vec2 currentPosition;
  
  // Control point for two lines
  vec2 controlPoint = block0.xy;

  // Get the vertexColor
  vertexColor = mix(pickColor(startColor), pickColor(endColor), vertexIndex / resolution);

  if (vertexIndex < threshold.x ) {
    float realTime;
    float subRatio = 0.3;
    float subThreshold = subRatio * threshold.x;
    float smallStep = 0.25;
    
    if (vertexIndex < subThreshold) {
      realTime = subRatio * smallStep * vertexIndex / subThreshold;
    }

<<<<<<< HEAD
=======
    else {
      realTime = smallStep * subRatio + (vertexIndex - subThreshold) * (1.0 - smallStep * subRatio) / (threshold.x - subThreshold);
    }

>>>>>>> 28f728aefc36a8149b18eb5c8f3ab5aa05580259
    // radius of hemiSphere where endpoints are in
    float r1 = distance(c1, start1);

    // mid of two end points
    vec2 mid1 = getMiddle(start1, start2);

    // distance from center to getMiddle;
    float d1 = distance(mid1, c1);

    // radius - distance
    float l1 = r1 - d1;

    // angle between line(middle, center) and line(currentPosition, center)
    float cosRadian = acos((r1 - l1 * realTime) / r1);

    // rotation angle of line(middle, center)
    float radian = acos((mid1.x - c1.x) / d1);

    if ((mid1.y - c1.y) < 0.0) radian = - radian;

    if (normalDirection == 1.0) {
      currentPosition = c1 + r1 * vec2(cos(radian - cosRadian), sin(radian - cosRadian));
    }

    else if (normalDirection == -1.0) {
      currentPosition = c1 + r1 * vec2(cos(radian + cosRadian), sin(radian + cosRadian));
    }
  }

  else if (vertexIndex >= threshold.x  && vertexIndex <= resolution - threshold.y ) {
    float realTime = (vertexIndex - threshold.x) / (resolution - threshold.x - threshold.y);

    if (normalDirection == 1.0) {
      currentPosition = makeBezier2(realTime, start1, end1, controlPoint);
    }

    else if (normalDirection == -1.0) {
      currentPosition = makeBezier2(realTime, start2, end2, controlPoint);
    }

    float minMidFade = 0.76;
    float stop1 = 0.17;
    float stop2 = 0.83;

    if (realTime > stop2) {
      vertexColor *= mix(minMidFade, 1.0, (realTime - stop2) / stop1);
    }

    else if (realTime < stop1) {
      vertexColor *= mix(minMidFade, 1.0, (stop1 - realTime) / stop1);
    }

    else {
      vertexColor *= minMidFade;
    }
  }

  else if (vertexIndex > resolution - threshold.y ) {
    float subRatio = 0.3;
    float subThreshold = (1.0 - subRatio) * threshold.y + (resolution - threshold.y);
    float smallStep = 0.25;
    float realTime;

    if(vertexIndex < subThreshold) {
      realTime = (1.0 - subRatio * smallStep) * (vertexIndex - resolution + threshold.y) / (subThreshold + threshold.y - resolution);
    }

    else {
      realTime = (1.0 - subRatio * smallStep) + subRatio * smallStep * (vertexIndex - subThreshold) / (resolution - subThreshold);
    }

    float r2 = distance(c2, end1);
    vec2 mid2 = getMiddle(end1, end2);
    float d2 = distance(mid2, c2);
    float l2 = r2 - d2;
    float cosRadian = acos((d2 + l2 * realTime) / r2);
    float radian = acos((mid2.x - c2.x) / d2);
    
    if ((mid2.y - c2.y) < 0.0) radian = - radian;

    if (normalDirection == 1.0) {
      currentPosition = c2 + r2 * vec2(cos(radian + cosRadian), sin(radian + cosRadian));
    }

    else if (normalDirection == -1.0) {
      currentPosition = c2 + r2 * vec2(cos(radian - cosRadian), sin(radian - cosRadian));
    }
  }

  vec4 mvPosition = modelViewMatrix * vec4(currentPosition, position.z, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
