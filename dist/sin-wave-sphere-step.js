!function(){"use strict";var e,t={9619:function(e,t,n){var r=n(2212),o=n(2886),i=document.getElementById("webgl"),a=new r.WebGLRenderer({antialias:!0,canvas:i,preserveDrawingBuffer:!0});a.setSize(innerWidth,innerHeight),a.setPixelRatio(Math.min(2,devicePixelRatio)),document.body.appendChild(a.domElement),a.setClearColor(14540253);var d=new r.Vector2(1,1),s=new r.Scene,c=new r.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);c.position.set(0,60,130),c.up.set(0,100,0);var u=new r.Object3D,l=new r.IcosahedronGeometry(30,10),m=new r.IcosahedronGeometry(30,10),p=new r.MeshNormalMaterial({flatShading:!0}),h=new r.Mesh(l,p),f=new r.Mesh(m,p),v=new r.PointLight(16777215,2.2);v.position.set(0,30,40),u.add(v);var w=new r.PointLight(16777215,1.7);w.position.set(60,30,0),u.add(w);var g=new r.PointLight(16777215,1.7);g.position.set(-60,30,0),u.add(g),u.add(h),s.add(u),new o.OrbitControls(c,a.domElement).update();var y=new r.GridHelper(200,5);s.add(y);var b=0;!function e(){b+=12e-5,h.material.wireframe=!1,function(e,t){for(var n=f.geometry.attributes.position,o=new r.Vector3,i=0;i<n.count;i++){o.fromBufferAttribute(n,i);var a="IcosahedronGeometry"===h.geometry.type?2:3,d=10*Math.sin(o.x/10),s=Math.floor(Math.sin((o.y/2+d+1e3*t)/2+1)/2);0!==s&&(s=-.6),s=(s+1)/2,o.multiplyScalar(s*a),e.geometry.attributes.position.setXYZ(i,o.x,o.y,o.z)}e.geometry.attributes.position.needsUpdate=!0}(h,b),a.render(s,c),requestAnimationFrame(e)}(),a.domElement.addEventListener("mousemove",(function(e){d.x=e.clientX/window.innerWidth*2-1,d.y=-e.clientY/window.innerHeight*2+1,v.position.x=25*d.x,v.position.y=8*(d.y+5)})),window.addEventListener("resize",(function(){var e=innerWidth,t=innerHeight;a.setSize(e,t),c.aspect=e/t,c.updateProjectionMatrix()})),document.addEventListener("keydown",(function(e){"p"===e.key&&function(){try{var e="image/jpeg",t=a.domElement.toDataURL(e),n=document.getElementsByTagName("script"),r=n[n.length-1],o=new URL(r.src).pathname.slice(1,-3);x(t.replace(e,O),o+".jpg")}catch(e){return void console.log(e)}}()}));var O="image/octet-stream",x=function(e,t){var n=document.createElement("a");"string"==typeof n.download?(document.body.appendChild(n),n.download=t,n.href=e,n.click(),document.body.removeChild(n)):location.replace(uri)}}},n={};function r(e){var o=n[e];if(void 0!==o)return o.exports;var i=n[e]={exports:{}};return t[e](i,i.exports,r),i.exports}r.m=t,e=[],r.O=function(t,n,o,i){if(!n){var a=1/0;for(c=0;c<e.length;c++){n=e[c][0],o=e[c][1],i=e[c][2];for(var d=!0,s=0;s<n.length;s++)(!1&i||a>=i)&&Object.keys(r.O).every((function(e){return r.O[e](n[s])}))?n.splice(s--,1):(d=!1,i<a&&(a=i));d&&(e.splice(c--,1),t=o())}return t}i=i||0;for(var c=e.length;c>0&&e[c-1][2]>i;c--)e[c]=e[c-1];e[c]=[n,o,i]},r.d=function(e,t){for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){var e={5649:0};r.O.j=function(t){return 0===e[t]};var t=function(t,n){var o,i,a=n[0],d=n[1],s=n[2],c=0;for(o in d)r.o(d,o)&&(r.m[o]=d[o]);if(s)var u=s(r);for(t&&t(n);c<a.length;c++)i=a[c],r.o(e,i)&&e[i]&&e[i][0](),e[a[c]]=0;return r.O(u)},n=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var o=r.O(void 0,[2886,5035],(function(){return r(9619)}));o=r.O(o)}();