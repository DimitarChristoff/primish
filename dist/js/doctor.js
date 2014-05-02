/*jshint mootools:true */
/*global moostrapScrollspy, prettyPrint, ace, IFrame */
(function(){
	'use strict';

	var nav = document.id('nav'),
		main = document.id('content'),
		runCode = '<span class="glyphicons .glyphicon-play-circle"></span> Run code',
		closeCode = '<span class="glyphicons .glyphicon-remove"></span> close';

	// convert code blocks that need ace
	main.getElements('.lang-ace').each(function(el){

		var code = el.get('html'),
			parent = el.getParent('pre'),
			edit = new Element('div.ace').set('html', code).inject(parent, 'before');

		new Element('div.alert').adopt(
			new Element('button.btn.btn-demo.btn-primary[html=' + runCode + ']'),
			new Element('button.btn.btn-demo.btn-close.pull-right.btn-danger[html='+ closeCode +']')
		).inject(edit, 'after');

		parent.destroy();
		var editor = ace.edit(edit);
		editor.setTheme('ace/theme/clouds_midnight');
		editor.getSession().setMode('ace/mode/javascript');
		edit.store('editor', editor);
	});

	// add heading anchors for linking to h2/h3
	main.getElements('h2,h3').each(function(el){
		new Element('a', {
			html: '&sect;',
			title: 'Link to ' + el.get('text'),
			'class': 'heading-anchor',
			href: '#' + el.get('id')
		}).inject(el, 'top');
	});

	// monitor scroll
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
			var g = el.getParents('li').getLast();
			g.addClass('active');
			target.addClass('active');
			nav.scrollTo(0, g.getPosition(this.element).y);
		},
		onInactive: function(el, target){
			target.removeClass('active');
			this.element.getElements('li.active').removeClass('active');
		}
	});

	/**
	 * @description create an iframe to host the code
	 * @param {HTMLElement} el
	 */
	var buildWindow = function(el, close){
		var editor = el.getParent().getPrevious().retrieve('editor');

		var uid = Slick.uidOf(close ? el.getPrevious() : el),
			iframe = document.id('demoFrame' + uid);

		if (iframe){
			iframe.destroy();
			iframe = null;
		}

		if (close){
			return;
		}

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
				// when blank.html loads, inject the script
				load: function(){
					new Element('script', {
						id: 'code',
						type: 'text/javascript',
						text: editor.getValue()
					}).inject(this.contentDocument.body);
				}
			}
		}).inject(el.getParent(), 'bottom');

	};

	/**
	 * @description handle the run this code
	 * @param e
	 * @param el
	 * @returns {boolean}
	 */
	var run = function(e, el){
		// delegated event handler.

		e && e.stop();
		var code = el.getPrevious('div.ace') || el.getParent().getPrevious('div.ace');

		if (!code){
			return false;
		}

		//toggleState(el);
		buildWindow(el, el.hasClass('btn-close'));
	};

	main.addEvent('click:relay(button.btn-demo)', run);


	prettyPrint();

}());