!function(){"use strict";var n,r={4951:function(n,r,e){var o=e(6358),t=e(2609),i=e(9416),a=e(1758),c=e(6298),l=e(966),f=e(6598),s=e(5437),p=e(1534);document.getElementById("webgl").remove();var m={boxSize:new t.A(1,1,.1),time:.025},d=new i.T({width:window.innerWidth,height:window.innerHeight}),v=d.gl,u=new a.V(v);u.position.set(0,2,4);var g=new c.q(u,{target:new t.A(0)});document.body.appendChild(v.canvas);var h=new l.Z(v,{position:{size:2,data:new Float32Array([-1,-1,3,-1,-1,3])},uv:{size:2,data:new Float32Array([0,0,2,0,0,2])}}),w=new f.$(v,{vertex:"#define GLSLIFY 1\nattribute vec2 uv;\nattribute vec2 position;\n\nvarying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = vec4(position, 0, 1);\n}",fragment:"precision highp float;\n#define GLSLIFY 1\n\n#define MAX_STEPS 100\n#define MAX_DIST 100.\n#define SURF_DIST .001\n#define IOR 1.45\n#define LCD 0.02\n#define RFL_STEPS 6\n#define AA 1\n\nuniform vec3 camPos;\nuniform vec3 boxSize;\nuniform float morphPower;\nuniform float boxThickness;\nuniform vec2 resolution;\nuniform float uTime;\n\nvec3 lights[2];\nvec3 projectedLights[2];\nfloat rIOR = 1.0 / IOR;\n\nstruct Reflection {\n  float power;\n  vec3 position;\n  vec3 direction;\n};\n\nmat2 rotate(float a) {\n  float s = sin(a);\n  float c = cos(a);\n  return mat2(c, s, -s, c);\n}\nfloat sdHexPrism(vec3 p, vec2 h) {\n  // p.yz *= rotate(uTime / 2.0);\n  // p.xz *= rotate(3.1415 * 0.5);\n  vec3 q = abs(p);\n  return max(q.z - h.y, max((q.x * 0.866025 + q.y * 0.5), q.y) - h.x);\n}\nfloat sdPlane(vec3 p) {\n  // p.xz *= Rot(uTime);\n  float d = dot(p, normalize(vec3(0.0, 0.0, 1.0)));\n  return d;\n}\nfloat sdBox(vec3 point, vec3 position, vec3 size) {\n  point.xz *= rotate(-uTime);\n  // point.xy *= rotate(3.1415 * 0.25);\n  point += position;\n  point = abs(point) - size;\n  float morphAmount = 0.1;\n  return length(max(point, 0.)) + min(max(point.x, max(point.y, point.z)), 0.) - morphAmount;\n}\nfloat sdSphere(vec3 p, float s) {\n  return length(p) - s;\n}\nfloat getDist(vec3 point) {\n  float box = sdBox(point, vec3(0.), boxSize);\n  // box = abs(box) - 0.4;\n  // float prism = sdHexPrism(point, vec2(1.5));\n  // float plane = sdPlane(point);\n\n  return box;\n  // return max(plane, prism);\n}\nfloat rayMarch(vec3 ro, vec3 rd, float sign) {\n  float dO = 0.;\n\n  for(int i = 0; i < MAX_STEPS; i++) {\n    vec3 p = ro + rd * dO;\n    float dS = getDist(p) * sign;\n    dO += dS;\n    if(dO > MAX_DIST || abs(dS) < SURF_DIST)\n      break;\n  }\n\n  return dO;\n}\nvec3 getNormal(vec3 point) {\n  float d = getDist(point);\n  vec2 e = vec2(.001, 0);\n\n  vec3 n = d - vec3(getDist(point - e.xyy), getDist(point - e.yxy), getDist(point - e.yyx));\n\n  return normalize(n);\n}\n\nvoid rotateLights(vec3 rayOrigin, vec3 camRight, vec3 camUp, vec3 camForward) {\n  lights[0] = rayOrigin + lights[0].x * camRight + lights[0].y * camUp + lights[0].z * camForward;\n  lights[1] = rayOrigin + lights[1].x * camRight + lights[1].y * camUp + lights[1].z * camForward;\n\n  projectedLights[0] = lights[0] + normalize(-lights[0]) * rayMarch(lights[0], normalize(-lights[0]), 1.0) * 0.95;\n  projectedLights[1] = lights[1] + normalize(-lights[1]) * rayMarch(lights[1], normalize(-lights[1]), 1.0) * 0.95;\n}\n\nfloat getDiffuse(vec3 point, vec3 normal) {\n  // return 1.0;\n  return max(0.0, dot(normalize(lights[0] - point), normal));\n}\n\nfloat getLight(vec3 ro, vec3 rd) {\n  rd = normalize(rd);\n  float power = 0.;\n\n  float d = rayMarch(ro, rd, -1.0);\n\n  if(d < MAX_DIST) {\n    vec3 p = ro + rd * d;\n    vec3 n = -getNormal(p);\n\n    vec3 reflection = reflect(rd, n);\n    reflection = normalize(reflection);\n    vec3 refraction = refract(-rd, n, rIOR);\n    refraction = normalize(refraction);\n\n    float rfl0 = dot(normalize(lights[0] - p), n);\n    rfl0 = smoothstep(0.95, 1.0, rfl0);\n    float rfl1 = dot(normalize(lights[1] - p), n);\n    rfl1 = smoothstep(0.75, 1.0, rfl1);\n\n    float rfr0 = dot(normalize(projectedLights[0] - p), refraction);\n    rfr0 = smoothstep(0.0, 1.0, rfr0);\n    float rfr1 = dot(normalize(projectedLights[1] - p), refraction);\n    rfr1 = smoothstep(0.0, 1.0, rfr1);\n\n    power += rfl0;\n    power += rfl1;\n    power += rfr0;\n    power += rfr1;\n  }\n\n  return power;\n}\n\nReflection getReflection(Reflection inReflection, int step) {\n  inReflection.direction = normalize(inReflection.direction);\n  Reflection ir = inReflection;\n\n  // out reflection\n  Reflection or;\n  or.power = 0.;\n\n  float d = rayMarch(ir.position, ir.direction, -1.0);\n  if(d < MAX_DIST) {\n    or.position = ir.position + ir.direction * d;\n    vec3 n = -getNormal(or.position);\n\n    vec3 reflection = reflect(ir.direction, n);\n    reflection = normalize(reflection);\n    vec3 refraction = refract(-ir.direction, n, rIOR);\n    refraction = normalize(refraction);\n\n    float rfl0 = dot(normalize(lights[0] - or.position), reflection);\n    rfl0 = smoothstep(0.99, 1.0, rfl0);\n    // rfl0 = clamp(rfl0, 0.0, 1.0);\n    float rfl1 = dot(normalize(lights[1] - or.position), reflection);\n    rfl1 = smoothstep(0.97, 1.0, rfl1);\n    // rfl1 = clamp(rfl1, 0.0, 1.0);\n\n    float rfr0 = dot(normalize(projectedLights[0] - or.position), refraction);\n    rfr0 = smoothstep(0.0, 1.0, rfr0);\n    // rfr0 = clamp(rfr0, 0.0, 1.0);\n    float rfr1 = dot(normalize(projectedLights[1] - or.position), refraction);\n    rfr1 = smoothstep(0.0, 1.0, rfr1);\n    // rfr1 = clamp(rfr1, 0.0, 1.0);\n\n    or.power += rfl0;\n    or.power += rfl1;\n    or.power += rfr0;\n    or.power += rfr1;\n\n    or.direction = reflection;\n    or.position = or.position + reflection;\n\n    // or.power = min(1.0, or.power);\n    or.power = clamp(or.power, 0.0, 1.0);\n    // or.power /= 0.8 / float(step);\n  }\n\n  return or;\n}\n\nvarying vec2 vUv;\n\nvoid main() {\n  vec3 power = vec3(1.);\n\n  vec3 rayOrigin = camPos;\n  vec3 camForward = normalize(vec3(0.) - camPos);\n  vec3 camRight = normalize(cross(camForward, vec3(0., 1., 0.)));\n  vec3 camUp = normalize(cross(camRight, camForward));\n\n  lights[0] = vec3(-0.2, 1.5, 0.0);\n  lights[1] = vec3(0.2, -1.6, 0.0);\n\n  rotateLights(rayOrigin, camRight, camUp, camForward);\n\n  #if AA > 1\n  for(int m = 0; m < AA; m++)\n    for(int n = 0; n < AA; n++) {\n      vec2 o = vec2(float(m), float(n)) / float(AA) - 0.;\n      vec2 uv = (2. * gl_FragCoord.xy + o - resolution) / resolution.y;\n      uv *= 0.5;\n  #else\n      // vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;\n      vec2 uv = vUv - 0.5;\n      uv.x *= resolution.x / resolution.y;\n      // uv *= 0.5;\n  #endif\n\n      vec3 rayDirection = uv.x * camRight + uv.y * camUp + camForward;\n\n      float dist = rayMarch(rayOrigin, rayDirection, 1.0);\n\n      if(dist < MAX_DIST) {\n        vec3 point = rayOrigin + rayDirection * dist;\n        vec3 normal = getNormal(point);\n\n        vec3 refractionR = refract(rayDirection, normal, rIOR + LCD);\n        vec3 refractionG = refract(rayDirection, normal, rIOR);\n        vec3 refractionB = refract(rayDirection, normal, rIOR - LCD);\n        // power += getLight(point + refractionR, refractionR);\n        // power += getDiffuse(point, normal);\n\n        Reflection rflR;\n        rflR.power = 0.;\n        rflR.direction = refractionR;\n        rflR.position = point + refractionR;\n\n        Reflection rflG;\n        rflG.power = 0.;\n        rflG.direction = refractionG;\n        rflG.position = point + refractionG;\n\n        Reflection rflB;\n        rflB.power = 0.;\n        rflB.direction = refractionB;\n        rflB.position = point + refractionB;\n\n        // for(int i = 0; i < RFL_STEPS; i++) {\n        //   rflR = getReflection(rflR, i);\n\n        //   power.r -= rflR.power;\n        // }\n        for(int i = 0; i < RFL_STEPS; i++) {\n          rflG = getReflection(rflG, i);\n\n          power -= rflG.power;\n        }\n        // for(int i = 0; i < RFL_STEPS; i++) {\n        //   rflB = getReflection(rflB, i);\n\n        //   power.b -= rflB.power;\n        // }\n        // power *= textureCube(bg, rflG.direction).rgb;\n      } else {\n        // uv.x /= resolution.x / resolution.y;\n        // uv += 0.5;\n        // power = textureCube(bg, rayDirection).rgb;\n      }\n#if AA > 1\n    }\n  // power /= float(AA * AA);\n#endif\n\n  power = clamp(power, 0.0, 1.0);\n  // power = pow(power, vec3(0.4545));\n\n  gl_FragColor = vec4(power, 1.0);\n}\n",uniforms:{uTime:{value:0},camPos:{value:new t.A(0,0,5)},resolution:{value:new s.S(window.innerWidth,window.innerHeight)},boxSize:{value:m.boxSize}}}),x=new p.K(v,{geometry:h,program:w});requestAnimationFrame((function n(){d.render({scene:x}),y+=m.time,w.uniforms.uTime.value=y,w.uniforms.camPos.value=u.position,w.uniforms.boxSize.value=m.boxSize,g.update(),requestAnimationFrame(n)}));var y=0;setTimeout((function(){o.ZP.to(m.boxSize,{duration:1,x:1,y:1,z:1})}),500),setTimeout((function(){var n=document.body.appendChild(document.createElement("button"));n.innerText="Stop rotate",n.style="\n    position: fixed;\n    padding: 15px;\n    z-index: 1;\n    left: 0;\n    top: 0;\n    border: none;\n    border-radius: 0;\n    cursor: pointer;",n.addEventListener("click",(function(){"Stop rotate"==n.innerText?(o.ZP.to(m,{duration:2,time:0,ease:"Circ.easeOut"}),n.innerText="Roate"):(o.ZP.to(m,{duration:2,time:.025,ease:"Circ.easeIn"}),n.innerText="Stop rotate")}))}),0)}},e={};function o(n){var t=e[n];if(void 0!==t)return t.exports;var i=e[n]={exports:{}};return r[n](i,i.exports,o),i.exports}o.m=r,n=[],o.O=function(r,e,t,i){if(!e){var a=1/0;for(s=0;s<n.length;s++){e=n[s][0],t=n[s][1],i=n[s][2];for(var c=!0,l=0;l<e.length;l++)(!1&i||a>=i)&&Object.keys(o.O).every((function(n){return o.O[n](e[l])}))?e.splice(l--,1):(c=!1,i<a&&(a=i));if(c){n.splice(s--,1);var f=t();void 0!==f&&(r=f)}}return r}i=i||0;for(var s=n.length;s>0&&n[s-1][2]>i;s--)n[s]=n[s-1];n[s]=[e,t,i]},o.d=function(n,r){for(var e in r)o.o(r,e)&&!o.o(n,e)&&Object.defineProperty(n,e,{enumerable:!0,get:r[e]})},o.o=function(n,r){return Object.prototype.hasOwnProperty.call(n,r)},function(){var n={2365:0};o.O.j=function(r){return 0===n[r]};var r=function(r,e){var t,i,a=e[0],c=e[1],l=e[2],f=0;if(a.some((function(r){return 0!==n[r]}))){for(t in c)o.o(c,t)&&(o.m[t]=c[t]);if(l)var s=l(o)}for(r&&r(e);f<a.length;f++)i=a[f],o.o(n,i)&&n[i]&&n[i][0](),n[i]=0;return o.O(s)},e=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];e.forEach(r.bind(null,0)),e.push=r.bind(null,e.push.bind(e))}();var t=o.O(void 0,[6358,1465],(function(){return o(4951)}));t=o.O(t)}();