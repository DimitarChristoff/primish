'use strict';

module.exports = function(grunt){
	// Project configuration.
	grunt.initConfig({

		// shared between tasks
		output: 'dist',

		// Before generating any new files, remove any previously-created files.
		clean: {
			dist: ['<%= output%>']
		},

		jshint: {
			files: ['primish.js', 'options.js', 'emitter.js'],
			options: grunt.file.readJSON('.jshintrc')
		},

		// builds the docs via grunt-doctor-md task.
		doctor: {
			default_options: {
				options: {
					source: 'README.md',
					output: '<%= output%>',
					title: 'primish - a MooTools prime fork for the browser, Class-based OOP in JavaScript',
					images: 'example/images',
					logo: 'images/primish-small-white.png',
					twitter: 'D_mitar',
					travis: 'http://travis-ci.org/DimitarChristoff/primish',
					github: 'https://github.com/DimitarChristoff/primish',
					disqus: 'primish'
				},
				files: {
					'<%= output%>/index.html': './README.md'
				},

				// via grunt-contrib-copy, move files to docs folder.
				copy: {
					doctor: {
						files: [{
							dest: '<%= output%>/js/primish/',
							src: ['*.js'],
							expand: true,
							flatten: true,
							filter: function(name){
								return name !== 'Gruntfile.js';
							}
						}, {
							src: 'example/favicon.ico',
							dest: '<%= output%>/favicon.ico',
							flatten: true,
							expand: false
						}]
					}
				},

				// helps move some files through a template engine to docs folder. passes options as context
				assemble: {
					options: {
						engine: 'handlebars',
						flatten: false,
						name: 'prime example',
						// files to embed in the example before running code, from /js
						jsIncludes: [],
						cssIncludes: []
					},
					doctor: {
						files: [{
							dest: '<%= output%>/js/blank.html',
							src: 'example/blank.hbs'
						}]
					}
				}
			}
		},

		requirejs: {
			build: {
				options: {
					optimize: 'uglify2',
					out: './primish-min.js',
					skipModuleInsertion: true,
					include: [
						'primish',
						'options',
						'emitter'
					]
				}
			},
		}

	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// By default, clean and generate docs
	grunt.registerTask('default', ['jshint', 'clean', 'doctor', 'requirejs:build']);
	grunt.registerTask('test', ['jshint']);
};
