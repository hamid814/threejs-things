!function(){"use strict";var e,n={5342:function(e,n,r){var t=JSON.parse('{"L":["boilerplate","bufferGeo","cube-of-lines","cube-of-lines-ortho","cubes","cubes-2","distorted-cube","double-normal","experiment-rotation","fbm-terrain","fireball","fireball-copy","flatshading-line","half-shape","intersecting-tetrahedra","line-rotate","menger-fractal","menger-mirror","mirror","mirror-shift","noise-sphere","noise-sphere-animate","noise-sphere-bloby","noise-sphere-fog","noise-sphere-points-cloud","noise-sphere-postprocess","perlin-4d","perlin-step","PI","plane-bump","plane-noise-advanced","plane-noise-simple","plane-noise-simple-2","points-between-points","radial-postprocessing","radial-shader-high","radial-shift","RGBNoise-postprocessing","sandbox","sandbox-2","sandbox-cube-of-lines","shift-shader","sin-wave-all-axis","sin-wave-points-cloud","sin-wave-points-standing","sin-wave-sphere","sin-wave-sphere-high","sin-wave-sphere-step","sphere-base","sphere-brown-4d","sphere-brown-mirror","sphere-brwon","sphere-noise-to-camera","sphere-red","sphere-red-2","sphere-red-3","sphere-red-3-advanced-noise","sphere-red-growing-noise","sphere-red-mirror-shift","sphere-wireframe-mirror-shift","test_webgl_mirror"]}'),i=r(3379),o=r.n(i),a=r(1424),s=(o()(a.Z,{insert:"head",singleton:!1}),a.Z.locals,r(2212)),l=document.getElementById("webgl"),c=new s.WebGLRenderer({antialias:!0,canvas:l});c.setPixelRatio(Math.min(2,devicePixelRatio)),c.setClearColor(14540253),c.setSize(innerWidth,innerHeight);var p=new s.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);p.position.set(0,0,10),p.lookAt(0,0,0);for(var d=new s.Scene,h=0;h<100;h++){var u=new s.BoxGeometry(3.5,3.5,3.5),f=new s.MeshBasicMaterial({color:14540253}),m=new s.Mesh(u,f),b=new s.EdgesGeometry(u),v=new s.LineSegments(b,new s.LineBasicMaterial({color:3355443}));v.rotation.x=m.rotation.x=Math.random()*Math.PI,v.rotation.y=m.rotation.y=Math.random()*Math.PI,v.rotation.z=m.rotation.z=Math.random()*Math.PI,d.add(m),d.add(v)}!function e(){c.render(d,p),requestAnimationFrame(e)}(),window.addEventListener("resize",(function(){var e=innerWidth,n=innerHeight;c.setSize(e,n),p.aspect=e/n,p.updateProjectionMatrix()}));var g=document.querySelector("#sketches-container"),w=location.href;t.L.forEach((function(e){!function(e){var n=document.createElement("a");n.href=w+e+".html",n.className="sketch-item";var r=document.createElement("div");r.className="sketch-item-name",e.replaceAll("-"," ").split("").forEach((function(e,n){r.innerHTML+="<span>".concat(e,"</span>")}));var t=document.createElement("img");t.src="/images/"+e+".jpg",t.style.width="100%",n.appendChild(t),n.appendChild(r),g.appendChild(n)}(e)}))},1424:function(e,n,r){var t=r(3645),i=r.n(t)()((function(e){return e[1]}));i.push([e.id,"* {\r\n  padding: 0;\r\n  margin: 0;\r\n  box-sizing: border-box;\r\n}\r\n\r\na {\r\n  text-decoration: none;\r\n  color: black;\r\n}\r\n\r\n#sketches-container {\r\n  margin: 0 auto;\r\n  margin-top: 70vh;\r\n  margin-bottom: 30vh;\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  width: 85%;\r\n}\r\n\r\n.sketch-item {\r\n  position: relative;\r\n  padding: 0;\r\n  display: block;\r\n  flex-basis: 50%;\r\n}\r\n\r\n.sketch-item-name {\r\n  position: absolute;\r\n  left: 0;\r\n  top: 0;\r\n}\r\n\r\n#webgl {\r\n  position: fixed;\r\n  top: 0;\r\n  left: 0;\r\n  z-index: -1;\r\n}\r\n\r\n@media only screen and (max-width: 600px) {\r\n  #sketckes-container {\r\n    width: 100%;\r\n    border: 1px solid red;\r\n  }\r\n}\r\n",""]),n.Z=i}},r={};function t(e){var i=r[e];if(void 0!==i)return i.exports;var o=r[e]={id:e,exports:{}};return n[e](o,o.exports,t),o.exports}t.m=n,e=[],t.O=function(n,r,i,o){if(!r){var a=1/0;for(c=0;c<e.length;c++){r=e[c][0],i=e[c][1],o=e[c][2];for(var s=!0,l=0;l<r.length;l++)(!1&o||a>=o)&&Object.keys(t.O).every((function(e){return t.O[e](r[l])}))?r.splice(l--,1):(s=!1,o<a&&(a=o));s&&(e.splice(c--,1),n=i())}return n}o=o||0;for(var c=e.length;c>0&&e[c-1][2]>o;c--)e[c]=e[c-1];e[c]=[r,i,o]},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,{a:n}),n},t.d=function(e,n){for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={4826:0};t.O.j=function(n){return 0===e[n]};var n=function(n,r){var i,o,a=r[0],s=r[1],l=r[2],c=0;for(i in s)t.o(s,i)&&(t.m[i]=s[i]);if(l)var p=l(t);for(n&&n(r);c<a.length;c++)o=a[c],t.o(e,o)&&e[o]&&e[o][0](),e[a[c]]=0;return t.O(p)},r=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];r.forEach(n.bind(null,0)),r.push=n.bind(null,r.push.bind(r))}();var i=t.O(void 0,[2595],(function(){return t(5342)}));i=t.O(i)}();