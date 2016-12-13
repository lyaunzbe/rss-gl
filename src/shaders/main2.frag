#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D texture;

varying vec3 vPos;
varying vec3 vNormal;
varying vec2 vUv;


struct PointLight {
  vec3 position;
  vec3 color;
};
uniform PointLight pointLights[NUM_POINT_LIGHTS];
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(( (q.z + (q.w - q.y) / (6.0 * d + e))) ), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
float rand(vec2 p)
{
    vec2 n = floor(p/2.0);
     return fract(cos(dot(n,vec2(48.233,39.645)))*375.42);
}
float srand(vec2 p)
{
     vec2 f = floor(p);
    vec2 s = smoothstep(vec2(0.0),vec2(1.0),fract(p));

    return mix(mix(rand(f),rand(f+vec2(1.0,0.0)),s.x),
           mix(rand(f+vec2(0.0,1.0)),rand(f+vec2(1.0,1.0)),s.x),s.y);
}
float noise(vec2 p)
{
    float total = srand(p/128.0)*0.5+srand(p/64.0)*0.35+srand(p/32.0)*0.1+srand(p/16.0)*0.05;
    return total;
}

//Main Calculation

void main()
{
	// vec2 uv = gl_FragCoord.xy / resolution.xy;
  // vec3 texcol = texture2D(texture, vUv).rgb;
  // //
  //   float intensity = pattern(uv+(mouse.x*mouse.y));
  //   vec3 color = vec3(vUv, .75+0.75*cos(time*(mouse.x+mouse.y)));
  //   vec3 hsv = rgb2hsv(color);
  //   hsv.z = cos(hsv.y) - 0.5;
  //   color = hsv2rgb(hsv);
  //   vec3 adjustedLight = pointLights[0].position + cameraPosition;
  //   vec3 lightDirection = normalize(vPos - adjustedLight);
  // //   gl_FragColor = texcol;
  // // vec3 col = texture2D(texture, vUv).rgb;
  // vec3 col = texcol;
  // // col += clamp(dot(-lightDirection, vNormal), 0.0, 1.0) * pointLights[0].color;
  //
  // gl_FragColor = vec4(col,1.0);
//   float t = time;
//   vec2 warp = vec2(noise(gl_FragCoord.xy+t)+noise(gl_FragCoord.xy*0.5+t*3.5),
//                    noise(gl_FragCoord.xy+128.0-t)+noise(gl_FragCoord.xy*0.6-t*2.5))*0.5-0.25;
// //     vec2 uv = gl_FragCoord.xy / resolution.xy+warp;
//  vec2 mW = warp*mouse;
//   vec2 uv = vUv+mW*sin(time);
//   vec4 look = gl_FragColor = texture2D(texture,uv);
//   vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(mouse.x*uv.x/100.0, mouse.y*uv.y/100.0);
//   vec2 coord = offs+vUv;
//   vec4 repos = texture2D(texture, coord);
//   gl_FragColor = repos;

vec2 uv = vUv;

  vec2 e = 1.0/resolution.xy;


  float am1 = 0.5 + 0.5*0.927180409;
  float am2 = 10.0;

  for( int i=0; i<5; i++ ){
  	float h  = dot( texture2D(texture, uv*0.99            ).xyz, vec3(0.5) );
  	float h1 = dot( texture2D(texture, uv+vec2(e.x,0.0)).xyz, vec3(0.5) );
  	float h2 = dot( texture2D(texture, uv+vec2(0.0,e.y)).xyz, vec3(0.5) );
  	vec2 g = 0.001*vec2( (h-h2), (h-h1) )/e;
//     	vec2 g = 0.001*vec2( (h1-h) (h2-h) )/e;
  	vec2 f = g.yx*vec2(3.0*mouse.x ,3.0*mouse.y);

 	  g = mix( g,f, am1 );
  	uv += 0.00005*g*am2;
  }

  vec3 col = texture2D(texture, uv).xyz;
  gl_FragColor = vec4(col, 1.0);
}
