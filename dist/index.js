!(function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("three"),require("ramda"),require("react"),require("d3-color"),require("bowser")):"function"==typeof define&&define.amd?define(["three","ramda","react","d3-color","bowser"],e):"object"==typeof exports?exports.voidgl=e(require("three"),require("ramda"),require("react"),require("d3-color"),require("bowser")):t.voidgl=e(t.three,t.ramda,t.react,t["d3-color"],t.bowser)})(this, function(t, e, r, n, o) {
return (function(t){function e(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var r={};return e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/",e(e.s=26)})([function(e, r) {
e.exports = t;
}, function(t, e, r) {
'use strict'; function n(t, e) {
O = t[0], T = t[1], E = t[2], z = t[3], R = t[4], L = t[5], D = t[6], U = t[7], N = t[8], j = t[9], k = t[10], J = e[0], K = e[1], tt = e[2], et = e[3], rt = e[4], nt = e[5], ot = e[6], it = e[7], st = e[8], at = e[9], ut = e[10];
} function o(t, e) {
for (let r = ct; r < t; ++r)X = r * J, e(r - ct, O, X)
;} function i(t, e) {
for (let r = ct; r < t; ++r)X = r * J, W = r * K, e(r - ct, O, X, T, W)
;} function s(t, e) {
for (let r = ct; r < t; ++r)X = r * J, W = r * K, F = r * tt, e(r - ct, O, X, T, W, E, F)
;} function a(t, e) {
for (let r = ct; r < t; ++r)X = r * J, W = r * K, F = r * tt, Y = r * et, e(r - ct, O, X, T, W, E, F, z, Y);
} function u(t, e) {
for (let r = ct; r < t; ++r)X = r * J, W = r * K, F = r * tt, Y = r * et, V = r * rt, e(r - ct, O, X, T, W, E, F, z, Y, R, V)
;} function c(t, e) {
for (let r = ct; r < t; ++r)X = r * J, W = r * K, F = r * tt, Y = r * et, V = r * rt, q = r * nt, e(r - ct, O, X, T, W, E, F, z, Y, R, V, L, q);
} function f(t, e) {
for (let r = ct; r < t; ++r)X = r * J, W = r * K, F = r * tt, Y = r * et, V = r * rt, q = r * nt, H = r * ot, e(r - ct, O, X, T, W, E, F, z, Y, R, V, L, q, D, H);
} function h(t, e) {
for (let r = ct; r < t; ++r)X = r * J, W = r * K, F = r * tt, Y = r * et, V = r * rt, q = r * nt, H = r * ot, Z = r * it, e(r - ct, O, X, T, W, E, F, z, Y, R, V, L, q, D, H, U, Z)
;} function l(t, e) {
for (let r = ct; r < t; ++r)X = r * J, W = r * K, F = r * tt, Y = r * et, V = r * rt, q = r * nt, H = r * ot, Z = r * it, G = r * st, e(r - ct, O, X, T, W, E, F, z, Y, R, V, L, q, D, H, U, Z, N, G);
} function d(t, e) {
for (let r = ct; r < t; ++r)X = r * J, W = r * K, F = r * tt, Y = r * et, V = r * rt, q = r * nt, H = r * ot, Z = r * it, G = r * st, Q = r * at, e(r - ct, O, X, T, W, E, F, z, Y, R, V, L, q, D, H, U, Z, N, G, j, Q);
} function p(t, e) {
for (let r = ct; r < t; ++r)X = r * J, W = r * K, F = r * tt, Y = r * et, V = r * rt, q = r * nt, H = r * ot, Z = r * it, G = r * st, Q = r * at, $ = r * ut, e(r - ct, O, X, T, W, E, F, z, Y, R, V, L, q, D, H, U, Z, N, G, j, Q, k, $);
} function y(t) {
P = t[0] || 0, A = t[1] || 0, B = t[2] || 0, S = t[3] || 0;
} function m(t, e) {
t[e] = P;
} function g(t, e) {
t[e] = P, t[++e] = A
;} function b(t, e) {
t[e] = P, t[++e] = A, t[++e] = B;
} function v(t, e) {
t[e] = P, t[++e] = A, t[++e] = B, t[++e] = S;
} function x(t) {
return  Boolean(Array.isArray(t))
;}Object.defineProperty(e, '__esModule', {value:!0}); let _ = r(0),
 w = r(10),
 C = r(4),
 I = r(4)('WebGLSurface:BufferUtil'); !(function(t){t[t.CW=0]="CW",t[t.CCW=1]="CCW",t[t.DEGENERATE=2]="DEGENERATE"})(e.TriangleOrientation || (e.TriangleOrientation = {})); let M; !(function(t){t[t.ONE=0]="ONE",t[t.TWO=1]="TWO",t[t.THREE=2]="THREE",t[t.FOUR=3]="FOUR"})(M = e.AttributeSize || (e.AttributeSize = {})); !(function(t){t[t.ONE=0]="ONE",t[t.TWO=1]="TWO",t[t.THREE=2]="THREE",t[t.FOUR=3]="FOUR"})(e.UniformAttributeSize || (e.UniformAttributeSize = {})); var P = 0,
 A = 0, 
B = 0,
 S = 0,
 O = [], 
T = [],
 E = [],
 z = [],
 R = [],
 L = [], 
D = [], 
U = [],
 N = [], 
j = [],
 k = [], 
X = 0,
 W = 0,
 F = 0,
 Y = 0, 
V = 0,
 q = 0,
 H = 0,
 Z = 0, 
G = 0, 
Q = 0,
 $ = 0,
 J = 0, 
K = 0,
 tt = 0,
 et = 0,
 rt = 0,
 nt = 0,
 ot = 0,
 it = 0,
 st = 0, 
at = 0, 
ut = 0,
 ct = 0, 
ft = !1,
 ht = (pt = {}, pt[M.ONE] = m, pt[M.TWO] = g, pt[M.THREE] = b, pt[M.FOUR] = v, pt),
 lt = {1:o, 2:i, 3:s, 4:a, 5:u, 6:c, 7:f, 8:h, 9:l, 10:d, 11:p},
 dt = (function(){function t(){}return t.beginUpdates=function(){ft=!0,ct=0},t.dispose=function(t){t&&t.forEach(function(t){t.attributes=null,t.currentData=null,t.geometry.dispose(),t.geometry=null,t.system=null})},t.endUpdates=function(){var t=ct;return ft=!1,ct=0,t},t.examineBuffer=function(t,e,r){var n=C(r);if(n.enabled){var o=t.attributes,i=t.geometry,s=o.map(function(t){return i.attributes[t.name]}),a=s.map(function(t){return t.array}),u=[];if(t.system.drawMode===_.TrianglesDrawMode)for(var c=0,f=0,h=0,l=i.drawRange.start+i.drawRange.count;c<l;)!function(){for(var t={vertex_0:{},vertex_1:{},vertex_2:{}},e=0;e<3;++e)!function(e){o.forEach(function(r,n){f=r.size+1,h=c*f,t["vertex_"+e][r.name]=a[n].slice(h,h+f)}),c++}(e);u.push(t)}();else if(t.system.drawMode===_.TriangleStripDrawMode)for(var d=0,p=0,y=0,m=i.drawRange.start+i.drawRange.count;d<m;)!function(){for(var t={vertex_0:{},vertex_1:{},vertex_2:{}},e=0;e<3;++e)!function(e){o.forEach(function(r,n){p=r.size+1,y=d*p,t["vertex_"+e][r.name]=a[n].slice(y,y+p)}),d++}(e);d-=2,u.push(t)}();n(e||"vertices: %o uniforms: %o",{drawRange:i.drawRange,triangles:u},t.system.material.uniforms)}},t.flattenMultiBuffers=function(t){var e=[];return t.forEach(function(t){t.getBuffers().forEach(function(t){return e=e.concat(t)})}),e},t.updateMultiBuffer=function(t,e,r,n,o){if(!t)return!1;var i,s=!1;i=x(t)?t.reduce(function(t,e){return t.concat(e.getBuffers())},[]):t.getBuffers();var a=new Map;e.forEach(function(t){return a.set(t.bufferItems.currentData,t)});var u=[];if(o?u=[].concat(i):i.forEach(function(t){a.get(t)?a.delete(t):t.length>0&&u.push(t)}),u.length>=a.size)a.forEach(function(t){s=n(t,u.shift())||s}),u.forEach(function(t){var o=r();e.push(o),s=n(o,t)||s});else{var c=Array.from(a.values());u.forEach(function(t){var e=c.shift();s=n(e,t)||s}),c.forEach(function(t){t.bufferItems.geometry.setDrawRange(0,0)})}return s},t.makeBuffer=function(t,e){for(var r=e.length,n=new _.BufferGeometry,o=0,i=!1,s=0;s<r;++s){var a=e[s],u=a.size+1;o+=u;var c=a.name,f=a.injectBuffer,h=f||new Float32Array(u*t),l=ht[a.size],d=a.customFill,p=a.defaults;if("position"===c&&(i=!0),!f)if(d)for(var m=0;m<t;++m)d(h,m,m*u,p);else{y(p);for(var m=0;m<t;++m)l(h,m*u)}var g=new _.BufferAttribute(h,u);g.setDynamic(!0),n.addAttribute(c,g),I("Made Buffer Attribute:",c,u)}return i||console.warn("It is recommended you ALWAYS use the position attribute as one of your attributes","There are features of threejs that REQUIRES this to be in place (even if not explicitly","documented). You don't have to use for exact position information, rather fill it with something","you need. Failure to do so will have you see consequences that are EXTREMELY hard to find."),o>16&&console.warn("A Buffer has specified more attributes than available. The max is 16 and the buffer provided:",o),n},t.shareBuffer=function(t,e){for(var r=e.attributes,n=new _.BufferGeometry,o=0,i=t;o<i.length;o++){var s=i[o],a=r[s.name];a?n.addAttribute(s.name,a):console.warn("Could not find attribute",s,"in the buffer to be shared. Can not share buffers properly")}return n},t.makeUniformBuffer=function(t){var e=0,r=[],n=w.WebGLStat.MAX_VERTEX_INSTANCE_DATA,o={};t.forEach(function(t){e=Math.max(t.block,e),(o[t.block]=(o[t.block]||0)+(t.size+1))>4&&console.warn("There were too many uniform attribute usages of a single block:",t)});for(var i=0;i<n;++i)r.push(new _.Vector4(0,0,0,0));return{blocksPerInstance:e+1,buffer:r,maxInstances:Math.floor(n/e)}},t.updateBuffer=function(t,e,r,o,i,s){var a=e.attributes,u=e.geometry,c=0!==ct&&ft;if(void 0!==t&&t!==e.currentData||c||s){ft||(ct=0),e.currentData=t;var f=a.map(function(t){return u.attributes[t.name]});n(f.map(function(t){return t.array}),a.map(function(t){return(t.size+1)*r}));return(0,lt[a.length])(o+ct,i),f.forEach(function(t){t.updateRange&&(t.updateRange.offset=0,t.updateRange.count=r*(ct+o)*t.itemSize),t.needsUpdate=!0}),ct+=o,!0}return ct+=o,!1},t.updateUniformBuffer=function(t,e,r,n,o){var i=0!==ct&&ft;if(void 0!==t&&t!==e.currentData||i||o){ft||(ct=0);var s=e.system.material,a=s.uniforms,u=a.instanceData;if(e.currentData=t,!(u&&"v4v"===u.type||"bvec4"===u.type&&e.uniformBuffer))return console.warn("A uniform buffer update was specified on a material that lacks uniform buffer usage"),!1;for(var c=e.uniformAttributes,f=e.uniformBuffer.blocksPerInstance,h=e.uniformBuffer.buffer,l=e.uniformBuffer.maxInstances,d=ct,p=ct*f,y=0;y<r&&d<l;++y){d=ct+y,p=f*d;for(var m=[d],g=0,b=c;g<b.length;g++){var v=b[g];m.push(h[v.block+p])}n.apply(null,m)}return u.value=[].concat(h),ct+=r,!0}return ct+=r,!1},t.makeBufferItems=function(){return{attributes:[],currentData:[],geometry:null,system:null,uniformAttributes:[],uniformBuffer:null}},t})(); e.BufferUtil = dt; let pt;
}, function(t, e, r) {
'use strict'; Object.defineProperty(e, '__esModule', {value:!0}); let n = (function(){function t(t,e,r,n){this.height=0,this.width=0,this.x=0,this.y=0,4===arguments.length&&(this.x=t,this.width=e-t,this.y=r,this.height=r-n)}return Object.defineProperty(t.prototype,"area",{get:function(){return this.width*this.height},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"bottom",{get:function(){return this.y-this.height},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"mid",{get:function(){return{x:this.x+this.width/2,y:this.y-this.height/2}},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"right",{get:function(){return this.x+this.width},enumerable:!0,configurable:!0}),t.prototype.containsPoint=function(t){return!(t.x<this.x)&&(!(t.y>this.y)&&(!(t.x>this.right)&&!(t.y<this.bottom)))},t.prototype.copyBounds=function(t){this.height=t.height,this.width=t.width,this.x=t.x,this.y=t.y},t.prototype.encapsulate=function(t){t.x<this.x&&(this.width+=this.x-t.x,this.x=t.x),t.y>this.y&&(this.height+=t.y-this.y,this.y=t.y),t.right>this.right&&(this.width=t.right-this.x),t.bottom<this.bottom&&(this.height=this.y-t.bottom)},t.prototype.encapsulateBounds=function(e,r){if(r&&e.length&&this.copyBounds(e[0]),0!==e.length){var n=Number.MAX_VALUE,o=-Number.MAX_VALUE,i=Number.MAX_VALUE,s=-Number.MAX_VALUE;e.forEach(function(t){t.x<n&&(n=t.x),t.right>o&&(o=t.right),t.bottom<i&&(i=t.bottom),t.y>s&&(s=t.y)}),this.encapsulate(new t(n,o,s,i))}},t.prototype.encapsulatePoint=function(t){t.x<this.x&&(this.width+=this.x-t.x,this.x=t.x),t.y>this.y&&(this.height+=t.y-this.y,this.y=t.y),t.x>this.right&&(this.width=t.x-this.x),t.y<this.bottom&&(this.height=this.y-t.y)},t.prototype.encapsulatePoints=function(e){var r=Number.MAX_VALUE,n=-Number.MAX_VALUE,o=Number.MAX_VALUE,i=-Number.MAX_VALUE;void 0!==e[0]&&e[0].x?e.forEach(function(t){t.x<r?r=t.x:t.x>n&&(n=t.x),t.y<o?o=t.y:t.y>i&&(i=t.y)}):e.forEach(function(t){t[0]<r?r=t[0]:t[0]>n&&(n=t[0]),t[1]<o?o=t[1]:t[1]>i&&(i=t[1])}),this.encapsulate(new t(r,n,i,o))},t.prototype.fits=function(t){return this.width===t.width&&this.height===t.height?1:this.width>=t.width&&this.height>=t.height?2:0},t.prototype.hitBounds=function(t){return!(t.right<this.x)&&(!(t.x>this.right)&&(!(t.bottom>this.y)&&!(t.y<this.bottom)))},t.prototype.pointInside=function(t){return!(t.x<this.x)&&(!(t.y>this.y)&&(!(t.x>this.right)&&!(t.y<this.bottom)))},t.isBounds=function(t){return!!t&&(t instanceof this||t&&"containsPoint"in t&&"encapsulate"in t&&"hitTest"in t)},t.prototype.isInside=function(t){return t.x<=this.x&&t.right>=this.right&&t.y>=this.y&&t.bottom<=this.bottom},t.maxBounds=function(){return new t(Number.MIN_VALUE,Number.MAX_VALUE,Number.MIN_VALUE,Number.MAX_VALUE)},t})(); e.Bounds = n
;}, function(t, e, r) {
'use strict'; Object.defineProperty(e, '__esModule', {value:!0}); let n = r(1),
 o = (function(){function t(){}return t.prototype.dispose=function(){this.bufferItems&&n.BufferUtil.dispose([this.bufferItems])},t.prototype.init=function(t,e){},t.prototype.update=function(t){return!1},t})(); e.BaseBuffer = o
;}, function(t, e, r) {
(function(n) {
function o() {
return !('undefined' == typeof window || !window.process || 'renderer' !== window.process.type) || ('undefined' != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || 'undefined' != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || 'undefined'!==typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || 'undefined' != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
;} function i(t) {
let r = this.useColors; if (t[0] = (r ? '%c':'') + this.namespace + (r ? ' %c':' ') + t[0] + (r ? '%c ':' ') + '+' + e.humanize(this.diff), r) {
let n = 'color: ' + this.color; t.splice(1, 0, n, 'color: inherit'); let o = 0,
 i = 0; t[0].replace(/%[a-zA-Z%]/g, function(t) {
'%%' !== t && (o++, '%c' === t && (i = o))
;}), t.splice(i, 0, n);
}
} function s() {
return 'object'===typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments)
;} function a(t) {
try {
t==null ? e.storage.removeItem('debug'):e.storage.debug = t;}
catch (t) {}
} function u() {
let t; try {
t = e.storage.debug;
} catch(t) {} return!t && void 0 !== n && 'env' in n && (t = n.env.DEBUG), t;
}e = t.exports = r(31), e.log = s, e.formatArgs = i, e.save = a, e.load = u, e.useColors = o, e.storage = 'undefined' != typeof chrome && void 0 !== chrome.storage ? chrome.storage.local:(function(){try{return window.localStorage}catch(t){}})(), e.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'], e.formatters.j = function(t) {
try {
return JSON.stringify(t);}
 catch(t) {
return '[UnexpectedJSONParseError]: ' + t.message
;}
}, e.enable(u());
}).call(e, r(30))
;}, function(t, r) {
t.exports = e
;}, function(t, e, r) {
'use strict'; function n(t, e) {
let r = t.x - e.x,
 n = t.y - e.y; return r * r + n * n
;}Object.defineProperty(e, '__esModule', {value:!0}); let o = (function(){function t(){}return t.add=function(t,e,r){return r?(r.x=t.x+e.x,r.y=t.y+e.y,r):{x:t.x+e.x,y:t.y+e.y}},t.getClosest=function(t,e){var r,o=Number.MAX_VALUE,i=null,s=function(e){(r=n(e,t))<o&&(o=r,i=e)};return e.forEach(s),i},t.getClosestIndex=function(t,e){var r,o=Number.MAX_VALUE,i=0,s=function(e,s){(r=n(e,t))<o&&(o=r,i=s)};return e.forEach(s),i},t.getDirection=function(t,e,r){void 0===r&&(r=!1);var n=e.x-t.x,o=e.y-t.y;if(r){var i=Math.sqrt(n*n+o*o);n/=i,o/=i}return{x:n,y:o}},t.getDistance=function(t,e,r){return void 0===r&&(r=!1),r?n(t,e):Math.sqrt(n(t,e))},t.getMidpoint=function(e,r){var n=t.getDirection(e,r);return{x:n.x/2+e.x,y:n.y/2+e.y}},t.make=function(t,e){return{x:t,y:e}},t.scale=function(t,e,r){return r?(r.x=t.x*e,r.y=t.y*e,r):{x:t.x*e,y:t.y*e}},t.zero=function(){return{x:0,y:0}},t})(); e.Point = o
;}, function(t, e, r) {
'use strict'; let n = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let o = r(2),
 i = (function(t){function e(e,r){var n=t.call(this,0,1,1,0)||this;return n.setPoints(e,r),n}return n(e,t),e.prototype.directionTo=function(t){var e={x:this.p1.x-t.x,y:this.p1.y-t.y};return this.perpendicular.x*e.x+this.perpendicular.y*e.y},e.prototype.distanceTo=function(t){var e={x:this.p1.x-t.x,y:this.p1.y-t.y};return Math.abs(this.perpendicular.x*e.x+this.perpendicular.y*e.y)},e.getClosest=function(t,e){var r,n=Number.MAX_VALUE,o=0;return t.forEach(function(t){(o=t.distanceTo(e))<n&&(r=t,n=o)}),r},e.prototype.setPoints=function(t,e){this.x=t.x-1,this.y=t.y-1,this.width=2,this.height=2,this.encapsulatePoint(e);var r=e.x-t.x,n=e.y-t.y;this.slope=n/r,this.p1=t,this.p2=e,this.magnitude=Math.sqrt(r*r+n*n),this.perpendicular={x:this.p2.y-this.p1.y,y:-(this.p2.x-this.p1.x)};var o=Math.sqrt(this.perpendicular.x*this.perpendicular.x+this.perpendicular.y*this.perpendicular.y);this.perpendicular.x/=o,this.perpendicular.y/=o},e})(o.Bounds); e.Line = i
;}, function(t, e, r) {
'use strict'; Object.defineProperty(e, '__esModule', {value:!0}); let n = (function(){function t(t,e){this.aspectRatio=1,this.imagePath=t,this.label=e,e&&(this.label.rasterizedLabel=this)}return t})(); e.AtlasTexture = n
;}, function(t, e, r) {
'use strict'; function n() {
let t = o.lastFrameTime / 1e7; return Math.floor(1e7 * (t - Math.floor(t)));
}Object.defineProperty(e, '__esModule', {value:!0}); var o = (function(){function t(){}return t.lastFrameTime=Date.now(),t.nextFrameTime=Date.now(),t.framesPlayed=new Map,t})(); e.FrameInfo = o, e.getAttributeCurrentTime = n;
}, function(t, e, r) {
'use strict'; function n(t, e) {
for (var r = {attributeCount:0, attributes:new Array(), uniformCount:0, uniforms:new Array()}, n = t.getProgramParameter(e, t.ACTIVE_UNIFORMS), o = t.getProgramParameter(e, t.ACTIVE_ATTRIBUTES), i = {35664:'FLOAT_VEC2', 35665:'FLOAT_VEC3', 35666:'FLOAT_VEC4', 35667:'INT_VEC2', 35668:'INT_VEC3', 35669:'INT_VEC4', 35670:'BOOL', 35671:'BOOL_VEC2', 35672:'BOOL_VEC3', 35673:'BOOL_VEC4', 35674:'FLOAT_MAT2', 35675:'FLOAT_MAT3', 35676:'FLOAT_MAT4', 35678:'SAMPLER_2D', 35680:'SAMPLER_CUBE', 5120:'BYTE', 5121:'UNSIGNED_BYTE', 5122:'SHORT', 5123:'UNSIGNED_SHORT', 5124:'INT', 5125:'UNSIGNED_INT', 5126:'FLOAT'}, s = {35664:1, 35665:1, 35666:1, 35667:1, 35668:1, 35669:1, 35670:1, 35671:1, 35672:1, 35673:1, 35674:1, 35675:3, 35676:4, 35678:1, 35680:1, 5120:1, 5121:1, 5122:1, 5123:1, 5124:1, 5125:1, 5126:1}, a = 0; a < n; ++a) {
let u = t.getActiveUniform(e, a); u.typeName = i[u.type], r.uniforms.push(u), r.uniformCount += u.size, u.size*=s[u.type];
} for(var a = 0; a < o; a++) {
let c = t.getActiveAttrib(e, a); c.typeName = i[c.type], r.attributes.push(c), r.attributeCount += c.size;
} return r
;}Object.defineProperty(e, '__esModule', {value:!0}); let o = (function(){function t(){}return t.printCurrentProgramInfo=function(t,e){if(e.gl){var r=n(e.gl,e.gl.getParameter(e.gl.CURRENT_PROGRAM)),o=window.table;o&&o(r.uniforms)}else t("Attempted to printProgramInfo but the surface has not established its gl context yet")},t.MAX_VERTEX_UNIFORMS=0,t.MAX_FRAGMENT_UNIFORMS=0,t.MAX_ATTRIBUTES=0,t.WEBGL_SUPPORTED=!1,t.MAX_VERTEX_INSTANCE_DATA=96,t})(); e.WebGLStat = o, (function(){var t=function(){try{var t=document.createElement("canvas");return window.WebGLRenderingContext&&(t.getContext("webgl")||t.getContext("experimental-webgl"))}catch(t){return!1}}();t&&(o.WEBGL_SUPPORTED=!0,o.MAX_VERTEX_UNIFORMS=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),o.MAX_FRAGMENT_UNIFORMS=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),o.MAX_ATTRIBUTES=t.getParameter(t.MAX_VERTEX_ATTRIBS),o.MAX_VERTEX_INSTANCE_DATA=96)})();
}, function(t, e, r) {
'use strict'; function n(t, e, r, n) {
return r * t / n + e
;} function o(t, e, r, n) {
return r * (t /= n) * t + e;
} function i(t, e, r, n) {
return -r * (t /= n) * (t - 2) + e;
} function s(t, e, r, n) {
return (t /= n / 2) < 1 ? r / 2 * t * t + e:-r / 2 * (--t * (t - 2) - 1) + e
;} function a(t, e, r, n) {
return r * (t /= n) * t * t + e
;} function u(t, e, r, n) {
return r * ((t = t / n - 1) * t * t + 1) + e
;} function c(t, e, r, n) {
return (t /= n / 2) < 1 ? r / 2 * t * t * t + e:r / 2 * ((t -= 2) * t * t + 2) + e;
} function f(t, e, r, n) {
return r * (t /= n) * t * t * t + e;
} function h(t, e, r, n) {
return -r * ((t = t / n - 1) * t * t * t - 1) + e;
} function l(t, e, r, n) {
return (t /= n / 2) < 1 ? r / 2 * t * t * t * t + e:-r / 2 * ((t -= 2) * t * t * t - 2) + e
;} function d(t, e, r, n) {
return r * (t /= n) * t * t * t * t + e
;} function p(t, e, r, n) {
return r * ((t = t / n - 1) * t * t * t * t + 1) + e;
} function y(t, e, r, n) {
return (t /= n / 2) < 1 ? r / 2 * t * t * t * t * t + e:r / 2 * ((t -= 2) * t * t * t * t + 2) + e;
} function m(t, e, r, n) {
return -r * Math.cos(t / n * (Math.PI / 2)) + r + e
;} function g(t, e, r, n) {
return r * Math.sin(t / n * (Math.PI / 2)) + e;
} function b(t, e, r, n) {
return -r / 2 * (Math.cos(Math.PI * t / n) - 1) + e;
} function v(t, e, r, n) {
return t===0 ? e:r * Math.pow(2, 10 * (t / n - 1)) + e
;} function x(t, e, r, n) {
return t === n ? e + r:r * (1 - Math.pow(2, -10 * t / n)) + e
;} function _(t, e, r, n) {
return t===0 ? e:t === n ? e + r:(t /= n / 2) < 1 ? r / 2 * Math.pow(2, 10 * (t - 1)) + e:r / 2 * (2 - Math.pow(2, -10 * --t)) + e
;} function w(t, e, r, n) {
return -r * (Math.sqrt(1 - (t /= n) * t) - 1) + e
;} function C(t, e, r, n) {
return r * Math.sqrt(1 - (t = t / n - 1) * t) + e;
} function I(t, e, r, n) {
return (t /= n / 2) < 1 ? -r / 2 * (Math.sqrt(1 - t * t) - 1) + e:r / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + e
;} function M(t, e, r, n) {
let o = 1.70158,
 i = 0, 
s = r; return t===0 ? e:(t/=n)==1 ? e + r:(i || (i = 0.3 * n), s < Math.abs(r) ? (s = r, o = i / 4):o = i / (2 * Math.PI) * Math.asin(r / s), -s * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * n - o) * (2 * Math.PI) / i) + e);
} function P(t, e, r, n) {
let o = 1.70158, 
i = 0,
 s = r; return t===0 ? e:(t/=n)==1 ? e + r:(i || (i = 0.3 * n), s < Math.abs(r) ? (s = r, o = i / 4):o = i / (2 * Math.PI) * Math.asin(r / s), s * Math.pow(2, -10 * t) * Math.sin((t * n - o) * (2 * Math.PI) / i) + r + e);
} function A(t, e, r, n) {
let o = 1.70158, 
i = 0,
 s = r; return t===0 ? e:(t/=n/2)==2 ? e + r:(i || (i = n * (0.3 * 1.5)), s < Math.abs(r) ? (s = r, o = i / 4):o = i / (2 * Math.PI) * Math.asin(r / s), t < 1 ? s * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * n - o) * (2 * Math.PI) / i) * -0.5 + e:s * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * n - o) * (2 * Math.PI) / i) * 0.5 + r + e)
