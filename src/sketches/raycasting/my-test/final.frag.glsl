#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .001
#define IOR 1.45
#define LCD 0.01
#define RFL_STEPS 5
#define AA 1

uniform samplerCube bg;
uniform vec3 camPos;
uniform vec2 resolution;
uniform float uTime;

vec3[2] lights;
vec3[2] projectedLights;
float rIOR = 1.0 / IOR;

struct Reflection {
  vec3 power;
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
  // point.xz *= rotate(uTime / 1.0);
  // point.xy *= rotate(3.1415 * 0.25);
  point += position;
  point = abs(point) - size;
  float morphAmount = -0.37;
  return length(max(point, 0.)) + min(max(point.x, max(point.y, point.z)), 0.) - morphAmount;
}
float sdSphere(vec3 p, float s) {
  return length(p) - s;
}
float getDist(vec3 point) {
  float box = sdBox(point, vec3(0.), vec3(1.));
  box = abs(box) - 0.4;
  // float prism = sdHexPrism(point, vec2(1.5));
  // prism = abs(prism) - 0.1;
  // float plane = sdPlane(point);
  // float s = sdSphere(point, 1.5);

  return box;
  // return max(plane, prism);
}
float rayMarch(vec3 ro, vec3 rd, float sign) {
  // rd = normalize(rd);
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
    rfl0 = smoothstep(0.95, 1.0, rfl0);
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
  or.power = vec3(0.);

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
    // rfl0 = clamp(rfl0, 0.0, 1.0);
    float rfl1 = dot(normalize(lights[1] - or.position), reflection);
    rfl1 = smoothstep(0.97, 1.0, rfl1);
    // rfl1 = clamp(rfl1, 0.0, 1.0);

    float rfr0 = dot(normalize(projectedLights[0] - or.position), refraction);
    rfr0 = smoothstep(0.0, 1.0, rfr0);
    // rfr0 = clamp(rfr0, 0.0, 1.0);
    float rfr1 = dot(normalize(projectedLights[1] - or.position), refraction);
    rfr1 = smoothstep(0.0, 1.0, rfr1);
    // rfr1 = clamp(rfr1, 0.0, 1.0);

    or.power += rfl0;
    or.power += rfl1;
    or.power += rfr0;
    or.power += rfr1;

    // or.power *= textureCube(bg, reflection * 2.).rgb;

    or.direction = reflection;
    or.position = or.position + reflection;

    // or.power = min(1.0, or.power);
    or.power = clamp(or.power, 0.0, 1.0);
    // or.power /= 0.8 / float(step);
  }

  return or;
}

void main() {
  vec3 power = vec3(1.);

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

      vec3 rayDirection = uv.x * camRight + uv.y * camUp + camForward;

      float dist = rayMarch(rayOrigin, rayDirection, 1.0);

      if(dist < MAX_DIST) {
        vec3 point = rayOrigin + rayDirection * dist;
        vec3 normal = getNormal(point);

        vec3 refractionR = refract(rayDirection, normal, rIOR + LCD);
        vec3 refractionG = refract(rayDirection, normal, rIOR);
        vec3 refractionB = refract(rayDirection, normal, rIOR - LCD);
        // power += getLight(point + refractionR, refractionR);

        Reflection rflR;
        rflR.power = vec3(0.);
        rflR.direction = refractionR;
        rflR.position = point + refractionR;

        Reflection rflG;
        rflG.power = vec3(0.);
        rflG.direction = refractionG;
        rflG.position = point + refractionG;

        Reflection rflB;
        rflB.power = vec3(0.);
        rflB.direction = refractionB;
        rflB.position = point + refractionB;

        // for(int i = 0; i < RFL_STEPS; i++) {
        //   rflR = getReflection(rflR, i);

        //   power.r += rflR.power;
        // }
        for(int i = 0; i < RFL_STEPS; i++) {
          rflG = getReflection(rflG, i);

          power -= rflG.power / 2.0;
        }
        // power *= textureCube(bg, rflG.direction).rgb;
        // for(int i = 0; i < RFL_STEPS; i++) {
        //   rflB = getReflection(rflB, i);

        //   power.b += rflB.power;
        // }
      } else {
        // uv.x /= resolution.x / resolution.y;
        // uv += 0.5;
        // power = textureCube(bg, rayDirection).rgb;
      }
#if AA > 1
    }
  // power /= float(AA * AA);
#endif

  power = clamp(power, 0.0, 1.0);
  power = pow(power, vec3(0.4545));

  gl_FragColor = vec4(power, 1.0);
}
