 varying vec2 vUv;
 uniform vec2 resolution;
 uniform vec2 mouse;
 uniform float morphPower;
 uniform float refractionPower;
 uniform float lightChannelDelta;
 uniform float angle;
 struct Scene {
   vec3 outerSize;
   float outerRadius;
   vec3 innerSize;
   float innerRadius;
   
   vec3 light[2];
   vec3 projectedLight[2];
 
   mat4 localToWorld;
   mat4 worldToLocal;
 } scene;
       
 // vec2 boxIntersection( vec3 ro, vec3 rd, vec3 boxSize, out vec3 outNormal ) 
 float boxIntersection( vec3 ro, vec3 rd, vec3 boxSize) 
 {
     vec3 m = 1.0 / rd; // can precompute if traversing a set of aligned boxes
     vec3 n = m * ro;   // can precompute if traversing a set of aligned boxes
     vec3 k = abs(m) * boxSize;
     vec3 t1 = -n - k;
     vec3 t2 = -n + k;
     float tN = max( max( t1.x, t1.y ), t1.z );
     float tF = min( min( t2.x, t2.y ), t2.z );
     if( tN > tF || tF < 0.0) return 0.; // no intersection
     // outNormal = -sign(rdd)*step(t1.yzx,t1.xyz)*step(t1.zxy,t1.xyz);
     return 1.;
 }
 
 float capIntersect( in vec3 ro, in vec3 rd, in vec3 pa, in vec3 pb, in float ra )
 {
     vec3  ba = pb - pa;
     vec3  oa = ro - pa;
     float baba = dot(ba,ba);
     float bard = dot(ba,rd);
     float baoa = dot(ba,oa);
     float rdoa = dot(rd,oa);
     float oaoa = dot(oa,oa);
     float a = baba      - bard*bard;
     float b = baba*rdoa - baoa*bard;
     float c = baba*oaoa - baoa*baoa - ra*ra*baba;
     float h = b*b - a*c;
     if( h >= 0.0 )
     {
       float t = (-b-sqrt(h))/a;
       float y = baoa + t*bard;
       // body
       if( y>0.0 && y<baba ) return t;
       // caps
       vec3 oc = (y <= 0.0) ?  ro - pb;
       b = dot(rd,oc);
       c = dot(oc,oc) - ra*ra;
       h = b*b - c;
       if( h>0.0 ) return -b - sqrt(h);
     }
     return 1e15;
 }
 
 float roundedboxIntersectModified(in vec3 rayOrigin, in vec3 rayDirection, in vec3 size, in float rad) {
   // bounding box
   vec3 m = 1. / rayDirection;
   vec3 n = m * rayOrigin;
   vec3 k = abs(m) * (size + rad);
   vec3 t1 = -n - k;
   vec3 t2 = -n + k;
   float tN = max(max(t1.x, t1.y), t1.z);
   float tF = min(min(t2.x, t2.y), t2.z);
   if (tN > tF || tF < 0.0) {
       return 1e15;
   }
   float t = tN;
 
   // convert to first octant
   vec3 pos = rayOrigin + t * rayDirection;
   vec3 s = sign(pos);
   vec3 ro = rayOrigin * s;
   vec3 rd = rayDirection * s;
   pos *= s;
   
   // faces
   pos -= size;
   pos = max(pos.xyz, pos.yzx);
   if (min(min(pos.x, pos.y), pos.z) < 0.) {
       return t;
   }
 
   t = capIntersect(ro, rd, vec3(size.x, -size.y, size.z), vec3(size.x, size.y, size.z), rad);
   t = min(t, capIntersect(ro, rd, vec3(size.x, size.y, -size.z), vec3(size.x, size.y, size.z), rad));
   t = min(t, capIntersect(ro, rd, vec3(-size.x, size.y, size.z), vec3(size.x, size.y, size.z), rad));
   
   return t;
 }
 
 float rand(vec2 n) { 
     return fract(sin(dot(n, vec2(12.9898, 4.1414))));
 }
 
 // normal of a rounded box
 vec3 roundedboxNormal(in vec3 pos, in vec3 siz, in float rad) {
       return normalize(sign(pos) * max(abs(pos) - siz, 0.));
 }
  
     
 
 vec4 rayFromOutside = vec4(0., 1., 1., 0.);
 vec4 rayFromInside = vec4(10., -1., 0., 1.);
 
 float traceOuter1(vec3 rayOrigin, vec3 rayDirection, float eta, vec4 sign) {
     rayDirection = normalize(rayDirection);
   float power = 0.;
   float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
   if (d < 1e14) {
       vec3 pos = rayOrigin + rayDirection * d;
     vec3 nor = -roundedboxNormal(pos, scene.outerSize, scene.outerRadius);
     rayDirection = -rayDirection;
     vec3 reflection = reflect(rayDirection, nor);
     vec3 refraction = refract(rayDirection, nor, eta);
     
 vec3 nrefl = normalize(reflection);
 float reflectedLight = 
   smoothstep(.95, 1., dot(normalize(scene.projectedLight[0] - pos), nrefl)) +
   smoothstep(.75, 1., dot(normalize(scene.projectedLight[1] - pos), nrefl))
 ;
     power += reflectedLight;
     
 float refractedLights[2];
 refractedLights[0] = dot(normalize(scene.light[0] - pos), normalize(refraction));
 refractedLights[1] = dot(normalize(scene.light[1] - pos), normalize(refraction));
 float refractedLight = (
       smoothstep(.0, 1., refractedLights[0])
   + smoothstep(.0, 1., refractedLights[1])
 )
 ;
     power += refractedLight;
   }
   return power;
 }
 
   vec3 trace(vec3 rayOrigin, vec3 rayDirection) {
     rayDirection = normalize(rayDirection);
     vec3 power = vec3(0., 0., 0.);
     float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
     if (d < 1e14) {
         vec3 pos = rayOrigin + rayDirection * d;
       vec3 nor = roundedboxNormal(pos, scene.outerSize, scene.outerRadius);
       
       float refractionPowerR = refractionPower + lightChannelDelta;
       float refractionPowerB = refractionPower - lightChannelDelta;
       vec3 refractionR = refract(rayDirection, nor, refractionPowerR);
       vec3 refractionG = refract(rayDirection, nor, refractionPower);
       vec3 refractionB = refract(rayDirection, nor, refractionPowerB);
       float ir = traceInner2(pos, refractionR, refractionPowerR, rayFromOutside);
       float ib = traceInner2(pos, refractionG, refractionPower,  rayFromOutside);
       float ig = traceInner2(pos, refractionB, refractionPowerB, rayFromOutside);
       power.r += ir > 0. ?  traceOuter1(pos + refractionR * rayFromInside.x, -refractionR, refractionPowerR, rayFromInside);
       power.g += ig > 0. ?  traceOuter1(pos + refractionG * rayFromInside.x, -refractionG, refractionPower , rayFromInside);
       power.b += ib > 0. ?  traceOuter1(pos + refractionB * rayFromInside.x, -refractionB, refractionPowerB, rayFromInside);
       power.r = traceInner2(pos, refractionR, refractionPowerR, rayFromOutside);
       power.g = traceInner2(pos, refractionG, refractionPower,  rayFromOutside);
       power.b = traceInner2(pos, refractionB, refractionPowerB, rayFromOutside);
       power.r = traceOuter1(pos + refractionR * rayFromInside.x, -refractionR, refractionPowerR, rayFromInside);
       power.g = traceOuter1(pos + refractionG * rayFromInside.x, -refractionG, refractionPower , rayFromInside);
       power.b = traceOuter1(pos + refractionB * rayFromInside.x, -refractionB, refractionPowerB, rayFromInside);
     }
   return power;
 }
 
 float traceInner1(vec3 rayOrigin, vec3 rayDirection, float eta, vec4 sign) {
     rayDirection = normalize(rayDirection);
   float power = 0.;
   float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.innerSize, scene.innerRadius);
   if (d < 1e14) {
       power += .001;
     vec3 pos = rayOrigin + rayDirection * d;
     vec3 nor = sign.y * roundedboxNormal(pos, scene.innerSize, scene.innerRadius);
     rayDirection *= sign.y;
     vec3 reflection = reflect(rayDirection, nor);
     vec3 refraction = refract(rayDirection, nor, eta);
     
 vec3 nrefl = normalize(reflection);
 float reflectedLight = 
   smoothstep(.95, 1., dot(normalize(scene.projectedLight[0] - pos), nrefl)) +
   smoothstep(.75, 1., dot(normalize(scene.projectedLight[1] - pos), nrefl))
 ;
     power += reflectedLight;
   }
   return power;
 }
 
   float traceInner2(vec3 rayOrigin, vec3 rayDirection, float eta, vec4 sign) {
       rayDirection = normalize(rayDirection);
     float power = 0.;
     float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.innerSize, scene.innerRadius);
     if (d < 1e14) {
         power += .001;
       vec3 pos = rayOrigin + rayDirection * d;
       vec3 nor = sign.y * roundedboxNormal(pos, scene.innerSize, scene.innerRadius);
       rayDirection *= sign.y;
       vec3 reflection = reflect(rayDirection, nor);
       vec3 refraction = refract(rayDirection, nor, eta);
   
       
 vec3 nrefl = normalize(reflection);
 float reflectedLight = 
   smoothstep(.95, 1., dot(normalize(scene.projectedLight[0] - pos), nrefl)) +
   smoothstep(.75, 1., dot(normalize(scene.projectedLight[1] - pos), nrefl))
 ;
       power += reflectedLight;
   
       vec3 rayOuter = sign.z * reflection + sign.w * refraction;
       vec3 rayInner = sign.w * reflection + sign.z * refraction;
   
       // power += traceOuter1(pos + rayFromInside.x * rayOuter, rayFromInside.y * rayOuter, eta, rayFromInside) * 0.8;
       power += traceInner1(pos + rayFromInside.x * rayInner, rayFromInside.y * rayInner, eta, rayFromInside) * 0.8;
     }
     return power;
   }
   
       
 void main() {
   // scene.localToWorld = rotateBox(normalize(vec3(0., 0., 1.)), 
   // 0.7853981633974483);
   scene.localToWorld = rotateBox(normalize(vec3(0., 0., 1.)), 0.0);
   scene.worldToLocal = inverse(scene.localToWorld);
   float innerFactor = mix(.5, .375, morphPower);
   scene.outerSize = vec3(morphPower);
   scene.outerRadius = 1. - morphPower;
   scene.innerSize = vec3(scene.outerRadius * innerFactor);
   scene.innerRadius = morphPower * innerFactor;
   // scene.innerSize = vec3(morphPower * innerFactor);
   // scene.innerRadius = scene.outerRadius * innerFactor;
   vec3 power = vec3(0.);
   
   // vec3 rayOrigin = vec3(9.5 * cos(angle), 0., 9.5 * sin(angle));
   vec3 rayOrigin = cameraPosition;
   vec3 ww = normalize(-rayOrigin);
   vec3 uu = normalize(cross(ww, vec3(0., 1., 0.)));
   vec3 vv = cross(uu, ww);
   vec3 rayOriginLocal = ptransform(scene.worldToLocal, rayOrigin);
   
       // scene.light[0] = vec3(.0,  2., -.02);
       // scene.light[1] = vec3(.02, -2., -.0);
       scene.light[0] = vec3(.2,  2., -.8);
       scene.light[1] = vec3(.2, -2., -.8);
       vec3 dir;
     
     scene.light[0] = scene.light[0].x * uu + scene.light[0].y * vv + scene.light[0].z * ww;
     scene.light[0] = ptransform(scene.worldToLocal, scene.light[0]);
     dir = normalize(-scene.light[0]);
     scene.projectedLight[0] = scene.light[0] + dir * roundedboxIntersectModified(scene.light[0], dir, scene.outerSize, scene.outerRadius);
     
     scene.light[1] = scene.light[1].x * uu + scene.light[1].y * vv + scene.light[1].z * ww;
     scene.light[1] = ptransform(scene.worldToLocal, scene.light[1]);
     dir = normalize(-scene.light[1]);
     scene.projectedLight[1] = scene.light[1] + dir * roundedboxIntersectModified(scene.light[1], dir, scene.outerSize, scene.outerRadius);
     
   
   
     vec2 p = (2. * gl_FragCoord.xy - resolution) / resolution.y;
   
     vec3 rayDirection = normalize(p.x * uu + p.y * vv + 3. * ww);
     vec3 rayDirectionLocal = ntransform(scene.worldToLocal, rayDirection);
   
     power += trace(rayOriginLocal, rayDirectionLocal);
   

   power = clamp(power, 0., 1.);
   
   // power = mix(vec3(1.), power, power);
   gl_FragColor = vec4(power, 1.);
 }
