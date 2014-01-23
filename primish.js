/**
 * @module primish 0.2.2 - prototypal inheritance sugar, MooTools Style
 * @description browser-friendly or node-js Class sugar
 **/
;(function(factory){
	// UMD wrap
	if (typeof define === 'function' && define.amd){
		define('primish/primish', factory);
	} else if (typeof module !== 'undefined' && module.exports){
		module.exports = factory();
	} else {
		this.primish = factory();
	}
}).call(this, function(){
	var hasOwnProperty = Object.hasOwnProperty,
		has = function(obj, key){
			// hasOwnProperty shortcut
			return hasOwnProperty.call(obj, key);
		};

	var each = function(object, method, context){
		for (var key in object)
			if (method.call(context, object[key], key, object) === false)
				break;
		return object;
	};

	if (!{ valueOf: 0 }.propertyIsEnumerable('valueOf')){
		var buggy = 'constructor,toString,valueOf,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString'.split(','),
			proto = Object.prototype;

		each = function(object, method, context){
			var key,
				i,
				value;

			for (key in object)
				if (method.call(context, object[key], key, object) === false)
					return object;
			for (i = 0; key = buggy[i]; i++){
				value = object[key];
				if ((value !== proto[key] || has(object, key)) && method.call(context, value, key, object) === false)
					break;
			}
			return object;
		};
	}

	// use Object.create if available or polyfill
	var create = Object.create || function(self){
		var constructor = function(){
		};
		constructor.prototype = self;
		return new constructor();
	};

	// slice reference
	var slice = Array.prototype.slice;

	var isObject = (function(){
		var toString = Object.prototype.toString,
			objString = '[object Object]';
		return function(obj){
			return toString.call(obj) === objString && obj != null;
		};
	}());

	// polyfill these also
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
		defineProperty = Object.defineProperty;

	try {
		defineProperty({}, '~', {});
		getOwnPropertyDescriptor({}, '~');
	} catch (e) {
		// no native support, fix it.
		getOwnPropertyDescriptor = function(object, key){
			return { value: object[key] };
		};
		defineProperty = function(object, key, descriptor){
			object[key] = descriptor.value;
			return object;
		};
	}

	var escapeKeys = /^constructor|extend|define$/;

	// the mixin is via Object.defineProperty for Object.keys (each)
	var implement = function(proto){
		if (has(proto, 'implement')){
			// mixins: mutator key.
			// expects [array] or single [function constructor]
			typeof proto.implement === 'function' && (proto.implement = [proto.implement]);

			for (var i = 0, len = proto.implement.length; i < len; ++i)
				this.implement(new proto.implement[i]());

			delete proto.implement;
		}

		// copies properties from other classes
		each(proto, function(value, key){
			if (!key.match(escapeKeys)){
				isObject(value) && (proto[key] = clone(value));
				this.define(key, getOwnPropertyDescriptor(proto, key) || {
					writable: true,
					enumerable: true,
					configurable: true,
					value: value
				});
			}
		}, this);

		return this;
	};

	var parent = function(method){
		// call a method from immediate parent with scope of current object
		// expected method argument
		var parent = this._parent || this.constructor.parent,
			result;

		this._parent = parent.constructor.parent;
		if (!method || !has(parent, method)){
			throw new Error('You need to pass a valid super method to .parent', '');
		}

		result = parent[method].apply(this, slice.call(arguments, 1));
		this._parent = parent;
		return result;
	};

	var clone = function(obj){
		// clones an object, needs a constructor
		var copy = create(obj),
			key;
		for (key in obj){
			if (obj.hasOwnProperty(key)) copy[key] = obj[key];
		}
		return copy;
	};

	var merge = function merge(a, b){
		// extending objects (merge)
		var k,
			callback = function(key){
				// primitives from b are just copied, if b is object, it is de-referenced and merged
				a[key] = (isObject(b[key])) ? (!isObject(a[key])) ? clone(b[key]) : merge(a[key], clone(b[key])) : b[key];
			};

		// Don't touch 'null' or 'undefined' objects.
		if (a == null || b == null)
			return a;

		for (k in b) if (b.hasOwnProperty(k)) callback(k);

		return a;
	};

	// main
	var primish = function(id, proto){

		if (typeof id === 'object'){
			proto = id;
			id = undefined;
		}

		var superclass = proto.extend;
		// if our nice proto object has no own constructor property
		// then we proceed using a ghosting constructor that all it does is
		// call the parent's constructor if it has a superclass, else an empty constructor
		// proto.constructor becomes the effective constructor
		var constructor = has(proto, 'constructor') ? proto.constructor : superclass ? function(){
			return superclass.apply(this, arguments);
		} : function(){
		};

		delete proto.constructor;

		if (superclass){
			var superproto = superclass.prototype;
			// inherit from superclass
			var cproto = constructor.prototype = create(superproto);

			// setting constructor.parent to superprime.prototype
			// because it's the shortest possible absolute reference
			constructor.parent = superproto;
			cproto.constructor = constructor;

			// merge objects
			isObject(proto.options) && isObject(superproto.options) && (proto.options = merge(clone(superproto.options), proto.options));

			delete proto.extend;
		}

		// ability to call super via .parent
		proto.parent = parent;

		// inherit (kindof inherit) define
		constructor.define = proto.define || superclass && superclass.define || function(key, descriptor){
			defineProperty(this.prototype, key, descriptor);
			return this;
		};

		// copy mixin (this should never change)
		constructor.implement = implement;

		id && constructor.define('_id', {
			value: id,
			enumerable: false
		});

		// finally implement proto and return constructor
		return constructor.implement(proto);
	};

	// exports
	primish.has = has;
	primish.each = each;
	primish.merge = merge;

	// prime.create is Object.create polyfill
	primish.create = create;
	primish.define = defineProperty;
	primish.hide = function(obj, prop){
		return obj[prop] = obj[prop] || {}, defineProperty(obj, prop, {enumerable: false, value: obj[prop]}), obj[prop];
	};

	return primish;
});
