/**
 * @module primish/options
 * @description setOptions mixin for primish
 **/
;(function(factory){
	// UMD wrap
	if (typeof define === 'function' && define.amd){
		define(['./primish'], factory);
	} else if (typeof module !== 'undefined' && module.exports){
		module.exports = factory(require('./primish'));
	} else {
		this.options = factory(this.primish);
	}
}).call(this, function(primish){
	var sFunction = 'function',
		removeOn = function(string){
			// removes <on>Event prefix and returns a normalised event name
			return string.replace(/^on([A-Z])/, function(full, first){
				return first.toLowerCase();
			});
		};

	return primish({
		// a mixin class that allows for this.setOptions
		setOptions: function(options){
			var option,
				o;

			this.options || (this.options = {});
			o = this.options = primish.merge(this.options, options);

			// add the events as well, if class has events.
			if ((this.on && this.off))
				for (option in o){
					if (o.hasOwnProperty(option)){
						if (typeof o[option] !== sFunction || !(/^on[A-Z]/).test(option)) continue;
						this.on(removeOn(option), o[option]);
						delete o[option];
					}
				}
			return this;
		}
	});
});
