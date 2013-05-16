/*
 * grunt-execute
 * https://github.com/Bartvds/grunt-execute
 *
 * Copyright (c) 2013 Bart van der Schoor
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'index.js',
				'test/**/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		clean: {
			tests: ['index.js', 'test/tmp', 'test/_tmp.*.js']
		},
		typescript: {
			options: {
				target: 'es5',
				base_path: 'src/'
			},
			reporter: {
				options: {
					module: 'commonjs'
				},
				src: ['src/unfunk.ts'],
				dest: 'index.js'
			},
			test: {
				src: ['test/*.test.ts'],
				dest: 'test/_tmp.test.js'
			}
		},
		mochaTest: {
			all: ['test/*.test.js']
		},
		mochaTestConfig: {
			all: {
				options: {
					reporter: './index.js'
				}
			}
		}
	});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('build', ['clean', 'jshint']);
	grunt.registerTask('test', ['build', 'mochaTest']);

	grunt.registerTask('default', ['jshint', 'test']);

};