;} function B(t, e, r, n, o) {
return void 0 === o && (o = 1.70158), r * (t /= n) * t * ((o + 1) * t - o) + e
;} function S(t, e, r, n, o) {
return void 0 === o && (o = 1.70158), r * ((t = t / n - 1) * t * ((o + 1) * t + o) + 1) + e;
} function O(t, e, r, n, o) {
return void 0 === o && (o = 1.70158), (t /= n / 2) < 1 ? r / 2 * (t * t * ((1 + (o *= 1.525)) * t - o)) + e:r / 2 * ((t -= 2) * t * ((1 + (o *= 1.525)) * t + o) + 2) + e;
} function T(t, e, r, n) {
return r - E(n - t, 0, r, n) + e;
} function E(t, e, r, n) {
return (t /= n) < 1 / 2.75 ? r * (7.5625 * t * t) + e:t < 2 / 2.75 ? r * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + e:t < 2.5 / 2.75 ? r * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + e:r * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + e
;} function z(t, e, r, n) {
return t < n / 2 ? 0.5 * T(2 * t, 0, r, n) + e:0.5 * E(2 * t - n, 0, r, n) + 0.5 * r + e
;}Object.defineProperty(e, '__esModule', {value:!0}), e.linear = n, e.easeInQuad = o, e.easeOutQuad = i, e.easeInOutQuad = s, e.easeInCubic = a, e.easeOutCubic = u, e.easeInOutCubic = c, e.easeInQuart = f, e.easeOutQuart = h, e.easeInOutQuart = l, e.easeInQuint = d, e.easeOutQuint = p, e.easeInOutQuint = y, e.easeInSine = m, e.easeOutSine = g, e.easeInOutSine = b, e.easeInExpo = v, e.easeOutExpo = x, e.easeInOutExpo = _, e.easeInCirc = w, e.easeOutCirc = C, e.easeInOutCirc = I, e.easeInElastic = M, e.easeOutElastic = P, e.easeInOutElastic = A, e.easeInBack = B, e.easeOutBack = S, e.easeInOutBack = O, e.easeInBounce = T, e.easeOutBounce = E, e.easeInOutBounce = z;
}, function(t, e, r) {
'use strict'; function n(t, e, r, n) {
let o = t * t, 
i = 1 - t,
 s = i * i; return {x:e.x * s + 2 * n.x * i * t + r.x * o, y:e.y * s + 2 * n.y * i * t + r.y * o};
} function o(t, e, r, n, o) {
let i = t * t,
 s = i * t,
 a = 1 - t,
 u = a * a, 
c = u * a; return {x:e.x * c + 3 * n.x * u * t + 3 * o.x * a * i + r.x * s, y:e.y * c + 3 * n.y * u * t + 3 * o.y * a * i + r.y * s}
;} function i(t, e, r, n, o) {
let i = a.Point.getDirection(n, e),
 s = Math.atan2(i.y, i.x),
 c = a.Point.getDirection(n, r), 
f = Math.atan2(c.y, c.x); s < 0 && (s += 2 * Math.PI), f < 0 && (f += 2 * Math.PI); let h = f - s; h > Math.PI && (h = s - f), h *= t; let l = a.Point.getDistance(e, n),
 d = a.Point.getDistance(r, n),
 p = (o || u.linear)(t, l, d - l, 1); return {x:Math.cos(s + h) * p + n.x, y:Math.sin(s + h) * p + n.y};
}Object.defineProperty(e, '__esModule', {value:!0}); var s, 
a = r(6),
 u = r(11); !(function(t){t[t.BEZIER2=0]="BEZIER2",t[t.BEZIER3=1]="BEZIER3",t[t.CIRCULAR=2]="CIRCULAR"})(s = e.InterpolationMethod || (e.InterpolationMethod = {})), e.bezier2 = n, e.bezier3 = o, e.circular = i, e.pickInterpolation = (c = {}, c[s.BEZIER2] = n, c[s.BEZIER3] = o, c[s.CIRCULAR] = i, c); let c
;}, function(t, e, r) {
'use strict'; let n = this && this.__awaiter || function(t, e, r, n) {
return new (r || (r = Promise))(function(o, i) {
function s(t) {
try {
u(n.next(t))
;} catch(t) {
i(t);
}
} function a(t) {
try {
u(n.throw(t));
}catch (t) {
i(t)
;}
} function u(t) {
t.done ? o(t.value):new r(function(e) {
e(t.value);
}).then(s, a)
;}u((n = n.apply(t, e || [])).next());
})
;}, 
o = this && this.__generator || function(t, e) {
function r(t) {
return function(e) {
return n([t, e]);
};
} function n(r) {
if (o) throw new TypeError('Generator is already executing.'); for (;u;)try {
if (o = 1, i && (s = i[2 & r[0] ? 'return':r[0] ? 'throw':'next']) && !(s = s.call(i, r[1])).done) return s; switch (i = 0, s && (r = [0, s.value]), r[0]) {
case 0:case 1:s = r; break; case 4:return u.label++, {value:r[1], done:!1}; case 5:u.label++, i = r[1], r = [0]; continue; case 7:r = u.ops.pop(), u.trys.pop(); continue; default:if (s = u.trys, !(s = s.length > 0 && s[s.length - 1]) && (r[0]===6 || r[0]===2)) {
u = 0; continue;
} if(r[0]===3 && (!s || r[1] > s[0] && r[1] < s[3])) {
u.label = r[1]; break
;}if (r[0]===6 && u.label < s[1]) {
u.label = s[1], s = r; break
;}if (s && u.label < s[2]) {
u.label = s[2], u.ops.push(r); break
;}s[2] && u.ops.pop(), u.trys.pop(); continue
;}r = e.call(t, u);} 
catch(t) {
r = [6, t], i = 0;
}finally {
o = s = 0;
} if(5 & r[0]) throw r[1]; return {value:r[0] ? r[1]:void 0, done:!0};
} var o, i, s, a,
 u = {label:0, sent:function() {
if (1 & s[0]) throw s[1]; return s[1];
}, trys:[], ops:[]}; return a = {next:r(0), throw:r(1), return:r(2)}, 'function'===typeof Symbol && (a[Symbol.iterator] = function() {
return this
;}), a;
}; Object.defineProperty(e, '__esModule', {value:!0}); let i = r(29), 
s = r(0),
 a = r(2), 
u = r(14), 
c = r(15), 
f = r(8),
 h = r(4)('webgl-surface:Atlas'),
 l = r(4)('webgl-surface:Labels'),
 d = {atlasBL:{x:0, y:0}, atlasBR:{x:0, y:0}, atlasTL:{x:0, y:0}, atlasTR:{x:0, y:0}, label:new c.Label({text:' '}), pixelHeight:0, pixelWidth:0},
 p = (function(){function t(t,e){this.atlasImages={},this.atlasMap={},this.atlasTexture={},this.textureWidth=t,this.textureHeight=e}return t.prototype.createAtlas=function(t,e,r){return n(this,void 0,void 0,function(){var n,i,a,c,f,f,l,d;return o(this,function(o){switch(o.label){case 0:if(n=new u.PackNode(0,0,this.textureWidth,this.textureHeight),this.atlasMap[t]=n,this.atlasImages[t]=[],i=document.createElement("canvas").getContext("2d"),i.canvas.width=this.textureWidth,i.canvas.height=this.textureHeight,!e)return[3,4];a=0,c=e,o.label=1;case 1:return a<c.length?(f=c[a],[4,this.draw(f,t,i)]):[3,4];case 2:o.sent(),o.label=3;case 3:return a++,[3,1];case 4:return r?[4,this.drawColors(r,t,i)]:[3,6];case 5:f=o.sent(),f&&this.atlasImages[t].push(f),o.label=6;case 6:return l=new s.Texture(i.canvas),l.premultiplyAlpha=!0,l.generateMipmaps=!0,this.atlasTexture[t]=l,e&&(d=this.atlasImages[t]).push.apply(d,e),h("Atlas Created-> texture: %o mapping: %o images: %o",l,n,e),[2,l]}})})},t.prototype.destroyAtlas=function(t){if(this.atlasTexture[t]&&(this.atlasTexture[t].dispose(),this.atlasTexture[t]=null),this.atlasMap[t]&&(this.atlasMap[t].destroy(),this.atlasMap[t]=null),this.atlasImages[t]){var e={x:0,y:0};this.atlasImages[t].forEach(function(t){t.atlasReferenceID=null,t.pixelWidth=0,t.pixelHeight=0,t.atlasBL=e,t.atlasBR=e,t.atlasTL=e,t.atlasTR=e}),this.atlasImages[t]=null}},t.prototype.isValidImage=function(t){var e=!1;return t&&(t.imagePath||t.label&&t.label.text)&&t.pixelWidth&&t.pixelHeight&&(e=!0),e},t.prototype.setDefaultImage=function(t,e){return t=Object.assign(t,d,{atlasReferenceID:e})},t.prototype.draw=function(t,e,r){return n(this,void 0,void 0,function(){var n,i,s,u,c,f,d,p,y,m;return o(this,function(o){switch(o.label){case 0:return this.atlasMap[e]?[4,this.loadImage(t)]:(h("Can not load image, invalid Atlas Name: %o for atlasMaps: %o",e,this.atlasMap),[2,!1]);case 1:return n=o.sent(),t.atlasReferenceID=null,n&&this.isValidImage(t)?(h("Image loaded: %o",t.imagePath),i=new a.Bounds(0,t.pixelWidth,t.pixelHeight,0),s={first:t,second:i},s.second.width+=1,s.second.height+=1,u=this.atlasMap[e],c=u.insert(s),c?(h("Atlas location determined: %o",c),t.label&&l("Atlas location determined. PackNode: %o Dimensions: %o",c,s),c.nodeImage=t,f=c.nodeDimensions.x/this.textureWidth,d=c.nodeDimensions.y/this.textureHeight,p=c.nodeDimensions.width/this.textureWidth,y=c.nodeDimensions.height/this.textureHeight,m=new a.Bounds(f,f+p,1-d,1-(d+y)),t.atlasReferenceID=e,t.atlasBL={x:m.x,y:m.y-m.height},t.atlasBR={x:m.x+m.width,y:m.y-m.height},t.atlasTL={x:m.x,y:m.y},t.atlasTR={x:m.x+m.width,y:m.y},r.drawImage(n,c.nodeDimensions.x,c.nodeDimensions.y),[2,!0]):(console.error("Could not fit image into atlas "+t.imagePath),t=this.setDefaultImage(t,e),[2,!1])):(console.error("Could not load image "+t.imagePath),t=this.setDefaultImage(t,e),[2,!1])}})})},t.prototype.drawColors=function(t,e,r){return n(this,void 0,void 0,function(){var n,i,s,u,c,l,d,p,y,m,g,b,v,x,_,w,C,I,M,P,A,B,S,O,T,E,z,R,L,D,U,N;return o(this,function(o){if(h("Finding space for colors on the atlas: %o",t),n=2,i=2,s=1024/n,u=Math.min(this.textureWidth,s*n),c=Math.ceil(t.length*n/u),l=Math.ceil(u/n),d=c*i,p={first:new f.AtlasTexture(null,null),second:new a.Bounds(0,u,d,0)},p.second.width+=1,p.second.height+=1,y=this.atlasMap[e],m=y.insert(p)){for(h("Atlas location determined for colors: %o",m),g=m.nodeImage=p.first,b=m.nodeDimensions.x/this.textureWidth,v=m.nodeDimensions.y/this.textureHeight,x=m.nodeDimensions.width/this.textureWidth,_=m.nodeDimensions.height/this.textureHeight,w=new a.Bounds(b,b+x,1-v,1-(v+_)),g.atlasReferenceID=e,g.atlasBL={x:w.x,y:w.y-w.height},g.atlasBR={x:w.x+w.width,y:w.y-w.height},g.atlasTL={x:w.x,y:w.y},g.atlasTR={x:w.x+w.width,y:w.y},C=m.nodeDimensions,I=C.x,M=C.y,P=n/this.textureWidth,A=-i/this.textureHeight,B=I/this.textureWidth+P/2,S=1-M/this.textureHeight+A/2,O=0,T=0,E=0,z=t;E<z.length;E++)R=z[E],R.atlasReferenceID=e,R.colorIndex=O+T*l,R.colorsPerRow=l,R.firstColor={x:B,y:S},R.nextColor={x:P,y:A},L=R.color,D=L.r,U=L.g,N=L.b,r.fillStyle="rgba("+Math.round(255*D)+", "+Math.round(255*U)+", "+Math.round(255*N)+", "+R.opacity+")",r.fillRect(O*n+I,T*i+M,n,i),++O===l&&(O=0,T++);return[2,g]}throw new Error("Could not fit colors into atlas")})})},t.prototype.getAtlasTexture=function(t){return this.atlasTexture[t]},t.prototype.loadImage=function(t){return t.imagePath?new Promise(function(e,r){var n=new Image;n.onload=function(){t.pixelWidth=n.width,t.pixelHeight=n.height,t.aspectRatio=n.width/n.height,e(n)},n.onerror=function(){e(null)},n.src=t.imagePath}):t.label?new Promise(function(e,r){var n=t.label,o=n.getSize(),s=document.createElement("canvas"),a=s.getContext("2d");if(s.width=o.width+t.label.rasterizationOffset.x+t.label.rasterizationPadding.width,s.height=o.height+t.label.rasterizationPadding.height,h("label X %o",t.label.rasterizationOffset.x),a){var u=n.fontSize,c=i.rgb(255*n.color.base.color.r,255*n.color.base.color.g,255*n.color.base.color.b,n.color.base.opacity);a.font=n.makeCSSFont(u),a.textAlign=n.textAlign,a.textBaseline=n.textBaseline,a.fillStyle=c.toString(),a.fillText(n.text,t.label.rasterizationOffset.x,t.label.rasterizationOffset.y);var f=new Image;f.onload=function(){t.pixelWidth=f.width,t.pixelHeight=f.height,t.aspectRatio=f.width/f.height,l("Applying size based on rasterization to the Label: w: %o h: %o",f.width,f.height),n.setSize({height:f.height,width:f.width}),e(f)},f.onerror=function(){e(null)},f.src=s.toDataURL("image/png")}}):Promise.resolve(null)},t})(); e.AtlasManager = p
;}, function(t, e, r) {
'use strict'; Object.defineProperty(e, '__esModule', {value:!0}); let n = r(2), 
o = (function(){function t(t,e,r,o){this.child=[null,null],this.isLeaf=!0,this.nodeImage=null,this.nodeDimensions=new n.Bounds(t,t+r,e,e-o)}return t.prototype.destroy=function(){this.nodeImage=null,this.child[0]&&this.child[0].destroy(),this.child[1]&&this.child[1].destroy(),this.child[0]=void 0,this.child[1]=void 0},t.prototype.hasChild=function(){return this.child[0]&&!this.child[0].nodeImage?!this.child[0].isLeaf:!(!this.child[1]||this.child[1].nodeImage)&&!this.child[1].isLeaf},t.prototype.insert=function(e){if(!this.isLeaf){var r=this.child[0].insert(e);return null!==r?r:this.child[1].insert(e)}if(this.nodeImage)return null;var n=this.nodeDimensions.fits(e.second);if(0===n)return null;if(1===n)return this;this.isLeaf=!1;var o=e.second.width,i=e.second.height,s=this.nodeDimensions.width-o,a=this.nodeDimensions.height-e.second.height;return s>a?(this.child[0]=new t(this.nodeDimensions.x,this.nodeDimensions.y,o,this.nodeDimensions.height),this.child[1]=new t(this.nodeDimensions.x+o,this.nodeDimensions.y,s,this.nodeDimensions.height)):(this.child[0]=new t(this.nodeDimensions.x,this.nodeDimensions.y,this.nodeDimensions.width,i),this.child[1]=new t(this.nodeDimensions.x,this.nodeDimensions.y+i,this.nodeDimensions.width,a)),this.child[0].insert(e)},t.prototype.remove=function(t){if(this.isLeaf)return this.nodeImage===t&&(this.nodeImage=null,t.atlasReferenceID=null,t.pixelWidth=0,!0);var e=this.child[0].remove(t);return!!e||(e=this.child[1].remove(t),this.child[0].hasChild()||this.child[1].hasChild()||(this.child[0]=null,this.child[1]=null),e)},t})(); e.PackNode = o;
}, function(t, e, r) {
'use strict'; let n = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let o = r(5),
 i = r(16),
 s = r(17),
 a = new s.Sprite(200, 200, 1, 1),
 u = (function(t){function e(e){void 0===e&&(e={});var r=t.call(this,{x:0,y:1},{width:1,height:1},0,i.AnchorPosition.TopLeft)||this;return r.depth=40,r.direction="inherit",r.font="serif",r.fontSize=10,r.fontWeight=400,r.maxWidth=void 0,r.text="",r.id="",r.textAlign="start",r.textBaseline="alphabetic",r.zoomable=!1,r.rasterizationOffset={x:20,y:0},r.rasterizationPadding={width:0,height:0},Object.assign(r,e),r.setFontSize(e.fontSize||12),r}return n(e,t),Object.defineProperty(e.prototype,"baseLabel",{get:function(){return this._baseLabel},set:function(t){this._baseLabel=t,this.text=t.text,this.fontSize=t.fontSize,this.font=t.font,this.textAlign=t.textAlign,this.textBaseline=t.textBaseline},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"rasterizedLabel",{get:function(){return this.baseLabel?this.baseLabel.rasterizedLabel:this._rasterizedLabel},set:function(t){this._rasterizedLabel=t},enumerable:!0,configurable:!0}),e.prototype.copyLabel=function(t){Object.assign(this,o.omit(["x","y","width","height"],t)),this.setText(t.text)},e.prototype.getText=function(){return this._baseLabel?this._baseLabel.getText():this.text},e.prototype.makeCSSFont=function(t){return this.fontWeight+" "+(t||this.fontSize)+"px "+this.font},e.prototype.position=function(t,e){this.x=t,this.y=e},e.prototype.setFontSize=function(t){var e=this.getText(),r=this.getSize(),n=r.width,o=r.height;if(this.baseLabel){var i=this.baseLabel.getSize(),s=t/this.baseLabel.fontSize;o=i.height*s,n=i.width*s}else{a.context.font=this.makeCSSFont();var u=a.context.measureText(e);o=t,n=u.width}this.fontSize=t,this.setSize({width:n,height:o})},e.prototype.setText=function(t){this.text=t,this.setFontSize(this.fontSize)},e.prototype.update=function(){this.setFontSize(this.fontSize),t.prototype.update.call(this)},e})(i.RotateableQuad); e.Label = u;
}, function(t, e, r) {
'use strict'; let n = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let o,
 i = r(0),
 s = r(2); !(function(t){t[t.BottomLeft=0]="BottomLeft",t[t.BottomRight=1]="BottomRight",t[t.Custom=2]="Custom",t[t.Middle=3]="Middle",t[t.MiddleBottom=4]="MiddleBottom",t[t.MiddleLeft=5]="MiddleLeft",t[t.MiddleRight=6]="MiddleRight",t[t.MiddleTop=7]="MiddleTop",t[t.TopLeft=8]="TopLeft",t[t.TopRight=9]="TopRight"})(o = e.AnchorPosition || (e.AnchorPosition = {})); let a = (c = {}, c[o.BottomLeft] = function(t) {
return {x:0, y:0}
;}, c[o.BottomRight] = function(t) {
return {x:t.getSize().width, y:0};
}, c[o.Custom] = function(t) {
return {x:0, y:t.getSize().height}
;}, c[o.Middle] = function(t) {
return {x:t.getSize().width / 2, y:t.getSize().height / 2}
;}, c[o.MiddleBottom] = function(t) {
return {x:t.getSize().width / 2, y:0}
;}, c[o.MiddleLeft] = function(t) {
return {x:0, y:t.getSize().height / 2};
}, c[o.MiddleRight] = function(t) {
return {x:t.getSize().width, y:t.getSize().height / 2}
;}, c[o.MiddleTop] = function(t) {
return {x:t.getSize().width / 2, y:t.getSize().height};
}, c[o.TopLeft] = function(t) {
return {x:0, y:t.getSize().height};
}, c[o.TopRight] = function(t) {
return {x:t.getSize().width, y:t.getSize().height}
;}, c),
 u = (function(t){function e(e,r,n,i){void 0===i&&(i=o.Middle);var s=t.call(this,0,0,0,0)||this;return s.setSize(r),s.setAnchor(i),s.setLocation(e),s.setRotation(n),s.update(),s}return n(e,t),e.prototype.calculateAnchor=function(t){this.anchor=a[t](this)},e.prototype.getSize=function(){return this.size},e.prototype.setAnchor=function(t,e){if(void 0===t&&(t=o.Middle),this.anchorType=t,e)return this.anchorType=o.Custom,void(this.anchor=e);this.calculateAnchor(t)},e.prototype.getAnchor=function(){return this.anchor},e.prototype.getAnchorType=function(){return this.anchorType},e.prototype.setLocation=function(t){this.location=t},e.prototype.getLocation=function(){return this.location},e.prototype.setRotation=function(t){this.rotation=t},e.prototype.getRotation=function(){return this.rotation},e.prototype.getDirection=function(){var t=this.rotation;return{x:Math.cos(t),y:Math.sin(t)}},e.prototype.setSize=function(t){this.size=t,this.base=[new i.Vector4(0,t.height,0,1),new i.Vector4(t.width,t.height,0,1),new i.Vector4(0,0,0,1),new i.Vector4(t.width,0,0,1)],this.anchorType&&this.calculateAnchor(this.anchorType)},e.prototype.update=function(){var t=(new i.Matrix4).makeTranslation(this.anchor.x,-this.anchor.y,0),e=(new i.Matrix4).makeRotationZ(this.rotation),r=(new i.Matrix4).makeTranslation(this.location.x,this.location.y,0);this.transform=(new i.Matrix4).multiply(r).multiply(e).multiply(t),this.TL=this.base[0].clone().applyMatrix4(this.transform),this.TR=this.base[1].clone().applyMatrix4(this.transform),this.BL=this.base[2].clone().applyMatrix4(this.transform),this.BR=this.base[3].clone().applyMatrix4(this.transform),this.x=this.TL.x,this.y=this.TL.y,this.width=1,this.height=1,this.encapsulatePoints([this.TR,this.BL,this.BR])},e})(s.Bounds); e.RotateableQuad = u; let c;
}, function(t, e, r) {
'use strict'; Object.defineProperty(e, '__esModule', {value:!0}); let n = (function(){function t(t,e,r,n){this.scaleX=1,this.scaleY=1;var o=document.createElement("canvas");o&&(this.scaleX=r||this.scaleX,this.scaleY=n||this.scaleY,o.width=t*this.scaleX,o.height=e*this.scaleY,this.context=o.getContext("2d"),this.canvas=o)}return t.prototype.getContentScale=function(){return{x:this.scaleX,y:this.scaleY}},t.prototype.getContentSize=function(){return{height:this.canvas.height,width:this.canvas.width}},t.prototype.getWidth=function(){return this.canvas.width/this.scaleX},t.prototype.getHeight=function(){return this.canvas.height/this.scaleY},t})(); e.Sprite = n;
}, function(t, e, r) {
'use strict'; function n(t) {
let e = t.nativeEvent,
 r = 0,
 n = 0; return Math.sign(y[0]) !== Math.sign(n) && y.splice(0, y.length, 0, 0, 0, 0), r = e.deltaX * p, n = e.deltaY * p * m + y[0] * g + y[1] * b + y[2] * v, y.unshift(n), y.pop(), new f.Vector2(-r, -n);
} function o(t) {
let e = t.nativeEvent; return new f.Vector2(e.deltaX, -e.deltaY);
} function i(t) {
let e = t.nativeEvent,
 r = e.deltaX; void 0 === r && (r = void 0 !== e.wheelDeltaX ? e.wheelDeltaX * l:0); let n = e.deltaY; return void 0 === n && (n = void 0 !== e.wheelDeltaY ? e.wheelDeltaY * l:(e.wheelDelta || -e.detail) * d), new f.Vector2(-r, -n);
} function s(t) {
let e = t.nativeEvent, 
r = e.deltaX,
 n = e.deltaY; void 0 === r && (r = void 0 !== e.wheelDeltaX ? e.wheelDeltaX * l:0), void 0 === n && (n = void 0 !== e.wheelDeltaY ? e.wheelDeltaY * l:e.wheelDelta || -e.detail); let o = new f.Vector2(r, -n); return o.multiplyScalar(0.25), o
;} function a(t, e) {
let r = 0,
 n = 0,
 o = 0, 
i = 0,
 s = e || t.nativeEvent.target; if (t || (t = window.event), t.pageX || t.pageY ? (r = t.pageX, n = t.pageY):(t.clientX || t.clientY) && (r = t.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, n = t.clientY + document.body.scrollTop + document.documentElement.scrollTop), s.offsetParent) do{
o += s.offsetLeft, i += s.offsetTop, s = s.offsetParent;
}while (s);return {x:r - o, y:n - i};
}Object.defineProperty(e, '__esModule', {value:!0}); var u, 
c = r(33),
 f = r(0),
 h = r(4)('CommunicationsView:Mouse'),
 l = 1 / 30,
 d = -0.25,
 p = 100, 
y = [0, 0, 0, 0], 
m = 0.1, 
g = 0.2, 
b = 0.2, 
v = 0.5; e.normalizeWheel = u, c.firefox ? (h('Using mouse wheel for firefox'), e.normalizeWheel = u = n):c.msie && Number(c.version) >= 11 ? (h('Using mouse wheel for IE 11'), e.normalizeWheel = u = i):c.msedge ? (h('Using mouse wheel for MS EDGE'), e.normalizeWheel = u = s):(h('Using mouse wheel for Chrome'), e.normalizeWheel = u = o), e.eventElementPosition = a;
}, function(t, e, r) {
'use strict'; function n(t, e) {
let r = []; return e.forEach(function(e) {
t.find(function(t) {
return e instanceof t;
}) && r.push(e)
;}), r
;} let o = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let i = r(2); e.filterQuery = n; let s = (function(){function t(t,e){this.TL=null,this.TR=null,this.BL=null,this.BR=null;var r=t.mid;this.TL=new a(t.x,r.x,t.y,r.y,e),this.TR=new a(r.x,t.right,t.y,r.y,e),this.BL=new a(t.x,r.x,r.y,t.bottom,e),this.BR=new a(r.x,t.right,r.y,t.bottom,e)}return t.prototype.destroy=function(){this.TL.destroy(),this.TR.destroy(),this.BL.destroy(),this.BR.destroy(),this.TL=null,this.TR=null,this.BL=null,this.BR=null},t})(); e.Quadrants = s; var a = (function(){function t(t,e,r,n,o){this.bounds=null,this.children=[],this.childrenProps=[],this.depth=0,this.nodes=null,arguments.length>=4?this.bounds=new i.Bounds(t,e,r,n):this.bounds=new i.Bounds(0,1,1,0),this.depth=o||0}return t.prototype.destroy=function(){this.children=null,this.bounds=null,this.nodes&&(this.nodes.destroy(),this.nodes=null)},t.prototype.add=function(t,e){return t.isInside(this.bounds)?this.doAdd(t):(this.cover(t),this.add(t,e))},t.prototype.addAll=function(t,e){var r=this;e=e||[];var n=Number.MAX_VALUE,o=Number.MAX_VALUE,s=-Number.MAX_VALUE,a=-Number.MAX_VALUE;t.forEach(function(t){t.x<n&&(n=t.x),t.right>s&&(s=t.right),t.bottom<o&&(o=t.bottom),t.y>a&&(a=t.y)}),this.cover(new i.Bounds(n,s,a,o)),t.forEach(function(t,e){return r.doAdd(t)})},t.prototype.cover=function(t){var e=this;if(!t.isInside(this.bounds)){this.bounds.encapsulate(t),this.bounds.x-=1,this.bounds.y+=1,this.bounds.width+=2,this.bounds.height+=4;var r=this.gatherChildren([]);this.nodes&&(this.nodes.destroy(),this.nodes=null),r.forEach(function(t,r){return e.doAdd(t)})}},t.prototype.doAdd=function(t){return this.nodes?t.isInside(this.nodes.TL.bounds)?this.nodes.TL.doAdd(t):t.isInside(this.nodes.TR.bounds)?this.nodes.TR.doAdd(t):t.isInside(this.nodes.BL.bounds)?this.nodes.BL.doAdd(t):t.isInside(this.nodes.BR.bounds)?this.nodes.BR.doAdd(t):(this.children.push(t),!0):t.isInside(this.bounds)?(this.children.push(t),this.children.length>5&&this.depth<10&&this.split(),!0):(isNaN(t.width+t.height+t.x+t.y)?console.error("Child did not fit into bounds because a dimension is NaN",t):0===t.area&&console.error("Child did not fit into bounds because the area is zero",t),!0)},t.prototype.gatherChildren=function(t){return t=t.concat(this.children),this.nodes&&(this.nodes.TL.gatherChildren(t),this.nodes.TR.gatherChildren(t),this.nodes.BL.gatherChildren(t),this.nodes.BR.gatherChildren(t)),t},t.prototype.gatherProps=function(t){var e=this;return this.children.forEach(function(r,n){t.push(e.childrenProps[n])}),this.nodes&&(this.nodes.TL.gatherProps(t),this.nodes.TR.gatherProps(t),this.nodes.BL.gatherProps(t),this.nodes.BR.gatherProps(t)),t},t.prototype.query=function(t,e){return t instanceof i.Bounds?t.hitBounds(this.bounds)?this.queryBounds(t,[],e):[]:this.bounds.containsPoint(t)?this.queryPoint(t,[],e):[]},t.prototype.queryBounds=function(t,e,r){return this.children.forEach(function(r,n){r.hitBounds(t)&&e.push(r)}),r&&r(this),this.nodes&&(t.hitBounds(this.nodes.TL.bounds)&&this.nodes.TL.queryBounds(t,e,r),t.hitBounds(this.nodes.TR.bounds)&&this.nodes.TR.queryBounds(t,e,r),t.hitBounds(this.nodes.BL.bounds)&&this.nodes.BL.queryBounds(t,e,r),t.hitBounds(this.nodes.BR.bounds)&&this.nodes.BR.queryBounds(t,e,r)),e},t.prototype.queryPoint=function(t,e,r){return this.children.forEach(function(r,n){r.containsPoint(t)&&e.push(r)}),r&&r(this),this.nodes&&(this.nodes.TL.bounds.containsPoint(t)&&this.nodes.TL.queryPoint(t,e,r),this.nodes.TR.bounds.containsPoint(t)&&this.nodes.TR.queryPoint(t,e,r),this.nodes.BL.bounds.containsPoint(t)&&this.nodes.BL.queryPoint(t,e,r),this.nodes.BR.bounds.containsPoint(t)&&this.nodes.BR.queryPoint(t,e,r)),e},t.prototype.split=function(){var t=this.gatherChildren([]);for(this.nodes=new s(this.bounds,this.depth+1),this.children=[],this.childrenProps=[];t.length>0;)this.doAdd(t.pop())},t.prototype.visit=function(t){var e=Boolean(t(this));this.nodes&&!e&&(this.nodes.TL.visit(t),this.nodes.TR.visit(t),this.nodes.BL.visit(t),this.nodes.BR.visit(t))},t})(); e.Node = a; let u = (function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return o(e,t),e})(a); e.QuadTree = u;
}, function(t, e, r) {
'use strict'; let n = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let o = r(21), 
i = r(7),
 s = r(6), 
a = (function(t){function e(e){var r=t.call(this,e)||this;return r.depth=0,r.lineWidth=1,r.encapsulatePoints(r.getTriangleStrip()),r.cachesQuadSegments=e.cacheSegments,r.depth=e.depth||0,r.lineWidth=e.lineWidth||1,r.startColor=e.startColor,r.endColor=e.endColor,r.marchingAnts=e.marchingAnts,r}return n(e,t),e.prototype.clone=function(){var t=new e({cacheSegments:this.cachesSegments,controlPoints:this.controlPoints,end:this.end,endColor:this.endColor,lineWidth:this.lineWidth,resolution:this.resolution,start:this.start,startColor:this.startColor,type:this.type});return t.d=this.d,t},e.prototype.distanceTo=function(e){return Math.max(0,t.prototype.distanceTo.call(this,e)-this.lineWidth/2)},e.prototype.getTriangleStrip=function(){if(this.cachesSegments&&this.cachedQuadSegments)return this.cachedQuadSegments;var t=[],e=[],r=this.getLineStrip(),n=this.lineWidth/2,o=new i.Line(s.Point.zero(),s.Point.zero()),a=s.Point.zero();if(r.length<2)return[];for(var u=0;u<r.length-1;u++){if(o.setPoints(r[u],r[u+1]),0===e.length)e.push(o.perpendicular);else{var c={x:e[u].x+o.perpendicular.x,y:e[u].y+o.perpendicular.y},f=Math.sqrt(c.x*c.x+c.y*c.y);c.x=c.x/f,c.y=c.y/f,e[u]=c}e.push(o.perpendicular)}for(var u=0;u<r.length-1;u++){var h=r[u],l=r[u+1];t.push(s.Point.add(s.Point.scale(e[u+1],-n,a),l)),t.push(s.Point.add(s.Point.scale(e[u+1],n,a),l)),t.push(s.Point.add(s.Point.scale(e[u],-n,a),h)),t.push(s.Point.add(s.Point.scale(e[u],n,a),h))}return t},e.prototype.setPoints=function(e,r,n){t.prototype.setPoints.call(this,e,r,n),this.cachedQuadSegments=[]},e})(o.CurvedLine); e.CurvedLineShape = a;
}, function(t, e, r) {
'use strict'; function n(t, e) {
let r,
 n = t.getLineStrip(),
 o = m.Point.getClosestIndex(e, n), 
i = Number.MAX_VALUE; return o > 0 && (r = new y.Line(n[o], n[o - 1]), i = r.distanceTo(e)), o < n.length - 1 && (r = new y.Line(n[o], n[o + 1]), i = Math.min(i, r.distanceTo(e))), i;
} function o(t, e) {
let r,
 n = t.getLineStrip(), 
o = m.Point.getClosestIndex(e, n), 
i = Number.MAX_VALUE; return o > 0 && (r = new y.Line(n[o], n[o - 1]), i = r.distanceTo(e)), o < n.length - 1 && (r = new y.Line(n[o], n[o + 1]), i = Math.min(i, r.distanceTo(e))), i;
} function i(t, e) {
return new y.Line(t.start, t.end).distanceTo(e);
} function s(t) {
if (t.cachesSegments && t.cachedSegments) return t.cachedSegments; for (var e = [], r = 1 / t.resolution, n = t.start, o = t.end, i = t.controlPoints[0], s = 0, a = t.resolution; s <= a; ++s)e.push(d.bezier2(r * s, n, o, i)); return t.cachesSegments && (t.cachedSegments = e), e;
} function a(t) {
if (t.cachesSegments && t.cachedSegments) return t.cachedSegments; for (var e = [], r = 1 / t.resolution, n = t.start, o = t.end, i = t.controlPoints[0], s = t.controlPoints[1], a = 0, u = t.resolution; a <= u; ++a)e.push(d.bezier3(r * a, n, o, i, s)); return t.cachesSegments && (t.cachedSegments = e), e;
} function u(t) {
if (t.cachesSegments && t.cachedSegments) return t.cachedSegments; g('CW'); let e = new y.Line(t.start, t.end), 
r = m.Point.getDistance(t.start, t.controlPoints[0]),
 n = t.controlPoints[1]; if (!n) {
let o = m.Point.getMidpoint(t.start, t.end), 
i = m.Point.getDistance(o, t.start); r < i && (r = m.Point.getDistance(o, t.start)); let s = e.perpendicular, 
a = Math.sqrt(r * r - i * i); n = {x:s.x * a + o.x, y:s.y * a + o.y}, t.controlPoints[1] = n;
}g(' center of circle is %o  %o', n.x, n.y); let u = m.Point.getDirection(n, t.start),
 c = Math.atan2(u.y, u.x), 
f = m.Point.getDirection(n, t.end),
 h = Math.atan2(f.y, f.x); c < h && (c += 2 * Math.PI); let l = (c - h) / t.resolution; g('theta1 is %o, theta2 is %o', c, h); for (var d = [], p = 0, b = t.resolution + 1; p < b; ++p)d.push({x:Math.cos(c - l * p) * r + n.x, y:Math.sin(c - l * p) * r + n.y}); return t.cachesSegments && (t.cachedSegments = d), g('Generated Circular Segments: %o dTheta: %o radius: %o', d, l, r), d;
} function c(t) {
if (t.cachesSegments && t.cachedSegments) return t.cachedSegments; let e = new y.Line(t.start, t.end), 
r = m.Point.getDistance(t.start, t.controlPoints[0]),
 n = t.controlPoints[1]; if (!n) {
let o = m.Point.getMidpoint(t.start, t.end),
 i = m.Point.getDistance(o, t.start); r < i && (r = m.Point.getDistance(o, t.start)); let s = e.perpendicular, 
a = Math.sqrt(r * r - i * i); n = {x:-s.x * a + o.x, y:-s.y * a + o.y}, t.controlPoints[1] = n
;} let u = m.Point.getDirection(n, t.start),
 c = Math.atan2(u.y, u.x),
 f = m.Point.getDirection(n, t.end),
 h = Math.atan2(f.y, f.x); h < c && (h += 2 * Math.PI); for (var l = (h - c) / t.resolution, d = [], p = 0, g = t.resolution + 1; p < g; ++p)d.push({x:Math.cos(c + l * p) * r + n.x, y:Math.sin(c + l * p) * r + n.y}); return t.cachedSegments && (t.cachedSegments = d), d;
} function f(t) {
return [t.start, t.end]
;} let h = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); var l,
 d = r(12),
 p = r(2),
 y = r(7),
 m = r(6),
 g = r(4)('bezier'); !(function(t){t[t.Bezier=0]="Bezier",t[t.CircularCCW=1]="CircularCCW",t[t.CircularCW=2]="CircularCW",t[t.Straight=3]="Straight"})(l = e.CurveType || (e.CurveType = {})); let b = (_ = {}, _[l.Bezier] = [null, s, a], _[l.CircularCW] = [null, u, u], _[l.CircularCCW] = [null, c, c], _[l.Straight] = [f], _),
 v = (w = {}, w[l.Bezier] = n, w[l.CircularCW] = o, w[l.CircularCCW] = o, w[l.Straight] = i, w), 
