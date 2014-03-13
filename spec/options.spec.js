'use strict';

var primish = require('../primish'),
	emitter = require('../emitter'),
	options = require('../options');


describe('Class with the options mixin', function(){

	it('Should merge options on the instance', function(){
		var TestClass = primish({

			implement: [options],

			options: {
				name: 'bob'
			},

			constructor: function(options){
				this.setOptions(options);
			}

		});

		var i = new TestClass({
			surname: 'roberts'
		});

		expect(i.options.name).toEqual('bob');
		expect(i.options.surname).toEqual('roberts');
	});

	it('Should have own options that don\'t reference proto chain', function(){

		var A = primish({

			implement: [options],

			options: {
				name: 'Bob'
			},

			constructor: function(options){
				this.setOptions(options);
			}

		});

		new A({
			surname: 'Roberts'
		});

		expect(A.prototype.options.surname).not.toEqual('Roberts');

	});

	it('Should merge options on the instance with passed overriding prototype', function(){
		var TestClass = primish({

			implement: [options],

			options: {
				name: 'bob'
			},

			constructor: function(options){
				this.setOptions(options);
			}

		});

		var i = new TestClass({
			name: 'not bob'
		});

		expect(i.options.name).toEqual('not bob');
	});

	it('Should deep merge objects recursively', function(){
		var TestClass = primish({

			implement: [options],

			options: {
				name: 'bob',
				foo: 'bar'
			},

			constructor: function(options){
				this.setOptions(options);
			}

		});

		var other = {
			primary: true,
			secondary: true,
			university: false,
			extra: ''
		};

		delete other.extra;

		var now = new Date();

		var i = new TestClass({
			name: 'not bob',
			education: other,
			// test null (object)
			something: null,
			// date objects
			timestamp: now
		});

		expect(i.options.education.primary).toBe(true);

		// make sure undefined properties and null don't throw
		expect(i.options.education.extra).toBe(undefined);
		expect(i.options.something).toBe(null);
		expect(i.options.timestamp).toEqual(now);
		expect(i.options.foo).toEqual(TestClass.prototype.options.foo);

		// catch derefrencing
		other.primary = false;
		expect(i.options.education.primary).toBe(true);

	});

	it('Should have merged options to dereferenced', function(){
		var TestClass = primish({

			implement: [options],

			options: {
				name: 'bob'
			},

			constructor: function(options){
				this.setOptions(options);
			}

		});

		var obj = {
			surname: 'roberts'
		};

		var i = new TestClass(obj);

		obj.surname = 'not roberts';

		expect(i.options.surname).toEqual('roberts');
	});

	it('Should add events from options automatically, removing from options object', function(){
		var TestClass = primish({

			implement: [options, emitter],

			options: {
				name: 'bob'
			},

			constructor: function(options){
				this.setOptions(options);
			}

		});

		var obj = {
			runme: function(){}
		};

		var i = new TestClass({
			onReady: function(){
				obj.runme();
			}
		});

		spyOn(obj, 'runme');
		i.trigger('ready');

		expect(obj.runme).toHaveBeenCalled();
		expect(i.options.onReady).not.toBeDefined();
		expect(i.options.ready).not.toBeDefined();

	});

	it('Should ignore options onEvent keys if no Emitter mixed in', function(){
		var TestClass = primish({

			implement: [options],

			options: {
				name: 'bob'
			},

			constructor: function(options){
				this.setOptions(options);
			}

		});

		var i = new TestClass({
			onReady: function(){}
		});

		expect(i.options.onReady).toBeDefined();

	});

});


