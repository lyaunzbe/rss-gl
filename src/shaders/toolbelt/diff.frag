uniform sampler2D texture;
uniform sampler2D texture2;
uniform sampler2D texture3;
varying vec2 vUv;

void main() {
  vec4 tex0 = texture2D(texture, vUv);
  vec4 tex1 = texture2D(texture2, vUv);
  vec4 tex2 = texture2D(texture3, vUv);

  vec4 fc = (tex2 - tex1);
  vec4 add = (fc + tex0);
  gl_FragColor = vec4(fc);
}
