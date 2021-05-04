uniform float time;
varying vec3 vPosition;
varying vec2 vUv;
varying float test;

void main() {
  gl_FragColor = vec4(vec3(test, test / 2.0, 0.0), 1.0);
}