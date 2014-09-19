(function(t){"function"==typeof define&&define.amd?define("primish/primish",t):"undefined"!=typeof module&&module.exports?module.exports=t():this.primish=t()}).call(this,function(){var t=Object.hasOwnProperty,e=function(e,n){return t.call(e,n)},n=function(t,e,n){for(var i in t)if(e.call(n,t[i],i,t)===!1)break;return t};if(!{valueOf:0}.propertyIsEnumerable("valueOf")){var i=Object.prototype,r="constructor,toString,valueOf,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString".split(",");n=function(t,n,o){var u,s,f;for(u in t)if(n.call(o,t[u],u,t)===!1)return t;for(s=0;(u=r[s])&&(f=t[u],f===i[u]&&!e(t,u)||n.call(o,f,u,t)!==!1);s++);return t}}var o=Object.create||function(t){var e=function(){};return e.prototype=t,new e},u=function(t,e){e=~~e;for(var n=-1,i=t.length-e,r=Array(i);++n<i;)r[n]=t[n+e];return r},s=function(){var t=Object.prototype.toString,e="[object Object]";return function(n){return t.call(n)===e&&null!=n}}(),f=Object.getOwnPropertyDescriptor,p=Object.defineProperty;try{p({},"~",{}),f({},"~")}catch(l){f=function(t,e){return{value:t[e]}},p=function(t,e,n){return t[e]=n.value,t}}var c=/^constructor|extend|define$/,a=function(t){if(e(t,"implement")){"function"==typeof t.implement&&(t.implement=[t.implement]);for(var i=0,r=t.implement.length;r>i;++i)this.implement(new t.implement[i]);delete t.implement}return n(t,function(e,n){n.match(c)||(s(e)&&(t[n]=m(e)),this.define(n,f(t,n)||{writable:!0,enumerable:!0,configurable:!0,value:e}))},this),this},h=function(t){var n,i=this._parent||this.constructor.parent;if(this._parent=i.constructor.parent,!t||!e(i,t))throw new Error("You need to pass a valid super method to .parent","");return n=i[t].apply(this,u(arguments,1)),this._parent=i,n},m=function(e){var n,i=o(e);for(n in e)t.call(e,n)&&(i[n]=e[n]);return i},d=function y(e,n){var i,r=function(t){e[t]=s(n[t])?s(e[t])?y(e[t],m(n[t])):m(n[t]):n[t]};if(null==e||null==n)return e;for(i in n)t.call(n,i)&&r(i);return e},v=function(t,n){"object"==typeof t&&(n=t,t=void 0);var i=n.extend,r=e(n,"constructor")?n.constructor:i?function(){return i.apply(this,arguments)}:function(){};if(delete n.constructor,s(n.options)&&(n.options=m(n.options)),i){var u=i.prototype,f=r.prototype=o(u);r.parent=u,f.constructor=r,s(n.options)&&s(u.options)&&(n.options=d(m(u.options),n.options)),delete n.extend}return n.parent=h,r.define=n.define||i&&i.define||function(t,e){return p(this.prototype,t,e),this},r.implement=a,t&&r.define("_id",{value:t,enumerable:!1}),r.implement(n)};return v.has=e,v.each=n,v.merge=d,v.clone=m,v.slice=u,v.create=o,v.define=p,v.hide=function(t,e,n){return t[e]=t[e]||n,p(t,e,{enumerable:!1,value:t[e]}),t[e]},v}),function(t){"function"==typeof define&&define.amd?define("primish/options",["./primish"],t):"undefined"!=typeof module&&module.exports?module.exports=t(require("./primish")):this.options=t(this.primish)}.call(this,function(t){var e="function",n=function(t){return t.replace(/^on([A-Z])/,function(t,e){return e.toLowerCase()})};return t({setOptions:function(i){var r,o;if(this.options||(this.options={}),o=this.options=t.merge(t.clone(this.options),i),this.on&&this.off)for(r in o)if(o.hasOwnProperty(r)){if(typeof o[r]!==e||!/^on[A-Z]/.test(r))continue;this.on(n(r),o[r]),delete o[r]}return this}})}),function(t){"function"==typeof define&&define.amd?define("primish/emitter",["./primish"],t):"undefined"!=typeof module&&module.exports?module.exports=t(require("./primish")):this.emitter=t(this.primish)}.call(this,function(t){var e=t.slice,n=0,i={once:function(t,e){var n=this,i=function(){e.apply(this,arguments),n.off(t,i)};return i}},r=t({on:function(e,r){e=e.split(/\s+/);var o,u,s,f,p,l=0,c=e.length,a=this._listeners||t.hide(this,"_listeners",{});t:for(;c>l;++l){s=e[l].split(":"),f=s.shift(),p=s.length&&s[0]in i,p||(f=e[l]),o=a[f]||(a[f]={});for(u in o)if(o[u]===r)continue t;o[(n++).toString(36)]=p?i[s[0]].call(this,f,r):r}return this},off:function(t,e){var n,i,r,o,u=this._listeners,s=0;if(u&&(n=u[t])){for(o in n)if(s++,null==i&&n[o]===e&&(i=o),i&&s>1)break;if(i&&(delete n[i],1===s)){delete u[t];for(r in u)return this;delete this._listeners}}return this},trigger:function(t){var n,i,r=this._listeners;if(r&&r[t]){i=arguments.length>1?e(arguments,1):[];for(n in r[t])r[t][n].apply(this,i)}return this}});return r.definePseudo=function(t,e){i[t]=e},r});