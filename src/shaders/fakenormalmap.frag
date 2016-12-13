#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D textureA;
uniform sampler2D textureB;
varying vec2 vUv;

#define NORMAL_SCALE
#define DIFFUSE_INTENSITY 1.0
#define SPECULAR_INTENSITY 1.2

void main()
{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 uvStep = 1.0 / resolution.xy;
    vec4 Normal = vec4(0.0, 0.0, 0.0, 1.0);

   	vec4 sample1 = texture2D(textureA, vUv);
    vec4 sample2 = texture2D(textureA, uv + vec2(uvStep.x, 0));
    vec4 sample3 = texture2D(textureA, vUv - vec2(0, uvStep.y));


	  float diff1 = (sample2.x + sample2.y + sample2.z / 3.0) - (sample1.x + sample1.y + sample1.z / 3.0);
   	float diff2 = (sample3.x + sample3.y + sample3.z / 3.0) - (sample1.x + sample1.y + sample1.z / 3.0);

    vec4 normal = vec4(0.0, 0.0, 0.0, 1.0);
    normal.x = sin(atan(diff1));
    normal.y = sin(atan(diff2));
	  normal.z = sqrt(normal.x * normal.x + normal.y * normal.y);


    vec4 lightColor = vec4(.8, .8, .8, 1.0);

    float phi = cos(time);
    float theta = sin(time);
    vec3 light = vec3(phi, theta, 10.0);
    vec3 eye = vec3(0, 0, 0);
    light = normalize(light);


    vec4 color = texture2D(textureA, uv);
    vec3 norm = normalize(normal.xyz);

    vec4 diffuse = dot(norm, light) * color * lightColor * DIFFUSE_INTENSITY;
    vec3 refVec = reflect(light, norm);
    vec4 specular =  dot(refVec, eye) * lightColor * SPECULAR_INTENSITY;

    gl_FragColor = diffuse+specular;


}
