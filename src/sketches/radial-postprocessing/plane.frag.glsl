#pragma glslify: noise = require('../../glsl-util/perlin/3d') 

uniform float uTime;

varying vec2 vUv;

void main() {
  float noiseValue = noise(vec3(vUv.x * 20.0, vUv.y * 20.0, uTime));
  
  noiseValue = sin(noiseValue * 10.0);
  
  noiseValue = step(noiseValue, -0.1);

  vec3 color = noiseValue == 0.0 ? vec3(1.0, 0.7, 0.2) : vec3(0.3, 0.2, 0.1);

  gl_FragColor = vec4(color, 1.0);
}