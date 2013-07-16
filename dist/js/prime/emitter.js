/*
 primish 0.1.0
 - prototypish inheritance

 emitter for primish, standalone mediator or mixin
 */
;(function(){
	'use strict';

	var wrap = function(prime){
		var slice = Array.prototype.slice;

		var EID = 0;

		var pseudoEvents = {
			once: function(eventName, fn){
				var self = this;
				return function one(){
					fn.apply(this, arguments);
					self.off(eventName, one);
				};
			}
		};

		var hideProperty = function(obj, prop){
			// listeners not to be enumerable where supported
			return obj[prop] = {}, prime.define(obj, prop, {enumerable: false}), obj[prop];
		};

		var emitter = prime({

			on: function(event, fn){
				// supports multiple events split by white space
				event = event.split(/\s+/);
				var i = 0,
					len = event.length,
					listeners = this._listeners || hideProperty(this, '_listeners'),
					events,
					k,
					pseudos,
					eventName,
					knownPseudo;

				loopEvents:
				for (;i < len; ++i){
					pseudos = event[i].split(':');
					eventName = pseudos.shift();
					knownPseudo = pseudos.length && pseudos[0] in pseudoEvents;

					knownPseudo || (eventName = event[i]);
					events = listeners[eventName] || (listeners[eventName] = {});

					for (k in events) if (events[k] === fn) continue loopEvents;
					events[(EID++).toString(36)] = knownPseudo ? pseudoEvents[pseudos[0]].call(this, eventName, fn) : fn;
				}
				return this;
			},

			off: function(event, fn){
				var listeners = this._listeners, events, key, length = 0, l, k;
				if (listeners && (events = listeners[event])){

					for (k in events){
						length++;
						/* don't touch this, === breaks tests due to undefined after delete */
						if (key == null && events[k] === fn) key = k;
						if (key && length > 1) break;
					}

					if (key){
						delete events[key];
						if (length === 1){
							// delete so that the order of the array remains unaffected, making it sparse
							delete listeners[event];
							for (l in listeners) return this;
							delete this._listeners;
						}
					}
				}
				return this;
			},

			trigger: function(event){
				var listeners = this._listeners,
					events,
					k,
					args;

				if (listeners && (events = listeners[event])){
					args = (arguments.length > 1) ? slice.call(arguments, 1) : [];
					for (k in events) events[k].apply(this, args);
				}

				return this;
			}

		});

		emitter.definePseudo = function(pseudo, fn){
			pseudoEvents[pseudo] = fn;
		};

		return emitter;
	}; // wrap

	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// define as an anonymous module so, through path mapping, it can be
		// referenced as the "underscore" module
		define(['./prime'], wrap);
	}
	else if (typeof module !== 'undefined' && module.exports){
		// CommonJS module is defined
		module.exports = wrap(require('./prime'));
	}
	else {
		this.emitter = wrap(this.prime);
	}
}.call(this));