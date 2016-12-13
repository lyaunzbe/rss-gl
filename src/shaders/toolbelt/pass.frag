uniform sampler2D texture;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
varying vec2 vUv;

void main(){
  vec3 col = texture2D(texture, vUv).rgb;
  gl_FragColor = vec4(col,1.0);
}
