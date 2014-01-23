primish
=======

A prime derivative that went beyond repair. Initially a fork of [MooTools prime](https://github.com/mootools/prime/), now with a lot of sugar. 

Why fork prime in the first place? Well... prime is very good. But it is written as a CommonJS module and it needs a fair amount of packaging and bundling of plugins and behaviours in order to make it work in a browser. Having to repeat these tasks for every project became repetitive and tedious after a while, hence this mini release. It does not only do module packaging, there are some small changes in code.

## Differences

### prime changes

- forked from before the new prime [types and object mixins](https://github.com/mootools/prime/blob/master/index.js#L6-L11).
- `.parent()`
- `.implement()` and `implement` mutator, like mootools. not `mixin`
- `extend`, not `inherits`
- `prime.merge()` shallow Object merging
- object keys of constructor object are NOT dereferenced / cloned
- only `options` key is merged with supers, not other objects
- extras from prime like utils, shell, type, etc have all been removed, recommended util library is `lodash`
- primish classes can have IDs for reflection like in AMD.

### emitter changes

- `.emit` is actually `.trigger`, so it's not an `emitter` as such :)
- no support for defered async events (see [this](https://github.com/mootools/prime/blob/master/emitter.js#L50-L65))
- support for event stacking like `.on('foo bar baz', function(){});`
- support for event pseudos like `.on('foo:once', function(){});`
- `emitter.definePseudo()` to allow custom pseudo events

### options

- `.setOptions()` - shallow merging of object with `this.options`
- support for emitter events via `onEventname` -> `this.on('eventname')` like in MooTools 1.x

### browser support

The main driving force behind primish is to change prime to work in a browser out of the box as well as under nodejs.
This fork changes the code to work w/o any dependencies and support AMD (eg. RequireJS) as well as simple browser exports to gloabls. If you don't have an AMD loader and not under NodeJS / browserify, it will export `window.prime`, `window.emitter` and `window.options`,
so be careful. Another goal has been to bring as much MooTools 1.x sugar into classes as possible.

### changelog

- 0.3.3 requirejs 2.1.10 compatible bundles support via module ids
- 0.3.2 requirejs uglify2 build

## Testimonials

[kentaromiura](https://github.com/kentaromiura), mootools-core and mootools-prime developer said:

> _I guess that when you said I'll go and make my own version of prime with, blackjack and hookers you really meant it_

![our own](http://cdn.meme.li/instances/300x300/39768609.jpg)

## Creating a Class

To create a new Class, you simply need to do:

```ace
require(['primish/primish'], function(primish){

	var Human = primish({
		setName: function(name){
			this.name = name;
		},
		getName: function(){
			return this.name;
		}
	});

	var Bob = new Human();
	Bob.setName('Bob');
	console.log(Bob.getName()); // 'Bob'

});
```

You can also add a constructor method on your config object to run automatically:

```ace
require(['primish/primish'], function(primish){

	var Human = primish({
		constructor: function(name){
			name && this.setName(name);
		},
		setName: function(name){
			this.name = name;
		},
		getName: function(){
			return this.name;
		}
	});

	var Bob = new Human('Bob');
	console.log(Bob.getName()); // 'Bob'

});
```

Here is an example that will make the name property `readonly` and  example private variables

```ace
require(['primish/primish'], function(primish){

    var Human = (function(){
        var storage = {},
            hid = 0;

        var Human = primish({
            constructor: function(name){
                this.$hid = hid++;
                storage[this.$hid] = {};
                // disallow changes to human id
                prime.define(this, '$hid', {
                    writable: false,
                    enumerable: false
                });

                prime.define(this, 'name', {
                    configurable: false,
                    get: function(){
                        return this.getName();
                    }
                });

                name && this.setName(name);
            },
            setName: function(name){
                storage[this.$hid].name = name;
            },
            getName: function(){
                return storage[this.$hid].name;
            }
        });

        return Human;
    }());

    var Bob = new Human('Bob'),
        Greg = new Human('Greg');

    console.log(Bob);
    console.log(Bob.getName()); // 'Bob'
    console.log(Bob.name); // 'Bob'
    Bob.name = 'Robert'; // nope, should not change.
    console.log(Bob.name); // 'Bob'
    Bob.$uid = Greg.$uid; // try to puncture Greg's storage
    console.log(Bob.name); // 'Bob'

});
```

What happens behind the scenes? `prime` accepts a single argument as a config object. The object is a simple JavaScript
Object - with special keys (also referred to `mutator keys`).

A `mutator key` is a key:value pair that has a special meaning and is used differently by the Class constructor. The
following keys in your config object are considered `mutator`:

### constructor

The `constructor` method in your config object is what becomes the prime constructor. It runs automatically when you
instantiate and can accept any number of arguments, named or otherwise.

```ace
require(['primish/primish'], function(primish){
	// have an element
	var div = document.createElement('div');
	div.setAttribute('id', 'myWidget');
	document.body.appendChild(div);

	var Widget = primish({
		options: {
			title: 'My Widget'
		},
		constructor: function(el, options){
			this.element = document.getElementById(el);
			if (options && Object(options) === options){
				this.options = options;
			}
			this.element.innerHTML = this.options.title;
		}
	});

	var instance = new Widget('myWidget', {
		title: 'Cool Widget',
		height: 300
	});

	console.log(instance.options.title); // 'Cool Widget'
	console.log(instance.element.innerHTML); // 'Cool Widget'
});
```

#### class IDs

Primish also supports Class IDs (for 'reflection') - similar to AMD's module IDs. The first argument can be an optional
string ID, which can then be accessed via `instance._id`. When possible, these are added via `Object.defineProperty` and
are not enumerable.

```ace
require(['primish/primish'], function(primish){

	var User = primish('Admin.User', {
		constructor: function(){
			console.log(this._id);
		}
	});

	var instance = new User();
	console.log('It looks like the instance is ' + instance._id);
});
```

Caveat: if your super Class has an ID but your subclass does not, it will still resolve this via the prototype chain
and may incorrectly identify your instance as the parent. Make sure you use IDs recursively if you need them.

### extend

The special key `extend` defines what SuperClass your new Class will inherit from. It only accepts a single argument,
pointing to another Class. The resulting new Class definition will have its prototype set to the SuperClass and inherit
any of its static properties and methods via the scope chain.

This allows you to abstract differences between Classes without having to repeat a lot of code.

```ace
require(['primish/primish'], function(primish){
	var Rectangle = primish({

		constructor: function(width, height){
			return this.setWidth(width).setHeight(height);
		},

		setWidth: function(width){
			this.width = width;
			return this; // allow chaining
		},

		setHeight: function(height){
			this.height = height;
			return this;
		},

		squareRoot: function(){
			return this.height * this.width;
		}

	});

	var Square = primish({

		// subclass of Rectangle
		extend: Rectangle,

		constructor: function(side){
			return this.setSide(side);
		},

		setSide: function(side){
			// both sides are the same
			this.width = this.height = side;
			return this;
		},

		setWidth: function(width){
			return this.setSide(width);
		},

		setHeight: function(height){
			return this.setSide(height);
		}

	});

	var square = new Square(30);
	square.setWidth(5); // local
	console.log(square.height); // 5
	console.log(square.squareRoot()); // from parent proto of Rectangle, 25
});
```
Changes to the parent Class are also reflected in the child Class by inheritance (unless the child has a local
implementation). This differs from when you use the [implement](#creating-a-class/implement) directives, which copies instead.

```javascript
// continued from above
Rectangle.prototype.shrink = function(){
	this.width--;
	this.height--;
	return this;
};

// square can also now call .shrink:
square.setSide(5).shrink();
square.width; // 4;
square.height; // 4
```

**Warning**: when creating a new sub class, if you have an `options` object in the constructor and the super class also has it,
it will automatically merge them for you. This is really helpful when using the [options](#plugins/options) mixin:

```javascript
require(['primish/primish'], function(primish){
	var a = primish({
		options: {
			x: 1,
			y: 1
		}
	});

	var b = primish({
		extend: a,
		options: {
			z: 1
		}
	});

	console.log(new b().options);  // {x:1, y:1, z:1}
});
```

### implement

The special key `implement` is used to tell prime which other Objects' properties are to be `copied` into your own Class
definition. Mixins do not work via inheritance, they create a local instance of the properties.

When used as a property, `implement` accepts either a single Class or an array of Classes to implement.

```ace
require(['primish/primish'], function(primish){
	// example using a small event emitter as a mixin
	var EID = 0;

	var Emitter = primish({

		on: function(event, fn){
			var listeners = this._listeners || (this._listeners = {}),
				events = listeners[event] || (listeners[event] = {});

				for (var k in events) if (events[k] === fn) return this;

				events[(EID++).toString(36)] = fn;
			return this;
		},

		trigger: function(event){
			var listeners = this._listeners, events, k, args;
			if (listeners && (events = listeners[event])){
				args = (arguments.length > 1) ? slice.call(arguments, 1) : [];
				for (k in events) events[k].apply(this, args);
			}
			return this;
		}

	});

	var myClass = primish({

		// implement the emitter:
		implement: [Emitter],

		doSomethingImportant: function(){
			this.trigger('important');
		}

	});

	var instance = new myClass();

	// bind some event, .on is available
	instance.on('important', function(){
		console.log('important is done');
	});

	// call the method that will fire the event.
	instance.doSomethingImportant();
});
```

There is an alternative syntax to allow `late implementation` via the `.mixin` method:

```javascript
myClass.implement(new OtherClass());
// or chaining on an instance
instanceofMyClass.implement(new OtherClass2()).implement(new OtherClass3());

// late binding at proto definition also works
var myClass = primish({}).implement(new OtherClass);
```

<div class="alert">Note: When a mixin is implemented, the mixin Class is instantiated (via `new`) and the methods are copied from
the instance, not the prototype. Changing the mixin prototype afterwards will not automatically make the changes available
in your Class instances (unlike when using [extend](#creating-a-class/extend))


### parent

When [extending a Class](#extend), you can access methods from the super via the `.parent()` method. It expects at least
1 argument - the method name as `String`. This is synthactic sugar for saying:

`this.constructor.prototype.methodname.apply(this, [arguments])`, where methodname is the method passed as string.

The parent method is borrowed from Arian's prime-util repo.

Here is a more comprehensive example:

```ace
require(['primish/primish'], function(primish){
	// this example won't work w/o jQuery and ECMA5
	// assume this.$element is a jquery wrapped el.

	var Widget = primish({

		attachEvents: function(){
			this.$element.on('click', this.handleclick.bind(this));
		},
		handleClick: function(){

		},
		setTitle: function(title){
			this.$element.find('.title').text(title);
		}

	});

	var WeatherWidget = primish({

		extend: Widget,

		attachEvents: function(){
			this.parent('attachEvents'); // call it on super Widget
			// do more.
			this.$element.find('input').on('blur', this.validateInput.bind(this));
		},
		validateInput: function(event){

		}

	});

	// example with shifting arguments
	var NewsWidget = primish({

		extend: Widget,

		setTitle: function(text){
			this.$element.find('.sub-heading').addClass('active');
			this.parent('setTitle', text); // passes original arg to parent.
		}

	});
});
```

## Define

Define is a micro polyfill to `Object.defineProperty` - see [MDN](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty). It works in conjunction with `Object.getOwnPropertyDescriptor`, which is also shimmed for older browsers.

This allows you to have read-only properties of objects, or private getters/setters. Example use

```ace
require(['primish/primish'], function(primish){
	var Human = primish({

		constructor: function(name){
			this.name = name;

			// make name readonly
			prime.define(this, 'name', {
				writable: false,
				enumerable: true
			});
		},

		setName: function(name){
			this.name = name; // won't work in modern browsers
		}

	});

	var Bob = new Human('Bob');

	Bob.setName('Robert');

	Bob.name = 'Rob';

	// should be fine.
	console.info(Bob.name);
	console.assert(Bob.name === 'Bob');

});
```

## Plugins

### emitter

The Emitter class can work either as a [mixin](#creating-a-class/implement) or as a standalone Class instance. It provides any Class that uses it with 3 methods it can call:

- `.on(event, callback)` - subscribes to `String(event)` and runs `callback` when fired.
- `.off(event, callback)` - removes specific subscription to `String(event)` by exact reference to `callback`. Removing events requires you to be able to pass on the original bound callback.
- `.trigger(event, [Optional arguments])` - fires `String(event)` and optionally passes arguments to the callback

By default, the scope of `this` in any event callback function will be the object that fired it, not the subscriber. If you want to keep scope bound to your local instance, you need to use `Function.prototype.bind` (if ES5Shim is being used) or `_.bind` (lodash or underscore), which is probably safer.

#### Using events

```ace
require(['primish/primish', 'primish/emitter'], function(primish, emitter){
	// this example won't run w/o ECMA5 Function.prototype.bind

	var someController = new (primish({
		implement: [emitter]
	}))();

	var Human = primish({
		implement: [Emitter],
		constructor: function(){
			this.attachEvents();
		},
		eat: function(energy){
			this.energy += energy;
			// fire an event, passing how much and new energy level
			this.trigger('eat', [energy, this.energy]);
		},
		attachEvents: function(){
			// subscribe to another instance's init event
			someController.on('init', this.initialize.bind(this));

			// example of an event that gets removed after a single run
			this.boundFetch = this.dataFetched.bind(this);
			someController.on('fetch', this.boundFetch);
		},
		initialize: function(){
			// this will only run after the controller fires init, this = self.
			console.log('ready to do stuff');
		},
		dataFetched: function(){
			// should only run once and unsubscribe
			// do stuff
			console.log('we have data');

			// remove the event by passing reference to the saved bound function
			this.off('fetch', this.boundFetch);
			delete this.boundFetch;
		}
	});

	var Bob = new Human();
	someController.trigger('init');
	setTimeout(function(){
		someController.trigger('fetch');
	}, 1000);
});
```

You can also use **named anonymous functions** to remove your own event in a hurry:

```ace
require(['primish/primish', 'primish/emitter'], function(primish, emitter){
	var Human = primish({
		implement: [emitter],
		constructor: function(){
			this.on('hi', function hiEvent(){
				console.log('running callback');
				this.off('hi', hiEvent);
			});
		}
	});

	var h = new Human();
	h.trigger('hi').trigger('hi'); // should only console.log once

	// or simply use the :once pseudo
	h.on('bye:once', function(){
		console.log('bye');
	});

	h.trigger('bye');
	h.trigger('bye'); // won't do anything
});

```

There is also syntactic sugar available for adding more than one event to the same callback:

```javascript
var cb = function(){
};

model.on('change fetch create', cb); // any of change, fetch or create events fire the same handler
```

#### definePseudo

Emitter supports `pseudo events`, similar in style to CSS pseudos. For instance: `load:once` is a `load` event with a `once` pseudo.

By default, emitter ships with `once` pre-defined - which will run an event callback once only, then unbind itself.

It exposes an API to define custom pseudos on the emitter object.

```ace
require(['primish/primish', 'primish/emitter'], function(primish, emitter){

    var user = {
        role: 'tester'
    };

    // definePseudo takes 2 arguments - base event name and fn callback
    emitter.definePseudo('admin', function(eventName, fn){
        // need to return a function
        return function(){
            // eg, check if user.role is admin
            if (user.role === 'admin'){
                fn.apply(this, arguments);
            }
        };
    });

    var e = new emitter();

    e.on('load:once', function(){
        console.log('loaded, should see this once');
    });

    e.on('test:admin', function(){
        console.log('this should only run when user.role === "admin"');
    });

    // once
    e.trigger('load');
    e.trigger('load');

    // at the moment, role is wrong, so this won't fire
    e.trigger('test');

    user.role = 'admin';
    e.trigger('test'); // test:admin cb will now run
});
```

### options

A small utility mixin from Arian's prime-util that allows easy object merge of an Object into `this.object` from right to left. If emitter is also mixed-in, it will automatically add events prefixed by `on` and camelcased, eg, `onReady: function(){}`.

```ace
require(['primish/primish', 'primish/emitter', 'primish/options'], function(primish, emitter, options){
	var Human = primish({
		options: {
			name: 'unknown'
		},
		implement: [options, emitter],
		constructor: function(options){
			this.setOptions(options);
			this.trigger('ready');
		}
	});

	var bob = new Human({
		name: 'Bob',
		surname: 'Roberts',
		onReady: function(){
			console.log(this.options.name, this.options.surname);
			// this.options.onReady won't be added.
		}
	});
});
```

## Setup

```sh
# pull the deps
$ npm install

# run the tests
$ npm test

# generate docs
$ npm install -g grunt-cli
$ grunt
$ cd dist
$ python -m SimpleHTTPServer
# go to http://localhost:8000
```

## npm usage

You can install it via npm by simply doing:

```
npm install primish --save
```

Then to access it in a nodejs script:

```javascript
var prime = require('primish'),
	emitter = require('primish/emitter');

var foo = primish({

	implement: emitter

}); // etc.

```

Have fun, examples in `./examples/` and also look at the `spec` folder (jasmine-node test runner).
Most examples in the docs are runnable, just edit the code and press `run this`, then look at your console.

## License

Use as you deem fit under the original [MIT license](https://github.com/mootools/prime/blob/master/package.json#L23) for prime. Primish brings little on top of the work of the MooTools team. The documentation and examples are not covered by the license and may need to be changed.
