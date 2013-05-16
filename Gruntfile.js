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
			tests: ['build', 'test/tmp', 'test/_tmp.*.js']
		},
		typescript: {
			options: { target: 'es5', declaration: false, sourcemap: false },
			reporter: {
				options: {
					base_path: 'src/'
				},
				src: ['src/unfunk.ts'],
				dest: 'build/unfunk.js'
			},
			test: {
				options: {
					base_path: 'test/'
				},
				src: ['test/*.test.ts'],
				dest: 'test/_tmp.test.js'
			}
		},
		mochaTest: {
			list: ['test/*.test.js'],
			unfunk: ['test/*.test.js']
		},
		mochaTestConfig: {
			list: {
				options: {
					reporter: 'list'
				}
			},
			unfunk: {
				options: {
					reporter: __dirname +'/build/unfunk'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-typescript');

	grunt.registerTask('build', ['clean', 'jshint', 'typescript:reporter']);
	grunt.registerTask('test', ['build', 'typescript:test', 'mochaTest:unfunk']);

	grunt.registerTask('default', ['jshint', 'test']);

};
