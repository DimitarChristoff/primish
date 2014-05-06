'use strict';

var primish = require('../primish'),
	emitter = require('../emitter');


// core functionality of prime

describe('Creating a class with the events mixin', function(){

	var TestClass;
	beforeEach(function(){
		TestClass = primish({
			constructor:function(){}
		}).implement(new emitter());
	});

	it('Should create a class with emitter via .implement()', function(){

		var test = new TestClass();

		expect(typeof test.on).toBe('function');
		expect(typeof test.off).toBe('function');
		expect(typeof test.trigger).toBe('function');
	});

	it('Should create a class with emitter via implement: [] mutator', function(){
		var TestClass = primish({
			implement: emitter
		});

		var test = new TestClass();

		expect(typeof test.on).toBe('function');
	});
});

describe('Older tests from prime-emitter', function(){

	it('Should allow subscriptions with on', function(){
		var publisher = new emitter(), called = 0;
		publisher.on('publish', function(){
			called++;
		});
		expect(called).toBe(0);
		publisher.trigger('publish');
		expect(called).toBe(1);
	});

	it('Should allow unsubscription with off', function(){
		var publisher = new emitter(), called = 0;
		var changeIdea = function(){
			called++;
		};
		publisher.on('publish', function(){
			called++;
		});
		publisher.on('publish', changeIdea);
		expect(called).toBe(0);
		publisher.trigger('publish');
		expect(called).toBe(2);
		publisher.off('publish', changeIdea);
		publisher.trigger('publish');
		expect(called).toBe(3);
	});

	it('Should publish with emit', function(){
		var publisher = new emitter(), called = 0;
		publisher.on('add1', function(){
			called++;
		});
		publisher.on('subtract1', function(){
			called--;
		});
		publisher.on('add5', function(){
			called += 5;
		});
		expect(called).toBe(0);
		publisher.trigger('add5');
		expect(called).toBe(5);
		publisher.trigger('foo');
		expect(called).toBe(5);
		publisher.trigger('subtract1');
		expect(called).toBe(4);
		publisher.trigger('add1');
		expect(called).toBe(5);
	});

	it('Should remove all listeners', function(){
		var events = new emitter(), called = 0;
		var listener = function(){
			called++;
		};
		events.on('thing', listener);
		events.off('thing', listener);
		events.trigger('thing');
		expect(called).toBe(0);
	});

	it('Should not add the same listener twice', function(){
		var events = new emitter(), called = 0;
		var listener = function(){ called++; };
		events.on('thing', listener);
		events.on('thing', listener);
		events.trigger('thing');
		expect(called).toBe(1);
	});

	it('Should not remove listeners of a different type', function(){
		var events = new emitter(), calledA = 0, calledB = 0;
		var listenerA = function(){ calledA++; };
		var listenerB = function(){ calledB++; };
		events.on('thing', listenerA);
		events.on('thang', listenerB);
		events.trigger('thing');
		events.trigger('thang');
		expect(calledA).toBe(1);
		expect(calledB).toBe(1);

		events.off('thing', listenerA);

		events.trigger('thing');
		events.trigger('thang');
		expect(calledA).toBe(1);
		expect(calledB).toBe(2);
	});

	it('Should add multiple events separated by space', function(){
		var events = new emitter(), called = 0;
		var listener = function(){ called++; };
		events.on('thing thang', listener);
		events.trigger('thing');
		events.trigger('thang');
		expect(called).toBe(2);
	});

	it('Should remove events with a :once pseudo', function(){
		var events = new emitter(), called = 0;
		events.on('foo:once bar', function(){
			called++;
		});
		events.trigger('foo');
		events.trigger('foo');
		events.trigger('bar');
		expect(called).toBe(2);
	});

	it('Should not affect call queue when an event is removed', function(){
		var events = new emitter(),
			called = 0,
			onFoo = function(){
				called++;
				events.off('foo', onFoo);
			};
		events.on('foo', onFoo);
		events.on('foo', function(){
			called++;
		});

		events.trigger('foo');
		expect(called).toBe(2);
		events.trigger('foo');
		expect(called).toBe(3);
	});

	it('Should allow you to define custom pseudos', function(){
		var events = new emitter(), called = 0;
		var isAdmin = false;

		emitter.definePseudo('admin', function(eventName, fn){
			return function(){
				// some condition
				if (isAdmin){
					fn.apply(this, arguments);
				}
			}
		});

		events.on('foo:admin', function(){
			called++;
		});
		events.trigger('foo');
		isAdmin = true;
		events.trigger('foo');
		expect(called).toBe(1);
	});

	it('Should add unknown pseudos as string literals and fire them', function(){
		var events = new emitter(), called = 0, fn = function(){ called++; };

		events.on('foo:bar', fn);
		events.trigger('foo:bar');
		expect(called).toBe(1);
	});

	if ('keys' in Object && typeof Object.keys === 'function'){
		it('Should hide _listeners from enums where supported', function(){
			var events = new emitter();

			events.on('foo', function(){});
			var keys = Object.keys(events);

			expect(keys.indexOf('_listeners')).toBe(-1);
		});
	}
});