x = (function(t){function e(e){var r=this,n=Number.MAX_VALUE,o=-Number.MAX_VALUE,i=Number.MAX_VALUE,s=-Number.MAX_VALUE;return r=t.call(this,n,o,s,i)||this,r.cachesSegments=e.cacheSegments||!1,r.type=e.type,r.resolution=e.resolution||20,r.setPoints(e.start,e.end,e.controlPoints),r.distanceMethod=v[e.type],r}return h(e,t),Object.defineProperty(e.prototype,"values",{get:function(){return{controlPoints:this.controlPoints,end:this.end,start:this.start}},enumerable:!0,configurable:!0}),e.prototype.distanceTo=function(t){return this.distanceMethod(this,t)},e.getClosest=function(t,e){var r,n=Number.MAX_VALUE,o=0;return t.forEach(function(t){(o=t.distanceTo(e))<n&&(r=t,n=o)}),r},e.prototype.getLineStrip=function(){return this.segmentMethod(this)},e.prototype.setPoints=function(t,e,r){this.start=t,this.end=e,0===r.length&&g("start: %o, end:%o",t,e);var n=b[this.type];if(r){this.controlPoints=r;var o=r.length;if(o>n.length&&(o=n.length-1),this.segmentMethod=n[o],!this.segmentMethod)throw new Error("An Invalid number of control points was provided to a curved line. You must have at LEAST 1 control point. Or 0 for a straight line");this.type===l.Bezier?this.encapsulatePoints(r):this.type!==l.CircularCCW&&this.type!==l.CircularCW||this.encapsulatePoints(this.getLineStrip())}this.encapsulatePoint(t),this.encapsulatePoint(e),this.cachedSegments=null},e})(p.Bounds); e.CurvedLine = x; let _, w
;}, function(t, e, r) {
'use strict'; let n = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let o = r(2), 
i = 0,
 s = (function(t){function e(e){var r=t.call(this,0,0,0,0)||this;return r._id=++i,r._radius=0,r._centerX=0,r._centerY=0,r._centerX=e.centerX,r._centerY=e.centerY,r._radius=e.radius,r.updateBounds(),r}return n(e,t),Object.defineProperty(e.prototype,"values",{get:function(){return{radius:this._radius,x:this._centerX,y:this._centerY}},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"radius",{get:function(){return this._radius},set:function(t){this._radius=t,this.updateBounds()},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"centerX",{get:function(){return this._centerX},set:function(t){this._centerX=t,this.updateBounds()},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"centerY",{get:function(){return this._centerY},set:function(t){this._centerY=t,this.updateBounds()},enumerable:!0,configurable:!0}),e.prototype.boundsInside=function(t){var e=this._radius*this._radius,r=t.x-this._centerX,n=t.y-this._centerY,o=n*n,i=r*r;return!(i+o>e)&&(r=t.right-this._centerX,!((i=r*r)+o>e)&&(n=t.bottom-this._centerY,o=n*n,!(i+o>e)&&(r=t.x-this._centerX,(i=r*r)+o<e)))},e.prototype.distanceTo=function(t,e){var r=this._centerX-t.x,n=this._centerY-t.y;return e?r*r+n*n:Math.sqrt(r*r+n*n)},e.getClosest=function(t,e){var r,n=Number.MAX_VALUE,o=0;return t.forEach(function(t){(o=t.distanceTo(e,!0))<n&&(r=t,n=o)}),r},e.prototype.hitCircle=function(t){var e=t._radius+this._radius;return e*=e,this.distanceTo({x:t._centerX,y:t._centerY},!0)<e},e.prototype.hitPoint=function(t){var e=this._radius*this._radius,r=t.x-this._centerX,n=t.y-this._centerY;return r*r+n*n<e},e.prototype.position=function(t,e,r){this._centerX=t,this._centerY=e,this._radius=r,this.updateBounds()},e.prototype.pointInside=function(t){var e=this._radius*this._radius,r=t.x-this._centerX,n=t.y-this._centerY;return r*r+n*n<e},e.prototype.updateBounds=function(){var t=this._radius;this.x=this._centerX-t,this.y=this._centerY-t,this.height=2*t,this.width=2*t},e.prototype.toString=function(){return"[Circle {x: "+this._centerX+", y: "+this._centerY+", r: "+this._radius+"}]"},e})(o.Bounds); e.Circle = s;
}, function(t, e, r) {
'use strict'; let n = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let o = r(7),
 i = (function(t){function e(e){var r=t.call(this,e.p1,e.p2)||this;return r.depth=e.depth||0,r.endColor=e.endColor,r.startColor=e.startColor,r.thickness=e.thickness||1,r}return n(e,t),e.prototype.clone=function(t){return Object.assign(new e(this),t)},e})(o.Line); e.LineShape = i;
}, function(t, e, r) {
'use strict'; function n(t) {
return t.id;
} function o(t, e) {
let r = e[0].buffer.length, 
n = e[0]; return e.some(function(t) {
return t.buffer.length < r && (n = t, !0);
}), n.buffer.push(t), [n]
;} function i() {
for (let t = [], e = 0; e < arguments.length; e++)t[e] = arguments[e];
} function s(t, e, r) {
return [e];
} let a = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let u = r(25), 
c = '__mb__', 
f = 0,
 h = (function(t){function e(e,r){var a=t.call(this)||this;return a.numBuffers=0,a.selectionUID=c+ ++f,a.addMethod=o,a.idMethod=n,a.initMethod=i,a.removeMethod=s,a.updateMethod=s,a.numBuffers=e,r&&(a.addMethod=r.add||a.addMethod,a.idMethod=r.id||a.idMethod,a.initMethod=r.init||a.initMethod,a.removeMethod=r.remove||a.removeMethod,a.updateMethod=r.update||a.updateMethod),a}return a(e,t),e.prototype.addShape=function(t){var e=this.addMethod(t,this.store.allBuffers);this.store.idToItem.set(this.idMethod(t),t),this.store.itemToBuffer.set(t,e[0]),this.flagBuffersDirty(e)},e.prototype.destroy=function(){this.store&&(this.store.selection.clearSelection(this.selectionUID),delete this.store)},e.prototype.containsId=function(t){return Boolean(this.store.idToItem.get(t))},e.prototype.containsShape=function(t){return Boolean(this.store.itemToBuffer.get(t))},e.prototype.flagBuffersDirty=function(t){t?t.forEach(function(t){return t.isDirty=!0}):this.store.allBuffers.forEach(function(t){return t.isDirty=!0})},e.prototype.generate=function(e){for(var r=[],n=1;n<arguments.length;n++)r[n-1]=arguments[n];this.getStorage(e),t.prototype.generate.apply(this,arguments),this.processDirtyBuffers()},e.prototype.getBuffer=function(){return console.warn("A multishape buffer should have getBuffers called instead"),[]},e.prototype.getBuffers=function(){return this.store?this.store.allBuffers.map(function(t){return t.buffer}):[]},e.prototype.getNumBuffers=function(){return this.store.allBuffers.length},e.prototype.getShapeById=function(t){return this.store.idToItem.get(t)},e.prototype.processDirtyBuffers=function(){this.store.allBuffers.forEach(function(t){t.isDirty&&(t.isDirty=!1,t.buffer=[].concat(t.buffer))})},e.prototype.getStorage=function(t){var e=(t.getSelection(this.selectionUID)||[])[0];if(!e){e={allBuffers:[],idToItem:new Map,itemToBuffer:new Map,selection:t};for(var r=0;r<this.numBuffers;++r)e.allBuffers.push({buffer:[],isDirty:!1});this.initMethod(e.allBuffers),t.select(this.selectionUID,e)}return this.store=e},e.prototype.removeShape=function(t){var e=this.store.itemToBuffer.get(t),r=this.removeMethod(t,e,this.store.allBuffers);e.buffer.splice(e.buffer.indexOf(t),1),this.store.idToItem.delete(this.idMethod(t)),this.flagBuffersDirty(r)},e.prototype.updateShape=function(t){var e=this.updateMethod(t,this.store.itemToBuffer.get(t),this.store.allBuffers);this.flagBuffersDirty(e)},e})(u.ShapeBufferCache); e.MultiShapeBufferCache = h;
}, function(t, e, r) {
'use strict'; Object.defineProperty(e, '__esModule', {value:!0}); let n = (function(){function t(){this.buffer=[],this.bustCache=!0}return t.prototype.generate=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this.bustCache&&(this.buildCache.apply(this,t),this.bustCache=!1)},t.prototype.buildCache=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e]},t.prototype.getBuffer=function(){return this.buffer},t})(); e.ShapeBufferCache = n;
}, function(t, e, r) {
'use strict'; function n(t) {
for (let r in t)e.hasOwnProperty(r) || (e[r] = t[r]);
}Object.defineProperty(e, '__esModule', {value:!0}), n(r(27)), n(r(34)), n(r(45)), n(r(53)), n(r(54));
}, function(t, e, r) {
'use strict'; function n(t) {
return  Boolean(t.options);
} function o(t) {
return !t.options
;} function i(t) {
return t ? t > 0 ? 1:t < 0 ? -1:0:0;
} let s = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let a, 
u = r(5), 
c = r(28),
 f = r(0),
 h = r(13), 
l = r(8),
 d = r(2),
 p = r(9),
 y = r(18), 
m = r(19),
 g = r(10),
 b = r(4)('webgl-surface:GPU'),
 v = r(4)('webgl-surface:Camera'),
 x = r(4)('webgl-surface:Labels'), 
_ = r(4)('webgl-surface:Colors'); !(function(t){t[t.INITIALIZE=0]="INITIALIZE",t[t.BUFFERCHANGES=1]="BUFFERCHANGES",t[t.CAMERA=2]="CAMERA",t[t.LABELS=3]="LABELS",t[t.COLORS=4]="COLORS"})(a = e.BaseApplyPropsMethods || (e.BaseApplyPropsMethods = {})); let w; !(function(t){t[t.CONTEXT=0]="CONTEXT",t[t.INERTIA=1]="INERTIA",t[t.POSITION=2]="POSITION",t[t.ZOOM=3]="ZOOM"})(w = e.BaseAnimatedMethods || (e.BaseAnimatedMethods = {})); let C = (new f.Color()).setRGB(38 / 255, 50 / 255, 78 / 255), 
I = new f.Vector3(),
 M = (function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.atlasManager=new h.AtlasManager(2048,2048),e.atlasNames={colors:"colors",labels:"labels"},e.animatedMethodList=[],e.animatedMethodBreak=!1,e.camera=new f.OrthographicCamera(0,0,0,0,0,0),e.colorsCurrentLoadedId=0,e.colorsLoadId=0,e.disableMouseInteraction=0,e.distance=0,e.sizeCamera=null,e.currentZoom=1,e.destinationX=0,e.destinationY=0,e.destinationZoom=1,e.isPanning=!1,e.lastMousePosition={x:0,y:0},e.propsMethodList=[],e.inertia=null,e.inertiaBuild=1.5,e.inertiaDecay=.9,e.inertiaMax=100,e.quadTree=null,e.shiftIsDown=!1,e.stop=!1,e.currentX=0,e.currentY=0,e.targetZoom=1,e.previousZoomToFit=0,e.zoomTargetX=0,e.zoomTargetY=0,e.animating=!1,e.labels=[],e.labelsReady=!1,e.labelsCurrentLoadedId=0,e.labelsLoadId=0,e.colors=[],e.colorsReady=!1,e.currentHoverItems=[],e.dragOver=!0,e.animate=function(){if(!e.stop){p.FrameInfo.lastFrameTime=Date.now(),p.FrameInfo.framesPlayed.set(e,(p.FrameInfo.framesPlayed.get(e)||0)+1),requestAnimationFrame(function(){return e.animate()});var t,r=!1;e.animatedMethodList.some(function(i){return n(i)?i.options.labelsReady&&i.options.colorsReady?e.labelsReady&&e.colorsReady&&(t=i.method()):i.options.labelsReady?e.labelsReady&&(t=i.method()):i.options.colorsReady&&e.colorsReady&&(t=i.method()):o(i)&&(t=i()),r||(r=t.doDraw),t.stop&&(e.stop=!0),!!t.break})||(e.updateCameraUniforms(),e.disableMouseInteraction>0&&e.disableMouseInteraction--,(r||e.forceDraw)&&(e.forceDraw=!1,e.emitViewport(),e.draw()))}},e.applyProps=function(t){b("Applying props");var r;e.propsMethodList.some(function(e){return r=e(t),!!r.break}),v("current cam",e.currentX,e.currentY,e.destinationX,e.destinationY),v("Zoom Target: [%o, %o]",e.zoomTargetX,e.zoomTargetY),v("Last Mouse: [%o, %o]",e.lastMousePosition.x,e.lastMousePosition.y)},e.init=function(t,r,n){if(t&&!e.scene&&(e.renderEl=t,0!==r&&0!==n)){b("Initializing GPU objects el: %o width: %o height: %o",t,r,n),e.ctx={height:n,heightHalf:n/2,width:r,widthHalf:r/2},e.initCamera(),window.scene=e.scene=new f.Scene,e.initBuffers(),e.renderer=new f.WebGLRenderer({alpha:e.props.backgroundColor&&e.props.backgroundColor.opacity<1,antialias:!0,preserveDrawingBuffer:!0}),e.renderer.setPixelRatio(window.devicePixelRatio),e.renderer.setSize(r,n),e.props.backgroundColor?e.renderer.setClearColor(new f.Color(e.props.backgroundColor.r,e.props.backgroundColor.g,e.props.backgroundColor.b),e.props.backgroundColor.opacity):e.renderer.setClearColor(C),e.renderer.setFaceCulling(f.CullFaceNone);t.appendChild(e.renderer.domElement),e.gl=e.renderer.domElement.getContext("webgl"),e.makeDraggable(document.getElementById("div"),e)}},e.initCamera=function(){b("Initializing Camera");var t=e.ctx.height,r=t,n=e.ctx.width,o=n/t,i={aspectRatio:o,bottom:-r/2,far:1e7,left:-o*r/2,near:-100,right:o*r/2,top:r/2,viewSize:r};e.camera=new f.OrthographicCamera(i.left,i.right,i.top,i.bottom,i.near,i.far),e.sizeCamera=new f.OrthographicCamera(i.left,i.right,i.top,i.bottom,i.near,i.far),e.camera.position.z=300,e.sizeCamera.position.set(0,0,300)},e.resizeContext=function(){var t=e.props.width,r=e.props.height;if(!e.renderer)return!1;var n=e.renderer.getSize();if(n.width===t&&n.height===r)return!1;b("RENDERER RESIZE"),e.ctx={height:r,heightHalf:r/2,width:t,widthHalf:t/2};var o=e.camera.zoom,i=e.camera.position.clone();if(e.initCamera(),e.camera.zoom=o,e.camera.position.set(i.x,i.y,i.z),e.camera.updateProjectionMatrix(),e.renderer.setPixelRatio(window.devicePixelRatio),e.renderer.setSize(t,r),e.renderer.setFaceCulling(f.CullFaceNone),e.props.backgroundColor){var s=e.props.backgroundColor;e.renderer.setClearColor(new f.Color(s.r,s.g,s.b),s.opacity<1?s.opacity:void 0)}else e.renderer.setClearColor(C);return!0},e.emitViewport=function(){var t=e.screenToWorld(0,0),r=e.screenToWorld(e.ctx.width,e.ctx.height);e.camera.updateMatrixWorld(!0);var n=e.quadTree.query(new d.Bounds(t.x,r.x,t.y,r.y));e.onViewport(n,e.projection,e.ctx)},e.handleMouseDown=function(t){e.disableMouseInteraction>0||(e.isPanning=!0,e.distance=0,e.onMouseDown())},e.handleMouseOut=function(t){e.disableMouseInteraction>0||(e.isPanning=!1,e.distance=0,e.onMouseOut())},e.handleMouseUp=function(t){if(!(e.disableMouseInteraction>0)){e.isPanning=!1;var r=y.eventElementPosition(t),n=e.screenToWorld(r.x,r.y);if(e.distance<5){for(var o=[],i=e.quadTree.query(n),s=0,a=i;s<a.length;s++){var u=a[s];u.pointInside(n)&&o.push(u)}o.length?e.onMouseUp(t,o,r,n,e.projection):e.onMouseUp(t,null,r,n,e.projection)}}},e.handleMouseMove=function(t){if(!(e.disableMouseInteraction>0)){var r=e.props.onMouse,n=e.props.zoom,o=y.eventElementPosition(t),s=e.screenToWorld(o.x,o.y);if(e.distance++,e.isPanning){b("down and moving ~~");var a=(o.x-e.lastMousePosition.x)/e.targetZoom,u=-(o.y-e.lastMousePosition.y)/e.targetZoom,c=e.willPan(a,u);a=c.x,u=c.y,e.destinationX-=a,e.destinationY-=u,e.inertia=e.inertia||{x:0,y:0},i(a)!==i(e.inertia.x)&&(e.inertia.x=0),i(u)!==i(e.inertia.y)&&(e.inertia.y=0),e.inertia.x=a*e.inertiaBuild,e.inertia.y=u*e.inertiaBuild;var f=e.inertiaMax/n,h=Math.sqrt(e.inertia.x*e.inertia.x+e.inertia.y*e.inertia.y);h>f&&(e.inertia.x=e.inertia.x/h*f,e.inertia.y=e.inertia.y/h*f)}if(e.quadTree&&!e.isPanning){for(var l=[],d=e.quadTree.query(s),p=[],m=0,g=d;m<g.length;m++){var v=g[m];v.pointInside(s)&&(p.push(v),l.push(v))}e.onMouseHover(p,o,s,e.projection);for(var x=[],_=0,w=e.currentHoverItems;_<w.length;_++){var v=w[_];l.indexOf(v)<0&&x.push(v)}e.onMouseLeave(x,o,s,e.projection),e.currentHoverItems=l}r&&e.onMouse(o,s,e.isPanning),e.lastMousePosition=o}},e.applyRef=function(t){e.init(t,e.props.width,e.props.height),e.applyProps(e.props)},e}return s(e,t),e.prototype.animatedMethods=function(t,e){return e},e.prototype.animatedMethodsBase=function(){var t=this;return e={},e[w.CONTEXT]=function(){var e={break:!1,doDraw:!1};return t.resizeContext()&&(e.doDraw=!0),t.quadTree||(e.break=!0),e},e[w.INERTIA]=function(){return t.isPanning||t.inertia&&(t.inertia.x*=t.inertiaDecay,t.inertia.y*=t.inertiaDecay,t.inertia.x*t.inertia.x+t.inertia.y*t.inertia.y<1&&(t.inertia=null)),{doDraw:!1}},e[w.POSITION]=function(){var e={doDraw:t.currentX!==t.destinationX||t.currentY!==t.destinationY};return t.currentX=t.destinationX,t.currentY=t.destinationY,t.positionCamera(t.currentX,t.currentY),e},e[w.ZOOM]=function(){var e={doDraw:!1},r=t.destinationZoom,n=Math.abs(r-t.targetZoom);n>.001?(t.targetZoom=t.targetZoom+(r-t.targetZoom)/3,e.doDraw=!0):0!==n&&(t.targetZoom=r,e.doDraw=!0);var o=t.zoomTargetX,i=t.zoomTargetY,s=t.worldToScreen(o,i);t.zoomCamera(t.targetZoom);var a=t.worldToScreen(o,i),u=-(a.x-s.x)/t.targetZoom,c=(a.y-s.y)/t.targetZoom;return t.currentX-=u,t.currentY-=c,t.destinationX-=u,t.destinationY-=c,t.positionCamera(t.currentX,t.currentY),e},e;var e},e.prototype.applyColorBufferChanges=function(t){},e.prototype.applyLabelBufferChanges=function(t){},e.prototype.applyPropsMethods=function(t,e){return e},e.prototype.applyPropsMethodsBase=function(){var t=this;return e={},e[a.INITIALIZE]=function(e){var r=e.backgroundColor,n=e.height,o=e.width;if(t.init(t.renderEl,o,n),!t.renderEl||0===o||0===n)return{break:!0};if(t.camera){var i=t.screenToWorld(t.lastMousePosition.x,t.lastMousePosition.y);t.zoomTargetX=i.x,t.zoomTargetY=i.y}if(t.renderer&&r){var s=t.props.backgroundColor||{b:C.b,g:C.g,opacity:1,r:C.r};s.r===r.r&&s.g===r.g&&s.b===r.b&&s.opacity===r.opacity||t.renderer.setClearColor(new f.Color(r.r,r.g,r.b),r.opacity<1?r.opacity:void 0)}return b("props",e),{}},e[a.LABELS]=function(e){var r={};if(e.labels&&e.labels!==t.labels){x("Labels are being comitted to an Atlas %o",e.labels),t.labelsReady=!1,t.labelsLoadId++,t.labels=e.labels,t.atlasManager.getAtlasTexture(t.atlasNames.labels)&&t.atlasManager.destroyAtlas(t.atlasNames.labels);var n=e.labels.map(function(t){return new l.AtlasTexture(null,t)});x("Creating the atlas for labels based on these textures %o",n),t.atlasManager.createAtlas(t.atlasNames.labels,n).then(function(){x("Labels rasterized within the atlas: %o",t.atlasManager.getAtlasTexture(t.atlasNames.labels)),t.forceDraw=!0,t.labelsCurrentLoadedId++,t.labelsCurrentLoadedId===t.labelsLoadId&&(t.labelsReady=!0),t.applyProps(t.props)})}return r},e[a.COLORS]=function(e){var r={};return e.colors&&e.colors!==t.colors&&(_("Colors are being comitted to an Atlas %o",e.colors),t.colorsReady=!1,t.colorsLoadId++,t.colors=e.colors,t.atlasManager.getAtlasTexture(t.atlasNames.colors)&&t.atlasManager.destroyAtlas(t.atlasNames.colors),t.atlasManager.createAtlas(t.atlasNames.colors,null,t.colors).then(function(){_("Colors rasterized within the atlas: %o",t.atlasManager.getAtlasTexture(t.atlasNames.colors)),t.forceDraw=!0,t.colorsCurrentLoadedId++,t.colorsCurrentLoadedId===t.colorsLoadId&&(t.colorsReady=!0),t.applyProps(t.props)})),r},e[a.BUFFERCHANGES]=function(e){return t.applyBufferChanges(e),t.labelsReady&&t.colorsReady&&(x("labels changed %o",e),t.applyLabelBufferChanges(e)),t.colorsReady&&t.applyColorBufferChanges(e),{}},e[a.CAMERA]=function(e){if(t.destinationZoom=e.zoom,e.viewport&&e.viewport!==t.appliedViewport&&t.quadTree){var r=e.viewport.mid;t.currentX=t.destinationX=r.x,t.currentY=t.destinationY=r.y;var n=e.width/e.viewport.width,o=e.height/e.viewport.height,i=Math.min(n,o);t.destinationZoom=i,t.targetZoom=1.001*t.destinationZoom,t.zoomTargetX=r.x,t.zoomTargetY=r.y,t.lastMousePosition.x=e.width/2,t.lastMousePosition.y=e.height/2,t.positionCamera(t.currentX,t.currentY),t.zoomCamera(t.targetZoom),t.updateCameraUniforms(),e.onZoomRequest&&(e.onZoomRequest(t.destinationZoom),v("Requesting zoom level",t.destinationZoom));t.disableMouseInteraction=10,t.appliedViewport=e.viewport,v("init cam",t.currentX,t.currentY)}return t.quadTree||(t.quadTree=new m.QuadTree(0,1,1,0)),{}},e;var e},e.prototype.applyBufferChanges=function(t){},e.prototype.componentDidMount=function(){this.animate()},e.prototype.componentWillMount=function(){this.projection={screenSizeToWorld:this.screenSizeToWorld.bind(this),screenToWorld:this.screenToWorld.bind(this),worldSizeToScreen:this.worldSizeToScreen.bind(this),worldToScreen:this.worldToScreen.bind(this)};var t=this.applyPropsMethodsBase();this.propsMethodList=this.applyPropsMethods(t,[t[a.INITIALIZE],t[a.LABELS],t[a.COLORS],t[a.BUFFERCHANGES],t[a.CAMERA]]);var e=this.animatedMethodsBase();this.animatedMethodList=this.animatedMethods(e,[e[w.CONTEXT],e[w.INERTIA],e[w.POSITION],e[w.ZOOM]])},e.prototype.componentWillReceiveProps=function(t){this.applyProps(t)},e.prototype.componentWillUnmount=function(){this.stop=!0,this.quadTree&&this.quadTree.destroy(),this.quadTree=null,this.camera=null,this.sizeCamera=null,this.ctx=null,this.renderEl=null,this.renderer=null,this.scene=null,this.atlasManager.destroyAtlas(this.atlasNames.colors),this.atlasManager.destroyAtlas(this.atlasNames.labels),p.FrameInfo.framesPlayed.delete(this)},e.prototype.draw=function(){if(this.renderer.render(this.scene,this.camera),this.props.onRender&&(this.colorsReady||0===this.colors.length)&&(this.labelsReady||0===this.labels.length)){var t=this.renderer.domElement.toDataURL();this.props.onRender(t)}},e.prototype.initBuffers=function(){},e.prototype.onMouse=function(t,e,r){},e.prototype.onMouseDown=function(){},e.prototype.onMouseOut=function(){},e.prototype.onMouseUp=function(t,e,r,n,o){},e.prototype.onMouseHover=function(t,e,r,n){},e.prototype.onMouseLeave=function(t,e,r,n){},e.prototype.onViewport=function(t,e,r){},e.prototype.makeDraggable=function(t,e){t.onmousedown=function(r){e.dragOver=!1,document.onmousemove=function(r){var n=y.eventElementPosition(r,t),o=n.x,i=n.y,s=(o-e.lastMousePosition.x)/e.targetZoom,a=(i-e.lastMousePosition.y)/e.targetZoom;e.destinationX-=s,e.destinationY+=a,e.lastMousePosition.x=o,e.lastMousePosition.y=i},document.onmouseup=function(){document.onmousemove=null,e.isPanning=!1,e.dragOver=!0},document.onmouseover=function(){!1===e.dragOver&&(e.isPanning=!0)},t.onmouseup=function(){e.dragOver=!0},t.onselectstart=function(){return!1}}},e.prototype.positionCamera=function(t,e){this.camera&&this.camera.position.set(t,e,this.camera.position.z)},e.prototype.screenToWorld=function(t,e,r){return I.set(t/this.ctx.width*2-1,-e/this.ctx.height*2+1,0),I.unproject(this.camera),r=r||{x:0,y:0},r.x=I.x,r.y=I.y,r},e.prototype.screenSizeToWorld=function(t,e,r){return r=r||new d.Bounds(0,0,0,0),r.width=t/(this.sizeCamera?this.sizeCamera.zoom:1),r.height=e/(this.sizeCamera?this.sizeCamera.zoom:1),r},e.prototype.worldToScreen=function(t,e,r){return I.set(t,e,0),I.project(this.camera),r=u.merge(r||{},{x:I.x*this.ctx.widthHalf+this.ctx.widthHalf,y:-I.y*this.ctx.heightHalf+this.ctx.heightHalf})},e.prototype.worldSizeToScreen=function(t,e,r){return r=r||new d.Bounds(0,0,0,0),r.width=t*this.sizeCamera.zoom,r.height=e*this.sizeCamera.zoom,r},e.prototype.zoomCamera=function(t){this.camera.zoom=t,this.sizeCamera.zoom=t,this.camera.updateProjectionMatrix(),this.sizeCamera.updateProjectionMatrix()},e.prototype.updateCameraUniforms=function(){},e.prototype.shouldComponentUpdate=function(t){return this.props.width!==t.width||this.props.height!==t.height},e.prototype.willPan=function(t,e){return new f.Vector3(t,e,0)},e.prototype.render=function(){var t=this,e=this.props,r=e.width,n=e.height;return g.WebGLStat.WEBGL_SUPPORTED?c.createElement("div",{id:"div",onMouseDown:this.handleMouseDown,onMouseOut:this.handleMouseOut,onMouseUp:this.handleMouseUp,onMouseLeave:this.handleMouseOut,onMouseMove:this.handleMouseMove,onDoubleClick:function(e){t.props.onDoubleClick&&t.props.onDoubleClick(e)},style:{position:"relative",width:r,height:n}},c.createElement("div",{ref:this.applyRef})):c.createElement("div",null,this.props.children||"Web GL not supported")},e})(c.Component); e.WebGLSurface = M;
}, function(t, e) {
t.exports = r
;}, function(t, e) {
t.exports = n
;}, function(t, e) {
function r() {
throw new Error('setTimeout has not been defined');
} function n() {
throw new Error('clearTimeout has not been defined')
;} function o(t) {
if (f === setTimeout) return setTimeout(t, 0); if ((f === r || !f) && setTimeout) return f = setTimeout, setTimeout(t, 0); try {
return f(t, 0);}
catch (e) {
try {
return f.call(null, t, 0)
;}catch (e) {
return f.call(this, t, 0);
}
}
} function i(t) {
if (h === clearTimeout) return clearTimeout(t); if ((h === n || !h) && clearTimeout) return h = clearTimeout, clearTimeout(t); try {
return h(t);
}catch (e) {
try {
return h.call(null, t);} 
catch(e) {
return h.call(this, t);
}
}
} function s() {
y && d && (y = !1, d.length ? p = d.concat(p):m = -1, p.length && a())
;} function a() {
if (!y) {
let t = o(s); y = !0; for (let e = p.length; e;) {
for (d = p, p = []; ++m < e;)d && d[m].run(); m = -1, e = p.length;
}d = null, y = !1, i(t)
;}
} function u(t, e) {
this.fun = t, this.array = e;
} function c() {} let f, h, 
l = t.exports = {}; !(function(){try{f="function"==typeof setTimeout?setTimeout:r}catch(t){f=r}try{h="function"==typeof clearTimeout?clearTimeout:n}catch(t){h=n}})(); var d,
 p = [], 
y = !1, 
m = -1; l.nextTick = function(t) {
let e = new Array(arguments.length - 1); if (arguments.length > 1) for(let r = 1; r < arguments.length; r++)e[r - 1] = arguments[r]; p.push(new u(t, e)), p.length!==1 || y || o(a);
}, u.prototype.run = function() {
this.fun.apply(null, this.array);
}, l.title = 'browser', l.browser = !0, l.env = {}, l.argv = [], l.version = '', l.versions = {}, l.on = c, l.addListener = c, l.once = c, l.off = c, l.removeListener = c, l.removeAllListeners = c, l.emit = c, l.prependListener = c, l.prependOnceListener = c, l.listeners = function(t) {
return [];
}, l.binding = function(t) {
throw new Error('process.binding is not supported');
}, l.cwd = function() {
return '/';
}, l.chdir = function(t) {
throw new Error('process.chdir is not supported')
;}, l.umask = function() {
return 0;
}
;}, function(t, e, r) {
function n(t) {
let r,
 n = 0; for (r in t)n = (n << 5) - n + t.charCodeAt(r), n |= 0; return e.colors[Math.abs(n) % e.colors.length];
} function o(t) {
function r() {
if (r.enabled) {
let t = r, 
n = Number(new Date)(),
 o = n - (c || n); t.diff = o, t.prev = c, t.curr = n, c = n; for (var i = new Array(arguments.length), s = 0; s < i.length; s++)i[s] = arguments[s]; i[0] = e.coerce(i[0]), 'string'!==typeof i[0] && i.unshift('%O'); let a = 0; i[0] = i[0].replace(/%([a-zA-Z%])/g, function(r, n) {
if ('%%' === r) return r; a++; let o = e.formatters[n]; if ('function'===typeof o) {
let s = i[a]; r = o.call(t, s), i.splice(a, 1), a--;
} return r
;}), e.formatArgs.call(t, i); (r.log || e.log || console.log.bind(console)).apply(t, i)
;}
} return r.namespace = t, r.enabled = e.enabled(t), r.useColors = e.useColors(), r.color = n(t), 'function' == typeof e.init && e.init(r), r
;} function i(t) {
e.save(t), e.names = [], e.skips = []; for (let r = ('string' == typeof t ? t:'').split(/[\s,]+/), n = r.length, o = 0; o < n; o++)r[o] && (t = r[o].replace(/\*/g, '.*?'), '-' === t[0] ? e.skips.push(new RegExp('^' + t.substr(1) + '$')):e.names.push(new RegExp('^' + t + '$')))
;} function s() {
e.enable('');
} function a(t) {
let r, n; for (r = 0, n = e.skips.length; r < n; r++) if(e.skips[r].test(t)) return!1; for (r = 0, n = e.names.length; r < n; r++) if(e.names[r].test(t))return !0; return !1;
} function u(t) {
return t instanceof Error ? t.stack || t.message:t;
}e = t.exports = o.debug = o.default = o, e.coerce = u, e.disable = s, e.enable = i, e.enabled = a, e.humanize = r(32), e.names = [], e.skips = [], e.formatters = {}; let c
;}, function(t, e) {
function r(t) {
if (t = String(t), !(t.length > 100)) {
let e = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t); if (e) {
let r = parseFloat(e[1]); switch ((e[2] || 'ms').toLowerCase()) {
case 'years':case 'year':case 'yrs':case 'yr':case 'y':return r * f; case 'days':case 'day':case 'd':return r * c; case 'hours':case 'hour':case 'hrs':case 'hr':case 'h':return r * u; case 'minutes':case 'minute':case 'mins':case 'min':case 'm':return r * a; case 'seconds':case 'second':case 'secs':case 'sec':case 's':return r * s; case 'milliseconds':case 'millisecond':case 'msecs':case 'msec':case 'ms':return r; default:return
;}
}
}
} function n(t) {
return t >= c ? Math.round(t / c) + 'd':t >= u ? Math.round(t / u) + 'h':t >= a ? Math.round(t / a) + 'm':t >= s ? Math.round(t / s) + 's':t + 'ms';
} function o(t) {
return i(t, c, 'day') || i(t, u, 'hour') || i(t, a, 'minute') || i(t, s, 'second') || t + ' ms'
;} function i(t, e, r) {
if (!(t < e)) return t < 1.5 * e ? Math.floor(t / e) + ' ' + r:Math.ceil(t / e) + ' ' + r + 's';
} var s = 1e3,
 a = 60 * s,
 u = 60 * a,
 c = 24 * u,
 f = 365.25 * c; t.exports = function(t, e) {
e = e || {}; let i = typeof t; if ('string' === i && t.length > 0) return r(t); if ('number' === i && !1 === isNaN(t)) return e.long ? o(t):n(t); throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(t))
;}
;}, function(t, e) {
t.exports = o
;}, function(t, e, r) {
'use strict'; function n(t) {
for (let r in t)e.hasOwnProperty(r) || (e[r] = t[r]);
}Object.defineProperty(e, '__esModule', {value:!0}), n(r(35)), n(r(36)), n(r(37)), n(r(3)), n(r(38)), n(r(39)), n(r(40)), n(r(41)), n(r(42)), n(r(43)), n(r(44))
;}, function(t, e, r) {
'use strict'; function n(t) {
return Array.isArray(t[0])
;} let o = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let i = r(5),
 s = r(0),
 a = r(1), 
u = r(3), 
c = (function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return o(e,t),e.prototype.init=function(t,e){this.bufferItems=a.BufferUtil.makeBufferItems(),this.bufferItems.attributes=[{defaults:[0,0,0],name:"position",size:a.AttributeSize.THREE},{defaults:[0],name:"startColorPick",size:a.AttributeSize.ONE},{defaults:[0],name:"endColorPick",size:a.AttributeSize.ONE},{defaults:[1],name:"normalDirection",size:a.AttributeSize.ONE},{defaults:[0,0,0,0],name:"endPoints",size:a.AttributeSize.FOUR},{defaults:[0],name:"halfLinewidth",size:a.AttributeSize.ONE},{defaults:[0,0,0,0],name:"marching",size:a.AttributeSize.FOUR},{defaults:[0],name:"controlPick",size:a.AttributeSize.ONE}];var r=e;this.bufferItems.geometry=a.BufferUtil.makeBuffer(6*r,this.bufferItems.attributes),this.bufferItems.system=new s.Mesh(this.bufferItems.geometry,t),this.bufferItems.system.frustumCulled=!1,this.bufferItems.system.drawMode=s.TriangleStripDrawMode},e.prototype.update=function(t,e,r){if(!t)return this.bufferItems.geometry.setDrawRange(0,0),!1;var o;o=n(t)?i.flatten(t):t,0===o.length&&(this.bufferItems.currentData=t);var s,u=[],c=new Map;if(o&&o.length>0&&e){var f=o[0].startColor,h=f.base,l=this.bufferItems.system.material,d=l.uniforms,p=e.getAtlasTexture(h.atlasReferenceID);d.colorAtlas.value=p,d.colorsPerRow.value=h.colorsPerRow,d.firstColor.value=[h.firstColor.x,h.firstColor.y],d.nextColor.value=[h.nextColor.x,h.nextColor.y],s=d.controlPoints,p.needsUpdate=!0}var y,m,g,b,v,x,_,w,C,I,M=1,P=15,A=!1;a.BufferUtil.beginUpdates();for(var B=this,S=0,O=o;S<O.length;S++){var T=O[S];if("break"===function(e){if(!e.marchingAnts)return console.error("Attempted to render a curved line shape with a marching ant buffer but provided no marching ant metrics. This curved line shape will be skipped",e),"continue";if(v=e.startColor.base.opacity,g=e.startColor.base,b=e.endColor.base,M=e.lineWidth/2,P=e.resolution,y=e.start,m=e.end,_=e.marchingAnts.gapLength,w=e.marchingAnts.speed,x=e.marchingAnts.strokeLength+e.marchingAnts.gapLength,C=e.controlPoints[r],void 0===(I=c.get(C))){var n=u.push(C.x,C.y);I=n-2,c.set(C,I)}return A=a.BufferUtil.updateBuffer(t,B.bufferItems,6,P,function(t,r,n,o,i,s,a,u,c,f,h,l,d,p,v,C,A){r[n]=(t+1)/P,r[++n]=P,r[++n]=e.depth,l[d]=M,i+=1,a+=1,v+=4,u[c]=1,f[h]=y.x,f[++h]=y.y,f[++h]=m.x,f[++h]=m.y,C[A]=I,r[++n]=(t+1)/P,r[++n]=P,r[++n]=e.depth,l[++d]=M,u[++c]=1,f[++h]=y.x,f[++h]=y.y,f[++h]=m.x,f[++h]=m.y,o[i]=g.colorIndex,s[a]=b.colorIndex,p[v]=0,p[++v]=w,p[++v]=_,p[++v]=x,C[++A]=I,r[++n]=(t+1)/P,r[++n]=P,r[++n]=e.depth,l[++d]=M,u[++c]=-1,f[++h]=y.x,f[++h]=y.y,f[++h]=m.x,f[++h]=m.y,o[++i]=g.colorIndex,s[++a]=b.colorIndex,p[++v]=0,p[++v]=w,p[++v]=_,p[++v]=x,C[++A]=I,r[++n]=t/P,r[++n]=P,r[++n]=e.depth,l[++d]=M,u[++c]=1,f[++h]=y.x,f[++h]=y.y,f[++h]=m.x,f[++h]=m.y,o[++i]=g.colorIndex,s[++a]=b.colorIndex,p[++v]=0,p[++v]=w,p[++v]=_,p[++v]=x,C[++A]=I,r[++n]=t/P,r[++n]=P,r[++n]=e.depth,l[++d]=M,u[++c]=-1,f[++h]=y.x,f[++h]=y.y,f[++h]=m.x,f[++h]=m.y,o[++i]=g.colorIndex,s[++a]=b.colorIndex,p[++v]=0,p[++v]=w,p[++v]=_,p[++v]=x,C[++A]=I,r[++n]=t/P,r[++n]=P,r[++n]=e.depth,l[++d]=M,i+=1,a+=1,v+=4,u[++c]=-1,f[++h]=y.x,f[++h]=y.y,f[++h]=m.x,f[++h]=m.y,C[++A]=I}),A?void 0:"break"}(T))break}var E=a.BufferUtil.endUpdates();return s&&(s.value=u),A?this.bufferItems.geometry.setDrawRange(0,6*E):0===t.length&&this.bufferItems.geometry.setDrawRange(0,0),n(t)&&(this.bufferItems.currentData=t),A},e})(u.BaseBuffer); e.SharedControlCurvedLineBufferAnts = c
;}, function(t, e, r) {
'use strict'; let n = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let o = r(0), 
i = r(1), 
s = r(3), 
a = (function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.prototype.init=function(t,e){this.bufferItems=i.BufferUtil.makeBufferItems(),this.bufferItems.attributes=[{defaults:[0,0,0],name:"position",size:i.AttributeSize.THREE},{defaults:[0,0,0,0],name:"colorPicks",size:i.AttributeSize.FOUR},{defaults:[0],name:"controlPick",size:i.AttributeSize.ONE},{defaults:[0,0],name:"timing",size:i.AttributeSize.TWO},{defaults:[1],name:"normalDirection",size:i.AttributeSize.ONE},{defaults:[0,0,0,0],name:"endPoints",size:i.AttributeSize.FOUR},{defaults:[0],name:"halfLinewidth",size:i.AttributeSize.ONE}];var r=e;this.bufferItems.geometry=i.BufferUtil.makeBuffer(6*r,this.bufferItems.attributes),this.bufferItems.system=new o.Mesh(this.bufferItems.geometry,t),this.bufferItems.system.frustumCulled=!1,this.bufferItems.system.drawMode=o.TriangleStripDrawMode},e.prototype.update=function(t,e,r){if(!t)return this.bufferItems.geometry.setDrawRange(0,0),!1;0===t.length&&(this.bufferItems.currentData=t);var n,o,s=[],a=new Map;if(t&&t.length>0&&e){var u=t[0].startColor,c=u.base;n=this.bufferItems.system.material.uniforms;var f=e.getAtlasTexture(c.atlasReferenceID);n.colorAtlas.value=f,n.colorsPerRow.value=c.colorsPerRow,n.firstColor.value=[c.firstColor.x,c.firstColor.y],n.nextColor.value=[c.nextColor.x,c.nextColor.y],o=n.controlPoints,f.needsUpdate=!0}var h,l,d,p,y,m,g,b,v,x,_,w=1,C=15,I=!1;i.BufferUtil.beginUpdates();for(var M=this,P=0,A=t;P<A.length;P++){var B=A[P];if("break"===function(e){if(g=e.startColor.base.opacity,y=e.endColor.base.colorIndex,m=e.endColorStop.base.colorIndex,d=e.startColor.base.colorIndex,p=e.startColorStop.base.colorIndex,v=e.duration,w=e.lineWidth/2,C=e.resolution,h=e.currentStart,l=e.currentEnd,b=e.startTime,_=e.controlPoints[r],void 0===(x=a.get(_))){var n=s.push(_.x,_.y);x=n-2,a.set(_,x)}if(!(I=i.BufferUtil.updateBuffer(t,M.bufferItems,6,C,function(t,r,n,o,i,s,a,u,c,f,g,_,I,M,P){s[a]=x,i+=4,_[I]=h.x,_[++I]=h.y,_[++I]=l.x,_[++I]=l.y,M[P]=w,f[g]=1,r[n]=(t+1)/C,r[++n]=C,r[++n]=e.depth,c+=2,o[i]=d,o[++i]=p,o[++i]=y,o[++i]=m,s[++a]=x,_[++I]=h.x,_[++I]=h.y,_[++I]=l.x,_[++I]=l.y,M[++P]=w,f[++g]=1,r[++n]=(t+1)/C,r[++n]=C,r[++n]=e.depth,u[c]=b,u[++c]=v,o[++i]=d,o[++i]=p,o[++i]=y,o[++i]=m,s[++a]=x,_[++I]=h.x,_[++I]=h.y,_[++I]=l.x,_[++I]=l.y,M[++P]=w,f[++g]=-1,r[++n]=(t+1)/C,r[++n]=C,r[++n]=e.depth,u[++c]=b,u[++c]=v,o[++i]=d,o[++i]=p,o[++i]=y,o[++i]=m,s[++a]=x,_[++I]=h.x,_[++I]=h.y,_[++I]=l.x,_[++I]=l.y,M[++P]=w,f[++g]=1,r[++n]=t/C,r[++n]=C,r[++n]=e.depth,u[++c]=b,u[++c]=v,o[++i]=d,o[++i]=p,o[++i]=y,o[++i]=m,s[++a]=x,_[++I]=h.x,_[++I]=h.y,_[++I]=l.x,_[++I]=l.y,M[++P]=w,f[++g]=-1,r[++n]=t/C,r[++n]=C,r[++n]=e.depth,u[++c]=b,u[++c]=v,r[++n]=t/C,r[++n]=C,r[++n]=e.depth,M[++P]=w,i+=4,f[++g]=-1,_[++I]=h.x,_[++I]=h.y,_[++I]=l.x,_[++I]=l.y,s[++a]=x},!0)))return"break"}(B))break}var S=i.BufferUtil.endUpdates();return o&&(o.value=s),I?this.bufferItems.geometry.setDrawRange(0,6*S):0===t.length&&this.bufferItems.geometry.setDrawRange(0,0),I},e})(s.BaseBuffer); e.SharedControlCurvedLineColorsBuffer = a
;}, function(t, e, r) {
'use strict'; function n(t) {
return Array.isArray(t[0]);
} let o = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let i = r(5),
 s = r(0),
 a = r(1),
 u = r(3),
 c = (function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return o(e,t),e.prototype.init=function(t,e,r){if(this.bufferItems=a.BufferUtil.makeBufferItems(),this.bufferItems.uniformAttributes=[{block:0,name:"controlPoint",size:a.UniformAttributeSize.TWO},{block:0,name:"startColorPick",size:a.UniformAttributeSize.ONE},{block:0,name:"endColorPick",size:a.UniformAttributeSize.ONE},{block:1,name:"halfLineWidth",size:a.UniformAttributeSize.ONE},{block:1,name:"resolution",size:a.UniformAttributeSize.ONE},{block:1,name:"maxResolution",size:a.UniformAttributeSize.ONE},{block:1,name:"depth",size:a.UniformAttributeSize.ONE},{block:2,name:"endPoints",size:a.UniformAttributeSize.FOUR},{block:3,name:"marching",size:a.UniformAttributeSize.FOUR}],this.bufferItems.attributes=[{defaults:[0,0,0],name:"position",size:a.AttributeSize.THREE}],this.bufferItems.uniformBuffer=a.BufferUtil.makeUniformBuffer(this.bufferItems.uniformAttributes),r)this.bufferItems.geometry=a.BufferUtil.shareBuffer(this.bufferItems.attributes,r.bufferItems.geometry);else{this.bufferItems.geometry=a.BufferUtil.makeBuffer(600*this.bufferItems.uniformBuffer.maxInstances,this.bufferItems.attributes),a.BufferUtil.beginUpdates();for(var n=this,o=0;o<this.bufferItems.uniformBuffer.maxInstances;++o)!function(t){a.BufferUtil.updateBuffer([],n.bufferItems,6,100,function(e,r,n){r[n]=1,r[++n]=e+1,r[++n]=t,r[++n]=1,r[++n]=e+1,r[++n]=t,r[++n]=-1,r[++n]=e+1,r[++n]=t,r[++n]=1,r[++n]=e,r[++n]=t,r[++n]=-1,r[++n]=e,r[++n]=t,r[++n]=-1,r[++n]=e,r[++n]=t})}(o);a.BufferUtil.endUpdates(),this.bufferItems.geometry.setDrawRange(0,600*this.bufferItems.uniformBuffer.maxInstances)}this.bufferItems.system=new s.Mesh(this.bufferItems.geometry,t),this.bufferItems.system.frustumCulled=!1,this.bufferItems.system.drawMode=s.TriangleStripDrawMode},e.prototype.update=function(t,e,r){if(!t)return this.bufferItems.geometry.setDrawRange(0,0),!1;var o;if(o=n(t)?i.flatten(t):t,0===o.length&&(this.bufferItems.currentData=t),o.length>this.bufferItems.uniformBuffer.maxInstances&&console.warn("Too many shapes provided for a uniform instancing buffer.","Max supported:",this.bufferItems.uniformBuffer.maxInstances,"Shapes provided:",o.length,"This shape buffer should be split across more uniform instancing buffers to render correctly.","Consider using the MultiShapeBufferCache. If this is already in use:","Consider raising the number of buffers it splits across"),o.length>0&&e){var s=o[0].startColor,u=s.base,c=this.bufferItems.system.material,f=c.uniforms,h=e.getAtlasTexture(u.atlasReferenceID);f.colorAtlas.value=h,f.colorsPerRow.value=u.colorsPerRow,f.firstColor.value=[u.firstColor.x,u.firstColor.y],f.nextColor.value=[u.nextColor.x,u.nextColor.y],h.needsUpdate=!0}return a.BufferUtil.updateUniformBuffer(o,this.bufferItems,o.length,function(t,e,n,i,s,a,u,c,f,h){var l=o[t],d=l.marchingAnts.strokeLength+l.marchingAnts.gapLength;e.x=l.controlPoints[r].x,e.y=l.controlPoints[r].y,n.z=l.startColor.base.colorIndex,i.w=l.endColor.base.colorIndex,s.x=l.lineWidth/2,a.y=l.resolution,u.z=100,c.w=l.depth,f.x=l.start.x,f.y=l.start.y,f.z=l.end.x,f.w=l.end.y,h.x=0,h.y=l.marchingAnts.speed,h.z=l.marchingAnts.gapLength,h.w=d}),n(t)&&(this.bufferItems.currentData=t),this.bufferItems.geometry.setDrawRange(0,600*o.length),!0},e})(u.BaseBuffer); e.UniformInstanceArcBufferAnts = c;
}, function(t, e, r) {
'use strict'; function n(t) {
return Array.isArray(t[0]);
} let o = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let i = r(5), 
s = r(0), 
a = r(1), 
u = r(3),
 c = (function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return o(e,t),e.prototype.init=function(t,e){this.bufferItems=a.BufferUtil.makeBufferItems(),this.bufferItems.attributes=[{defaults:[0,0,0],name:"position",size:a.AttributeSize.THREE},{defaults:[0],name:"startColorPick",size:a.AttributeSize.ONE},{defaults:[0],name:"endColorPick",size:a.AttributeSize.ONE},{defaults:[1],name:"normalDirection",size:a.AttributeSize.ONE},{defaults:[0,0,0,0],name:"endPoints",size:a.AttributeSize.FOUR},{defaults:[0],name:"halfLinewidth",size:a.AttributeSize.ONE},{defaults:[0],name:"controlPick",size:a.AttributeSize.ONE}];var r=e;this.bufferItems.geometry=a.BufferUtil.makeBuffer(6*r,this.bufferItems.attributes),this.bufferItems.system=new s.Mesh(this.bufferItems.geometry,t),this.bufferItems.system.frustumCulled=!1,this.bufferItems.system.drawMode=s.TriangleStripDrawMode},e.prototype.update=function(t,e,r){if(!t)return this.bufferItems.geometry.setDrawRange(0,0),!1;var o;o=n(t)?i.flatten(t):t,0===o.length&&(this.bufferItems.currentData=t);var s,u=[],c=new Map;if(o.length>0&&e){var f=o[0].startColor,h=f.base,l=this.bufferItems.system.material,d=l.uniforms,p=e.getAtlasTexture(h.atlasReferenceID);d.colorAtlas.value=p,d.colorsPerRow.value=h.colorsPerRow,d.firstColor.value=[h.firstColor.x,h.firstColor.y],d.nextColor.value=[h.nextColor.x,h.nextColor.y],s=d.controlPoints,p.needsUpdate=!0}var y,m,g,b,v,x,_,w=1,C=15,I=!1;a.BufferUtil.beginUpdates();for(var M=this,P=0,A=o;P<A.length;P++){var B=A[P];if("break"===function(t){if(v=t.startColor.base.opacity,g=t.startColor.base,b=t.endColor.base,w=t.lineWidth/2,C=t.resolution,y=t.start,m=t.end,x=t.controlPoints[r],void 0===(_=c.get(x))){var e=u.push(x.x,x.y);_=e-2,c.set(x,_)}if(!(I=a.BufferUtil.updateBuffer(o,M.bufferItems,6,C,function(e,r,n,o,i,s,a,u,c,f,h,l,d,p,v){r[n]=(e+1)/C,r[++n]=C,r[++n]=t.depth,l[d]=w,i+=1,a+=1,u[c]=1,f[h]=y.x,f[++h]=y.y,f[++h]=m.x,f[++h]=m.y,p[v]=_,r[++n]=(e+1)/C,r[++n]=C,r[++n]=t.depth,l[++d]=w,u[++c]=1,f[++h]=y.x,f[++h]=y.y,f[++h]=m.x,f[++h]=m.y,o[i]=g.colorIndex,s[a]=b.colorIndex,p[++v]=_,r[++n]=(e+1)/C,r[++n]=C,r[++n]=t.depth,l[++d]=w,u[++c]=-1,f[++h]=y.x,f[++h]=y.y,f[++h]=m.x,f[++h]=m.y,o[++i]=g.colorIndex,s[++a]=b.colorIndex,p[++v]=_,r[++n]=e/C,r[++n]=C,r[++n]=t.depth,l[++d]=w,u[++c]=1,f[++h]=y.x,f[++h]=y.y,f[++h]=m.x,f[++h]=m.y,o[++i]=g.colorIndex,s[++a]=b.colorIndex,p[++v]=_,r[++n]=e/C,r[++n]=C,r[++n]=t.depth,l[++d]=w,u[++c]=-1,f[++h]=y.x,f[++h]=y.y,f[++h]=m.x,f[++h]=m.y,o[++i]=g.colorIndex,s[++a]=b.colorIndex,p[++v]=_,r[++n]=e/C,r[++n]=C,r[++n]=t.depth,l[++d]=w,i+=1,a+=1,u[++c]=-1,f[++h]=y.x,f[++h]=y.y,f[++h]=m.x,f[++h]=m.y,p[++v]=_})))return"break"}(B))break}var S=a.BufferUtil.endUpdates();return s&&(s.value=u),I?this.bufferItems.geometry.setDrawRange(0,6*S):0===t.length&&this.bufferItems.geometry.setDrawRange(0,0),n(t)&&(this.bufferItems.currentData=t),I},e})(u.BaseBuffer); e.SharedControlCurvedLineBuffer = c;
}, function(t, e, r) {
'use strict'; let n = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let o = r(0),
 i = r(1), 
s = r(3),
 a = (function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.prototype.init=function(t,e){this.bufferItems=i.BufferUtil.makeBufferItems(),this.bufferItems.attributes=[{defaults:[0,0,0],name:"position",size:i.AttributeSize.THREE},{defaults:[0,0,0,1],name:"customColor",size:i.AttributeSize.FOUR},{defaults:[1],name:"normalDirection",size:i.AttributeSize.ONE},{defaults:[0,0,0,0],name:"endPoints",size:i.AttributeSize.FOUR},{defaults:[0,0],name:"controlPoint",size:i.AttributeSize.TWO},{defaults:[0],name:"halfLinewidth",size:i.AttributeSize.ONE}];var r=e;this.bufferItems.geometry=i.BufferUtil.makeBuffer(6*r,this.bufferItems.attributes),this.bufferItems.system=new o.Mesh(this.bufferItems.geometry,t),this.bufferItems.system.frustumCulled=!1,this.bufferItems.system.drawMode=o.TriangleStripDrawMode},e.prototype.update=function(t){if(!t)return this.bufferItems.geometry.setDrawRange(0,0),!1;var e,r,n,o,s=1,a=15,u=!1;i.BufferUtil.beginUpdates();for(var c=this,f=0,h=t;f<h.length;f++){var l=h[f];if("break"===function(f){if(o=f.startColor.base.opacity,n=f.startColor.base.color,s=f.lineWidth/2,a=f.resolution,e=f.start,r=f.end,!(u=i.BufferUtil.updateBuffer(t,c.bufferItems,6,a,function(t,i,u,c,h,l,d,p,y,m,g,b,v){i[u]=(t+1)/a,i[++u]=a,i[++u]=f.depth,b[v]=s,h+=4,l[d]=1,p[y]=e.x,p[++y]=e.y,p[++y]=r.x,p[++y]=r.y,m[g]=f.controlPoints[0].x,m[++g]=f.controlPoints[0].y,i[++u]=(t+1)/a,i[++u]=a,i[++u]=f.depth,b[++v]=s,l[++d]=1,p[++y]=e.x,p[++y]=e.y,p[++y]=r.x,p[++y]=r.y,m[++g]=f.controlPoints[0].x,m[++g]=f.controlPoints[0].y,c[h]=n.r,c[++h]=n.g,c[++h]=n.b,c[++h]=o,i[++u]=(t+1)/a,i[++u]=a,i[++u]=f.depth,b[++v]=s,l[++d]=-1,p[++y]=e.x,p[++y]=e.y,p[++y]=r.x,p[++y]=r.y,m[++g]=f.controlPoints[0].x,m[++g]=f.controlPoints[0].y,c[++h]=n.r,c[++h]=n.g,c[++h]=n.b,c[++h]=o,i[++u]=t/a,i[++u]=a,i[++u]=f.depth,b[++v]=s,l[++d]=1,p[++y]=e.x,p[++y]=e.y,p[++y]=r.x,p[++y]=r.y,m[++g]=f.controlPoints[0].x,m[++g]=f.controlPoints[0].y,c[++h]=n.r,c[++h]=n.g,c[++h]=n.b,c[++h]=o,i[++u]=t/a,i[++u]=a,i[++u]=f.depth,b[++v]=s,l[++d]=-1,p[++y]=e.x,p[++y]=e.y,p[++y]=r.x,p[++y]=r.y,m[++g]=f.controlPoints[0].x,m[++g]=f.controlPoints[0].y,c[++h]=n.r,c[++h]=n.g,c[++h]=n.b,c[++h]=o,i[++u]=t/a,i[++u]=a,i[++u]=f.depth,b[++v]=s,h+=4,l[++d]=-1,p[++y]=e.x,p[++y]=e.y,p[++y]=r.x,p[++y]=r.y,m[++g]=f.controlPoints[0].x,m[++g]=f.controlPoints[0].y})))return"break"}(l))break}var d=i.BufferUtil.endUpdates();return u?this.bufferItems.geometry.setDrawRange(0,6*d):0===t.length&&this.bufferItems.geometry.setDrawRange(0,0),u},e})(s.BaseBuffer); e.SimpleStaticBezierLineBuffer = a
