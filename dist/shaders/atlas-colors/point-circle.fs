varying vec4 outerColor;
varying vec4 innerColor;
varying float normalizedInnerRadius;
varying float edgeSharpness;

float circle(vec2 coord, float radius){
  vec2 dist = coord - vec2(0.5);

	return 1.0 - smoothstep(
    radius - (radius * edgeSharpness),
    radius + (radius * 0.01),
    dot(dist, dist) * 4.0
  );
}

void main() {
  float outer_step_factor = circle(gl_PointCoord.xy, 1.0);
  float inner_step_factor = circle(gl_PointCoord.xy, normalizedInnerRadius);

  gl_FragColor = mix(
    mix(                        // Select the outer color outside of the inner radius
      vec4(0.0, 0.0, 0.0, 0.0),    // Select invisible outside of inner and outer radius
      outerColor,                  // Select outer color outside of inner, but inside outer
      outer_step_factor
    ),
    innerColor,                 // Select inner color inside inner
    inner_step_factor
  );
}
