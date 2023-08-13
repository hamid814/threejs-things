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

// Remove threejs default canvas
document.getElementById('webgl').remove();

const defaultValues = {
  time: 0.025,
};

const values = {
  boxSize: new Vec3(1, 1, 0.1),
  time: defaultValues.time,
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

  time += values.time;

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

// Put a button on corner to stop glass rotating
setTimeout(() => {
  const btn = document.body.appendChild(document.createElement('button'));
  btn.innerText = 'Stop rotate';
  btn.style = `
    position: fixed;
    padding: 15px;
    z-index: 1;
    left: 0;
    top: 0;
    border: none;
    border-radius: 0;
    cursor: pointer;`;
  btn.addEventListener('click', () => {
    if (btn.innerText == 'Stop rotate') {
      gsap.to(values, {
        duration: 2,
        time: 0,
        ease: 'Circ.easeOut',
      });
      btn.innerText = 'Roate';
    } else {
      // values.time = defaultValues.time;
      gsap.to(values, {
        duration: 2,
        time: defaultValues.time,
        ease: 'Circ.easeIn',
      });
      btn.innerText = 'Stop rotate';
    }
  });
}, 0);
