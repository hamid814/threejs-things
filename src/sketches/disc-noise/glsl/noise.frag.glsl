#define PI 3.1415926538

uniform sampler2D tDiffuse;
uniform float uTime;

varying vec2 vUv;

void main() {
  float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  angle /= PI * 2.0;
  angle += 0.5;
  float sinusoid = sin(angle * 55.0);
  
  // vec4 texel = texture2D( tDiffuse, vUv * sinusoid );
  
  gl_FragColor = texel;
  // gl_FragColor = vec4(sinusoid, sinusoid, sinusoid, 1.0);
}