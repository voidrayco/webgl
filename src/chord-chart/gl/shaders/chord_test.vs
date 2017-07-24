attribute vec4 customColor;
varying vec4 vColor;

// Using the next and prev sibling, calculate the normals to the lines and
// find a normal that is half way between those two normals.
// This attribute will be filled with either 1 or -1 to indicate how much
// this vertexes position should be shifted in the calculated normal direction
attribute float normalDirection;

// end points of the bezier
attribute vec4 endPoints;

// Control point of the bezier
attribute vec2 controlPoint;

// This is how much the vertex should shift in the calculated normal's direction
attribute float line_width_half;

vec2 makeBezier2(float t, vec4 endPoints, vec2 controlPoint){ 
    return vec2((1.0-t)*(1.0-t)*endPoints.x+2.0*t*(1.0-t)*controlPoint.x+t*t*endPoints.z,(1.0-t)*(1.0-t)*endPoints.y+2.0*t*(1.0-t)*controlPoint.y+t*t*endPoints.w);
}

void main(){
    vColor = customColor;

    vec2 current_position = makeBezier2(position.x, endPoints, controlPoint);
	vec2 prev_position = makeBezier2(position.y, endPoints, controlPoint);
    vec2 next_position = makeBezier2(position.z, endPoints, controlPoint);
    
    vec2 prev_line = prev_position - current_position;
    vec2 next_line = next_position - current_position;
    
    vec2 prev_normal = vec2(-prev_line.y,prev_line.x);
    vec2 next_normal = vec2(next_line.y,-next_line.x);
    vec2 half_normal; 
    if ( position.y >= 0.0 && position.z <= 1.0) half_normal = normalize(prev_normal+next_normal);
    if ( position.y < 0.0 )half_normal = normalize(next_normal);
    if ( position.z > 1.0 )half_normal = normalize(prev_normal);
    //output position
    vec2 outputPosition = current_position + normalDirection * line_width_half * half_normal;
    vec4 mvPosition = modelViewMatrix * vec4( outputPosition, 0.0 , 1.0 );
    //vec4 mvPosition = modelViewMatrix * vec4( position , 1.0 ); 
    gl_Position = projectionMatrix * mvPosition;
}