#pragma glslify: noise = require(../../glsl-util/perlin/4d)

uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
  float time = uTime / 1.0;

  vec3 pos = position * 0.5;
  pos.z += sin(time);
  float noiseValue = noise(vec4(pos, cos(time)));
  // float noiseValue = noise(position + time);
  // noiseValue = abs(noiseValue);

  float noiseAmp = map(noiseValue, 0.0, 1.0, 1.0, 1.5);

  vec3 newPos = position * noiseAmp;
  // vec3 newPos = position;

  vec4 modelPosition = modelMatrix * vec4(newPos, 1.0);
  vec3 modelNormal = mat3(modelMatrix) * normal;

  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  vUv = uv;
  vNormal = modelNormal;
  vWorldPosition = modelPosition.xyz;
}