/*jshint mootools:true */
/*global moostrapScrollspy, prettyPrint, ace */
(function(){
	'use strict';

	var nav = document.id('nav');
	var main = document.id('content');

	main.getElements('.lang-ace').each(function(el){

		var html = el.get('text'),
			parent = el.getParent('pre'),
			edit = new Element('div.ace', {
				text: html
			}).inject(parent, 'before');

		new Element('div.alert').adopt(
			new Element('button.btn.btn-demo.btn-primary[text=Run this]')
		).inject(edit, 'after');

		parent.destroy();
		var editor = ace.edit(edit);
		editor.setTheme('ace/theme/clouds_midnight');
		editor.getSession().setMode('ace/mode/javascript');
		edit.store('editor', editor);
	});

	main.getElements('h2,h3').each(function(el){
		new Element('a', {
			html: '&sect;',
			title: 'Link to ' + el.get('text'),
			'class': 'heading-anchor',
			href: '#' + el.get('id')
		}).inject(el, 'top');
	});

	nav && new moostrapScrollspy('sections', {
		offset: 0,
		onReady: function(){
			this.scroll();
			/* may want to overrride this
			var handleClicks = function(e, el){
				e.stop();
				var target = el.get('href');
				window.location.hash = target;
				body.scrollTo(0, main.getElement(target).getPosition().y - 40);
			};

			this.element.addEvent('click:relay(li > a)', handleClicks);
			main.addEvent('click:relay(a[href^=#])', handleClicks);
			*/
		},
		onActive: function(el, target){
			var g = el.getParents("li").getLast();
			g.addClass('active');
			target.addClass('active');
			nav.scrollTo(0, g.getPosition(this.element).y);
		},
		onInactive: function(el, target){
			target.removeClass('active');
			this.element.getElements('li.active').removeClass('active');
		}
	});

	var buildWindow = function(el){
		var editor = el.getParent().getPrevious().retrieve('editor');

		var uid = Slick.uidOf(el),
			iframe = document.id('demoFrame' + uid);

		if (!iframe) {
			// make example
			new IFrame({
				src: 'js/blank.html',
				styles: {
					width: '100%',
					height: 400
				},
				'class': 'acely',
				id: 'demoFrame' + uid,
				events: {
					load: function(){
						new Element('script', {
							type: 'text/javascript',
							text: editor.getValue()
						}).inject(this.contentDocument.body);
					}
				}
			}).inject(el, 'after');
		}
		else {
			// close example
			iframe.destroy();
		}
	};

	var toggleState = function(anchor){
		var state = anchor.retrieve('isopen'),
			map = {
				true: {
					text: 'Close example'
				},
				false: {
					text: 'Run this'
				}
			};

		// when not set, it's the first time
		state === null && (state = true);
		anchor.set(map[state]).toggleClass('btn-warning').toggleClass('btn-info').store('isopen', !state);
	};

	// delegated event handler.
	var handleClick = function(e, el){
		e && e.stop();
		var code = el.getPrevious('div.ace') || el.getParent().getPrevious('div.ace'),
			editor,
			module;

		if (!code) {
			return false;
		}

		editor = code.retrieve('editor');
		module = el.get('data-module');

		toggleState(el);
		buildWindow(el);

		// buildExample(module, editor.getValue(), el); - changed to linked iframe
	};

	main.addEvent('click:relay(button.btn-demo)', handleClick);


	prettyPrint();

}());