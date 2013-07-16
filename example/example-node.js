/*jshint browser:false, node:true */
// node:true will allow strict global
'use strict';

// definitions and deps
require('colors');

var prime = require('../prime'),
	Human = prime({

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
	Ninja = prime({

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

setTimeout(function(){
	console.log(bob.getName(), bob.getAge());
	console.log(chuck.getName(), chuck.getAge(), chuck.getRank().red);
}, 1000);