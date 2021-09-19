#pragma glslify: noise = require(../../../glsl-util/perlin/4d)

#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .001
#define IOR 1.45
#define RFL_STEPS 5
#define AA 1

uniform samplerCube bg;
uniform vec3 camPos;
uniform vec3 boxSize;
uniform vec2 resolution;
uniform float morphPower;
uniform float boxThickness;
uniform float sphereRadius;
uniform float LCD; // ligth channel delta
uniform float uTime;
uniform float mirrorRadius;

vec3[2] lights;
vec3[2] projectedLights;
float rIOR = 1.0 / IOR;

struct Reflection {
  float power;
  vec3 position;
  vec3 direction;
};

mat2 rotate(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, s, -s, c);
}
float sdHexPrism(vec3 p, vec2 h) {
  // p.yz *= rotate(uTime / 2.0);
  // p.xz *= rotate(3.1415 * 0.5);
  vec3 q = abs(p);
  return max(q.z - h.y, max((q.x * 0.866025 + q.y * 0.5), q.y) - h.x);
}
float sdPlane(vec3 p) {
  // p.xz *= Rot(uTime);
  float d = dot(p, normalize(vec3(0.0, 0.0, 1.0)));
  return d;
}
float sdBox(vec3 point, vec3 position, vec3 size) {
  // point.xz *= rotate(-uTime);
  // point.xy *= rotate(3.1415 * 0.25);
  point += position;
  point = abs(point) - size;
  // float morphAmount = -0.4;
  float morphAmount = 0.1;
  return length(max(point, 0.)) + min(max(point.x, max(point.y, point.z)), 0.) - morphAmount;
}
float sdTorus(vec3 p, vec2 t) {
  p.yz *= rotate(3.1415 * 0.5);
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}
float sdSphere(vec3 p, float s) {
  p.z *= 2.0;
  return length(p) - s;
}
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float sdPyramid(in vec3 p, in float h) {
  float m2 = h * h + 0.25;

    // symmetry
  p.xz = abs(p.xz);
  p.xz = (p.z > p.x) ? p.zx : p.xz;
  p.xz -= 0.5;

    // project into face plane (2D)
  vec3 q = vec3(p.z, h * p.y - 0.5 * p.x, h * p.x + 0.5 * p.y);

  float s = max(-q.x, 0.0);
  float t = clamp((q.y - 0.5 * p.z) / (m2 + 0.25), 0.0, 1.0);

  float a = m2 * (q.x + s) * (q.x + s) + q.y * q.y;
  float b = m2 * (q.x + 0.5 * t) * (q.x + 0.5 * t) + (q.y - m2 * t) * (q.y - m2 * t);

  float d2 = min(q.y, -q.x * m2 - q.y * 0.5) > 0.0 ? 0.0 : min(a, b);

    // recover 3D and scale, and add sign
  return sqrt((d2 + q.z * q.z) / m2) * sign(max(q.z, -p.y));;
}
float sdBoundingBox(vec3 p, vec3 b, float e) {
  p = abs(p) - b;
  vec3 q = abs(p + e) - e;

  return min(min(length(max(vec3(p.x, q.y, q.z), 0.0)) + min(max(p.x, max(q.y, q.z)), 0.0), length(max(vec3(q.x, p.y, q.z), 0.0)) + min(max(q.x, max(p.y, q.z)), 0.0)), length(max(vec3(q.x, q.y, p.z), 0.0)) + min(max(q.x, max(q.y, p.z)), 0.0));
}
float getDist(vec3 point) {
  float time = uTime;
  float s = sin(time) * 0.2 + 0.8;
  float c = cos(time + 3.14 * 0.5) * 0.2 + 0.8;
  float box = sdBox(point, vec3(0.), vec3(1.));
  // float vastBox = sdBox(point, vec3(0.), vec3(5.0, 5.0, 0.05));
  // box = abs(box) - 0.4;
  // float prism = sdHexPrism(point, vec2(1.5) * c);
  // float plane = sdPlane(point);

  // noisy one:
  // float time = uTime;
  // point.xz *= rotate(time);
  // float amp = 0.2;
  float sphere = sdSphere(point, 1.5);
  // noisep.z += cos(time) * amp;
  // sphere += noise(vec4(noisep, sin(time) * amp)) - 0.2;
  // return sphere * 0.4;
  // sphere += sin(distance(point, vec3(10.0)) * 12.0 + time * 3.0) * 0.05;
  // sphere += sin(point.y * 10.0 + time * 3.0) * 0.03;
  // sphere += cos(point.x * 10.0 + time * 3.0) * 0.03;
  // sphere += cos(point.z * 10.0 + time * 3.0) * 0.03;

  float pyr = sdPyramid(point, 1.0);
  float bBox = sdBoundingBox(point, vec3(1.0), 0.1);

  return box;
  // return mix(box, bBox, 0.2);
  // return mix(box, bBox, sin(time * 0.5) * 0.5 + 0.5);
  return smin(box, sphere, 0.1);
}
float rayMarch(vec3 ro, vec3 rd, float sign) {
  float dO = 0.;

  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = getDist(p) * sign;
    dO += dS;
    if(dO > MAX_DIST || abs(dS) < SURF_DIST)
      break;
  }

  return dO;
}
vec3 getNormal(vec3 point) {
  float d = getDist(point);
  vec2 e = vec2(.001, 0);

  vec3 n = d - vec3(getDist(point - e.xyy), getDist(point - e.yxy), getDist(point - e.yyx));

  return normalize(n);
}

