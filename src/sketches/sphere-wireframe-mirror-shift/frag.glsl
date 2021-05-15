uniform float time;
varying vec3 vPosition;
varying vec2 vUv;
varying float test;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
  float r = map(test, -0.1, 0.0, 0.6, 1.0);

  r = clamp(r, 0.6, 1.0);

  float g = map(r, 0.6, 1.0, 1.0, 0.6);

  gl_FragColor = vec4(vec3(r, g, g), 1.0);
}