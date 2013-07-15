primish
=======

A prime derivative that went beyond repair. Initially a fork of [MooTools prime](https://github.com/mootools/prime/), now with a lot of sugar. 

You are still advised to use Prime but in case you care, here is what you get with primish:

### prime changes

- `.parent()`
- `.implement()` and `implement` mutator:
- `prime.merge()` shallow Object merging

### emitter changes

- support for event stacking like `.on('foo bar baz', function(){});`
- support for event pseudos like `.on('foo:once', function(){});`
- `emitter.definePseudo()` to allow custom pseudo events

### options

- `.setOptions()` - shallow merging of object with `this.options`
- support for emitter events via `onEventname` -> `this.on('eventname')` like in MooTools 1.x

Use at your own risk, examples in spec. Documentation in /dev/null
