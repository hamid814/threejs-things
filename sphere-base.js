!function(){"use strict";var n,e={5746:function(n,e,t){var o=t(2212),i=t(2886),a=t(5260),r=t(6426),v=t(5980),c=document.getElementById("webgl"),l=new o.WebGLRenderer({antialias:!0,canvas:c,preserveDrawingBuffer:!0});l.setSize(innerWidth,innerHeight),l.setSize(600,600),document.body.appendChild(l.domElement),l.setClearColor(10066329);var g=new o.Scene,f=new o.PerspectiveCamera(45,1,.1,1e3);f.position.set(0,0,4),f.lookAt(0,0,0),new i.OrbitControls(f,l.domElement).update();var m=new o.IcosahedronGeometry(1.4,32),s=new o.ShaderMaterial({uniforms:{time:{value:0}},vertexShader:"\n  varying vec3 vPosition;\n  varying vec2 vUv;\n  varying float test;\n  uniform float time;\n\n  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\n  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\n  vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}\n\n  float noise(vec3 P){\n    vec3 Pi0 = floor(P); // Integer part for indexing\n    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\n    Pi0 = mod(Pi0, 289.0);\n    Pi1 = mod(Pi1, 289.0);\n    vec3 Pf0 = fract(P); // Fractional part for interpolation\n    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n    vec4 iy = vec4(Pi0.yy, Pi1.yy);\n    vec4 iz0 = Pi0.zzzz;\n    vec4 iz1 = Pi1.zzzz;\n\n    vec4 ixy = permute(permute(ix) + iy);\n    vec4 ixy0 = permute(ixy + iz0);\n    vec4 ixy1 = permute(ixy + iz1);\n\n    vec4 gx0 = ixy0 / 7.0;\n    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;\n    gx0 = fract(gx0);\n    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n    vec4 sz0 = step(gz0, vec4(0.0));\n    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n    vec4 gx1 = ixy1 / 7.0;\n    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;\n    gx1 = fract(gx1);\n    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n    vec4 sz1 = step(gz1, vec4(0.0));\n    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n    g000 *= norm0.x;\n    g010 *= norm0.y;\n    g100 *= norm0.z;\n    g110 *= norm0.w;\n    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n    g001 *= norm1.x;\n    g011 *= norm1.y;\n    g101 *= norm1.z;\n    g111 *= norm1.w;\n\n    float n000 = dot(g000, Pf0);\n    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n    float n111 = dot(g111, Pf1);\n\n    vec3 fade_xyz = fade(Pf0);\n    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); \n    return 2.2 * n_xyz;\n  }\n\n  float map(float value, float min1, float max1, float min2, float max2) {\n    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);\n  }\n  \n  void main() {\n    vUv = uv;\n    vPosition = position;\n    float slowTime = time * 5.0;\n\n    // vec3 sth = vec3(position.x * 2.0, position.y * 2.0 + slowTime, position.z * 2.0);\n    // float noiseValue = noise(sth);\n\n    vec3 p = position;\n    \n    vec3 p1 = vec3(p.x * 1.0 + slowTime, p.y * 1.0 + slowTime, p.z * 1.0 + slowTime);\n    vec3 p2 = vec3(p.x * 2.0 + slowTime, p.y * 2.0 + slowTime, p.z * 2.0 + slowTime);\n    vec3 p3 = vec3(p.x * 4.0 + slowTime, p.y * 4.0 + slowTime, p.z * 4.0 + slowTime);\n    \n    float noiseValue = 1.0 * noise(p1) +  0.5 * noise(p2) + 0.25 * noise(p3);\n    \n    // test = map(noiseValue, 0.0, 1.0, 1.0, 0.0);\n    test = noiseValue;\n    \n    float noiseAmp = map(noiseValue, 0.0, 1.0, 0.8, 1.2);\n    \n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n",fragmentShader:"\n  uniform float time;\n  varying vec3 vPosition;\n  varying vec2 vUv;\n  varying float test;\n\n  float map(float value, float min1, float max1, float min2, float max2) {\n    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);\n  }\n\n  void main() {\n  \tfloat r = map(test, 0.0, 1.0, 0.625, 0.9);\n  \tfloat g = map(test, 0.0, 1.0, 0.625, 0.9);\n  \tfloat b = map(test, 0.0, 1.0, 0.625, 0.9);\n\n    gl_FragColor = vec4(vec3(r, g, b), 1.0);\n  }\n",side:2}),x=new o.Mesh(m,s);g.add(x);var d=new a.xC(l),u=new r.C(g,f);d.addPass(u);var y=new v.T({uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:"\n\t\tvarying vec2 vUv;\n\n\t\tvoid main() {\n\t\t\tvUv = uv;\n\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t}",fragmentShader:"\n\t\tuniform sampler2D tDiffuse;\n\t\tvarying vec2 vUv;\n\n    float map(float value, float min1, float max1, float min2, float max2) {\n      return min2 + (value - min1) * (max2 - min2) / (max1 - min1);\n    }\n    \n\t\tvoid main() {\n      vec2 doubleUv = vUv * 2.0;\n\n      if(vUv.x > 0.5) doubleUv.x = map(doubleUv.x - 1.0, 0.0, 1.0, 1.0, 0.0);\n      \n      if (vUv.y > 0.5) doubleUv.y = map(doubleUv.y - 1.0, 0.0, 1.0, 1.0, 0.0);\n\n\t\t\tgl_FragColor = texture2D(tDiffuse, doubleUv);\n\t\t}"});d.addPass(y);var p=0;!function n(){d.render(),x.material.uniforms.time.value=p,p+=.003,x.rotateZ(.01),requestAnimationFrame(n)}(),window.addEventListener("resize",(function(){var n=innerWidth,e=innerHeight;l.setSize(n,e),f.aspect=n/e,f.updateProjectionMatrix()})),document.addEventListener("keydown",(function(n){"p"===n.key&&function(){try{var n="image/jpeg",e=l.domElement.toDataURL(n),t=document.getElementsByTagName("script"),o=t[t.length-1],i=new URL(o.src).pathname.slice(1,-3);P(e.replace(n,z),i+".jpg")}catch(n){return void console.log(n)}}()}));var z="image/octet-stream",P=function(n,e){var t=document.createElement("a");"string"==typeof t.download?(document.body.appendChild(t),t.download=e,t.href=n,t.click(),document.body.removeChild(t)):location.replace(uri)}}},t={};function o(n){var i=t[n];if(void 0!==i)return i.exports;var a=t[n]={exports:{}};return e[n](a,a.exports,o),a.exports}o.m=e,n=[],o.O=function(e,t,i,a){if(!t){var r=1/0;for(l=0;l<n.length;l++){t=n[l][0],i=n[l][1],a=n[l][2];for(var v=!0,c=0;c<t.length;c++)(!1&a||r>=a)&&Object.keys(o.O).every((function(n){return o.O[n](t[c])}))?t.splice(c--,1):(v=!1,a<r&&(r=a));v&&(n.splice(l--,1),e=i())}return e}a=a||0;for(var l=n.length;l>0&&n[l-1][2]>a;l--)n[l]=n[l-1];n[l]=[t,i,a]},o.d=function(n,e){for(var t in e)o.o(e,t)&&!o.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:e[t]})},o.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},function(){var n={9930:0};o.O.j=function(e){return 0===n[e]};var e=function(e,t){var i,a,r=t[0],v=t[1],c=t[2],l=0;for(i in v)o.o(v,i)&&(o.m[i]=v[i]);if(c)var g=c(o);for(e&&e(t);l<r.length;l++)a=r[l],o.o(n,a)&&n[a]&&n[a][0](),n[r[l]]=0;return o.O(g)},t=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];t.forEach(e.bind(null,0)),t.push=e.bind(null,t.push.bind(t))}();var i=o.O(void 0,[2886,2214],(function(){return o(5746)}));i=o.O(i)}();