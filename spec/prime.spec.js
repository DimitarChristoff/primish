'use strict';

var prime = require('../prime');

// core functionality of prime

describe('Creating prototypes', function(){

	beforeEach(function(){
		this.instance = prime({
			constructor: function(cb){
				cb && cb.call(this);
			},
			foo: function(){

			}
		});
	});

	afterEach(function(){
		this.instance = null;
	});

	it('Should create a function constructor', function(){
		expect(typeof this.instance).toBe('function');
	});

	it('Should create objects that are instances of constructor', function(){
		expect(new this.instance() instanceof this.instance).toBeTruthy();
	});
});

describe('Calling `constructor` automatically', function(){

	var obj = {
		runme: function(){}
	}, C = prime({
		constructor: function(){
			obj.runme();
		}
	});

	it('Should call the constructor method when defined', function(){
		spyOn(obj, 'runme');
		new C();
		expect(obj.runme).toHaveBeenCalled();
	});

});

describe('`extend` classes', function(){

	var Human, Student,
		human, student;

	Human = prime({
		live: function(){

		},
		die: function(){

		}
	});

	Student = prime({

		extend: Human,

		study: function(){

		}
	});

	beforeEach(function(){
		human = new Human();
		student = new Student();
	});

	afterEach(function(){
		human = null;
		student = null;
	});

	it('Should make sub classes inherit from parent via prototype', function(){
		expect(student.live).toBeDefined();
	});

	it('Should make sub classes only get methods by inheritance', function(){
		expect(student.hasOwnProperty('live')).toBeFalsy();
	});

	it('Should make sub classes an instance of parent', function(){
		expect(student instanceof Student).toBeTruthy();
		expect(student instanceof Human).toBeTruthy();
	});

	it('Should make parent proto changes available to children', function(){
		Human.implement({
			eat: function(){

			}
		});

		expect(human.eat).toBeDefined();
		expect(student.eat).toBeDefined();
	});

});

describe('.parent should call method from super prototype', function(){

	var obj = {
		runme: function(){}
	}, C = prime({
		method: function(name){
			obj.runme(name);
		}
	});


	it('Should run override method from the super', function(){
		var A = prime({
			extend: C,
			method: function(){

			}
		});

		spyOn(obj, 'runme');
		var a =new A();
		a.method();
		expect(obj.runme).not.toHaveBeenCalled();
	});

	it('Should run from super proto on .parent() call', function(){
		var A = prime({
			extend: C,
			method: function(){
				this.parent('method');
			}
		});

		spyOn(obj, 'runme');
		var a = new A();
		a.method();
		expect(obj.runme).toHaveBeenCalled();
	});

	it('Should throw on a .parent() call without a method', function(){
		expect(function(){
			var A = prime({
				extend: C,
				method: function(){
					this.parent();
				}
			});

			var a = new A();
			a.method();
		}).toThrow('You need to pass a valid super method to .parent');

	});

	it('Should throw on a .parent() call when method not found', function(){
		expect(function(){
			var A = prime({
				extend: C,
				method: function(){
					this.parent('missing');
				}
			});

			var a = new A();
			a.method();
		}).toThrow('You need to pass a valid super method to .parent');

	});

	it('Should pass arguments to .parent() calls by shifting', function(){
		var A = prime({
			extend: C,
			method: function(){
				this.parent('method', 'hai');
			}
		});

		spyOn(obj, 'runme');
		var a = new A();
		a.method();
		expect(obj.runme).toHaveBeenCalledWith('hai');
	});

});

describe('`implement` classes', function(){

	var Human,
		Student,
		student;

	Human = prime({
		live: function(){

		},
		die: function(){

		}
	});

	Student = prime({
		study: function(){

		}
	}).implement(new Human());

	beforeEach(function(){
		student = new Student();
	});

	afterEach(function(){
		student = null;
	});

	it('Should make sub classes inherit from parent via prototype', function(){
		expect(student.live).toBeDefined();
	});

	it('Should not be affected by changes to mixed in class', function(){
		Human.implement({
			shower: function(){}
		});

		expect(student.shower).toBeFalsy();
	});

});

describe('`implement` of classes via mutator property', function(){

	var Human,
		Work,
		Play,
		bob;

	Work = prime({
		one: 'one',
		two: 'two',
		start: function(){},
		end: function(){}
	});

	Play = prime({
		one: '1',
		two: '2',
		drink: function(){},
		eat: function(){}
	});


	Human = prime({
		implement: [Work, Play],
		one: 'uno',
		live: function(){},
		die: function(){}
	});

	beforeEach(function(){
		bob = new Human();
	});

	afterEach(function(){
		bob = null;
	});

	it('Should mixin all constructors from mixins passed', function(){
		expect(bob.drink).toBeDefined();
		expect(bob.start).toBeDefined();
	});

	it('Should apply local properties after mixin ones, overriding', function(){
		expect(bob.one).toEqual('uno');
	});

	it('Should apply mixins in order, overriding', function(){
		expect(bob.two).toEqual('2');
	});

	it('Should also accept a single constructor for mixins, not just array', function(){
		var bob = new (prime({
			implement: Work,
			one: 'uno',
			live: function(){},
			die: function(){}
		}))();

		expect(bob.start).toBeDefined();
	});

});
