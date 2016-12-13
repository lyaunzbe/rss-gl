uniform vec2 resolution;
varying vec2 vUv;
uniform sampler2D texture;
uniform vec2 mouse;
uniform float greyscale;

//RADIUS of our vignette, where 0.5 results in a circle fitting the screen
const float RADIUS = 0.75;

//softness of our vignette, between 0.0 and 1.0
const float SOFTNESS = 0.45;

void main(){
  vec2 tc = vUv;
  vec4 look = texture2D(texture,tc);
  vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(mouse.x/50.0, mouse.y/50.0);
  vec2 coord = offs+tc;
  vec4 repos = texture2D(texture, coord);
  repos*=1.001;
  if (greyscale == 1.0) {
    vec2 position = (gl_FragCoord.xy / resolution.xy) - vec2(0.5);
    float len = length(position);
    float vignette = smoothstep(RADIUS, RADIUS-SOFTNESS, len);
    repos.rgb = mix(repos.rgb, repos.rgb * vignette, 0.5);

    float gray = dot(repos.rgb, vec3(0.299, 0.587, 0.114));

    gl_FragColor = vec4(gray,gray,gray, 1.0);
  } else {
    gl_FragColor = repos;
  }

}
