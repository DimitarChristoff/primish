require.config({
	paths: {
		'primish/primish': '../primish',
		'primish/emitter': '../emitter'
	}
});

define(function(require){
	'use strict';

	var primish = require('primish/primish'),
		Human = primish({

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
				this.parent('constructor', name);
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

	setTimeout(function(){
		console.log(bob.getName(), bob.getAge());
		console.log(chuck.getName(), chuck.getAge(), chuck.getRank());
	}, 1000);

});