void rotateLights(vec3 rayOrigin, vec3 camRight, vec3 camUp, vec3 camForward) {
  lights[0] = rayOrigin + lights[0].x * camRight + lights[0].y * camUp + lights[0].z * camForward;
  lights[1] = rayOrigin + lights[1].x * camRight + lights[1].y * camUp + lights[1].z * camForward;

  projectedLights[0] = lights[0] + normalize(-lights[0]) * rayMarch(lights[0], normalize(-lights[0]), 1.0) * 0.95;
  projectedLights[1] = lights[1] + normalize(-lights[1]) * rayMarch(lights[1], normalize(-lights[1]), 1.0) * 0.95;
}

float getDiffuse(vec3 point, vec3 normal) {
  // return 1.0;
  return max(0.0, dot(normalize(lights[0] - point), normal));
}

float getLight(vec3 ro, vec3 rd) {
  rd = normalize(rd);
  float power = 0.;

  float d = rayMarch(ro, rd, -1.0);

  if(d < MAX_DIST) {
    vec3 p = ro + rd * d;
    vec3 n = -getNormal(p);

    vec3 reflection = reflect(rd, n);
    reflection = normalize(reflection);
    vec3 refraction = refract(-rd, n, rIOR);
    refraction = normalize(refraction);

    float rfl0 = dot(normalize(lights[0] - p), n);
    rfl0 = smoothstep(0.95, 1.1, rfl0);
    float rfl1 = dot(normalize(lights[1] - p), n);
    rfl1 = smoothstep(0.75, 1.0, rfl1);

    float rfr0 = dot(normalize(projectedLights[0] - p), refraction);
    rfr0 = smoothstep(0.0, 1.0, rfr0);
    float rfr1 = dot(normalize(projectedLights[1] - p), refraction);
    rfr1 = smoothstep(0.0, 1.0, rfr1);

    power += rfl0;
    power += rfl1;
    power += rfr0;
    power += rfr1;
  }

  return power;
}

Reflection getReflection(Reflection inReflection, int step) {
  inReflection.direction = normalize(inReflection.direction);
  Reflection ir = inReflection;

  // out reflection
  Reflection or;
  or.power = 0.;

  float d = rayMarch(ir.position, ir.direction, -1.0);
  if(d < MAX_DIST) {
    or.position = ir.position + ir.direction * d;
    vec3 n = -getNormal(or.position);

    vec3 reflection = reflect(ir.direction, n);
    reflection = normalize(reflection);
    vec3 refraction = refract(-ir.direction, n, rIOR);
    refraction = normalize(refraction);

    float rfl0 = dot(normalize(lights[0] - or.position), reflection);
    rfl0 = smoothstep(0.99, 1.0, rfl0);
    float rfl1 = dot(normalize(lights[1] - or.position), reflection);
    rfl1 = smoothstep(0.97, 1.0, rfl1);

    float rfr0 = dot(normalize(projectedLights[0] - or.position), refraction);
    rfr0 = smoothstep(0.0, 1.0, rfr0);
    float rfr1 = dot(normalize(projectedLights[1] - or.position), refraction);
    rfr1 = smoothstep(0.0, 1.0, rfr1);

    or.power += rfl0;
    or.power += rfl1;
    or.power += rfr0;
    or.power += rfr1;

    or.direction = reflection;
    or.position = or.position + reflection;

    // or.power = min(1.0, or.power);
    or.power = clamp(or.power, 0.0, 1.0);
    // or.power *= pow(0.5, float(step));
  }

  return or;
}

