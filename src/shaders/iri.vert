varying vec3 P;
varying float fr;

void main(){

	P = position;							//vertex position vector
	vec4 N =  mat4(normalMatrix) * vec4(normal, 1.0);				//vertex normal vector
	vec4 V = modelViewMatrix * vec4(position, 1.0);			//eye to vertex vector
	vec4 E = normalize(-V);						//normalized vertex to eye vector
	fr = dot(N,E);							//facing ratio
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
