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
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

//FBM (Fractal Brownian Motion)

float rand(vec2 n) {
    return fract(cos(dot(n, vec2(12.9898,4.1414))) * (3758.5453));
}

float noise(vec2 n) {
    const vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
  float acc = 0.2 + abs(sin(time/10.0)) * .5;
  float total = 0.0, amplitude = 1.0;
  for (int i = 0; i <10; i++) {
      total += noise(n) * amplitude;
      amplitude *= acc;
  }
  return total;
}


 float pattern( in vec2 p )
  {
    vec2 q = vec2( fbm( p + vec2(0.2,0.7) ),
                   fbm( p + vec2(100.2 + cos(time)/10.0,5.3 - sin(time)/10.0) ) );

    vec2 r = vec2( fbm( p + 5.0*q + vec2(1.7+ sin(time)/10.0,9.2) ),
                   fbm( p + 4.0*q + vec2(8.3,2.8-sin(time)/10.0) ) );

      vec2 adjusted_coordinate = p + 10.0*r;
      adjusted_coordinate.x += cos(time);
      adjusted_coordinate.y += sin(time);
      return sqrt(pow(fbm( adjusted_coordinate + time
                 + fbm(adjusted_coordinate - time
                      + fbm(adjusted_coordinate + sin(time) ))), -2.0));
  }

//Main Calculation

void main()
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 texcol = texture2D(texture, vUv).rgb;
  //
    float intensity = pattern(uv+(mouse.x*mouse.y));
    vec3 color = vec3(vUv, .75+0.75*cos(time*(mouse.x+mouse.y)));
    vec3 hsv = rgb2hsv(color);
    hsv.z = cos(hsv.y) - 0.5;
    color = hsv2rgb(hsv);
    vec3 adjustedLight = pointLights[0].position + cameraPosition;
    vec3 lightDirection = normalize(vPos - adjustedLight);
  //   gl_FragColor = texcol;
  // vec3 col = texture2D(texture, vUv).rgb;
  vec3 col = texcol+color;
  // col += clamp(dot(-lightDirection, vNormal), 0.0, 1.0) * pointLights[0].color;

  gl_FragColor = vec4(col,1.0)*intensity;

}
