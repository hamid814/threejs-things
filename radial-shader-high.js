!function(){"use strict";var n,e={2671:function(n,e,t){var o=t(2212),a=t(5260),i=t(6426),r=t(5980),v=t(2886),l=document.getElementById("webgl"),c=new o.WebGLRenderer({antialias:!0,canvas:l,preserveDrawingBuffer:!0});c.setSize(innerWidth,innerHeight),document.body.appendChild(c.domElement);var s=new o.Scene,g=new o.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);g.position.set(0,0,7),g.lookAt(0,0,0),new v.OrbitControls(g,c.domElement).update();var f=new o.IcosahedronGeometry(1.4,32),m=new o.ShaderMaterial({uniforms:{time:{value:0}},vertexShader:"\n  varying vec3 vPosition;\n  varying vec2 vUv;\n  varying float test;\n  uniform float time;\n\n  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\n  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\n  vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}\n\n  float noise(vec3 P){\n    vec3 Pi0 = floor(P); // Integer part for indexing\n    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\n    Pi0 = mod(Pi0, 289.0);\n    Pi1 = mod(Pi1, 289.0);\n    vec3 Pf0 = fract(P); // Fractional part for interpolation\n    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n    vec4 iy = vec4(Pi0.yy, Pi1.yy);\n    vec4 iz0 = Pi0.zzzz;\n    vec4 iz1 = Pi1.zzzz;\n\n    vec4 ixy = permute(permute(ix) + iy);\n    vec4 ixy0 = permute(ixy + iz0);\n    vec4 ixy1 = permute(ixy + iz1);\n\n    vec4 gx0 = ixy0 / 7.0;\n    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;\n    gx0 = fract(gx0);\n    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n    vec4 sz0 = step(gz0, vec4(0.0));\n    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n    vec4 gx1 = ixy1 / 7.0;\n    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;\n    gx1 = fract(gx1);\n    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n    vec4 sz1 = step(gz1, vec4(0.0));\n    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n    g000 *= norm0.x;\n    g010 *= norm0.y;\n    g100 *= norm0.z;\n    g110 *= norm0.w;\n    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n    g001 *= norm1.x;\n    g011 *= norm1.y;\n    g101 *= norm1.z;\n    g111 *= norm1.w;\n\n    float n000 = dot(g000, Pf0);\n    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n    float n111 = dot(g111, Pf1);\n\n    vec3 fade_xyz = fade(Pf0);\n    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); \n    return 1.0 * n_xyz;\n  }\n\n  float map(float value, float min1, float max1, float min2, float max2) {\n    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);\n  }\n  \n  void main() {\n    vUv = uv;\n    vPosition = position;\n    float slowTime = time * 5.0;\n\n    // vec3 sth = vec3(position.x * 2.0, position.y * 2.0 + slowTime, position.z * 2.0);\n    // float noiseValue = noise(sth);\n\n    vec3 p = position;\n    \n    float noiseFactor = (sin(slowTime * 0.2) * 4.0) + 2.0;\n    float noisePower = (cos(slowTime * 0.2 + 0.5) * 0.4) + 0.6;\n    \n    vec3 p1 = vec3(p.x * 1.0 + slowTime, p.y * 1.0 + slowTime, p.z * 1.0 + slowTime);\n    vec3 p2 = vec3(p.x * 2.0 + slowTime, p.y * 2.0 + slowTime, p.z * 2.0 + slowTime);\n    vec3 p3 = vec3(p.x * 4.0 + slowTime, p.y * 4.0 + slowTime, p.z * 4.0 + slowTime);\n    \n    // float noiseValue = 0.0 * noise(p1) + 0.0 * noise(p2) + 0.3 * noise(p3);\n    float noiseValue = noisePower * noise(vec3(p.x * noiseFactor + slowTime, p.y * noiseFactor + slowTime, p.z * noiseFactor + slowTime));\n    \n    test = map(noiseValue, 0.0, 1.0, 0.6, 1.0);\n    test = noiseValue - 0.1;\n    \n    float noiseAmp = map(noiseValue, 0.0, 1.0, 0.8, 1.2);\n    \n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * noiseAmp * 1.5, 1.0);\n  }\n",fragmentShader:"\n  uniform float time;\n  varying vec3 vPosition;\n  varying vec2 vUv;\n  varying float test;\n\n  float map(float value, float min1, float max1, float min2, float max2) {\n    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);\n  }\n\n  void main() {\n  \tfloat r = map(test, -0.1, 0.0, 0.6, 1.0);\n\n    r = clamp(r, 0.6, 1.0);\n\n    gl_FragColor = vec4(vec3(r, 0.6, 0.6), 1.0);\n  }\n",side:2}),x=new o.Mesh(f,m);s.add(x);var d={uniforms:{tDiffuse:{value:null}},vertexShader:"\n    varying vec2 vUv;\n  \n    void main() {\n      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); \n\n      vUv = uv;\n    }\n  ",fragmentShader:"\n    #define PI 3.1415926538\n  \n    uniform sampler2D tDiffuse;\n    \n    varying vec2 vUv;\n\n    ".concat("\nmat3 rotation3dX(float angle) {\n\tfloat s = sin(angle);\n\tfloat c = cos(angle);\n\n\treturn mat3(\n\t\t1.0, 0.0, 0.0,\n\t\t0.0, c, s,\n\t\t0.0, -s, c\n\t);\n}\n  \nmat3 rotation3dY(float angle) {\n\tfloat s = sin(angle);\n\tfloat c = cos(angle);\n\n\treturn mat3(\n\t\tc, 0.0, -s,\n\t\t0.0, 1.0, 0.0,\n\t\ts, 0.0, c\n\t);\n}\n\nmat3 rotation3dZ(float angle) {\n\tfloat s = sin(angle);\n\tfloat c = cos(angle);\n\n\treturn mat3(\n\t\tc, s, 0.0,\n\t\t-s, c, 0.0,\n\t\t0.0, 0.0, 1.0\n\t);\n}\n\nmat4 rotation3d(vec3 axis, float angle) {\n  axis = normalize(axis);\n  float s = sin(angle);\n  float c = cos(angle);\n  float oc = 1.0 - c;\n\n  return mat4(\n\t\toc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,\n    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,\n    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,\n\t\t0.0,                                0.0,                                0.0,                                1.0\n\t);\n}\n\nmat2 rotation2d(float angle) {\n\tfloat s = sin(angle);\n\tfloat c = cos(angle);\n\n\treturn mat2(\n\t\tc, -s,\n\t\ts, c\n\t);\n}\n\nvec3 rotateX(vec3 v, float angle) {\n\treturn rotation3dX(angle) * v;\n}\n\nvec3 rotateY(vec3 v, float angle) {\n\treturn rotation3dY(angle) * v;\n}\n\nvec3 rotateZ(vec3 v, float angle) {\n\treturn rotation3dZ(angle) * v;\n}\n\nvec3 rotate(vec3 v, vec3 axis, float angle) {\n\treturn (rotation3d(axis, angle) * vec4(v, 1.0)).xyz;\n}\n\nvec2 rotate(vec2 v, float angle) {\n\treturn rotation2d(angle) * v;\n}\n","\n  \n    vec2 rotateUV(vec2 uv, float rotation, vec2 mid)\n      {\n          return vec2(\n            cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,\n            cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y\n          );\n      }\n    \n    void main() {\n      float angle = atan(vUv.x - 0.5, vUv.y - 0.5);\n\n      // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);\n      angle /= PI * 2.0;\n      angle += 0.5;\n      angle *= 1024000.0;\n      if(mod(angle, 2.0) < 1.0) {\n        angle = mod(angle, 1.0);\n      } else {\n        angle = 1.0 - mod(angle, 1.0);\n      }\n\n      vec2 rotatedUv = rotateUV(vUv, angle, vec2(0.5));\n      \n      vec4 texel = texture2D( tDiffuse, rotatedUv );\n      \n      gl_FragColor = vec4(angle, angle, angle, 1.0);\n      gl_FragColor = texel;\n    }\n  ")},u=new a.xC(c),y=new i.C(s,g);u.addPass(y);var p=new r.T({uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:"\n\t\tvarying vec2 vUv;\n\n\t\tvoid main() {\n\t\t\tvUv = uv;\n\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t}",fragmentShader:"\n\t\tuniform sampler2D tDiffuse;\n\t\tvarying vec2 vUv;\n\n    float map(float value, float min1, float max1, float min2, float max2) {\n      return min2 + (value - min1) * (max2 - min2) / (max1 - min1);\n    }\n    \n\t\tvoid main() {\n      vec2 doubleUv = vUv * 2.0;\n\n      if(vUv.x > 0.5) doubleUv.x = map(doubleUv.x - 1.0, 0.0, 1.0, 1.0, 0.0);\n      \n      if (vUv.y > 0.5) doubleUv.y = map(doubleUv.y - 1.0, 0.0, 1.0, 1.0, 0.0);\n\n\t\t\tvec4 vertex_Color = texture2D(tDiffuse, doubleUv);\n\n      // vertex_Color.r = map(vertex_Color.r, 0.0, 1.0, 0.3, 0.8);\n      \n      gl_FragColor = vec4(vertex_Color.r, vertex_Color.g, vertex_Color.b, 1.0);\n\t\t}"});p.enabled=!1,u.addPass(p);var z=new r.T(d);u.addPass(z);var P=0;!function n(){u.render(),x.material.uniforms.time.value=P,P+=.003,requestAnimationFrame(n)}(),window.addEventListener("resize",(function(){var n=innerWidth,e=innerHeight;c.setSize(n,e),g.aspect=n/e,g.updateProjectionMatrix()})),document.addEventListener("keydown",(function(n){"p"===n.key&&function(){try{var n="image/jpeg",e=c.domElement.toDataURL(n),t=document.getElementsByTagName("script"),o=t[t.length-1],a=new URL(o.src).pathname.slice(1,-3);h(e.replace(n,w),a+".jpg")}catch(n){return void console.log(n)}}()}));var w="image/octet-stream",h=function(n,e){var t=document.createElement("a");"string"==typeof t.download?(document.body.appendChild(t),t.download=e,t.href=n,t.click(),document.body.removeChild(t)):location.replace(uri)}}},t={};function o(n){var a=t[n];if(void 0!==a)return a.exports;var i=t[n]={exports:{}};return e[n](i,i.exports,o),i.exports}o.m=e,n=[],o.O=function(e,t,a,i){if(!t){var r=1/0;for(c=0;c<n.length;c++){t=n[c][0],a=n[c][1],i=n[c][2];for(var v=!0,l=0;l<t.length;l++)(!1&i||r>=i)&&Object.keys(o.O).every((function(n){return o.O[n](t[l])}))?t.splice(l--,1):(v=!1,i<r&&(r=i));v&&(n.splice(c--,1),e=a())}return e}i=i||0;for(var c=n.length;c>0&&n[c-1][2]>i;c--)n[c]=n[c-1];n[c]=[t,a,i]},o.d=function(n,e){for(var t in e)o.o(e,t)&&!o.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:e[t]})},o.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},function(){var n={843:0};o.O.j=function(e){return 0===n[e]};var e=function(e,t){var a,i,r=t[0],v=t[1],l=t[2],c=0;for(a in v)o.o(v,a)&&(o.m[a]=v[a]);if(l)var s=l(o);for(e&&e(t);c<r.length;c++)i=r[c],o.o(n,i)&&n[i]&&n[i][0](),n[r[c]]=0;return o.O(s)},t=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];t.forEach(e.bind(null,0)),t.push=e.bind(null,t.push.bind(t))}();var a=o.O(void 0,[2886,2214],(function(){return o(2671)}));a=o.O(a)}();