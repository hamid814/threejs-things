#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .001
#define IOR 1.45
#define LCD 0.02 // light channel delta

uniform mat4 worldToCamera;
uniform vec3 camPos;
uniform vec2 resolution;
uniform float uTime;

varying vec2 vUv;

// objects
vec3 box1Pos = vec3(0.);
vec3 box1Size = vec3(1.);

// diffuse light
float diffusePower = 0.1;
// glass
vec3 glassColor = vec3(0.8, 0.04, 0.02);
// lights
vec3[2] lights;

mat2 rotate(float a) {
  float s=sin(a), c=cos(a);
  return mat2(c, -s, s, c);
}

float sdPlane( vec3 p ){
  // p.xz *= Rot(uTime);
  float d = dot(p, normalize(vec3(0.0, 0.0, -1.0)));

  return d;
}

float sdBox(vec3 point, vec3 position, vec3 size) {
  // point.xz *= rotate(uTime / 3.0);
  // point.xy *= rotate(3.1415 * 0.25);
  point = abs(point) - size;
  float morphAmount = 0.1;
  return length(max(point, 0.))+min(max(point.x, max(point.y, point.z)), 0.) - morphAmount;
}

float getDist(vec3 point) {
  point.x *= -1.0;
  point *= mat3(worldToCamera);
  float box1 = sdBox(point, box1Pos, box1Size);
  // box1 = abs(box1) - 0.2;
  // float plane = sdPlane(point);

  return box1;
}

float getDiffuseLight(vec3 point, vec3 normal, int lightIndex) {
  vec3 lightDir = normalize(lights[lightIndex] - point);
  float diffuse = dot(normal, lightDir);
  diffuse = max(0.0, diffuse);
  diffuse *= diffusePower;
  return diffuse;
}

float getSpecularLight(vec3 rayOrigin, vec3 point, vec3 normal, int lightIndex) {
  vec3 viewDir = normalize(rayOrigin - point);
  vec3 reflectDir = reflect(lights[lightIndex], normal);
  reflectDir = normalize(reflectDir);
  float specular = dot(viewDir, -reflectDir);
  specular = max(0.0, specular);
  specular = pow(specular, 256.0);
  return specular;
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

  vec3 cameraPos = vec3(0.0, 0.0, -5.0);
  
  vec3 rayOrigin = cameraPos;
  vec3 rayDirection = getRayDir(uv, cameraPos, vec3(0.), 1.);
  rayDirection = normalize(rayDirection);

  // get light always behind the camera
  vec3 light0Dir = getRayDir(vec2( 1.0,  4.0), cameraPos, vec3(0.), -1.0);
  vec3 light1Dir = getRayDir(vec2(-1.0, -4.0), cameraPos, vec3(0.), -1.0);
  lights[0] = rayOrigin + light0Dir;
  lights[1] = rayOrigin + light1Dir;

  float dist = rayMarch(rayOrigin, rayDirection, 1.);

  vec3 color = vec3(0.);

  if(dist < MAX_DIST) {
    vec3 point = rayOrigin + rayDirection * dist;
    vec3 normal = getNormal(point);

    // diffuse light
    color += getDiffuseLight(point, normal, 0);

    // specular light
    color += getSpecularLight(rayOrigin, point, normal, 0);
    color += getSpecularLight(rayOrigin, point, normal, 1);

    vec3 rfr, pointStart;
    vec3 initialPoint = point;
    vec3 initialNormal = normal;

    // refraction enter
    rfr = refract(rayDirection, initialNormal, 1.0 / IOR);
    rfr = normalize(rfr);
    // if(dot(rfr, rfr) == 0.0) rfr = reflect(rayDirection, normal);
    pointStart = initialPoint + SURF_DIST * 3.0;
    dist = rayMarch(pointStart, rfr, -1.0);
    point = pointStart + rfr * dist;
    normal = -getNormal(point);
    color += getSpecularLight(pointStart, point, normal, 0);
    color += getSpecularLight(pointStart, point, normal, 1);


    // refract the ray inside
    // rfr = refract(rfr, normal, 1.0/IOR);
    // rfr = normalize(rfr);
    // if(dot(rfr, rfr) == 0.0) rfr = reflect(rayDirection, normal);
    // pointStart = point - SURF_DIST * 3.0;
    // dist = rayMarch(pointStart, rfr, -1.0);
    // point = pointStart + rfr * dist;
    // normal = -getNormal(point);
    // color += getSpecularLight(pointStart, point, normal);
  }

  // color *= glassColor; // glass color
  // color = pow(color, vec3(0.4545)); // gamma correction
  // color = mix(vec3(1.), color, color);
  
  gl_FragColor = vec4(color, 1.0);
}