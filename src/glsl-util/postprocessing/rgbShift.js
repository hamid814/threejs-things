const testShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
  
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;

    varying vec2 vUv;
  
    void main() {
      // vec4 texel = texture2D(tDiffuse, vUv);
      
      float slowTime = uTime * 10.0;
      
      float amp = 0.005;
      
      float xOff = sin(slowTime) * amp;
      float yOff = cos(slowTime) * amp;
      
      vec2 rUv = vUv;
      rUv.x += xOff;
      rUv.y += yOff;
      float r = texture2D(tDiffuse, rUv).r;
      
      vec2 gUv = vUv;
      gUv.x -= xOff;
      gUv.y -= yOff;
      float g = texture2D(tDiffuse, gUv).g;
      
      vec2 bUv = vUv;
      // bUv.x -= xOff;
      // bUv.y -= yOff;
      float b = texture2D(tDiffuse, bUv).b;
      
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `,
};
