varying vec2 vUv;
varying vec3 vNormal;

vec3 light = vec3(2.0, 2.0, 0.0);

void main() {
  vec3 normalLight = normalize(light);
  
  float s = dot(vNormal, normalLight);
  s = max(0.0, s);
  s = 10.0 / s;
  
  gl_FragColor = vec4(s, s, s, 1.0);
}