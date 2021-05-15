#pragma glslify: noise = require(../../perlin/3d)

uniform float uTime; 
uniform sampler2D tDiffuse; 

varying vec2 vUv;

void main() {
  float noiseValue = noise(vec3(vUv * 30.0, uTime));
  noiseValue *= 0.01;
  
  vec2 rUv = vUv;
  rUv.x += noiseValue;

  vec2 gUv = vUv;
  rUv.x += noiseValue;

  vec2 bUv = vUv;
  // bUv.x += noiseValue;
  
  float r = texture2D(tDiffuse, rUv).r;
  float g = texture2D(tDiffuse, gUv).g;
  float b = texture2D(tDiffuse, bUv).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
  