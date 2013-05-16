/*
 * grunt-execute
 * https://github.com/Bartvds/grunt-execute
 *
 * Copyright (c) 2013 Bart van der Schoor
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	grunt.initConfig({
		clean: {
			tests: ['build', 'test/tmp', 'test/_tmp.*']
		},
		typescript: {
			options: { target: 'es5', sourcemap: false },
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
		simplemocha: {
			unfunk: ['test/*.test.js'],
			options: {
				reporter: __dirname //yess
			}
		},
		cafemocha: {
			unfunk: ['test/*.test.js'],
			options: {
				reporter: __dirname //yess
			}
		},
		mochaTest: {
			unfunk: ['test/*.test.js'] //, 'node_modules/grunt-mocha-test/test/mocha.test.js']
		},
		mochaTestConfig: {
			unfunk: {
				options: {
					reporter: __dirname //yess
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-cafe-mocha');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-typescript');

	grunt.registerTask('build', ['clean', 'typescript:reporter']);
	grunt.registerTask('test', ['build', 'typescript:test', 'simplemocha']);

	grunt.registerTask('default', ['test']);

};
