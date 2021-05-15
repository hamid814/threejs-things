import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import vs from './vert.glsl';
import fs from './frag.glsl';

const uniforms = {
  tDiffuse: { value: null },
  ratio: { value: innerWidth / innerHeight },
  width: { value: innerWidth },
};

function RadialPass(slices = 3) {
  const pass = new ShaderPass({
    uniforms: {
      ...uniforms,
      slices: { value: slices },
    },
    vertexShader: vs,
    fragmentShader: fs,
  });

  return pass;
}

export { RadialPass };
