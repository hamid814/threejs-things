!function(){"use strict";var e,n={5986:function(e,n,t){var r=t(2212),o=t(2886),i=document.getElementById("webgl"),a=new r.WebGLRenderer({antialias:!0,canvas:i,preserveDrawingBuffer:!0});a.setSize(innerWidth,innerHeight),document.body.appendChild(a.domElement);var c=new r.Scene,d=new r.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);d.position.set(0,0,130);var u=new o.OrbitControls(d,a.domElement);u.update();var s=new r.IcosahedronGeometry(30,1),l=new r.MeshBasicMaterial({color:6737049,wireframe:!0}),f=new r.Mesh(s,l);c.add(f);var p=0,h=f.geometry.attributes.position.count;!function e(){p+=.0011,u.update(),a.render(c,d),f.geometry.drawRange.count=Math.floor((Math.sin(p)+1)/2*h),requestAnimationFrame(e)}(),window.addEventListener("resize",(function(){var e=innerWidth,n=innerHeight;a.setSize(e,n),d.aspect=e/n,d.updateProjectionMatrix()})),document.addEventListener("keydown",(function(e){"p"===e.key&&function(){try{var e="image/jpeg",n=a.domElement.toDataURL(e),t=document.getElementsByTagName("script"),r=t[t.length-1],o=new URL(r.src).pathname.slice(1,-3);v(n.replace(e,m),o+".jpg")}catch(e){return void console.log(e)}}()}));var m="image/octet-stream",v=function(e,n){var t=document.createElement("a");"string"==typeof t.download?(document.body.appendChild(t),t.download=n,t.href=e,t.click(),document.body.removeChild(t)):location.replace(uri)}}},t={};function r(e){var o=t[e];if(void 0!==o)return o.exports;var i=t[e]={exports:{}};return n[e](i,i.exports,r),i.exports}r.m=n,e=[],r.O=function(n,t,o,i){if(!t){var a=1/0;for(u=0;u<e.length;u++){t=e[u][0],o=e[u][1],i=e[u][2];for(var c=!0,d=0;d<t.length;d++)(!1&i||a>=i)&&Object.keys(r.O).every((function(e){return r.O[e](t[d])}))?t.splice(d--,1):(c=!1,i<a&&(a=i));c&&(e.splice(u--,1),n=o())}return n}i=i||0;for(var u=e.length;u>0&&e[u-1][2]>i;u--)e[u]=e[u-1];e[u]=[t,o,i]},r.d=function(e,n){for(var t in n)r.o(n,t)&&!r.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={3754:0};r.O.j=function(n){return 0===e[n]};var n=function(n,t){var o,i,a=t[0],c=t[1],d=t[2],u=0;for(o in c)r.o(c,o)&&(r.m[o]=c[o]);if(d)var s=d(r);for(n&&n(t);u<a.length;u++)i=a[u],r.o(e,i)&&e[i]&&e[i][0](),e[a[u]]=0;return r.O(s)},t=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}();var o=r.O(void 0,[2886,4967],(function(){return r(5986)}));o=r.O(o)}();