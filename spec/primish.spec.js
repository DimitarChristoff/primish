'use strict';

var primish = require('../primish');

// core functionality of prime

describe('Creating prototypes', function(){

	beforeEach(function(){
		this.instance = primish({
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

describe('Should be able to assign ids to classes', function(){

	it('Should accept an id and make a prime', function(){
		var User = primish('User', {
			constructor: function(){

			}
		});

		var user = new User();
		expect(user._id).toBe('User');
	});

	it('Class id should be immutable and not enumerable', function(){
		var User = primish('User', {
			constructor: function(){

			}
		});

		var user = new User(), keys = Object.keys(user);

		expect(keys.indexOf('_id')).toBe(-1);
	});
});

describe('Calling `constructor` automatically', function(){

	var obj = {
		runme: function(){}
	}, C = primish({
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

describe('Constructor scope', function(){

	it('Should have a context', function(){
		var Class = primish({
			constructor: function(){
				expect(this).not.toBeUndefined();
			}
		});

		new Class();
	});
});

describe('`extend` classes', function(){

	var Human, Student,
		human, student,
		opt = {
			age: 30
		};

	Human = primish({

		options: opt,

		test: {
			foo: 'bar'
		},

		live: function(){

		},
		die: function(){

		}
	});

	Student = primish({

		options: {
			school: 'LSE',
			age: 34
		},

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

	it('Should recursively merge objects from protos', function(){
		expect(human.options.age).not.toEqual(student.options.age);
		expect(human.options.age).toEqual(Human.prototype.options.age);
		expect(student.options.age).toEqual(student.constructor.prototype.options.age);
		expect(student.options.school).toEqual(Student.prototype.options.school);
		expect(student.hasOwnProperty('test')).toBeFalsy();
		expect(student.test.foo).toEqual(human.constructor.prototype.test.foo);
	});

});

describe('.parent should call method from super prototype', function(){

	var obj = {
		runme: function(){}
	}, C = primish({
		method: function(name){
			obj.runme(name);
		}
	});


	it('Should run override method from the super', function(){
		var A = primish({
			extend: C,
			method: function(){

			}
		});

		spyOn(obj, 'runme');
		var a = new A();
		a.method();
		expect(obj.runme).not.toHaveBeenCalled();
	});

	it('Should run from super proto on .parent() call', function(){
		var A = primish({
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
			var A = primish({
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
			var A = primish({
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
		var A = primish({
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

	Human = primish({
		live: function(){

		},
		die: function(){

		}
	});

	Student = primish({
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

	Work = primish({
		one: 'one',
		two: 'two',
		start: function(){},
		end: function(){}
	});

	Play = primish({
		one: '1',
		two: '2',
		drink: function(){},
		eat: function(){}
	});


	Human = primish({
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
		var bob = new (primish({
			implement: Work,
			one: 'uno',
			live: function(){},
			die: function(){}
		}))();

		expect(bob.start).toBeDefined();
	});

});
