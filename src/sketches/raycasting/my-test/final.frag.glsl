#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .001
#define IOR 1.45
#define LCD 0.1 // light channel delta

uniform vec3 camPos;
uniform vec2 resolution;
uniform float uTime;

varying vec2 vUv;

// objects
vec3 box1Pos = vec3(0.);
vec3 box1Size = vec3(1.);

// diffuse light
float diffusePower = 1.0;
// glass
vec3 glassColor = vec3(0.3, 0.2, 0.1);
// light
vec3 lightPos = vec3(0.5, 0.1, 10.0);

mat2 rotate(float a) {
  float s=sin(a), c=cos(a);
  return mat2(c, -s, s, c);
}

float sdBox(vec3 point, vec3 position, vec3 size) {
  point -= position;
  point = abs(point) - size;
  float morphAmount = 0.25;
  // float morphAmount = 0.0;
  return length(max(point, 0.))+min(max(point.x, max(point.y, point.z)), 0.) - morphAmount;
}

float getDist(vec3 point) {
  float box1 = sdBox(point, box1Pos, box1Size);

  return box1;
}

float getDiffuseLight(vec3 point, vec3 normal, vec3 light) {
  vec3 lightDir = normalize(light - point);
  float diffuse = dot(normal, lightDir);
  // diffuse = (diffuse + 1.0) / 2.0;
  diffuse = max(0.0, diffuse);
  diffuse *= diffusePower;
  return diffuse;
}

float rayMarch(vec3 ro, vec3 rd, float sign) {
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

vec3 getRayDir(vec2 uv, vec3 p, vec3 l, float z) {
  vec3 f = normalize(l-p),
      r = normalize(cross(vec3(0,1,0), f)),
      u = cross(f,r),
      c = f*z,
      i = c + -uv.x*r + uv.y*u,
      d = normalize(i);
  return d;
}

void main() {
  float ratio = resolution.x / resolution.y;
  vec2 uv = vUv - 0.5;
  uv.x *= ratio;

  vec3 rayOrigin = camPos;
  vec3 rayDirection = getRayDir(uv, camPos, vec3(0.), 1.);
  rayDirection = normalize(rayDirection);

  // get light always behind the camera
  lightPos = getRayDir(vec2(0.0, 0.0), camPos, -camPos, 1.0);
  // lightPos = getRayDir(vec2(0.0, 0.1), camPos, vec3(0.), -1.0);
  // lightPos = vec3(5.0, 5.0, 5.0);
  // lightPos = camPos;

  float dist = rayMarch(rayOrigin, rayDirection, 1.);

  vec3 color = vec3(0.);

  if(dist < MAX_DIST) {
    vec3 point = rayOrigin + rayDirection * dist;
    vec3 normal = getNormal(point);

    color += getDiffuseLight(point, normal, lightPos);
  }
  // color *= glassColor;
  
  gl_FragColor = vec4(color, 1.0);
}