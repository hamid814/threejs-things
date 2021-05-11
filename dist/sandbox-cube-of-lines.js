!function(){"use strict";var n,e={8396:function(n,e,t){var r=t(2212),o=t(2886),i=document.getElementById("webgl"),c=new r.WebGLRenderer({antialias:!0,canvas:i,preserveDrawingBuffer:!0});c.setSize(innerWidth,innerHeight),c.setClearColor(11184810),document.body.appendChild(c.domElement);var a=new r.Scene,v=new r.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);v.position.set(0,0,4),v.lookAt(0,0,0),new o.OrbitControls(v,c.domElement).update();for(var x="\n  uniform float uTime;\n\n  attribute vec3 color;\n  attribute vec3 test;\n\n  varying vec3 vColor;\n  varying vec3 vTest;\n  \n  ".concat("\nvec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\nfloat permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}\nvec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\nfloat taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}\nvec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}\n\nvec4 grad4(float j, vec4 ip){\n  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);\n  vec4 p,s;\n\n  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;\n  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);\n  s = vec4(lessThan(p, vec4(0.0)));\n  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; \n\n  return p;\n}\n\nfloat noise(vec3 P){\n  vec3 Pi0 = floor(P); // Integer part for indexing\n  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\n  Pi0 = mod(Pi0, 289.0);\n  Pi1 = mod(Pi1, 289.0);\n  vec3 Pf0 = fract(P); // Fractional part for interpolation\n  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n  vec4 iy = vec4(Pi0.yy, Pi1.yy);\n  vec4 iz0 = Pi0.zzzz;\n  vec4 iz1 = Pi1.zzzz;\n\n  vec4 ixy = permute(permute(ix) + iy);\n  vec4 ixy0 = permute(ixy + iz0);\n  vec4 ixy1 = permute(ixy + iz1);\n\n  vec4 gx0 = ixy0 / 7.0;\n  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;\n  gx0 = fract(gx0);\n  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n  vec4 sz0 = step(gz0, vec4(0.0));\n  gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n  gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n  vec4 gx1 = ixy1 / 7.0;\n  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;\n  gx1 = fract(gx1);\n  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n  vec4 sz1 = step(gz1, vec4(0.0));\n  gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n  gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n  g000 *= norm0.x;\n  g010 *= norm0.y;\n  g100 *= norm0.z;\n  g110 *= norm0.w;\n  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n  g001 *= norm1.x;\n  g011 *= norm1.y;\n  g101 *= norm1.z;\n  g111 *= norm1.w;\n\n  float n000 = dot(g000, Pf0);\n  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n  float n111 = dot(g111, Pf1);\n\n  vec3 fade_xyz = fade(Pf0);\n  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); \n  return 2.2 * n_xyz;\n}\n\nfloat noise(vec4 v){\n  const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4\n                        0.309016994374947451); // (sqrt(5) - 1)/4   F4\n// First corner\n  vec4 i  = floor(v + dot(v, C.yyyy) );\n  vec4 x0 = v -   i + dot(i, C.xxxx);\n\n// Other corners\n\n// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)\n  vec4 i0;\n\n  vec3 isX = step( x0.yzw, x0.xxx );\n  vec3 isYZ = step( x0.zww, x0.yyz );\n//  i0.x = dot( isX, vec3( 1.0 ) );\n  i0.x = isX.x + isX.y + isX.z;\n  i0.yzw = 1.0 - isX;\n\n//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );\n  i0.y += isYZ.x + isYZ.y;\n  i0.zw += 1.0 - isYZ.xy;\n\n  i0.z += isYZ.z;\n  i0.w += 1.0 - isYZ.z;\n\n  // i0 now contains the unique values 0,1,2,3 in each channel\n  vec4 i3 = clamp( i0, 0.0, 1.0 );\n  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );\n  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );\n\n  //  x0 = x0 - 0.0 + 0.0 * C \n  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;\n  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;\n  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;\n  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;\n\n// Permutations\n  i = mod(i, 289.0); \n  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);\n  vec4 j1 = permute( permute( permute( permute (\n             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))\n           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))\n           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))\n           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));\n// Gradients\n// ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)\n// 7*7*6 = 294, which is close to the ring size 17*17 = 289.\n\n  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;\n\n  vec4 p0 = grad4(j0,   ip);\n  vec4 p1 = grad4(j1.x, ip);\n  vec4 p2 = grad4(j1.y, ip);\n  vec4 p3 = grad4(j1.z, ip);\n  vec4 p4 = grad4(j1.w, ip);\n\n// Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n  p4 *= taylorInvSqrt(dot(p4,p4));\n\n// Mix contributions from the five corners\n  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);\n  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);\n  m0 = m0 * m0;\n  m1 = m1 * m1;\n  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))\n               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;\n\n}\n","\n  \n  void main() {\n    float t = uTime / 10.0;\n    \n    float posAmp = noise(test + t);\n    \n    vec3 pos = position * 2.0 - 1.0;\n\n    pos *= posAmp + 1.0;\n    \n    gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(\n      pos,\n      1.0);\n\n    vColor = color;\n    vTest = test;\n  }\n"),g=new r.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:x,fragmentShader:"\n  varying vec3 vColor;\n  varying vec3 vTest;\n\n  void main() {\n    gl_FragColor = vec4(vTest, 1.0);\n  }\n"}),s=new Float32Array(18e3),d=new Float32Array(18e3),p=0;p<3e3;p++){var y=6*p,m=Math.random(),f=Math.random(),l=Math.random(),u=Math.random(),z=Math.random(),w=Math.random();s[y]=m,s[y+1]=f,s[y+2]=l,s[y+3]=u,s[y+4]=z,s[y+5]=w;var h=Math.random(),P=Math.random(),b=Math.random();d[y]=h,d[y+1]=P,d[y+2]=b,d[y+3]=h,d[y+4]=P,d[y+5]=b}var C=new r.BufferGeometry;C.setAttribute("position",new r.BufferAttribute(s,3)),C.setAttribute("color",new r.BufferAttribute(s,3)),C.setAttribute("test",new r.BufferAttribute(d,3)),console.log(C.attributes);var j=new r.LineSegments(C,g);a.add(j);var M=0;!function n(){c.render(a,v),M+=.05,j.material.uniforms.uTime.value=M,requestAnimationFrame(n)}(),window.addEventListener("resize",(function(){var n=innerWidth,e=innerHeight;c.setSize(n,e),v.aspect=n/e,v.updateProjectionMatrix()})),document.addEventListener("keydown",(function(n){"p"===n.key&&function(){try{var n="image/jpeg",e=c.domElement.toDataURL(n),t=document.getElementsByTagName("script"),r=t[t.length-1],o=new URL(r.src).pathname.slice(1,-3);A(e.replace(n,_),o+".jpg")}catch(n){return void console.log(n)}}()}));var _="image/octet-stream",A=function(n,e){var t=document.createElement("a");"string"==typeof t.download?(document.body.appendChild(t),t.download=e,t.href=n,t.click(),document.body.removeChild(t)):location.replace(uri)}}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var i=t[n]={exports:{}};return e[n](i,i.exports,r),i.exports}r.m=e,n=[],r.O=function(e,t,o,i){if(!t){var c=1/0;for(x=0;x<n.length;x++){t=n[x][0],o=n[x][1],i=n[x][2];for(var a=!0,v=0;v<t.length;v++)(!1&i||c>=i)&&Object.keys(r.O).every((function(n){return r.O[n](t[v])}))?t.splice(v--,1):(a=!1,i<c&&(c=i));a&&(n.splice(x--,1),e=o())}return e}i=i||0;for(var x=n.length;x>0&&n[x-1][2]>i;x--)n[x]=n[x-1];n[x]=[t,o,i]},r.d=function(n,e){for(var t in e)r.o(e,t)&&!r.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:e[t]})},r.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},function(){var n={5865:0};r.O.j=function(e){return 0===n[e]};var e=function(e,t){var o,i,c=t[0],a=t[1],v=t[2],x=0;for(o in a)r.o(a,o)&&(r.m[o]=a[o]);if(v)var g=v(r);for(e&&e(t);x<c.length;x++)i=c[x],r.o(n,i)&&n[i]&&n[i][0](),n[c[x]]=0;return r.O(g)},t=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];t.forEach(e.bind(null,0)),t.push=e.bind(null,t.push.bind(t))}();var o=r.O(void 0,[2886,6533],(function(){return r(8396)}));o=r.O(o)}();