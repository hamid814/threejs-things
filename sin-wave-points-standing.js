!function(){"use strict";var e,n={8239:function(e,n,t){var r=t(2212),o=t(2886),i=document.getElementById("webgl"),a=new r.WebGLRenderer({antialias:!0,canvas:i,preserveDrawingBuffer:!0});a.setSize(innerWidth,innerHeight),document.body.appendChild(a.domElement);var c=new r.Scene,s=new r.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);s.position.set(0,60,130),s.lookAt(0,0,0);var d=new r.IcosahedronGeometry(30,20),u=new r.IcosahedronGeometry(30,20),l=new r.PointsMaterial,f=new r.Points(d,l),p=new r.Points(u,l);c.add(f),new o.OrbitControls(s,a.domElement);var m=new r.GridHelper(200,5);c.add(m);var h=0;!function e(){h+=2e-4;var n=(Math.sin(2*h*30)+1)/2,t=(Math.cos(2*h*30)+1)/2,o=(Math.cos(2*h*10)+1)/2;f.material.color=new r.Color(n,t,o),function(e,n){for(var t=p.geometry.attributes.position,o=new r.Vector3,i=0;i<t.count;i++){o.fromBufferAttribute(t,i);var a=10*Math.sin(o.x/10),c=Math.sin((2*o.y+a)/2+1)/2*Math.sin(300*n)*2;c=(c+1)/5+.8,o.multiplyScalar(1*c),e.geometry.attributes.position.setXYZ(i,o.x,o.y,o.z)}e.geometry.attributes.position.needsUpdate=!0}(f,h),a.render(c,s),requestAnimationFrame(e)}(),window.addEventListener("resize",(function(){var e=innerWidth,n=innerHeight;a.setSize(e,n),s.aspect=e/n,s.updateProjectionMatrix()})),document.addEventListener("keydown",(function(e){"p"===e.key&&function(){try{var e="image/jpeg",n=a.domElement.toDataURL(e),t=document.getElementsByTagName("script"),r=t[t.length-1],o=new URL(r.src).pathname.slice(1,-3);g(n.replace(e,v),o+".jpg")}catch(e){return void console.log(e)}}()}));var v="image/octet-stream",g=function(e,n){var t=document.createElement("a");"string"==typeof t.download?(document.body.appendChild(t),t.download=n,t.href=e,t.click(),document.body.removeChild(t)):location.replace(uri)}}},t={};function r(e){var o=t[e];if(void 0!==o)return o.exports;var i=t[e]={exports:{}};return n[e](i,i.exports,r),i.exports}r.m=n,e=[],r.O=function(n,t,o,i){if(!t){var a=1/0;for(d=0;d<e.length;d++){t=e[d][0],o=e[d][1],i=e[d][2];for(var c=!0,s=0;s<t.length;s++)(!1&i||a>=i)&&Object.keys(r.O).every((function(e){return r.O[e](t[s])}))?t.splice(s--,1):(c=!1,i<a&&(a=i));c&&(e.splice(d--,1),n=o())}return n}i=i||0;for(var d=e.length;d>0&&e[d-1][2]>i;d--)e[d]=e[d-1];e[d]=[t,o,i]},r.d=function(e,n){for(var t in n)r.o(n,t)&&!r.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={7760:0};r.O.j=function(n){return 0===e[n]};var n=function(n,t){var o,i,a=t[0],c=t[1],s=t[2],d=0;for(o in c)r.o(c,o)&&(r.m[o]=c[o]);if(s)var u=s(r);for(n&&n(t);d<a.length;d++)i=a[d],r.o(e,i)&&e[i]&&e[i][0](),e[a[d]]=0;return r.O(u)},t=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}();var o=r.O(void 0,[2886,1058],(function(){return r(8239)}));o=r.O(o)}();