import gsap from 'gsap';
import {
  Renderer,
  Geometry,
  Program,
  Mesh,
  Vec3,
  Vec2,
  Orbit,
  Camera,
} from 'ogl';
import vertex from './vert.glsl';
import fragment from './frag.glsl';

document.getElementById('webgl').remove()

const values = {
  boxSize: new Vec3(1.5, 0.3, 0.3),
};

const renderer = new Renderer({
  width: window.innerWidth,
  height: window.innerHeight,
});

const gl = renderer.gl;

const camera = new Camera(gl);
camera.position.set(0, 2, 4);

const controls = new Orbit(camera, {
  target: new Vec3(0),
});

document.body.appendChild(gl.canvas);

// Triangle that covers viewport, with UVs that still span 0 > 1 across viewport
const geometry = new Geometry(gl, {
  position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
  uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
});
// Alternatively, you could use the Triangle class.

const program = new Program(gl, {
  vertex,
  fragment,
  uniforms: {
    uTime: { value: 0 },
    camPos: { value: new Vec3(0, 0, 5) },
    resolution: { value: new Vec2(window.innerWidth, window.innerHeight) },
    boxSize: { value: values.boxSize },
  },
});

const mesh = new Mesh(gl, { geometry, program });

requestAnimationFrame(update);

let time = 0;

function update() {
  // Don't need a camera if camera uniforms aren't required
  renderer.render({ scene: mesh });

  time += 0.025;

  program.uniforms.uTime.value = time;
  program.uniforms.camPos.value = camera.position;
  program.uniforms.boxSize.value = values.boxSize;
  controls.update();

  requestAnimationFrame(update);
}

setTimeout(() => {
  gsap.to(values.boxSize, {
    duration: 1,
    x: 1,
    y: 1,
    z: 1,
  });
}, 500);
