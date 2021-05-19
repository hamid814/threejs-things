!function(){"use strict";var n,e={4287:function(n,e,t){var i,o=t(2212),r=t(3379),a=t.n(r),s=t(7953),u=(a()(s.Z,{insert:"head",singleton:!1}),s.Z.locals,document.getElementById("webgl")),l=new o.WebGLRenderer({antialias:!0,canvas:u,preserveDrawingBuffer:!0});l.setSize(innerWidth,innerHeight);var c=new o.Scene,d=new o.Raycaster,f=new o.Vector2(0,0);l.domElement.addEventListener("mousemove",(function(n){f.x=n.clientX/window.innerWidth*2-1,f.y=-n.clientY/window.innerHeight*2+1,i.material.uniforms.mouse.value=f}));var m=new o.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);m.position.set(0,0,30);var v=new o.PlaneGeometry(50,50,50,50),p=new o.ShaderMaterial({uniforms:{bumpPos:{value:{x:0,y:0}},mouse:{value:{x:0,y:0}},color:{value:new o.Color(10053324)},frq:{value:1.5}},vertexShader:"\n  uniform vec2 bumpPos;\n  uniform vec2 mouse;\n  uniform float frq;\n\n  float radius = 0.1;\n  \n  float map(float value, float min1, float max1, float min2, float max2) {\n    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);\n  }\n  \n  void main() {\n    float dist = distance(bumpPos, uv);\n\n    // float xa = (uv.x + 1.0) / 2.0;\n    // float ya = (uv.y + 1.0) / 2.0;\n    // float xDist = xa - mouse.x;\n    // float yDist = ya - mouse.y;\n    // float dist = sqrt(xDist * xDist + yDist * yDist);\n    \n    // float dist = distance(mouse, uv);\n\n    float xDirection;\n    float yDirection;\n    float magnetude = 2.0;\n\n    if (bumpPos.x < uv.x) {xDirection = 1.0;} else {xDirection = -1.0;}\n    if (bumpPos.y < uv.y) {yDirection = 1.0;} else {yDirection = -1.0;}\n    float val = dist < radius ? map(dist, 0.0, radius, 1.7, 0.0) : 0.0;\n    // val = sin(val) * cos(val);\n    // val = (sin(val) + 1.0) / 2.0;\n    val = sin(val);\n    \n    vec3 newPos = position;\n    // newPos.x = position.x + val * xDirection * magnetude;\n    // newPos.y = position.y + val * yDirection * magnetude;\n    newPos.z = position.z + val * magnetude;\n    \n    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);\n  }",fragmentShader:"uniform vec3 color;void main () {gl_FragColor = vec4(color, 1.0);}",wireframe:!0,side:2});i=new o.Mesh(v,p),c.add(i),function n(){l.render(c,m),d.setFromCamera(f,m);var e=d.intersectObjects(c.children);if(e[0]){var t=e[0].uv;i.material.uniforms.bumpPos.value={y:t.y,x:t.x}}requestAnimationFrame(n)}(),window.addEventListener("resize",(function(){var n=innerWidth,e=innerHeight;l.setSize(n,e),m.aspect=n/e,m.updateProjectionMatrix()})),document.addEventListener("keydown",(function(n){"p"===n.key&&function(){try{var n="image/jpeg",e=l.domElement.toDataURL(n),t=document.getElementsByTagName("script"),i=t[t.length-1],o=new URL(i.src).pathname.slice(1,-3);y(e.replace(n,h),o+".jpg")}catch(n){return void console.log(n)}}()}));var h="image/octet-stream",y=function(n,e){var t=document.createElement("a");"string"==typeof t.download?(document.body.appendChild(t),t.download=e,t.href=n,t.click(),document.body.removeChild(t)):location.replace(uri)}},7953:function(n,e,t){var i=t(3645),o=t.n(i)()((function(n){return n[1]}));o.push([n.id,"body {\r\n  cursor: crosshair;\r\n}\r\n",""]),e.Z=o}},t={};function i(n){var o=t[n];if(void 0!==o)return o.exports;var r=t[n]={id:n,exports:{}};return e[n](r,r.exports,i),r.exports}i.m=e,n=[],i.O=function(e,t,o,r){if(!t){var a=1/0;for(l=0;l<n.length;l++){t=n[l][0],o=n[l][1],r=n[l][2];for(var s=!0,u=0;u<t.length;u++)(!1&r||a>=r)&&Object.keys(i.O).every((function(n){return i.O[n](t[u])}))?t.splice(u--,1):(s=!1,r<a&&(a=r));s&&(n.splice(l--,1),e=o())}return e}r=r||0;for(var l=n.length;l>0&&n[l-1][2]>r;l--)n[l]=n[l-1];n[l]=[t,o,r]},i.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return i.d(e,{a:e}),e},i.d=function(n,e){for(var t in e)i.o(e,t)&&!i.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:e[t]})},i.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},function(){var n={1558:0};i.O.j=function(e){return 0===n[e]};var e=function(e,t){var o,r,a=t[0],s=t[1],u=t[2],l=0;for(o in s)i.o(s,o)&&(i.m[o]=s[o]);if(u)var c=u(i);for(e&&e(t);l<a.length;l++)r=a[l],i.o(n,r)&&n[r]&&n[r][0](),n[a[l]]=0;return i.O(c)},t=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];t.forEach(e.bind(null,0)),t.push=e.bind(null,t.push.bind(t))}();var o=i.O(void 0,[5414],(function(){return i(4287)}));o=i.O(o)}();