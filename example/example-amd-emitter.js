define(function(require){
	'use strict';

	var prime = require('../primish'),
		emitter = require('../emitter');


	var Human = primish({

		implement: emitter,

		constructor: function(name){
			this.dob = (new Date()).getTime();
			this.name = name || 'unknown';
		},

		getAge: function(){
			return (new Date()).getTime() - this.dob;
		},

		getName: function(){
			return this.name;
		}

	}),
	Ninja = primish({

		extend: Human,

		constructor: function(name, rank){
			this.constructor.parent.constructor.call(this, name);
			this.setRank(rank || 'Academy');
		},

		getRank: function(){
			return this.rank;
		},

		setRank: function(rank){
			this.rank = rank;
		}
	});

	// instantiation.
	var bob = new Human('Bob');
	var chuck = new Ninja('Chuck Norris', 'Sennin');

	// example subscribe
	bob.on('done:once', function(){
		console.log('done event fired for', this.getName());
	});

	setTimeout(function(){
		console.log(bob.getName(), bob.getAge());
		// example trigger
		bob.trigger('done');

		// should not trigger a second time
		bob.trigger('done');

		console.log(chuck.getName(), chuck.getAge(), chuck.getRank());
	}, 1000);

});