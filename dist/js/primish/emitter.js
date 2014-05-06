/**
 * @module primish/emitter
 * @description emitter for primish, standalone mediator or mixin
 **/
;(function(factory){
	// UMD wrap
	if (typeof define === 'function' && define.amd){
		define('primish/emitter', ['./primish'], factory);
	} else if (typeof module !== 'undefined' && module.exports){
		module.exports = factory(require('./primish'));
	} else {
		this.emitter = factory(this.primish);
	}
}).call(this, function(primish){
	var slice = Array.prototype.slice;

	/**
	 * unique event ids to store in object
	 * @type {number}
	 */
	var EID = 0;

	/**
	 * @description known / registered pseudo events, used via :
	 * @type {{once: once}}
	 */
	var pseudoEvents = {
		/**
		 * @description Subscribe to a once-only, event pseudo
		 * @param {string} event - prefix string (eg. use change:once)
		 * @param {function} fn - function to call once
		 * @returns {function} wrapped fn
		 */
		once: function(event, fn){
			var self = this,
				wrapped = function(){
					fn.apply(this, arguments);
					self.off(event, wrapped);
				};
			return wrapped;
		}
	};

	/**
	 * @class emitter
	 * @description mixin class for firing class events
	 */
	var emitter = primish({

		/**
		 * @description subscribes to an event handler
		 * @param {string} event - name of the event or multiple events, separated by space
		 * @param {function) fn - function to call when event matches
		 * @returns {emitter}
		 */
		on: function(event, fn){
			// supports multiple events split by white space
			event = event.split(/\s+/);
			var i = 0,
				len = event.length,
				listeners = this._listeners || primish.hide(this, '_listeners', {}),
				events,
				k,
				pseudos,
				eventName,
				knownPseudo;

			loopEvents:
				for (; i < len; ++i){
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

		/**
		 * @description unsubscribes from an event, needs exact name and saved fn ref to find a match
		 * @param {string} event - single event name
		 * @param {function} fn - matching callback to remove
		 * @returns {emitter}
		 */
		off: function(event, fn){
			var listeners = this._listeners,
				events,
				key,
				length = 0,
				l,
				k;

			if (listeners && (events = listeners[event])){
				for (k in events){
					length++;
					if (key == null && events[k] === fn) key = k;
					if (key && length > 1) break;
				}

				if (key){
					delete events[key];
					if (length === 1){
						// delete so that the order of the array remains unaffected, making it sparse
						delete listeners[event];
						for (l in listeners) return this;
						// none left, remove listeners prop
						delete this._listeners;
					}
				}
			}
			return this;
		},

		/**
		 * @description fires an event
		 * @param {string} event name
		 * @param {*=} arg1 optional arguments
		 * @param {*=} argN optional arguments
		 * @returns {emitter}
		 */
		trigger: function(event){
			var events = this._listeners,
				k,
				args;

			if (events){
				events = events[event] || {};
				args = arguments.length > 1 ? slice.call(arguments, 1) : [];
				for (k in events) events[k].apply(this, args);
			}
			return this;
		}

	});

	emitter.definePseudo = function(pseudo, fn){
		pseudoEvents[pseudo] = fn;
	};

	return emitter;
});
