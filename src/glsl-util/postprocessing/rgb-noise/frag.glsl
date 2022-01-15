#pragma glslify: noise = require(../../perlin/3d)

uniform float uTime; 
uniform sampler2D tDiffuse; 

varying vec2 vUv;

void main() {
  float noiseValue = noise(vec3(vUv * 30.0, uTime));
  noiseValue *= 0.01;
  
  vec2 rUv = vUv;
  rUv.x += noiseValue * 2.0;

  float r = texture2D(tDiffuse, rUv).r;
  vec2 gb = texture2D(tDiffuse, vUv).gb;

  gl_FragColor = vec4(r, gb, 1.0);
}
  