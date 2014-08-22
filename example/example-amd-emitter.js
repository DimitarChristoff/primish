require.config({
	paths: {
		'primish/primish': '../primish',
		'primish/emitter': '../emitter'
	}
});

define(function(require){
	'use strict';

	var primish = require('primish/primish'),
		emitter = require('primish/emitter');


	var Human = primish({

		implement: emitter,

		constructor: function(name){
			this.dob = (new Date()).getTime();
			this.name = name || 'unknown';
			this.age = 0;
		},

		getAge: function(){
			return (new Date()).getTime() - this.dob;
		},

		getName: function(){
			return this.name;
		},

		live: function(years){
			this.age += years;
		}

	}),
	Ninja = primish({

		extend: Human,

		constructor: function(name, rank){
			this.parent('constructor', name);
			this.setRank(rank || 'Academy');
		},

		getRank: function(){
			return this.rank;
		},

		setRank: function(rank){
			this.rank = rank;
		},

		live: function(years){
			this.parent('live', years);
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

//		var c = 500000;
//		console.time('parent');
//		while (c--)
//			chuck.live(1);
//		console.timeEnd('parent');

	}, 1000);


	return;
	var foo = new emitter();

	foo.on('foo', function(bar){
		bar;
	});

	setTimeout(function(){
		var c = 500000;
		console.time('events:trigger');
		while (c--)
			foo.trigger('foo').trigger('foo', 'bar');
		console.timeEnd('events:trigger');
	}, 5000);
});