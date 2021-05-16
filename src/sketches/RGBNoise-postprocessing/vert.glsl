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

  // vec3 sth = vec3(position.x * 2.0, position.y * 2.0 + slowTime, position.z * 2.0);
  // float noiseValue = noise(sth);

  vec3 p = position;
  
  vec3 p1 = vec3(p.x * 1.0 + slowTime, p.y * 1.0 + slowTime, p.z * 1.0 + slowTime);
  vec3 p2 = vec3(p.x * 2.0 + slowTime, p.y * 2.0 + slowTime, p.z * 2.0 + slowTime);
  vec3 p3 = vec3(p.x * 4.0 + slowTime, p.y * 4.0 + slowTime, p.z * 4.0 + slowTime);
  
  float noiseValue = 1.0 * noise(p1) +  0.5 * noise(p2) + 0.25 * noise(p3);
  
  // test = map(noiseValue, 0.0, 1.0, 1.0, 0.0);
  test = noiseValue;
  
  float noiseAmp = map(noiseValue, 0.0, 1.0, 0.8, 1.2);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}