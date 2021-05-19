!function(){"use strict";var e,n={5769:function(e,n,i){var t=i(2212);function r(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function o(e,n){for(var i=0;i<n.length;i++){var t=n[i];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}function s(e,n,i){return n&&o(e.prototype,n),i&&o(e,i),e}var h,a="x",d="y",c="z",u={corner:[0,2,4,6,8,9,10,11,12,14,16,18],cornerDirections:[{i:0,d:a},{i:2,d:c},{i:4,d:a},{i:6,d:c},{i:8,d:d},{i:9,d:d},{i:10,d:d},{i:11,d:d},{i:12,d:a},{i:14,d:c},{i:16,d:a},{i:18,d:c}],edgesDirections:{x:[{i:0,d:c},{i:2,d:a},{i:3,d:a},{i:5,d:a},{i:6,d:a},{i:7,d:d},{i:8,d:d},{i:9,d:c},{i:11,d:a},{i:12,d:a},{i:14,d:a},{i:15,d:a}],y:[{i:0,d:d},{i:1,d:d},{i:2,d:d},{i:3,d:d},{i:4,d:a},{i:6,d:c},{i:8,d:a},{i:10,d:c},{i:12,d:d},{i:13,d:d},{i:14,d:d},{i:15,d:d}],z:[{i:0,d:a},{i:1,d:c},{i:3,d:c},{i:4,d:c},{i:6,d:c},{i:7,d:d},{i:8,d:d},{i:9,d:a},{i:10,d:c},{i:12,d:c},{i:13,d:c},{i:15,d:c}]}},l=function(e,n,i){if("corner"===e)return u.cornerDirections.filter((function(e){return e.i===n}))[0].d;if("edge"===e){var t=u.edgesDirections[i].filter((function(e){return e.i===n}))[0];return t?t.d:t}},w=function(){function e(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:new f(0,0,0),o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:void 0,s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:void 0,h=arguments.length>5&&void 0!==arguments[5]?arguments[5]:void 0;r(this,e),this.cubeMagnetude=i,this.level=n,this.cubeSize=1,this.position=t||new f(0,0,0),this.width=Math.pow(3,n),this.children=[],this.childSize=this.width/3,this.childrenType=null,this.mother=o,this.isEdge=void 0!==s&&s,this.direction=h,this.center=new f(this.width/2+.5,this.width/2+.5,this.width/2+.5),this.centerToPosition=this.position.retsub(this.center),this.centerNegate=new f(-this.center.x,-this.center.y,-this.center.z),this.facesCount=0,this.childrenType=1===n?"cube":"menger",this.initChildren()}return s(e,[{key:"isNeighbour",value:function(e){var n=Math.pow(3,this.level);function i(e,n){return(Math.ceil(e/(n/3))-1)%2==1}function t(e,n,t){return i(e,t)&&i(n,t)}return e.x>n||e.x<1||e.y>n||e.y<1||e.z>n||e.z<1?2:function n(i){return t(e.x,e.y,i)||t(e.y,e.z,i)||t(e.z,e.x,i)?1:3!==i?n(i/3):0}(n)}},{key:"initChildren",value:function(){var n=this;if(this.mother){var i=[],t=this.position.x+this.childSize,r=this.position.x-this.childSize,o=this.position.y+this.childSize,s=this.position.y-this.childSize,h=this.position.z+this.childSize,w=this.position.z-this.childSize,p=this.position.x,m=this.position.y,g=this.position.z;this.isEdge?this.direction===a?i=[new f(p,o,g),new f(p,o,w),new f(t,o,w),new f(t,o,h),new f(p,o,h),new f(r,o,h),new f(r,o,w),new f(p,m,w),new f(p,m,h),new f(p,s,g),new f(p,s,w),new f(t,s,w),new f(t,s,h),new f(p,s,h),new f(r,s,h),new f(r,s,w)]:this.direction===d?i=[new f(t,o,w),new f(t,o,h),new f(r,o,h),new f(r,o,w),new f(p,m,w),new f(t,m,w),new f(t,m,g),new f(t,m,h),new f(p,m,h),new f(r,m,h),new f(r,m,g),new f(r,m,w),new f(t,s,w),new f(t,s,h),new f(r,s,h),new f(r,s,w)]:this.direction===c&&(i=[new f(p,o,g),new f(t,o,w),new f(t,o,g),new f(t,o,h),new f(r,o,h),new f(r,o,g),new f(r,o,w),new f(t,m,g),new f(r,m,g),new f(p,s,g),new f(t,s,w),new f(t,s,g),new f(t,s,h),new f(r,s,h),new f(r,s,g),new f(r,s,w)]):(i[0]=new f(p,o,w),i[1]=new f(t,o,w),i[2]=new f(t,o,g),i[3]=new f(t,o,h),i[4]=new f(p,o,h),i[5]=new f(r,o,h),i[6]=new f(r,o,g),i[7]=new f(r,o,w),i[8]=new f(t,m,h),i[9]=new f(t,m,w),i[10]=new f(r,m,w),i[11]=new f(r,m,h),i[12]=new f(p,s,w),i[13]=new f(t,s,w),i[14]=new f(t,s,g),i[15]=new f(t,s,h),i[16]=new f(p,s,h),i[17]=new f(r,s,h),i[18]=new f(r,s,g),i[19]=new f(r,s,w)),this.isEdge?"cube"===this.childrenType?i.forEach((function(e){for(var i=[],t=0;t<y.length;t++){var r=y[t],o=r.position,s=new f(e.x,e.y,e.z);s.x+=o.x,s.y+=o.y,s.z+=o.z,n.mother.isNeighbour(s)&&i.push(r.id)}n.mother.addToFacesCount(i.length);var h=new v(e,n.childSize,i);n.children.push(h)})):"menger"===this.childrenType&&i.forEach((function(i,t){var r=!1,o=l("edge",t,n.direction);o&&(r=!0);var s=new e(n.level-1,n.cubeSize,i,n.mother,r,o);n.children.push(s)})):"cube"===this.childrenType?i.forEach((function(e){for(var i=[],t=0;t<y.length;t++){var r=y[t],o=r.position,s=new f(e.x,e.y,e.z);s.x+=o.x,s.y+=o.y,s.z+=o.z,n.mother.isNeighbour(s)&&i.push(r.id)}n.mother.addToFacesCount(i.length);var h=new v(e,n.childSize,i);n.children.push(h)})):"menger"===this.childrenType&&i.forEach((function(i,t){var r=!1,o=void 0;-1!==u.corner.indexOf(t)&&(o=l("corner",t),r=!0);var s=new e(n.level-1,n.cubeSize,i,n.mother,r,o);n.children.push(s)}))}else{var x=[],z=this.center.x+this.childSize,b=this.center.x-this.childSize,C=this.center.y+this.childSize,k=this.center.y-this.childSize,S=this.center.z+this.childSize,E=this.center.z-this.childSize,P=this.center.x,T=this.center.y,M=this.center.z;x[0]=new f(P,C,E),x[1]=new f(z,C,E),x[2]=new f(z,C,M),x[3]=new f(z,C,S),x[4]=new f(P,C,S),x[5]=new f(b,C,S),x[6]=new f(b,C,M),x[7]=new f(b,C,E),x[8]=new f(z,T,S),x[9]=new f(z,T,E),x[10]=new f(b,T,E),x[11]=new f(b,T,S),x[12]=new f(P,k,E),x[13]=new f(z,k,E),x[14]=new f(z,k,M),x[15]=new f(z,k,S),x[16]=new f(P,k,S),x[17]=new f(b,k,S),x[18]=new f(b,k,M),x[19]=new f(b,k,E),"cube"===this.childrenType?x.forEach((function(e,i){for(var t=[],r=0;r<y.length;r++){var o=y[r],s=o.position,h=new f(e.x,e.y,e.z);h.x+=s.x,h.y+=s.y,h.z+=s.z,n.isNeighbour(h)&&t.push(o.id)}n.addToFacesCount(t.length);var a=new v(e,n.childSize,t);n.children.push(a)})):"menger"===this.childrenType&&x.forEach((function(i,t){var r=!1,o=void 0;-1!==u.corner.indexOf(t)&&(o=l("corner",t),r=!0);var s=new e(n.level-1,n.cubeSize,i,n,r,o);n.children.push(s)}))}}},{key:"addToFacesCount",value:function(e){this.facesCount+=e}},{key:"getPositions",value:function(){var e=this,n=[];return"cube"===this.childrenType?(this.children.forEach((function(i){e.mother?e.mother.centerToPosition:e.centerToPosition;var t=i.position,r=e.mother?e.mother.cubeMagnetude:e.cubeMagnetude,o=e.mother?e.mother.position:e.position,s=e.mother?e.mother.centerNegate:e.centerNegate;t.x+=s.x,t.y+=s.y,t.z+=s.z,t.x*=r,t.y*=r,t.z*=r,t.x+=o.x,t.y+=o.y,t.z+=o.z,n.push({position:t,faces:i.faces})})),n):"menger"===this.childrenType?(this.children.forEach((function(e){e.getPositions().forEach((function(e){n.push(e)}))})),n):void 0}},{key:"drawP5",value:function(){this.children.forEach((function(e){e.drawP5()}))}}],[{key:"isCube",value:function(e,n){function i(e,n){return(Math.ceil(e/(n/3))-1)%2==1}function t(e,n,t){return i(e,t)&&i(n,t)}return e.x>n||e.x<1||e.y>n||e.y<1||e.z>n||e.z<1?2:function n(i){return t(e.x,e.y,i)||t(e.y,e.z,i)||t(e.z,e.x,i)?0:3!==i?n(i/3):1}(n)}}]),e}(),v=function(){function e(n,i,t){r(this,e),this.position=n,this.index=n,this.size=i,this.faces=t}return s(e,[{key:"drawP5",value:function(){push(),translate(this.position.x,this.position.y,this.position.z),box(this.size,this.size,this.size),pop()}}]),e}(),f=function(){function e(n,i,t){r(this,e),this.x=n,this.y=i,this.z=t}return s(e,[{key:"add",value:function(e){this.x+=e.x,this.y+=e.y,this.z+=e.z}},{key:"sub",value:function(e){this.x-=e.x,this.y-=e.y,this.z-=e.z}},{key:"mul",value:function(e){this.x*=e.x,this.y*=e.y,this.z*=e.z}},{key:"dev",value:function(e){this.x/=e.x,this.y/=e.y,this.z/=e.z}},{key:"retsub",value:function(n,i,t){var r=new e(this.x,this.y,this.z);if(void 0===i&&void 0===t)r.sub(n);else{var o=new e(n,i,t);r.sub(o)}return r}},{key:"retadd",value:function(n,i,t){var r=new e(this.x,this.y,this.z);if(void 0===i&&void 0===t)r.add(n);else{var o=new e(n,i,t);r.add(o)}return r}},{key:"retmul",value:function(n){var i=new e(this.x,this.y,this.z);return i.mul(n),i}},{key:"retdev",value:function(n){var i=new e(this.x,this.y,this.z);return i.dev(n),i}}]),e}(),y=[{position:new f(1,0,0),id:11},{position:new f(-1,0,0),id:10},{position:new f(0,1,0),id:21},{position:new f(0,-1,0),id:20},{position:new f(0,0,1),id:31},{position:new f(0,0,-1),id:30}],p=i(2886),m=i(5260),g=i(6426),x=i(5980),z=[0,2,1,2,3,1,4,6,5,6,7,5,8,10,9,10,11,9,12,14,13,14,15,13,16,18,17,18,19,17,20,22,21,22,23,21],b={11:[0,1,2,3,4,5],10:[6,7,8,9,10,11],21:[12,13,14,15,16,17],20:[18,19,20,21,22,23],31:[24,25,26,27,28,29],30:[30,31,32,33,34,35]},C=document.getElementById("webgl"),k=new t.WebGLRenderer({antialias:!0,canvas:C,preserveDrawingBuffer:!0});k.setSize(innerWidth,innerHeight),k.setPixelRatio(Math.min(2,devicePixelRatio)),document.body.appendChild(k.domElement);var S=new t.Scene,E=new t.OrthographicCamera(-10,10,8,-8,1,1e3);E.lookAt(0,0,0),E.position.set(0,30,30),S.add(E),new p.OrbitControls(E,k.domElement);var P=new t.PointLight(6710920,3);P.position.set(150,150,150),S.add(P);var T=new t.PointLight(8939110,3);T.position.set(-150,150,-150),S.add(T);var M=new t.PointLight(6719590,3);M.position.set(0,-150,0),S.add(M);var O=new t.BoxGeometry,U=new t.MeshNormalMaterial,j=new w(2,3,new f(0,0,0)),D=new m.xC(k),_=new g.C(S,E);D.addPass(_);var L=new x.T({uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:"\n\t\tvarying vec2 vUv;\n\n\t\tvoid main() {\n\t\t\tvUv = uv;\n\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t}",fragmentShader:"\n\t\tuniform sampler2D tDiffuse;\n\t\tvarying vec2 vUv;\n\n    float map(float value, float min1, float max1, float min2, float max2) {\n      return min2 + (value - min1) * (max2 - min2) / (max1 - min1);\n    }\n    \n\t\tvoid main() {\n      vec2 doubleUv = vUv * 2.0;\n\n      if(vUv.x > 0.5) doubleUv.x = map(doubleUv.x - 1.0, 0.0, 1.0, 1.0, 0.0);\n      \n      if (vUv.y > 0.5) doubleUv.y = map(doubleUv.y - 1.0, 0.0, 1.0, 1.0, 0.0);\n\n\t\t\tvec4 vertex_Color = texture2D(tDiffuse, doubleUv);\n\n      // vertex_Color.r = map(vertex_Color.r, 0.0, 1.0, 0.3, 0.8);\n      \n      gl_FragColor = vec4(vertex_Color.r, vertex_Color.g, vertex_Color.b, 1.0);\n\t\t}"});D.addPass(L),function(e){var n=e.cubeMagnetude,i=e.getPositions();console.log("faces: ",e.facesCount),console.log("cubes count:",i.length);for(var r=new t.BufferGeometry,o=new Float32Array(2*e.facesCount*3*3),s=new Float32Array(2*e.facesCount*3*3),a=new t.BufferAttribute(o,3),d=new t.BufferAttribute(s,3),c=0,u=new t.Mesh(O,U),l=u.geometry.attributes.position,w=u.geometry.attributes.normal,v=0;v<i.length;v++)for(var f=i[v].position,y=i[v].faces,p=0;p<y.length;p++)for(var m=y[p],g=b[m],x=0;x<g.length;x++){var C=g[x];C=z[C];var k=l.array[3*C]*n+f.x,E=l.array[3*C+1]*n+f.y,P=l.array[3*C+2]*n+f.z,T=w.array[3*C],M=w.array[3*C+1],j=w.array[3*C+2];a.setXYZ(c,k,E,P),d.setXYZ(c,T,M,j),c++}r.setAttribute("position",a),r.setAttribute("normal",d),h=new t.Mesh(r,U),S.add(h)}(j),function e(){D.render(),h.rotation.y+=.005,requestAnimationFrame(e)}(),window.addEventListener("resize",(function(){return window.location.reload()})),window.addEventListener("resize",(function(){var e=innerWidth,n=innerHeight;k.setSize(e,n),E.aspect=e/n,E.updateProjectionMatrix()})),document.addEventListener("keydown",(function(e){"p"===e.key&&function(){try{var e="image/jpeg",n=k.domElement.toDataURL(e),i=document.getElementsByTagName("script"),t=i[i.length-1],r=new URL(t.src).pathname.slice(1,-3);A(n.replace(e,N),r+".jpg")}catch(e){return void console.log(e)}}()}));var N="image/octet-stream",A=function(e,n){var i=document.createElement("a");"string"==typeof i.download?(document.body.appendChild(i),i.download=n,i.href=e,i.click(),document.body.removeChild(i)):location.replace(uri)}}},i={};function t(e){var r=i[e];if(void 0!==r)return r.exports;var o=i[e]={exports:{}};return n[e](o,o.exports,t),o.exports}t.m=n,e=[],t.O=function(n,i,r,o){if(!i){var s=1/0;for(d=0;d<e.length;d++){i=e[d][0],r=e[d][1],o=e[d][2];for(var h=!0,a=0;a<i.length;a++)(!1&o||s>=o)&&Object.keys(t.O).every((function(e){return t.O[e](i[a])}))?i.splice(a--,1):(h=!1,o<s&&(s=o));h&&(e.splice(d--,1),n=r())}return n}o=o||0;for(var d=e.length;d>0&&e[d-1][2]>o;d--)e[d]=e[d-1];e[d]=[i,r,o]},t.d=function(e,n){for(var i in n)t.o(n,i)&&!t.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:n[i]})},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={5008:0};t.O.j=function(n){return 0===e[n]};var n=function(n,i){var r,o,s=i[0],h=i[1],a=i[2],d=0;for(r in h)t.o(h,r)&&(t.m[r]=h[r]);if(a)var c=a(t);for(n&&n(i);d<s.length;d++)o=s[d],t.o(e,o)&&e[o]&&e[o][0](),e[s[d]]=0;return t.O(c)},i=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];i.forEach(n.bind(null,0)),i.push=n.bind(null,i.push.bind(i))}();var r=t.O(void 0,[2886,2452],(function(){return t(5769)}));r=t.O(r)}();