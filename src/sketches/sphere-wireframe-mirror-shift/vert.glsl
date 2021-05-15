#pragma glslify: noise = require(../../glsl-util/perlin/3d)

varying vec3 vPosition;
varying vec2 vUv;
varying float test;
uniform float time;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
  vUv = uv;
  vPosition = position;
  float slowTime = time * 5.0;

  vec3 p = position;
  
  float noiseFactor = (sin(slowTime * 0.2) * 1.0) + 2.0;
  float noisePower = (cos(slowTime * 0.2 + 0.5) * 0.15) + 0.85;
  
  float noiseValue = noisePower * noise(vec3(p.x * noiseFactor + slowTime, p.y * noiseFactor + slowTime, p.z * noiseFactor + slowTime));
  
  test = map(noiseValue, 0.0, 1.0, 0.6, 1.0);
  test = noiseValue - 0.1;
  
  float noiseAmp = map(noiseValue, 0.0, 1.0, 0.8, 1.2);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position * noiseAmp * 1.5, 1.0);
}