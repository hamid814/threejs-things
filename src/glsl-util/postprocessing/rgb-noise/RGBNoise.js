import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import vs from './vert.glsl';
import fs from './frag.glsl';

const uniforms = {
  tDiffuse: { value: null },
  ratio: { value: null },
  uTime: { value: 0 },
};

function RGBNoise() {
  const pass = new ShaderPass({
    uniforms: {
      ...uniforms,
    },
    vertexShader: vs,
    fragmentShader: fs,
  });

  return pass;
}

export { RGBNoise };
