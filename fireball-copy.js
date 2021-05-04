!function(){"use strict";var n,e={308:function(n,e,t){var o=t(212),i=t(886),d=t(379),r=t.n(d),a=t(421),c=(r()(a.Z,{insert:"head",singleton:!1}),a.Z.locals,document.getElementById("webgl")),v=new o.CP7({antialias:!0,canvas:c});v.setSize(innerWidth,innerHeight),v.setClearColor(16777215);var s=new o.xsS,f=new o.cPb(45,innerWidth/innerHeight,.1,1e3);f.position.set(0,0,5),f.lookAt(0,0,0),new i.z(f,v.domElement).update();var m=new o.cJO(1.6,32,16),l=new o.jyz({uniforms:{time:{value:0}},vertexShader:"#define GLSLIFY 1\nvarying vec3 vPosition;\nvarying vec2 vUv;\nvarying float test;\nuniform float time;\n\nvec3 permute(vec3 x) {\n  return mod((34.0 * x + 1.0) * x, 289.0);\n}\n\nvec3 dist(vec3 x, vec3 y, vec3 z,  bool manhattanDistance) {\n  return manhattanDistance ?  abs(x) + abs(y) + abs(z) :  (x * x + y * y + z * z);\n}\n\nfloat noise(vec3 P, float jitter, bool manhattanDistance) {\n  float K = 0.142857142857; // 1/7\n  float Ko = 0.428571428571; // 1/2-K/2\n  float  K2 = 0.020408163265306; // 1/(7*7)\n  float Kz = 0.166666666667; // 1/6\n  float Kzo = 0.416666666667; // 1/2-1/6*2\n\n  vec3 Pi = mod(floor(P), 289.0);\n    vec3 Pf = fract(P) - 0.5;\n\n  vec3 Pfx = Pf.x + vec3(1.0, 0.0, -1.0);\n  vec3 Pfy = Pf.y + vec3(1.0, 0.0, -1.0);\n  vec3 Pfz = Pf.z + vec3(1.0, 0.0, -1.0);\n\n  vec3 p = permute(Pi.x + vec3(-1.0, 0.0, 1.0));\n  vec3 p1 = permute(p + Pi.y - 1.0);\n  vec3 p2 = permute(p + Pi.y);\n  vec3 p3 = permute(p + Pi.y + 1.0);\n\n  vec3 p11 = permute(p1 + Pi.z - 1.0);\n  vec3 p12 = permute(p1 + Pi.z);\n  vec3 p13 = permute(p1 + Pi.z + 1.0);\n\n  vec3 p21 = permute(p2 + Pi.z - 1.0);\n  vec3 p22 = permute(p2 + Pi.z);\n  vec3 p23 = permute(p2 + Pi.z + 1.0);\n\n  vec3 p31 = permute(p3 + Pi.z - 1.0);\n  vec3 p32 = permute(p3 + Pi.z);\n  vec3 p33 = permute(p3 + Pi.z + 1.0);\n\n  vec3 ox11 = fract(p11*K) - Ko;\n  vec3 oy11 = mod(floor(p11*K), 7.0)*K - Ko;\n  vec3 oz11 = floor(p11*K2)*Kz - Kzo; // p11 < 289 guaranteed\n\n  vec3 ox12 = fract(p12*K) - Ko;\n  vec3 oy12 = mod(floor(p12*K), 7.0)*K - Ko;\n  vec3 oz12 = floor(p12*K2)*Kz - Kzo;\n\n  vec3 ox13 = fract(p13*K) - Ko;\n  vec3 oy13 = mod(floor(p13*K), 7.0)*K - Ko;\n  vec3 oz13 = floor(p13*K2)*Kz - Kzo;\n\n  vec3 ox21 = fract(p21*K) - Ko;\n  vec3 oy21 = mod(floor(p21*K), 7.0)*K - Ko;\n  vec3 oz21 = floor(p21*K2)*Kz - Kzo;\n\n  vec3 ox22 = fract(p22*K) - Ko;\n  vec3 oy22 = mod(floor(p22*K), 7.0)*K - Ko;\n  vec3 oz22 = floor(p22*K2)*Kz - Kzo;\n\n  vec3 ox23 = fract(p23*K) - Ko;\n  vec3 oy23 = mod(floor(p23*K), 7.0)*K - Ko;\n  vec3 oz23 = floor(p23*K2)*Kz - Kzo;\n\n  vec3 ox31 = fract(p31*K) - Ko;\n  vec3 oy31 = mod(floor(p31*K), 7.0)*K - Ko;\n  vec3 oz31 = floor(p31*K2)*Kz - Kzo;\n\n  vec3 ox32 = fract(p32*K) - Ko;\n  vec3 oy32 = mod(floor(p32*K), 7.0)*K - Ko;\n  vec3 oz32 = floor(p32*K2)*Kz - Kzo;\n\n  vec3 ox33 = fract(p33*K) - Ko;\n  vec3 oy33 = mod(floor(p33*K), 7.0)*K - Ko;\n  vec3 oz33 = floor(p33*K2)*Kz - Kzo;\n\n  vec3 dx11 = Pfx + jitter*ox11;\n  vec3 dy11 = Pfy.x + jitter*oy11;\n  vec3 dz11 = Pfz.x + jitter*oz11;\n\n  vec3 dx12 = Pfx + jitter*ox12;\n  vec3 dy12 = Pfy.x + jitter*oy12;\n  vec3 dz12 = Pfz.y + jitter*oz12;\n\n  vec3 dx13 = Pfx + jitter*ox13;\n  vec3 dy13 = Pfy.x + jitter*oy13;\n  vec3 dz13 = Pfz.z + jitter*oz13;\n\n  vec3 dx21 = Pfx + jitter*ox21;\n  vec3 dy21 = Pfy.y + jitter*oy21;\n  vec3 dz21 = Pfz.x + jitter*oz21;\n\n  vec3 dx22 = Pfx + jitter*ox22;\n  vec3 dy22 = Pfy.y + jitter*oy22;\n  vec3 dz22 = Pfz.y + jitter*oz22;\n\n  vec3 dx23 = Pfx + jitter*ox23;\n  vec3 dy23 = Pfy.y + jitter*oy23;\n  vec3 dz23 = Pfz.z + jitter*oz23;\n\n  vec3 dx31 = Pfx + jitter*ox31;\n  vec3 dy31 = Pfy.z + jitter*oy31;\n  vec3 dz31 = Pfz.x + jitter*oz31;\n\n  vec3 dx32 = Pfx + jitter*ox32;\n  vec3 dy32 = Pfy.z + jitter*oy32;\n  vec3 dz32 = Pfz.y + jitter*oz32;\n\n  vec3 dx33 = Pfx + jitter*ox33;\n  vec3 dy33 = Pfy.z + jitter*oy33;\n  vec3 dz33 = Pfz.z + jitter*oz33;\n\n  vec3 d11 = dist(dx11, dy11, dz11, manhattanDistance);\n  vec3 d12 =dist(dx12, dy12, dz12, manhattanDistance);\n  vec3 d13 = dist(dx13, dy13, dz13, manhattanDistance);\n  vec3 d21 = dist(dx21, dy21, dz21, manhattanDistance);\n  vec3 d22 = dist(dx22, dy22, dz22, manhattanDistance);\n  vec3 d23 = dist(dx23, dy23, dz23, manhattanDistance);\n  vec3 d31 = dist(dx31, dy31, dz31, manhattanDistance);\n  vec3 d32 = dist(dx32, dy32, dz32, manhattanDistance);\n  vec3 d33 = dist(dx33, dy33, dz33, manhattanDistance);\n\n  vec3 d1a = min(d11, d12);\n  d12 = max(d11, d12);\n  d11 = min(d1a, d13); // Smallest now not in d12 or d13\n  d13 = max(d1a, d13);\n  d12 = min(d12, d13); // 2nd smallest now not in d13\n  vec3 d2a = min(d21, d22);\n  d22 = max(d21, d22);\n  d21 = min(d2a, d23); // Smallest now not in d22 or d23\n  d23 = max(d2a, d23);\n  d22 = min(d22, d23); // 2nd smallest now not in d23\n  vec3 d3a = min(d31, d32);\n  d32 = max(d31, d32);\n  d31 = min(d3a, d33); // Smallest now not in d32 or d33\n  d33 = max(d3a, d33);\n  d32 = min(d32, d33); // 2nd smallest now not in d33\n  vec3 da = min(d11, d21);\n  d21 = max(d11, d21);\n  d11 = min(da, d31); // Smallest now in d11\n  d31 = max(da, d31); // 2nd smallest now not in d31\n  d11.xy = (d11.x < d11.y) ? d11.xy : d11.yx;\n  d11.xz = (d11.x < d11.z) ? d11.xz : d11.zx; // d11.x now smallest\n  d12 = min(d12, d21); // 2nd smallest now not in d21\n  d12 = min(d12, d22); // nor in d22\n  d12 = min(d12, d31); // nor in d31\n  d12 = min(d12, d32); // nor in d32\n  d11.yz = min(d11.yz,d12.xy); // nor in d12.yz\n  d11.y = min(d11.y,d12.z); // Only two more to go\n  d11.y = min(d11.y,d11.z); // Done! (Phew!)\n  // return sqrt(d11.xy); // F1, F2\n  return sqrt(d11.x); // F1, F2\n}\n\nfloat map(float value, float min1, float max1, float min2, float max2) {\n  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);\n}\n\nvoid main() {\n  vUv = uv;\n  vPosition = position;\n  float slowTime = time * 15.0;\n\n  // vec3 sth = vec3(position.x * 2.0, position.y * 2.0 + slowTime, position.z * 2.0);\n  // float noiseValue = noise(sth);\n\n  vec3 p1 = vec3(position.x * 1.0, position.y * 1.0 + slowTime, position.z * 1.0);\n  vec3 p2 = vec3(position.x * 2.0 + slowTime, position.y * 2.0, position.z * 2.0);\n  vec3 p3 = vec3(position.x * 4.0, position.y * 4.0, position.z * 4.0 + slowTime);\n  \n  float noiseValue = 1.0 * noise(p1, 1.0, true) +  0.5 * noise(p2, 1.0, true) + 0.4 * noise(p3, 1.0, true);\n  \n  test = map(noiseValue, 0.0, 2.0, 1.0, 0.0);\n  // test = noiseValue;\n  \n  float noiseAmp = map(noiseValue, 0.0, 1.0, 0.5, 0.8);\n  \n  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position * noiseAmp, 1.0);\n}",fragmentShader:"#define GLSLIFY 1\nuniform float time;\nvarying vec3 vPosition;\nvarying vec2 vUv;\nvarying float test;\n\nvoid main() {\n  gl_FragColor = vec4(vec3(test, test / 2.0, 0.0), 1.0);\n}"}),p=new o.Kj0(m,l);s.add(p),window.addEventListener("resize",(function(){v.setSize(innerWidth,innerHeight),f.aspect=innerWidth/innerHeight,f.updateProjectionMatrix()}));var z=0;!function n(){v.render(s,f),p.material.uniforms.time.value=z,z+=.001,requestAnimationFrame(n)}()},421:function(n,e,t){var o=t(645),i=t.n(o)()((function(n){return n[1]}));i.push([n.id,".text {\r\n  position: absolute;\r\n  left: 50%;\r\n  top: 50%;\r\n  transform: translateX(-50%) translateY(-50%);\r\n  font-size: 160px;\r\n  font-weight: 900;\r\n  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',\r\n    'Lucida Sans Unicode', Geneva, Verdana, sans-serif;\r\n  color: white;\r\n  pointer-events: none;\r\n}\r\n",""]),e.Z=i}},t={};function o(n){var i=t[n];if(void 0!==i)return i.exports;var d=t[n]={id:n,exports:{}};return e[n](d,d.exports,o),d.exports}o.m=e,n=[],o.O=function(e,t,i,d){if(!t){var r=1/0;for(v=0;v<n.length;v++){t=n[v][0],i=n[v][1],d=n[v][2];for(var a=!0,c=0;c<t.length;c++)(!1&d||r>=d)&&Object.keys(o.O).every((function(n){return o.O[n](t[c])}))?t.splice(c--,1):(a=!1,d<r&&(r=d));a&&(n.splice(v--,1),e=i())}return e}d=d||0;for(var v=n.length;v>0&&n[v-1][2]>d;v--)n[v]=n[v-1];n[v]=[t,i,d]},o.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return o.d(e,{a:e}),e},o.d=function(n,e){for(var t in e)o.o(e,t)&&!o.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:e[t]})},o.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},function(){var n={396:0};o.O.j=function(e){return 0===n[e]};var e=function(e,t){var i,d,r=t[0],a=t[1],c=t[2],v=0;for(i in a)o.o(a,i)&&(o.m[i]=a[i]);if(c)var s=c(o);for(e&&e(t);v<r.length;v++)d=r[v],o.o(n,d)&&n[d]&&n[d][0](),n[r[v]]=0;return o.O(s)},t=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];t.forEach(e.bind(null,0)),t.push=e.bind(null,t.push.bind(t))}();var i=o.O(void 0,[886,595],(function(){return o(308)}));i=o.O(i)}();