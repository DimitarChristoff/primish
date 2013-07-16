module.exports = function(grunt){
	'use strict';

	// Project configuration.
	grunt.initConfig({

		// shared between tasks
		output: 'dist',

		// Before generating any new files, remove any previously-created files.
		clean: {
			dist: ['<%= output%>']
		},

		// builds the docs via grunt-doctor-md task.
		doctor: {
			default_options: {
				options: {
					source: 'README.md',
					output: '<%= output%>',
					title: 'primish documentation',
					images: 'example/images',
					logo: 'images/primish.png',
					twitter: 'D_mitar',
					github: 'https://github.com/DimitarChristoff/primish.git'
				},
				files: {
					'<%= output%>/index.html': './README.md'
				},

				// via grunt-contrib-copy, move files to docs folder.
				copy: {
					doctor: {
						files: [{
							dest: '<%= output%>/js/prime/',
							src: ['*.js'],
							expand: true,
							flatten: true,
							filter: function(name){
								return name !== 'Gruntfile.js';
							}
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
		}


	});

	// These plugins provide necessary tasks.
	// grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-doctor-md');

	// By default, clean and generate docs
	grunt.registerTask('default', ['clean','doctor']);
	grunt.registerTask('test', ['doctor']);
};