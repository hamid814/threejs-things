import helpers from './full-helpers';

export default /* glsl */ `
#define AA 1
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .001

uniform vec3 camPos;
uniform vec2 resolution;
uniform float uTime;

varying vec2 vUv;

float refractionPower = 0.77;
float lightChannelDelta = 0.02;
float morphPower = 0.1;
vec3 lights[2];
vec3 projectedLights[2];

float reflectionEffectPower = 0.8;
float diff1from = 0.97;
float diff2from = 0.9;

struct Scene {
  vec3 outerSize;
  float outerRadius;
  vec3 light[2];
  vec3 projectedLight[2];
  mat4 localToWorld;
  mat4 worldToLocal;
} scene;

${helpers}

mat2 rotate(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, s, -s, c);
}

float sdBox(vec3 point, vec3 position, vec3 size) {
  point += position;
  // point.yz *= rotate(3.1415 * 0.25);
  // point.xz *= rotate(uTime);
  point = abs(point) - size;
  float morphAmount = morphPower;
  return length(max(point, 0.))+min(max(point.x, max(point.y, point.z)), 0.) - morphAmount;
}

float sdSphere( vec3 p, float s, vec3 pos )
{
  p += pos;
  return length( p ) - s;
}

float sdPlane(vec3 p) {
  // p.xz *= Rot(uTime);
  float d = dot(p, normalize(vec3(0.0, 0.0, 1.0)));

  return d;
}

float getDist(vec3 point) {
  float box = sdBox(point, vec3(0.), vec3(1.));
  return box;
  // float box = sdBox(point, vec3(2.0, 0.0, 0.0), vec3(1.));
  // float s = sdSphere(point, 1.4, vec3(2.0, 0.0, 0.0));
  // float one = max(s, box);

  // float box2 = sdBox(point, vec3(-2.0, 0.0, 0.0), vec3(1.));
  // box2 = abs(box2) - 0.2;
  // float p = sdPlane(point);
  // float two = max(p, box2);
  // return min(one, two);
}

float rayMarch(vec3 ro, vec3 rd, float sign) {
  // rd = normalize(rd);
  float dO=0.;
    
  for(int i=0; i<MAX_STEPS; i++) {
    vec3 p = ro + rd*dO;
      float dS = getDist(p) * sign;
      dO += dS;
      if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
  }
    
  return dO;
}

vec3 getNormal(vec3 point) {
  float d = getDist(point);
  vec2 e = vec2(.001, 0);
  
  vec3 n = d - vec3(
      getDist(point - e.xyy),
      getDist(point - e.yxy),
      getDist(point - e.yyx));
  
  return normalize(n);
}

vec3 getCameraRayDir(vec2 uv, vec3 camPos, vec3 camTarget, float zoom) {
  vec3 camForward = normalize(camTarget - camPos);
  vec3 camRight = normalize(cross(vec3(0., 1., 0.), camForward));
  vec3 camUp = normalize(cross(camForward, camRight));

  vec3 dir = uv.x * -camRight + uv.y * camUp + zoom * camForward;

  return normalize(dir);
}

float traceOuter1(vec3 rayOrigin, vec3 rayDirection, float eta) {
  rayDirection = normalize(rayDirection);
  float power = 0.;
  // float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
  float d = rayMarch(rayOrigin, rayDirection, 1.0);
  
  if(d < 1e14) {
    vec3 pos = rayOrigin + rayDirection * d;
    // vec3 nor = -roundedboxNormal(pos, scene.outerSize, scene.outerRadius);
    vec3 nor = -getNormal(pos);

    rayDirection = -rayDirection;
    vec3 reflection = reflect(rayDirection, nor);
    vec3 refraction = refract(rayDirection, nor, eta);

    vec3 nrefl = normalize(reflection);
    float reflectedLight = smoothstep(diff1from, 1., dot(normalize(projectedLights[0] - pos), nrefl)) +
      smoothstep(diff2from, 1., dot(normalize(projectedLights[1] - pos), nrefl));
    power += reflectedLight;

    float refractedLights[2];
    refractedLights[0] = dot(normalize(lights[0] - pos), normalize(refraction));
    refractedLights[1] = dot(normalize(lights[1] - pos), normalize(refraction));
    float refractedLight = (smoothstep(.0, 1., refractedLights[0]) + smoothstep(.0, 1., refractedLights[1]));
    power += refractedLight;
  }

  return power;
}

float traceOuter2(vec3 rayOrigin, vec3 rayDirection, float eta) {
  rayDirection = normalize(rayDirection);
  float power = 0.;
  // float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
  float d = rayMarch(rayOrigin, rayDirection, 1.0);
  
  if(d < 1e14) {
    vec3 pos = rayOrigin + rayDirection * d;
    // vec3 nor = -roundedboxNormal(pos, scene.outerSize, scene.outerRadius);
    vec3 nor = -getNormal(pos);

    rayDirection = -rayDirection;
    vec3 reflection = reflect(rayDirection, nor);
    vec3 refraction = refract(rayDirection, nor, eta);

    vec3 nrefl = normalize(reflection);
    float reflectedLight = smoothstep(diff1from, 1., dot(normalize(projectedLights[0] - pos), nrefl)) +
      smoothstep(diff2from, 1., dot(normalize(projectedLights[1] - pos), nrefl));
    power += reflectedLight;

    float refractedLights[2];
    refractedLights[0] = dot(normalize(lights[0] - pos), normalize(refraction));
    refractedLights[1] = dot(normalize(lights[1] - pos), normalize(refraction));
    float refractedLight = (smoothstep(.0, 1., refractedLights[0]) + smoothstep(.0, 1., refractedLights[1]));
    power += refractedLight;

    power += traceOuter1(pos + reflection, -reflection, eta) * reflectionEffectPower;
  }

  return power;
}

float traceOuter3(vec3 rayOrigin, vec3 rayDirection, float eta) {
  rayDirection = normalize(rayDirection);
  float power = 0.;
  // float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
  float d  = rayMarch(rayOrigin, rayDirection, 1.0);
  
  if(d < 1e14) {
    vec3 pos = rayOrigin + rayDirection * d;
    // vec3 nor = -roundedboxNormal(pos, scene.outerSize, scene.outerRadius);
    vec3 nor = -getNormal(pos);

    rayDirection = -rayDirection;
    vec3 reflection = reflect(rayDirection, nor);
    vec3 refraction = refract(rayDirection, nor, eta);

    vec3 nrefl = normalize(reflection);
    float reflectedLight = smoothstep(diff1from, 1., dot(normalize(projectedLights[0] - pos), nrefl)) +
      smoothstep(diff2from, 1., dot(normalize(projectedLights[1] - pos), nrefl));
    power += reflectedLight;

    float refractedLights[2];
    refractedLights[0] = dot(normalize(lights[0] - pos), normalize(refraction));
    refractedLights[1] = dot(normalize(lights[1] - pos), normalize(refraction));
    float refractedLight = (smoothstep(.0, 1., refractedLights[0]) + smoothstep(.0, 1., refractedLights[1]));
    power += refractedLight;

    power += traceOuter2(pos + reflection, -reflection, eta) * reflectionEffectPower;
  }
  return power;
}

float traceOuter4(vec3 rayOrigin, vec3 rayDirection, float eta) {
  rayDirection = normalize(rayDirection);
  float power = 0.;
  // float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
  float d  = rayMarch(rayOrigin, rayDirection, 1.0);
  
  if(d < 1e14) {
    vec3 pos = rayOrigin + rayDirection * d;
    // vec3 nor = -roundedboxNormal(pos, scene.outerSize, scene.outerRadius);
    vec3 nor = -getNormal(pos);

    rayDirection = -rayDirection;
    vec3 reflection = reflect(rayDirection, nor);
    vec3 refraction = refract(rayDirection, nor, eta);

    vec3 nrefl = normalize(reflection);
    float reflectedLight = smoothstep(diff1from, 1., dot(normalize(projectedLights[0] - pos), nrefl)) +
      smoothstep(diff2from, 1., dot(normalize(projectedLights[1] - pos), nrefl));
    power += reflectedLight;

    float refractedLights[2];
    refractedLights[0] = dot(normalize(lights[0] - pos), normalize(refraction));
    refractedLights[1] = dot(normalize(lights[1] - pos), normalize(refraction));
    float refractedLight = (smoothstep(.0, 1., refractedLights[0]) + smoothstep(.0, 1., refractedLights[1]));
    power += refractedLight;

    power += traceOuter3(pos + reflection, -reflection, eta) * reflectionEffectPower;
  }
  return power;
}

float traceOuter5(vec3 rayOrigin, vec3 rayDirection, float eta) {
  rayDirection = normalize(rayDirection);
  float power = 0.;
  // float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
  float d  = rayMarch(rayOrigin, rayDirection, 1.0);

  if(d < MAX_DIST) {
    vec3 pos = rayOrigin + rayDirection * d;
    // vec3 nor = -roundedboxNormal(pos, scene.outerSize, scene.outerRadius);
    vec3 nor = -getNormal(pos);

    rayDirection = -rayDirection;
    vec3 reflection = reflect(rayDirection, nor);
    vec3 refraction = refract(rayDirection, nor, eta);

    vec3 nrefl = normalize(reflection);
    float reflectedLight = smoothstep(diff1from, 1., dot(normalize(projectedLights[0] - pos), nrefl)) +
      smoothstep(diff2from, 1., dot(normalize(projectedLights[1] - pos), nrefl));
    power += reflectedLight;

    float refractedLights[2];
    refractedLights[0] = dot(normalize(lights[0] - pos), normalize(refraction));
    refractedLights[1] = dot(normalize(lights[1] - pos), normalize(refraction));
    float refractedLight = (smoothstep(.0, 1., refractedLights[0]) + smoothstep(.0, 1., refractedLights[1]));
    power += refractedLight;

    power += traceOuter4(pos + reflection, -reflection, eta) * reflectionEffectPower;
  }
  return power;
}

vec3 trace(vec3 rayOrigin, vec3 rayDirection) {
  // rayDirection = normalize(rayDirection);
  vec3 power = vec3(0., 0., 0.);
  // float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
  float d = rayMarch(rayOrigin, rayDirection, 1.0);
  
  if(d < MAX_DIST) {
    // vec3 pos = rayOrigin + rayDirection * d;
    // // vec3 nor = roundedboxNormal(pos, scene.outerSize, scene.outerRadius);
    // vec3 nor = getNormal(pos);

    // float refractionPowerR = refractionPower + lightChannelDelta;
    // float refractionPowerB = refractionPower - lightChannelDelta;
    // vec3 refractionR = refract(rayDirection, nor, refractionPowerR);
    // vec3 refractionG = refract(rayDirection, nor, refractionPower);
    // vec3 refractionB = refract(rayDirection, nor, refractionPowerB);

    // power.r = traceOuter5(pos + refractionR, -refractionR, refractionPowerR);
    // power.g = traceOuter5(pos + refractionG, -refractionG, refractionPower);
    // power.b = traceOuter5(pos + refractionB, -refractionB, refractionPowerB);
  }

  return power;
}

// void main() {
//   scene.localToWorld = rotateBox(normalize(vec3(0., 0., 1.)), 0.7853981633974483);
//   scene.worldToLocal = inverse(scene.localToWorld);

//   scene.outerSize = vec3(morphPower);
//   scene.outerRadius = 1. - morphPower;

//   float ratio = resolution.x / resolution.y;
//   vec2 uv = vUv - 0.5;
//   uv.x *= ratio;

//   vec3 power = vec3(0.);

//   // vec3 rayOrigin = cameraPosition;
//   vec3 rayOrigin = camPos;
//   vec3 ww = normalize(-rayOrigin);
//   vec3 uu = normalize(cross(ww, vec3(0., 1., 0.)));
//   vec3 vv = cross(uu, ww);

//   vec3 rayOriginLocal = ptransform(scene.worldToLocal, rayOrigin);

//   scene.light[0] = vec3(.2, 2., -.8);
//   scene.light[1] = vec3(.2, -2., -.8);
//   vec3 dir;

//   scene.light[0] = scene.light[0].x * uu + scene.light[0].y * vv + scene.light[0].z * ww;
//   scene.light[0] = ptransform(scene.worldToLocal, scene.light[0]);
//   dir = normalize(-scene.light[0]);
//   scene.projectedLight[0] = scene.light[0] + dir * roundedboxIntersectModified(scene.light[0], dir, scene.outerSize, scene.outerRadius);

//   scene.light[1] = scene.light[1].x * uu + scene.light[1].y * vv + scene.light[1].z * ww;
//   scene.light[1] = ptransform(scene.worldToLocal, scene.light[1]);
//   dir = normalize(-scene.light[1]);
//   scene.projectedLight[1] = scene.light[1] + dir * roundedboxIntersectModified(scene.light[1], dir, scene.outerSize, scene.outerRadius);

//   vec2 p = (2. * gl_FragCoord.xy - resolution) / resolution.y;

//   // vec3 rayDirection = normalize(p.x * uu + p.y * vv + 3. * ww);
//   vec3 rayDirection = getCameraRayDir(uv, cameraPosition, vec3(0.), 1.);
//   vec3 rayDirectionLocal = ntransform(scene.worldToLocal, rayDirection);

//   // power += trace(rayOriginLocal, rayDirectionLocal);
//   power += trace(rayOrigin, rayDirection);

//   power = clamp(power, 0., 1.);

//   gl_FragColor = vec4(power, 1.);
// }

void main() {
  float ratio = resolution.x / resolution.y;
  // vec2 uv = vUv - 0.5;
  vec3 power = vec3(0.);

  // ray origin
  vec3 ro = camPos;
  vec3 ww = normalize(-ro);
  vec3 camForward = normalize(-ro);
  vec3 uu = normalize(cross(ww, vec3(0., 1., 0.)));
  vec3 camRight = normalize(cross(camForward, vec3(0.0, 1.0, 0.0)));
  vec3 vv = cross(uu, ww);
  vec3 camUp = normalize(cross(camRight, camForward));

  lights[0] = vec3(.2, 2., -.8);
  lights[1] = vec3(-.2, -2., -.8);
  vec3 dir;

  lights[0] = ro + lights[0].x * camRight + lights[0].y * camUp;
  dir = normalize(-lights[0]);
  projectedLights[0] = lights[0] + dir * rayMarch(lights[0], dir, 1.0);
  projectedLights[0] = lights[0];

  lights[1] = ro + lights[1].x * camRight + lights[1].y * camUp;
  dir = normalize(-lights[1]);
  projectedLights[1] = lights[1] + dir * rayMarch(lights[1], dir, 1.0);
  projectedLights[1] = lights[1];

  #if AA > 1
    for(int m = 0; m < AA; m++)
    for(int n = 0; n < AA; n++)
    {
      vec2 aadiff = vec2(float(m), float(n)) / float(AA) - 0.0;
      vec2 uv = (gl_FragCoord.xy + aadiff) / resolution - 0.5;
  #else
    vec2 uv = gl_FragCoord.xy / resolution - 0.5;
  #endif
  uv.x *= ratio; 
  
  // ray direction
  vec3 rd = getCameraRayDir(uv, ro, vec3(0.), 1.);
  // vec3 rd = normalize(uv.x * uu + uv.y * vv + 3. * ww);

  float d = rayMarch(ro, rd, 1.);

  if(d < MAX_DIST) {
    vec3 p = ro + rd * d;
    vec3 n = getNormal(p);

    float refractionPowerR = refractionPower + lightChannelDelta;
    float refractionPowerB = refractionPower - lightChannelDelta;
    vec3 refractionR = refract(rd, n, refractionPowerR);
    vec3 refractionG = refract(rd, n, refractionPower);
    vec3 refractionB = refract(rd, n, refractionPowerB);

    power.r += traceOuter5(p + refractionR * 0.1, -refractionR, refractionPowerR);
    power.g += traceOuter5(p + refractionG * 0.1, -refractionG, refractionPower);
    power.b += traceOuter5(p + refractionB * 0.1, -refractionB, refractionPowerB);
  }
  #if AA > 1
    }
    power /= float(AA * AA);
  #endif

  // power = pow(power, vec3(0.4545));

  gl_FragColor = vec4(power, 1.0);
}
`;
