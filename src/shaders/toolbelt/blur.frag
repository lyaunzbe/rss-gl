uniform sampler2D texture;
uniform vec2 resolution;

varying vec2 vUv;

void main() {
  float step_w = 1.0/resolution.x;
  float step_h = 1.0/resolution.y;
  vec2 tc = vUv;
  vec4 input0 = texture2D(texture,tc);

  vec2 x1 = vec2(step_w, 0.0);
  vec2 y1 = vec2(0.0, step_h);

  input0 += texture2D(texture, tc+x1); // right
  input0 += texture2D(texture, tc-x1); // left
  input0 += texture2D(texture, tc+y1); // top
  input0 += texture2D(texture, tc-y1); // bottom

  input0 *=0.2;

  gl_FragColor = input0;
}
