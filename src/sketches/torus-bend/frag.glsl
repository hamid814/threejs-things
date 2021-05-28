varying vec2 vUv;
varying float vTest;

void main() {
  gl_FragColor = vec4(step(vUv.y, 0.2), step(vUv.y, 0.2), step(vUv.y, 0.2), 1.0);
  // gl_FragColor = vec4(vUv.y, vUv.y, vUv.y, 1.0);
}