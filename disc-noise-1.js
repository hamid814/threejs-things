!function(){"use strict";var e,n={6099:function(e,n,t){var i=t(2212),o=t(5260),a=t(5980),r=document.getElementById("webgl"),c=new i.WebGLRenderer({antialias:!0,canvas:r,preserveDrawingBuffer:!0});c.setSize(innerWidth,innerHeight),c.setPixelRatio(Math.min(2,devicePixelRatio));var s={uniforms:{tDiffuse:{value:null},ratio:{value:innerWidth/innerHeight},uTime:{value:0}},vertexShader:"#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n\n  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);\n}",fragmentShader:"#define GLSLIFY 1\nvec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\nvec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\nvec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}\n\nfloat noise(vec3 P){\n  vec3 Pi0 = floor(P); // Integer part for indexing\n  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\n  Pi0 = mod(Pi0, 289.0);\n  Pi1 = mod(Pi1, 289.0);\n  vec3 Pf0 = fract(P); // Fractional part for interpolation\n  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n  vec4 iy = vec4(Pi0.yy, Pi1.yy);\n  vec4 iz0 = Pi0.zzzz;\n  vec4 iz1 = Pi1.zzzz;\n\n  vec4 ixy = permute(permute(ix) + iy);\n  vec4 ixy0 = permute(ixy + iz0);\n  vec4 ixy1 = permute(ixy + iz1);\n\n  vec4 gx0 = ixy0 / 7.0;\n  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;\n  gx0 = fract(gx0);\n  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n  vec4 sz0 = step(gz0, vec4(0.0));\n  gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n  gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n  vec4 gx1 = ixy1 / 7.0;\n  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;\n  gx1 = fract(gx1);\n  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n  vec4 sz1 = step(gz1, vec4(0.0));\n  gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n  gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n  g000 *= norm0.x;\n  g010 *= norm0.y;\n  g100 *= norm0.z;\n  g110 *= norm0.w;\n  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n  g001 *= norm1.x;\n  g011 *= norm1.y;\n  g101 *= norm1.z;\n  g111 *= norm1.w;\n\n  float n000 = dot(g000, Pf0);\n  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n  float n111 = dot(g111, Pf1);\n\n  vec3 fade_xyz = fade(Pf0);\n  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); \n  return 2.2 * n_xyz;\n}\n\nuniform float ratio;\nuniform float uTime;\n\nvarying vec2 vUv;\n\nvoid main() {\n  float time = uTime * 3.0;\n  float timeStep = 0.02;\n  \n  float timeN5 = time - 5.0 * timeStep;\n  float timeN4 = time - 4.0 * timeStep;\n  float timeN3 = time - 3.0 * timeStep;\n  float timeN2 = time - 2.0 * timeStep;\n  float timeN1 = time - 1.0 * timeStep;\n  float time0 = time;\n  float timeP1 = time + 1.0 * timeStep;\n  float timeP2 = time + 2.0 * timeStep;\n  float timeP3 = time + 3.0 * timeStep;\n  float timeP4 = time + 4.0 * timeStep;\n  float timeP5 = time + 5.0 * timeStep;\n  \n  vec2 ratioUV = vUv;\n  ratioUV.x *= ratio;\n  float shiftRatio = ratio / 2.0 - 0.5;\n  ratioUV.x -= shiftRatio;\n\n  vec2 noiseUV = ratioUV / 0.3;\n\n  float noiseN5 = noise(vec3(noiseUV.x, noiseUV.y, timeN5)) * 1.56;\n  float noiseN4 = noise(vec3(noiseUV.x, noiseUV.y, timeN4)) * 1.56;\n  float noiseN3 = noise(vec3(noiseUV.x, noiseUV.y, timeN3)) * 1.56;\n  float noiseN2 = noise(vec3(noiseUV.x, noiseUV.y, timeN2)) * 1.56;\n  float noiseN1 = noise(vec3(noiseUV.x, noiseUV.y, timeN1)) * 1.56;\n\n  float noiseP1 = noise(vec3(noiseUV.x, noiseUV.y, timeP1)) * 1.56;\n  float noiseP2 = noise(vec3(noiseUV.x, noiseUV.y, timeP2)) * 1.56;\n  float noiseP3 = noise(vec3(noiseUV.x, noiseUV.y, timeP3)) * 1.56;\n  float noiseP4 = noise(vec3(noiseUV.x, noiseUV.y, timeP4)) * 1.56;\n  float noiseP5 = noise(vec3(noiseUV.x, noiseUV.y, timeP5)) * 1.56;\n\n  float b1 = 1.0 - step(abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - 0.35), noiseN1);\n  float b2 = 1.0 - step(abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - 0.35), noiseN2);\n  float b3 = 1.0 - step(abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - 0.35), noiseN3);\n  float b4 = 1.0 - step(abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - 0.35), noiseN4);\n  float b5 = 1.0 - step(abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - 0.35), noiseN5);\n\n  float r1 = 1.0 - step(abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - 0.35), noiseP1);\n  float r2 = 1.0 - step(abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - 0.35), noiseP2);\n  float r3 = 1.0 - step(abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - 0.35), noiseP3);\n  float r4 = 1.0 - step(abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - 0.35), noiseP4);\n  float r5 = 1.0 - step(abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - 0.35), noiseP5);\n\n  float r = r1 / 5.0 + r2 / 5.0 + r3 / 5.0 + r4 / 5.0 + r5 / 5.0; \n\n  float b = b1 / 5.0 + b2 / 5.0 + b3 / 5.0 + b4 / 5.0 + b5 / 5.0; \n\n  gl_FragColor = vec4(r, 1.0 - step(r + b, 1.0), b, 1.0);\n}"},v=new o.xC(c),f=new a.T(s);v.addPass(f);var g=0;window.addEventListener("resize",(function(){var e=innerWidth,n=innerHeight;c.setSize(e,n)})),document.addEventListener("keydown",(function(e){"p"===e.key&&function(){try{var e="image/jpeg",n=c.domElement.toDataURL(e),t=document.getElementsByTagName("script"),i=t[t.length-1],o=new URL(i.src).pathname.slice(1,-3);m(n.replace(e,l),o+".jpg")}catch(e){return void console.log(e)}}()}));var l="image/octet-stream",m=function(e,n){var t=document.createElement("a");"string"==typeof t.download?(document.body.appendChild(t),t.download=n,t.href=e,t.click(),document.body.removeChild(t)):location.replace(uri)};!function e(){v.render(),g+=.003,f.uniforms.uTime.value=g,requestAnimationFrame(e)}()}},t={};function i(e){var o=t[e];if(void 0!==o)return o.exports;var a=t[e]={exports:{}};return n[e](a,a.exports,i),a.exports}i.m=n,e=[],i.O=function(n,t,o,a){if(!t){var r=1/0;for(f=0;f<e.length;f++){t=e[f][0],o=e[f][1],a=e[f][2];for(var c=!0,s=0;s<t.length;s++)(!1&a||r>=a)&&Object.keys(i.O).every((function(e){return i.O[e](t[s])}))?t.splice(s--,1):(c=!1,a<r&&(r=a));if(c){e.splice(f--,1);var v=o();void 0!==v&&(n=v)}}return n}a=a||0;for(var f=e.length;f>0&&e[f-1][2]>a;f--)e[f]=e[f-1];e[f]=[t,o,a]},i.d=function(e,n){for(var t in n)i.o(n,t)&&!i.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},i.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={4469:0};i.O.j=function(n){return 0===e[n]};var n=function(n,t){var o,a,r=t[0],c=t[1],s=t[2],v=0;if(r.some((function(n){return 0!==e[n]}))){for(o in c)i.o(c,o)&&(i.m[o]=c[o]);if(s)var f=s(i)}for(n&&n(t);v<r.length;v++)a=r[v],i.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return i.O(f)},t=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}();var o=i.O(void 0,[9869],(function(){return i(6099)}));o=i.O(o)}();