;}, function(t, e, r) {
'use strict'; function n(t) {
return Array.isArray(t[0]);
} let o = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let i = r(5), 
s = r(0), 
a = r(1),
 u = r(3),
 c = (function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return o(e,t),e.prototype.init=function(t,e){this.bufferItems=a.BufferUtil.makeBufferItems(),this.bufferItems.attributes=[{defaults:[0,0,0],name:"position",size:a.AttributeSize.THREE},{defaults:[0],name:"radius",size:a.AttributeSize.ONE},{defaults:[0],name:"innerRadius",size:a.AttributeSize.ONE},{defaults:[0],name:"colorPick",size:a.AttributeSize.ONE},{defaults:[0],name:"innerColorPick",size:a.AttributeSize.ONE}];var r=e;this.bufferItems.geometry=a.BufferUtil.makeBuffer(1*r,this.bufferItems.attributes),this.bufferItems.system=new s.Points(this.bufferItems.geometry,t),this.bufferItems.system.frustumCulled=!1},e.prototype.update=function(t,e,r){var o;if(!(o=n(t)?i.flatten(t):t)||0===o.length)return this.bufferItems.geometry.setDrawRange(0,0),!1;if(e){var s=o[0].outerColor,u=s.base,c=this.bufferItems.system.material,f=c.uniforms,h=e.getAtlasTexture(u.atlasReferenceID);f.colorAtlas.value=h,f.colorsPerRow.value=u.colorsPerRow,f.firstColor.value=[u.firstColor.x,u.firstColor.y],f.nextColor.value=[u.nextColor.x,u.nextColor.y],h.needsUpdate=!0,r&&(f.zoom.value=r.zoom)}var l,d=!1;return d=a.BufferUtil.updateBuffer(o,this.bufferItems,1,o.length,function(t,e,r,n,i,s,a,u,c,f,h){l=o[t],e[r]=l._centerX,e[++r]=l._centerY,e[++r]=l.depth,n[i]=l._radius,s[a]=l.innerRadius||0,u[c]=l.outerColor.base.colorIndex,f[h]=l.innerColor?l.innerColor.base.colorIndex:0}),d&&this.bufferItems.geometry.setDrawRange(0,o.length),n(t)&&(this.bufferItems.currentData=t),d},e})(u.BaseBuffer); e.SimpleStaticCircleBuffer = c;
}, function(t, e, r) {
'use strict'; function n(t) {
return  Boolean(Array.isArray(t[0]));
} let o = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let i = r(5), 
s = r(0),
 a = r(1),
 u = r(3), 
c = (function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return o(e,t),e.prototype.init=function(t,e){this.bufferItems=a.BufferUtil.makeBufferItems(),this.bufferItems.attributes=[{defaults:[0,0,0],name:"position",size:a.AttributeSize.THREE},{defaults:[0],name:"customColor",size:a.AttributeSize.ONE},{defaults:[0,0,1],name:"texCoord",size:a.AttributeSize.THREE},{defaults:[0,0],name:"size",size:a.AttributeSize.TWO},{defaults:[0,0],name:"anchor",size:a.AttributeSize.TWO}];var r=e;this.bufferItems.geometry=a.BufferUtil.makeBuffer(6*r,this.bufferItems.attributes),this.bufferItems.system=new s.Mesh(this.bufferItems.geometry,t),this.bufferItems.system.frustumCulled=!1,this.bufferItems.system.drawMode=s.TriangleStripDrawMode},e.prototype.update=function(t,e,r,o,s){if(!t||t.length<=0)return this.bufferItems.geometry.setDrawRange(0,0),!1;var u;u=n(t)?i.flatten(t):t;var c,f,h,l,d,p;if(e){var y=u[0].color,m=y.base,g=this.bufferItems.system.material,b=g.uniforms,v=e.getAtlasTexture(m.atlasReferenceID);b.colorAtlas.value!==v&&(b.colorAtlas.value=v,b.colorsPerRow.value=m.colorsPerRow,b.firstColor.value=[m.firstColor.x,m.firstColor.y],b.nextColor.value=[m.nextColor.x,m.nextColor.y],v.needsUpdate=!0),(r||o||s)&&(g=this.bufferItems.system.material,b=g.uniforms,b.startFade.value=r||0,b.endFade.value=o||0,b.maxLabelSize.value=s||0)}var x=a.BufferUtil.updateBuffer(u,this.bufferItems,6,u.length,function(t,e,r,n,o,i,s,a,y,m,g){c=u[t],f=c.rasterizedLabel,h=c.color.base,l=c.color.base.opacity,d={x:c.getLocation().x+c.getSize().width*Math.cos(c.getRotation()),y:c.getLocation().y+c.getSize().width*Math.sin(c.getRotation())},p=c.getSize(),c.update(),e[r]=c.TR.x,e[++r]=c.TR.y,e[++r]=c.depth,i[s]=f.atlasTR.x,i[++s]=f.atlasTR.y,i[++s]=l,n[o]=h.colorIndex,a[y]=p.width,a[++y]=p.height,m[g]=d.x,m[++g]=d.y,e[++r]=c.TR.x,e[++r]=c.TR.y,e[++r]=c.depth,i[++s]=f.atlasTR.x,i[++s]=f.atlasTR.y,i[++s]=l,n[++o]=h.colorIndex,a[++y]=p.width,a[++y]=p.height,m[++g]=d.x,m[++g]=d.y,e[++r]=c.BR.x,e[++r]=c.BR.y,e[++r]=c.depth,i[++s]=f.atlasBR.x,i[++s]=f.atlasBR.y,i[++s]=l,n[++o]=h.colorIndex,a[++y]=p.width,a[++y]=p.height,m[++g]=d.x,m[++g]=d.y,e[++r]=c.TL.x,e[++r]=c.TL.y,e[++r]=c.depth,i[++s]=f.atlasTL.x,i[++s]=f.atlasTL.y,i[++s]=l,n[++o]=h.colorIndex,a[++y]=p.width,a[++y]=p.height,m[++g]=d.x,m[++g]=d.y,e[++r]=c.BL.x,e[++r]=c.BL.y,e[++r]=c.depth,i[++s]=f.atlasBL.x,i[++s]=f.atlasBL.y,i[++s]=l,n[++o]=h.colorIndex,a[++y]=p.width,a[++y]=p.height,m[++g]=d.x,m[++g]=d.y,e[++r]=c.BL.x,e[++r]=c.BL.y,e[++r]=c.depth,i[++s]=f.atlasBL.x,i[++s]=f.atlasBL.y,i[++s]=l,n[++o]=h.colorIndex,a[++y]=p.width,a[++y]=p.height,m[++g]=d.x,m[++g]=d.y});return this.bufferItems.geometry.setDrawRange(0,6*u.length),n(t)&&(this.bufferItems.currentData=t),x},e})(u.BaseBuffer); e.SimpleStaticLabelBuffer = c
;}, function(t, e, r) {
'use strict'; let n = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let o = r(0),
 i = r(1),
 s = r(3),
 a = (function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.prototype.init=function(t,e){this.bufferItems=i.BufferUtil.makeBufferItems(),this.bufferItems.attributes=[{defaults:[0,0,0],name:"position",size:i.AttributeSize.THREE},{defaults:[0,0,0,1],name:"customColor",size:i.AttributeSize.FOUR}];var r=e;this.bufferItems.geometry=i.BufferUtil.makeBuffer(6*r,this.bufferItems.attributes),this.bufferItems.system=new o.Mesh(this.bufferItems.geometry,t),this.bufferItems.system.frustumCulled=!1,this.bufferItems.system.drawMode=o.TriangleStripDrawMode},e.prototype.update=function(t){if(!t)return this.bufferItems.geometry.setDrawRange(0,0),!1;var e=!1,r=0;i.BufferUtil.beginUpdates();for(var n,o,s,a,u,c,f=this,h=0,l=t;h<l.length;h++){var d=l[h];if("break"===function(h){var l=h.getTriangleStrip();if(u=h.startColor.base.color,c=h.startColor.base.opacity,!(e=i.BufferUtil.updateBuffer(t,f.bufferItems,6,l.length/4,function(t,e,i,f,d){r=4*t,n=l[r],o=l[r+1],s=l[r+2],a=l[r+3],e[i]=n.x,e[++i]=n.y,e[++i]=h.depth,d+=4,e[++i]=n.x,e[++i]=n.y,e[++i]=h.depth,f[d]=u.r,f[++d]=u.g,f[++d]=u.b,f[++d]=c,e[++i]=o.x,e[++i]=o.y,e[++i]=h.depth,f[++d]=u.r,f[++d]=u.g,f[++d]=u.b,f[++d]=c,e[++i]=s.x,e[++i]=s.y,e[++i]=h.depth,f[++d]=u.r,f[++d]=u.g,f[++d]=u.b,f[++d]=c,e[++i]=a.x,e[++i]=a.y,e[++i]=h.depth,f[++d]=u.r,f[++d]=u.g,f[++d]=u.b,f[++d]=c,e[++i]=a.x,e[++i]=a.y,e[++i]=h.depth,d+=4})))return"break"}(d))break}var p=i.BufferUtil.endUpdates();return e?this.bufferItems.geometry.setDrawRange(0,6*p):0===t.length?this.bufferItems.geometry.setDrawRange(0,0):0===t.length&&this.bufferItems.geometry.setDrawRange(0,0),e},e})(s.BaseBuffer); e.SimpleStaticLineBuffer = a
