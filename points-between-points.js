!function(){"use strict";var e,n={1578:function(e,n,t){var r=t(2212),o=t(2886),i=document.getElementById("webgl"),a=new r.WebGLRenderer({antialias:!0,canvas:i,preserveDrawingBuffer:!0});a.setSize(innerWidth,innerHeight),a.setClearColor(11184810),document.body.appendChild(a.domElement);var c=new r.Scene,l=new r.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);l.position.set(0,0,4),l.lookAt(0,0,0),new o.OrbitControls(l,a.domElement).update();var d=new r.ShaderMaterial({vertexShader:"\n    varying vec2 vUv;\n  \n    void main() {\n      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n      gl_PointSize = 60.0;\n      gl_PointSize *= (1.0 / -(modelViewMatrix * vec4(position, 1.0)).z);\n      \n      vUv = uv;\n    }\n  ",fragmentShader:"\n    varying vec2 vUv;\n  \n    void main() {\n      float dist = 1.0 - step(0.5, distance(gl_PointCoord, vec2(0.5)));\n\n      if (dist == 0.0) discard;\n      \n      gl_FragColor = vec4(dist, 1.0, 0.0, 1.0);\n    }\n  "}),s=new r.BufferGeometry,u=new r.Vector3(1,1,1),m=new r.Vector3(-1,-1,-1),v=new r.BufferAttribute(new Float32Array(15),3),p=u.distanceTo(m),f=(new r.Vector3).subVectors(u,m).normalize().multiplyScalar(Math.random()).multiplyScalar(p).add(m),g=(new r.Vector3).subVectors(u,m).normalize().multiplyScalar(Math.random()).multiplyScalar(p).add(m),h=(new r.Vector3).subVectors(u,m).normalize().multiplyScalar(Math.random()).multiplyScalar(p).add(m);v.setXYZ(0,u.x,u.y,u.z),v.setXYZ(1,m.x,m.y,m.z),v.setXYZ(2,f.x,f.y,f.z),v.setXYZ(3,g.x,g.y,g.z),v.setXYZ(4,h.x,h.y,h.z),s.setAttribute("position",v);var w=new r.Points(s,d);c.add(w);var y=new r.BoxGeometry(2,2,2),b=new r.EdgesGeometry(y),x=new r.LineSegments(b,new r.LineBasicMaterial({color:16777215}));c.add(x),function e(){a.render(c,l),requestAnimationFrame(e)}(),window.addEventListener("resize",(function(){var e=innerWidth,n=innerHeight;a.setSize(e,n),l.aspect=e/n,l.updateProjectionMatrix()})),document.addEventListener("keydown",(function(e){"p"===e.key&&function(){try{var e="image/jpeg",n=a.domElement.toDataURL(e),t=document.getElementsByTagName("script"),r=t[t.length-1],o=new URL(r.src).pathname.slice(1,-3);z(n.replace(e,S),o+".jpg")}catch(e){return void console.log(e)}}()}));var S="image/octet-stream",z=function(e,n){var t=document.createElement("a");"string"==typeof t.download?(document.body.appendChild(t),t.download=n,t.href=e,t.click(),document.body.removeChild(t)):location.replace(uri)}}},t={};function r(e){var o=t[e];if(void 0!==o)return o.exports;var i=t[e]={exports:{}};return n[e](i,i.exports,r),i.exports}r.m=n,e=[],r.O=function(n,t,o,i){if(!t){var a=1/0;for(d=0;d<e.length;d++){t=e[d][0],o=e[d][1],i=e[d][2];for(var c=!0,l=0;l<t.length;l++)(!1&i||a>=i)&&Object.keys(r.O).every((function(e){return r.O[e](t[l])}))?t.splice(l--,1):(c=!1,i<a&&(a=i));c&&(e.splice(d--,1),n=o())}return n}i=i||0;for(var d=e.length;d>0&&e[d-1][2]>i;d--)e[d]=e[d-1];e[d]=[t,o,i]},r.d=function(e,n){for(var t in n)r.o(n,t)&&!r.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={5933:0};r.O.j=function(n){return 0===e[n]};var n=function(n,t){var o,i,a=t[0],c=t[1],l=t[2],d=0;for(o in c)r.o(c,o)&&(r.m[o]=c[o]);if(l)var s=l(r);for(n&&n(t);d<a.length;d++)i=a[d],r.o(e,i)&&e[i]&&e[i][0](),e[a[d]]=0;return r.O(s)},t=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}();var o=r.O(void 0,[2886,6008],(function(){return r(1578)}));o=r.O(o)}();