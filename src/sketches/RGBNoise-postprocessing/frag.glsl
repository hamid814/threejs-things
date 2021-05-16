uniform float time;
varying vec3 vPosition;
varying vec2 vUv;
varying float test;

void main() {
  if (test > -0.45) discard;
  
  gl_FragColor = vec4(vec3(0.2, 0.3, 0.4), 1.0);
}