;}, function(t, e, r) {
'use strict'; function n(t) {
return  Boolean(Array.isArray(t[0]));
} let o = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let i = r(5), 
s = r(0),
 a = r(6),
 u = r(1), 
c = r(3),
 f = (function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return o(e,t),e.prototype.init=function(t,e){this.bufferItems=u.BufferUtil.makeBufferItems(),this.bufferItems.attributes=[{defaults:[0,0,0],name:"position",size:u.AttributeSize.THREE},{defaults:[0],name:"colorPick",size:u.AttributeSize.ONE}];var r=e;this.bufferItems.geometry=u.BufferUtil.makeBuffer(6*r,this.bufferItems.attributes),this.bufferItems.system=new s.Mesh(this.bufferItems.geometry,t),this.bufferItems.system.frustumCulled=!1,this.bufferItems.system.drawMode=s.TriangleStripDrawMode},e.prototype.update=function(t,e){if(!t||t.length<=0)return this.bufferItems.geometry.setDrawRange(0,0),!1;var r;if(r=n(t)?i.flatten(t):t,e){var o=r[0].startColor,s=o.base,c=this.bufferItems.system.material,f=c.uniforms,h=e.getAtlasTexture(s.atlasReferenceID);f.colorAtlas.value=h,f.colorsPerRow.value=s.colorsPerRow,f.firstColor.value=[s.firstColor.x,s.firstColor.y],f.nextColor.value=[s.nextColor.x,s.nextColor.y],h.needsUpdate=!0}var l,d=!1,p=a.Point.zero(),y=a.Point.zero(),m=a.Point.zero(),g=a.Point.zero(),b=0,v=0;d=u.BufferUtil.updateBuffer(r,this.bufferItems,6,r.length,function(t,e,n,o,i){l=r[t],b=l.startColor.base.colorIndex,v=l.endColor.base.colorIndex,a.Point.add(l.p2,a.Point.scale(l.perpendicular,-l.thickness/2),p),a.Point.add(l.p2,a.Point.scale(l.perpendicular,l.thickness/2),y),a.Point.add(l.p1,a.Point.scale(l.perpendicular,-l.thickness/2),m),a.Point.add(l.p1,a.Point.scale(l.perpendicular,l.thickness/2),g),e[n]=p.x,e[++n]=p.y,e[++n]=l.depth,i+=1,e[++n]=p.x,e[++n]=p.y,e[++n]=l.depth,o[i]=v,e[++n]=y.x,e[++n]=y.y,e[++n]=l.depth,o[++i]=v,e[++n]=m.x,e[++n]=m.y,e[++n]=l.depth,o[++i]=b,e[++n]=g.x,e[++n]=g.y,e[++n]=l.depth,o[++i]=b,e[++n]=g.x,e[++n]=g.y,e[++n]=l.depth});var x=u.BufferUtil.endUpdates();return d&&(this.bufferItems.geometry.setDrawRange(0,6*x),n(t)&&(this.bufferItems.currentData=t)),d},e})(c.BaseBuffer); e.SimpleStaticStraightLineBuffer = f;
}, function(t, e, r) {
'use strict'; function n(t) {
return Array.isArray(t[0])
;} let o = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let i = r(5), 
s = r(0),
 a = r(1),
 u = r(3),
 c = (function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return o(e,t),e.prototype.init=function(t,e,r){if(this.bufferItems=a.BufferUtil.makeBufferItems(),this.bufferItems.uniformAttributes=[{block:0,name:"controlPoint",size:a.UniformAttributeSize.TWO},{block:0,name:"startColorPick",size:a.UniformAttributeSize.ONE},{block:0,name:"endColorPick",size:a.UniformAttributeSize.ONE},{block:1,name:"halfLineWidth",size:a.UniformAttributeSize.ONE},{block:1,name:"resolution",size:a.UniformAttributeSize.ONE},{block:1,name:"maxResolution",size:a.UniformAttributeSize.ONE},{block:1,name:"depth",size:a.UniformAttributeSize.ONE},{block:2,name:"endPoints",size:a.UniformAttributeSize.FOUR}],this.bufferItems.attributes=[{defaults:[0,0,0],name:"position",size:a.AttributeSize.THREE}],this.bufferItems.uniformBuffer=a.BufferUtil.makeUniformBuffer(this.bufferItems.uniformAttributes),r)this.bufferItems.geometry=a.BufferUtil.shareBuffer(this.bufferItems.attributes,r.bufferItems.geometry);else{this.bufferItems.geometry=a.BufferUtil.makeBuffer(600*this.bufferItems.uniformBuffer.maxInstances,this.bufferItems.attributes),a.BufferUtil.beginUpdates();for(var n=this,o=0;o<this.bufferItems.uniformBuffer.maxInstances;++o)!function(t){a.BufferUtil.updateBuffer([],n.bufferItems,6,100,function(e,r,n){r[n]=1,r[++n]=e+1,r[++n]=t,r[++n]=1,r[++n]=e+1,r[++n]=t,r[++n]=-1,r[++n]=e+1,r[++n]=t,r[++n]=1,r[++n]=e,r[++n]=t,r[++n]=-1,r[++n]=e,r[++n]=t,r[++n]=-1,r[++n]=e,r[++n]=t})}(o);a.BufferUtil.endUpdates(),this.bufferItems.geometry.setDrawRange(0,600*this.bufferItems.uniformBuffer.maxInstances)}this.bufferItems.system=new s.Mesh(this.bufferItems.geometry,t),this.bufferItems.system.frustumCulled=!1,this.bufferItems.system.drawMode=s.TriangleStripDrawMode},e.prototype.update=function(t,e,r){if(!t)return this.bufferItems.geometry.setDrawRange(0,0),!1;var o;if(o=n(t)?i.flatten(t):t,0===o.length&&(this.bufferItems.currentData=t),o.length>this.bufferItems.uniformBuffer.maxInstances&&console.warn("Too many shapes provided for a uniform instancing buffer.","Max supported:",this.bufferItems.uniformBuffer.maxInstances,"Shapes provided:",o.length,"This shape buffer should be split across more uniform instancing buffers to render correctly.","Consider using the MultiShapeBufferCache. If this is already in use:","Consider raising the number of buffers it splits across"),o.length>0&&e){var s=o[0].startColor,u=s.base,c=this.bufferItems.system.material,f=c.uniforms,h=e.getAtlasTexture(u.atlasReferenceID);f.colorAtlas.value=h,f.colorsPerRow.value=u.colorsPerRow,f.firstColor.value=[u.firstColor.x,u.firstColor.y],f.nextColor.value=[u.nextColor.x,u.nextColor.y],h.needsUpdate=!0}return a.BufferUtil.updateUniformBuffer(o,this.bufferItems,o.length,function(t,e,n,i,s,a,u,c,f){var h=o[t];e.x=h.controlPoints[r].x,e.y=h.controlPoints[r].y,n.z=h.startColor.base.colorIndex,i.w=h.endColor.base.colorIndex,s.x=h.lineWidth/2,a.y=h.resolution,u.z=100,c.w=h.depth,f.x=h.start.x,f.y=h.start.y,f.z=h.end.x,f.w=h.end.y}),n(t)&&(this.bufferItems.currentData=t),this.bufferItems.geometry.setDrawRange(0,600*o.length),!0},e})(u.BaseBuffer); e.UniformInstanceArcBuffer = c
