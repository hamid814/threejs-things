#pragma glslify: noise = require(../../../glsl-util/perlin/3d);

#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .001

uniform vec2 resolution;
uniform vec2 mouse;
uniform float uTime;

varying vec2 vUv;

mat2 Rot(float a) {
  float s=sin(a), c=cos(a);
  return mat2(c, -s, s, c);
}

float sdSphere(vec3 p) {
  float r = noise(p * 2. + uTime) + 1.0;
  // float r = 1.0;
  
  vec4 s = vec4(0.0, 0.0, 0.0, r);
  
  float sphereDist =  length(p-s.xyz)-s.w;

  return sphereDist;
}

float sdBox(vec3 p, vec3 s) {
  p = abs(p)-s;
  return length(max(p, 0.))+min(max(p.x, max(p.y, p.z)), 0.);
}


float GetDist(vec3 p) {
  // float d = sdBox(p, vec3(0.5));
  float d = sdSphere(p) * 0.25;
  
  return d;
}

float RayMarch(vec3 ro, vec3 rd) {
  float dO=0.;
    
  for(int i=0; i<MAX_STEPS; i++) {
    vec3 p = ro + rd*dO;
      float dS = GetDist(p);
      dO += dS;
      if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
  }
    
  return dO;
}

vec3 GetNormal(vec3 p) {
  float d = GetDist(p);
  vec2 e = vec2(.001, 0);
  
  vec3 n = d - vec3(
      GetDist(p-e.xyy),
      GetDist(p-e.yxy),
      GetDist(p-e.yyx));
  
  return normalize(n);
}

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
  vec3 f = normalize(l-p),
      r = normalize(cross(vec3(0,1,0), f)),
      u = cross(f,r),
      c = f*z,
      i = c + uv.x*r + uv.y*u,
      d = normalize(i);
  return d;
}

void main() {
  float ratio = resolution.x / resolution.y;
  vec2 uv = (vUv - 0.5);
  uv.x *= ratio;

  vec3 ro = cameraPosition;
  ro.x *= -1.0;
  
  vec3 rd = GetRayDir(uv, ro, vec3(0.0 ,0.0, 0.0), 1.);
  vec3 col = vec3(0);

  float d = RayMarch(ro, rd);

  if(d<MAX_DIST) {
      vec3 p = ro + rd * d;
      vec3 n = GetNormal(p);
      vec3 r = reflect(rd, n);

      float dif = dot(n, normalize(vec3(1,2,3)))*.5+.5;
      col = vec3(dif);
  }
  
  col = pow(col, vec3(.4545));	// gamma correction
  
  gl_FragColor = vec4(col,1.0);
}