void main() {
  vec3 power = vec3(0.);

  vec3 rayOrigin = camPos;
  vec3 camForward = normalize(vec3(0.) - camPos);
  vec3 camRight = normalize(cross(camForward, vec3(0., 1., 0.)));
  vec3 camUp = normalize(cross(camRight, camForward));

  lights[0] = vec3(-0.2, 1.5, 0.0);
  lights[1] = vec3(0.2, -1.6, 0.0);

  rotateLights(rayOrigin, camRight, camUp, camForward);

  #if AA > 1
  for(int m = 0; m < AA; m++)
    for(int n = 0; n < AA; n++) {
      vec2 o = vec2(float(m), float(n)) / float(AA) - 0.;
      vec2 uv = (2. * gl_FragCoord.xy + o - resolution) / resolution.y;
      uv *= 0.5;
  #else
      vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
      uv *= 0.5;
  #endif

      // vec2 rotatePoint = vec2(0.25, 0.25);
      // if(distance(uv, rotatePoint) < 0.17 * mirrorRadius) {
      //   uv -= rotatePoint;

      //   uv *= rotate(3.14159265);
      //   power.gb -= 1.0;

      //   uv += rotatePoint;
      // }
      // rotatePoint = vec2(-0.25, -0.25);
      // if(distance(uv, rotatePoint) < 0.1) {
      //   uv -= rotatePoint;

      //   uv *= rotate(3.14159265);
      //   power.r -= 1.0;

      //   uv += rotatePoint;
      // }

      vec3 rayDirection = uv.x * camRight + uv.y * camUp + camForward;

      float dist = rayMarch(rayOrigin, rayDirection, 1.0);

      if(dist < MAX_DIST) {
        vec3 point = rayOrigin + rayDirection * dist;
        vec3 normal = getNormal(point);

        vec3 refractionR = refract(rayDirection, normal, rIOR + LCD);
        vec3 refractionG = refract(rayDirection, normal, rIOR);
        vec3 refractionB = refract(rayDirection, normal, rIOR - LCD);
        // power += getLight(point + refractionR, refractionR);
        float diff = getDiffuse(point, normal);

        Reflection rflR;
        rflR.power = 0.;
        rflR.direction = refractionR;
        rflR.position = point + refractionR;

        Reflection rflG;
        rflG.power = 0.;
        rflG.direction = refractionG;
        rflG.position = point + refractionG;

        Reflection rflB;
        rflB.power = 0.;
        rflB.direction = refractionB;
        rflB.position = point + refractionB;

        // float s = sin(uTime) * 0.5 + 0.505;
        // int reflSteps = int(ceil(s * float(RFL_STEPS)));
        int reflSteps = RFL_STEPS;

        vec3 refColor = vec3(0.);

        for(int i = 0; i < reflSteps; i++) {
          rflR = getReflection(rflR, i);
        }
        refColor.r += rflR.power;
        for(int i = 0; i < reflSteps; i++) {
          rflG = getReflection(rflG, i);
        }
        refColor.g += rflG.power;
        for(int i = 0; i < reflSteps; i++) {
          rflB = getReflection(rflB, i);
        }
        refColor.b += rflB.power;
        // power += diff;

        // float time = uTime;
        // float s = sin(time) * 0.5 + 0.5;
        // float c = cos(time + 3.14 * 0.5) * 0.5 + 0.5;
        power += refColor;
        // power += diff * 0.05;

        // power += textureCube(bg, refractionR.xyz).rgb;
        // power += textureCube(bg, rflR.direction).rgb;
        // power += 0.1;
      } else {
        // uv.x /= resolution.x / resolution.y;
        // uv += 0.5;
        // power = textureCube(bg, rayDirection).rgb;
        // power += vec3(1.0, 0.0, 0.0);
      }
#if AA > 1
    }
  // power /= float(AA * AA);
#endif

  power = clamp(power, 0.0, 1.0);
  power = pow(power, vec3(0.4545));

  gl_FragColor = vec4(power, 1.0);
}