;}, function(t, e, r) {
'use strict'; function n(t) {
for (let r in t)e.hasOwnProperty(r) || (e[r] = t[r])
;}Object.defineProperty(e, '__esModule', {value:!0}), n(r(46)), n(r(47)), n(r(48)), n(r(20)), n(r(49)), n(r(50)), n(r(15)), n(r(23)), n(r(51)), n(r(52)), n(r(13)), n(r(8)), n(r(17));
}, function(t, e, r) {
'use strict'; Object.defineProperty(e, '__esModule', {value:!0}); let n = (function(){function t(t){this.base=t}return t})(); e.ReferenceColor = n
;}, function(t, e, r) {
'use strict'; let n = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let o = r(0),
 i = r(11),
 s = r(9),
 a = r(12),
 u = r(20),
 c = (function(t){function e(e){var r=t.call(this,e)||this;return r.easing=i.linear,r._startColorChange=new o.Color(0,0,0),r._endColorChange=new o.Color(0,0,0),r.startStop={x:0,y:0},r.endStop={x:0,y:0},r._currentStartColor=new o.Color(0,0,0),r._currentEndColor=new o.Color(0,0,0),e&&(r.startStop=e.startStop||{x:0,y:0},r.endStop=e.endStop||{x:0,y:0},e.startColorStop&&(r.startColorStop=e.startColorStop),e.endColorStop&&(r.endColorStop=e.endColorStop)),r}return n(e,t),Object.defineProperty(e.prototype,"startColorStop",{get:function(){return this._startColorStop},set:function(t){var e=this.startColor.base.color,r=t.base.color;this._startColorStop=t,this._startColorChange.r=r.r-e.r,this._startColorChange.g=r.g-e.g,this._startColorChange.b=r.b-e.b},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"endColorStop",{get:function(){return this._endColorStop},set:function(t){var e=this.startColor.base.color,r=t.base.color;this._endColorStop=t,this._endColorChange.r=r.r-e.r,this._endColorChange.g=r.g-e.g,this._endColorChange.b=r.b-e.b},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"currentStartColor",{get:function(){var t=Math.min(s.FrameInfo.lastFrameTime-this.startTime,this.duration),e=this.startColor.base.color;return this._currentStartColor.r=this.easing(t,e.r,this._startColorChange.r,this.duration),this._currentStartColor.g=this.easing(t,e.g,this._startColorChange.g,this.duration),this._currentStartColor.b=this.easing(t,e.b,this._startColorChange.b,this.duration),this._currentStartColor},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"currentEndColor",{get:function(){var t=Math.min(s.FrameInfo.lastFrameTime-this.startTime,this.duration),e=this.endColor.base.color;return this._currentEndColor.r=this.easing(t,e.r,this._endColorChange.r,this.duration),this._currentEndColor.g=this.easing(t,e.g,this._endColorChange.g,this.duration),this._currentEndColor.b=this.easing(t,e.b,this._endColorChange.b,this.duration),this._currentEndColor},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"currentStart",{get:function(){var t=Math.min(s.FrameInfo.lastFrameTime-this.startTime,this.duration),e=this.easing(t,0,1,this.duration);return a.circular(e,this.start,this.startStop,this.controlPoints[1])},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"currentEnd",{get:function(){var t=Math.min(s.FrameInfo.lastFrameTime-this.startTime,this.duration),e=this.easing(t,0,1,this.duration);return a.circular(e,this.end,this.endStop,this.controlPoints[1])},enumerable:!0,configurable:!0}),e})(u.CurvedLineShape); e.AnimatedCurvedLineShape = c
;}, function(t, e, r) {
'use strict'; let n = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let o = r(22),
 i = (function(t){function e(e){var r=t.call(this,e)||this;return r.depth=e.depth||0,r.innerColor=e.innerColor,r.innerRadius=e.innerRadius,r.outerColor=e.outerColor,r}return n(e,t),e.prototype.clone=function(t){var r=new e(this);return r.d=this.d,r},e})(o.Circle); e.CircleShape = i
;}, function(t, e, r) {
'use strict'; let n = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let o = r(7), 
i = r(23),
 s = (function(t){function e(e){var r=t.call(this,Object.assign(e,{thickness:e.startWidth}))||this;return r.tl={x:0,y:0},r.bl={x:0,y:0},r.tr={x:0,y:0},r.br={x:0,y:0},r.endWidth=1,r.endWidth=e.endWidth||1,r.setPoints(e.p1,e.p2),r}return n(e,t),e.prototype.clone=function(t){return Object.assign(new e(Object.assign(this,{startWidth:this.thickness})),t)},e.prototype.pointInside=function(t){for(var e=t.x,r=t.y,n=[this.tl,this.tr,this.br,this.bl],o=n.length,i=!1,s=0,a=o-1;s<o;a=s++)n[s].y>r!=n[a].y>r&&e<(n[a].x-n[s].x)*(r-n[s].y)/(n[a].y-n[s].y)+n[s].x&&(i=!i);return i},e.prototype.setPoints=function(e,r){if(t.prototype.setPoints.call(this,e,r),this.tl){var n=this.thickness/2,i=this.endWidth/2,s=this.perpendicular.x*n,a=this.perpendicular.y*n,u=this.perpendicular.x*i,c=this.perpendicular.y*i;this.tl.x=this.p1.x+s,this.tl.y=this.p1.y+a,this.bl.x=this.p1.x-s,this.bl.y=this.p1.y-a,this.tr.x=this.p2.x+u,this.tr.y=this.p2.y+c,this.br.x=this.p2.x-u,this.br.y=this.p2.y-c,this.topEdge=new o.Line(this.tl,this.tr),this.bottomEdge=new o.Line(this.bl,this.br),this.encapsulatePoints([this.tl,this.tr,this.bl,this.br])}},e})(i.LineShape); e.EdgeShape = s;
}, function(t, e, r) {
'use strict'; let n = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let o = r(2),
 i = (function(t){function e(e,r){var n=t.call(this,0,0,r,r)||this;return n.opacity=1,n.texture=e,n.size=r,n}return n(e,t),Object.defineProperty(e.prototype,"size",{get:function(){return Math.max(this.width,this.height)},set:function(t){this.texture.aspectRatio>1?(this.width=t,this.height=t/this.texture.aspectRatio):(this.width=t*this.texture.aspectRatio,this.height=t)},enumerable:!0,configurable:!0}),e.prototype.centerOn=function(t,e){this.x=t-this.width/2,this.y=e-this.height/2},e})(o.Bounds); e.ImageShape = i
;}, function(t, e, r) {
'use strict'; let n = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let o = r(2), 
i = (function(t){function e(e,r){var n=t.call(this,e.x,e.right,e.y,e.bottom)||this;return n.r=1,n.g=0,n.b=0,n.a=1,n}return n(e,t),e})(o.Bounds); e.QuadShape = i
;}, function(t, e, r) {
'use strict'; Object.defineProperty(e, '__esModule', {value:!0}); let n = r(0), 
o = (function(){function t(t,e,r,o){void 0===o&&(o=1),this.opacity=1,this.pixelWidth=2,this.pixelHeight=2,t instanceof n.Color?(this.color=t.clone(),this.opacity=void 0===e?1:e):(this.color=new n.Color(t,e,r),this.opacity=o)}return t})(); e.AtlasColor = o;
}, function(t, e, r) {
'use strict'; function n(t) {
for (let r in t)e.hasOwnProperty(r) || (e[r] = t[r]);
}Object.defineProperty(e, '__esModule', {value:!0}), n(r(2)), n(r(22)), n(r(21)), n(r(7)), n(r(6)), n(r(16))
;}, function(t, e, r) {
'use strict'; function n(t) {
for (let r in t)e.hasOwnProperty(r) || (e[r] = t[r])
;}Object.defineProperty(e, '__esModule', {value:!0}), n(r(55)), n(r(56)), n(r(1)), n(r(57)), n(r(11)), n(r(9)), n(r(58)), n(r(12)), n(r(18)), n(r(24)), n(r(14)), n(r(19)), n(r(25)), n(r(10))
;}, function(t, e, r) {
'use strict'; Object.defineProperty(e, '__esModule', {value:!0}); let n; !(function(t){t[t.PLAY=0]="PLAY",t[t.STOP=1]="STOP"})(n || (n = {})); let o = (function(){function t(){}return t.animate=function(){t.playState===n.PLAY&&requestAnimationFrame(t.animate),this.animating.forEach(function(t){t.forEach(function(t){})})},t.cancel=function(t,e){},t.value=function(t,e,r,n,o,i){},t.point=function(t){},t.start=function(){},t.stop=function(){},t.playState=n.PLAY,t.animating=new Map,t})(); e.Animate = o
;}, function(t, e, r) {
'use strict'; let n = this && this.__extends || (function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}})(); Object.defineProperty(e, '__esModule', {value:!0}); let o, 
i = r(24); !(function(t){t[t.INIT=0]="INIT",t[t.PLAY=1]="PLAY",t[t.STOP=2]="STOP"})(o = e.PlayState || (e.PlayState = {})); let s = (function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.playState=o.INIT,e.buffer=[],e.bustCache=!0,e.doAnimate=function(){e.playState===o.PLAY&&requestAnimationFrame(e.doAnimate),e.animate()},e}return n(e,t),e.prototype.animate=function(){},e.prototype.generate=function(t){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];this.getStorage(t),this.bustCache&&(this.buildCache.apply(this,arguments),this.bustCache=!1,this.playState===o.INIT&&(this.start(),requestAnimationFrame(this.doAnimate))),this.flagBuffersDirty(),this.processDirtyBuffers()},e.prototype.buildCache=function(t){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r]},e.prototype.start=function(){this.playState=o.PLAY},e.prototype.stop=function(){this.playState=o.STOP},e})(i.MultiShapeBufferCache); e.AnimatedShapeBufferCache = s
;}, function(t, e, r) {
'use strict'; function n(t) {
return Array.from(t).filter(function(t) {
return t[1];
}).map(function(t) {
return t[0]
;});
}Object.defineProperty(e, '__esModule', {value:!0}), e.boolMapToArray = n; let o = (function(){function t(){this.cachedSelection=new Map,this.selections=new Map,this._didSelectionChange=new Map}return t.prototype.clearAllSelections=function(){for(var t=0,e=Array.from(this.selections.keys());t<e.length;t++){var r=e[t];this.clearSelection(r)}},t.prototype.clearSelection=function(t){this.getSelection(t).length&&(this.selections.set(t,null),this.cachedSelection.set(t,null),this._didSelectionChange.set(t,!0))},t.prototype.deselect=function(t,e){var r=this.selections.get(t);r&&r.get(e)&&(this.cachedSelection.set(t,null),r.set(e,!1),this._didSelectionChange.set(t,!0))},t.prototype.didSelectionCategoryChange=function(t){return this._didSelectionChange.get(t)},t.prototype.didSelectionChange=function(){return n(this._didSelectionChange).length>0},t.prototype.finalizeUpdate=function(){for(var t=0,e=Array.from(this._didSelectionChange.keys());t<e.length;t++){var r=e[t];this._didSelectionChange.set(r,!1)}},t.prototype.getSelection=function(t){if(!this.cachedSelection.get(t)){var e=this.selections.get(t);e?this.cachedSelection.set(t,n(e)):this.cachedSelection.set(t,[])}return this.cachedSelection.get(t)},t.prototype.select=function(t,e){var r=this.selections.get(t);r||(r=new Map,this.selections.set(t,r)),r.get(e)||(this.cachedSelection.set(t,null),r.set(e,!0),this._didSelectionChange.set(t,!0))},t.prototype.toggleSelect=function(t,e){var r=this.selections.get(t);r||(r=new Map,this.selections.set(t,r)),this.cachedSelection.set(t,null),r.get(e)?this.deselect(t,e):this.select(t,e),this._didSelectionChange.set(t,!0)},t})(); e.CustomSelection = o
;}, function(t, e, r) {
'use strict'; function n(t) {
let e = t.ctx, 
r = t.text, 
n = t.bboxHeight, 
o = t.ctx.canvas.height, 
i = t.baseline || 'alphabetic', 
s = t.flip || !1,
 a = t.drawBaseline || !1, 
u = 'Arial, san-serif',
 c = 14; t.fontFamily && (u = t.fontFamily), t.fontSize && (c = t.fontSize), e.save(), e.font = c + 'px ' + u; let f = e.measureText(r).width,
 h = 2 * c,
 l = 2 * c, 
d = e.canvas.width = Math.round(f + 2 * h), 
p = e.canvas.height = o || Math.round(2 * l); 'string'===typeof i && (l = 0, e.textBaseline = i), s && e.scale(1, -1), e.font = c + 'px ' + u, e.fillText(r, h, 'number' == typeof n ? n:l), a && e.fillRect(0, o / 2, e.canvas.width, 1); for (var y = e.getImageData(0, 0, d, p), m = y.data, g = m.length, b = 0, v = 0, x = 0, _ = 0; g > 0;) {
m[g + 3] && (g -= g % (4 * d), m[g + 3] && (g -= g % (4 * d), b = g / 4 / d, b -= l - c, g = 0), g -= 4), x = 0; for (var w = 0, C = 0; C < p && w < d;) {
m[C * d * 4 + 4 * w + 3] && (x = w - h, C = p, w = d), C++, C % p == 0 && (C = 0, w++);
}for (_ = 0, w = d, C = 0; C < p && w > 0;)m[C * d * 4 + 4 * w + 3] && (_ = w - h, C = p, w = d), ++C % p == 0 && (C = 0, w--); for (v = 0, g = m.length; g > 0;)m[g + 3] && (g -= g % (4 * d), v = g / 4 / d, g = 0), g -= 4; e.restore();
} return{bottom:v, height:b - 0, left:-x, top:c - 0, width:_ - x};
}Object.defineProperty(e, '__esModule', {value:!0}), e.getFontMetrics = n;
}]);
});
// # sourceMappingURL=index.js.map
