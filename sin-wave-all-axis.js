!function(){"use strict";var e,n={178:function(e,n,t){var r=t(2212),o=t(2886),i=document.getElementById("webgl"),a=new r.WebGLRenderer({antialias:!0,canvas:i,preserveDrawingBuffer:!0});a.setSize(innerWidth,innerHeight),document.body.appendChild(a.domElement);var s=new r.Vector2(1,1),d=new r.Scene,c=new r.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);c.position.set(0,60,130),c.up.set(0,100,0);var u=new r.Object3D,l=new r.IcosahedronGeometry(30,10),h=new r.IcosahedronGeometry(30,10),p=new r.MeshStandardMaterial({color:new r.Color(1,.9,.2),roughness:.25,metalness:.8,flatShading:!0}),m=new r.Mesh(l,p),f=new r.Mesh(h,p),v=new r.PointLight(16777215,2.2);v.position.set(0,30,40),u.add(v);var w=new r.PointLight(16777215,1.7);w.position.set(60,30,0),u.add(w);var g=new r.PointLight(16777215,1.7);g.position.set(-60,30,0),u.add(g),u.add(m),d.add(u),new o.OrbitControls(c,a.domElement).update();var y=new r.GridHelper(200,5);d.add(y);var b=0;!function e(){b+=2e-4;var n=(Math.sin(2*b*30)+1)/2,t=(Math.cos(2*b*30)+1)/2,o=(Math.cos(2*b*10)+1)/2;m.material.color=new r.Color(n,t,o),m.material.wireframe=!1,function(e,n){for(var t=f.geometry.attributes.position,o=new r.Vector3,i=0;i<t.count;i++){o.fromBufferAttribute(t,i);var a=Math.sin(20*o.y+1)/2*Math.sin(100*n);a=(a+1)/5+.8,o.multiplyScalar(1.8*a),e.geometry.attributes.position.setXYZ(i,o.x,o.y,o.z)}e.geometry.attributes.position.needsUpdate=!0}(m,b),a.render(d,c),requestAnimationFrame(e)}(),a.domElement.addEventListener("mousemove",(function(e){s.x=e.clientX/window.innerWidth*2-1,s.y=-e.clientY/window.innerHeight*2+1,v.position.x=25*s.x,v.position.y=8*(s.y+5)})),window.addEventListener("resize",(function(){var e=innerWidth,n=innerHeight;a.setSize(e,n),c.aspect=e/n,c.updateProjectionMatrix()})),document.addEventListener("keydown",(function(e){"p"===e.key&&function(){try{var e="image/jpeg",n=a.domElement.toDataURL(e),t=document.getElementsByTagName("script"),r=t[t.length-1],o=new URL(r.src).pathname.slice(1,-3);E(n.replace(e,O),o+".jpg")}catch(e){return void console.log(e)}}()}));var O="image/octet-stream",E=function(e,n){var t=document.createElement("a");"string"==typeof t.download?(document.body.appendChild(t),t.download=n,t.href=e,t.click(),document.body.removeChild(t)):location.replace(uri)}}},t={};function r(e){var o=t[e];if(void 0!==o)return o.exports;var i=t[e]={exports:{}};return n[e](i,i.exports,r),i.exports}r.m=n,e=[],r.O=function(n,t,o,i){if(!t){var a=1/0;for(c=0;c<e.length;c++){t=e[c][0],o=e[c][1],i=e[c][2];for(var s=!0,d=0;d<t.length;d++)(!1&i||a>=i)&&Object.keys(r.O).every((function(e){return r.O[e](t[d])}))?t.splice(d--,1):(s=!1,i<a&&(a=i));s&&(e.splice(c--,1),n=o())}return n}i=i||0;for(var c=e.length;c>0&&e[c-1][2]>i;c--)e[c]=e[c-1];e[c]=[t,o,i]},r.d=function(e,n){for(var t in n)r.o(n,t)&&!r.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={2038:0};r.O.j=function(n){return 0===e[n]};var n=function(n,t){var o,i,a=t[0],s=t[1],d=t[2],c=0;for(o in s)r.o(s,o)&&(r.m[o]=s[o]);if(d)var u=d(r);for(n&&n(t);c<a.length;c++)i=a[c],r.o(e,i)&&e[i]&&e[i][0](),e[a[c]]=0;return r.O(u)},t=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}();var o=r.O(void 0,[2886,5836],(function(){return r(178)}));o=r.O(o)}();