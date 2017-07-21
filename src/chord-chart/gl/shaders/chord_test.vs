// end points of the bezier
attribute vec4 endPoints;
// Control point of the bezier
attribute vec2 controlPoint;
// This vertex's bezier t parameter
attribute float t;
// The t parameter of the next vertex in the line
attribute float next_sibling_t;
// The t parameter of the previous vertex in the line
attribute float prev_sibling_t;
// Using the next and prev sibling, calculate the normals to the lines and
// find a normal that is half way between those two normals.
// This attribute will be filled with either 1 or -1 to indicate how much
// this vertexes position should be shifted in the calculated normal direction
attribute float normalDirection;
// This is how much the vertex should shift in the calculated normal's direction
attribute float line_width_half;

vec2 makeBezier2(float t, vec4 endPoints, vec2 controlPoint){
    return vec2((1-t)*(1-t)*endPoints.x+2*t*(1-t)*controlPoint.x+t*t*endPoints.z,(1-t)*(1-t)*endPoints.y+2*t*(1-t)*controlPoint.y+t*t*endPoints.w);
}

void main(){
    vec2 position = makeBezier2(t, endPoints, controlPoint);
	vec2 next_position = makeBezier2(next_sibling_t, endPoints, controlPoint);
	vec2 prev_position = makeBezier2(prev_sibling_t, endPoints, controlPoint);
    
    vec2 prev_line = prev_position - position;
    vec2 next_line = next_position - position;
    
    vec2 prev_normal = vec2(-prev_line.y,prev_line.x);
    vec2 next_normal = vec2(next_line.y,-next_line.x);
    vec2 normal = normalize(prev_normal+next_normal);
    
    //output position
    vec2 outputPosition = position + normalDirection * line_width_half * normal;
    vec4 mvPosition = modelViewMatrix * vec4( outputPosition, 1.0 ,1.0);
    gl_Position = projectionMatrix * mvPosition;
}