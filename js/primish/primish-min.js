(function(t){"function"==typeof define&&define.amd?define("primish/primish",t):"undefined"!=typeof module&&module.exports?module.exports=t():this.primish=t()}).call(this,function(){var t=Object.hasOwnProperty,e=function(e,n){return t.call(e,n)},n=function(t,e,n){for(var r in t)if(e.call(n,t[r],r,t)===!1)break;return t};if(!{valueOf:0}.propertyIsEnumerable("valueOf")){var r=Object.prototype,i="constructor,toString,valueOf,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString".split(",");n=function(t,n,o){var s,u,f;for(s in t)if(n.call(o,t[s],s,t)===!1)return t;for(u=0;(s=i[u])&&(f=t[s],f===r[s]&&!e(t,s)||n.call(o,f,s,t)!==!1);u++);return t}}var o=Object.create||function(t){var e=function(){};return e.prototype=t,new e},s=Array.prototype.slice,u=function(){var t=Object.prototype.toString,e="[object Object]";return function(n){return t.call(n)===e&&null!=n}}(),f=Object.getOwnPropertyDescriptor,p=Object.defineProperty;try{p({},"~",{}),f({},"~")}catch(c){f=function(t,e){return{value:t[e]}},p=function(t,e,n){return t[e]=n.value,t}}var l=/^constructor|extend|define$/,a=function(t){if(e(t,"implement")){"function"==typeof t.implement&&(t.implement=[t.implement]);for(var r=0,i=t.implement.length;i>r;++r)this.implement(new t.implement[r]);delete t.implement}return n(t,function(e,n){n.match(l)||(u(e)&&(t[n]=m(e)),this.define(n,f(t,n)||{writable:!0,enumerable:!0,configurable:!0,value:e}))},this),this},h=function(t){var n,r=this._parent||this.constructor.parent;if(this._parent=r.constructor.parent,!t||!e(r,t))throw new Error("You need to pass a valid super method to .parent","");return n=r[t].apply(this,s.call(arguments,1)),this._parent=r,n},m=function(t){var e,n=o(t);for(e in t)t.hasOwnProperty(e)&&(n[e]=t[e]);return n},d=function v(t,e){var n,r=function(n){t[n]=u(e[n])?u(t[n])?v(t[n],m(e[n])):m(e[n]):e[n]};if(null==t||null==e)return t;for(n in e)e.hasOwnProperty(n)&&r(n);return t},y=function(t,n){"object"==typeof t&&(n=t,t=void 0);var r=n.extend,i=e(n,"constructor")?n.constructor:r?function(){return r.apply(this,arguments)}:function(){};if(delete n.constructor,u(n.options)&&(n.options=m(n.options)),r){var s=r.prototype,f=i.prototype=o(s);i.parent=s,f.constructor=i,u(n.options)&&u(s.options)&&(n.options=d(m(s.options),n.options)),delete n.extend}return n.parent=h,i.define=n.define||r&&r.define||function(t,e){return p(this.prototype,t,e),this},i.implement=a,t&&i.define("_id",{value:t,enumerable:!1}),i.implement(n)};return y.has=e,y.each=n,y.merge=d,y.clone=m,y.create=o,y.define=p,y.hide=function(t,e,n){return t[e]=t[e]||n,p(t,e,{enumerable:!1,value:t[e]}),t[e]},y}),function(t){"function"==typeof define&&define.amd?define("primish/options",["./primish"],t):"undefined"!=typeof module&&module.exports?module.exports=t(require("./primish")):this.options=t(this.primish)}.call(this,function(t){var e="function",n=function(t){return t.replace(/^on([A-Z])/,function(t,e){return e.toLowerCase()})};return t({setOptions:function(r){var i,o;if(this.options||(this.options={}),o=this.options=t.merge(t.clone(this.options),r),this.on&&this.off)for(i in o)if(o.hasOwnProperty(i)){if(typeof o[i]!==e||!/^on[A-Z]/.test(i))continue;this.on(n(i),o[i]),delete o[i]}return this}})}),function(t){"function"==typeof define&&define.amd?define("primish/emitter",["./primish"],t):"undefined"!=typeof module&&module.exports?module.exports=t(require("./primish")):this.emitter=t(this.primish)}.call(this,function(t){var e=Array.prototype.slice,n=0,r={once:function(t,e){var n=this,r=function(){e.apply(this,arguments),n.off(t,r)};return r}},i=t({on:function(e,i){e=e.split(/\s+/);var o,s,u,f,p,c=0,l=e.length,a=this._listeners||t.hide(this,"_listeners",{});t:for(;l>c;++c){u=e[c].split(":"),f=u.shift(),p=u.length&&u[0]in r,p||(f=e[c]),o=a[f]||(a[f]={});for(s in o)if(o[s]===i)continue t;o[(n++).toString(36)]=p?r[u[0]].call(this,f,i):i}return this},off:function(t,e){var n,r,i,o,s=this._listeners,u=0;if(s&&(n=s[t])){for(o in n)if(u++,null==r&&n[o]===e&&(r=o),r&&u>1)break;if(r&&(delete n[r],1===u)){delete s[t];for(i in s)return this;delete this._listeners}}return this},trigger:function(t){var n,r,i=this._listeners,o=e.call(arguments,1),s={};if(i&&(n=i[t])){for(r in n)s[r]=n[r];for(r in s)s[r].apply(this,o)}return this}});return i.definePseudo=function(t,e){r[t]=e},i});