/*
 * mocha-unfunk-reporter
 * https://github.com/Bartvds/mocha-unfunk-reporter
 *
 * Copyright (c) 2013 Bart van der Schoor
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-typescript');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.loadNpmTasks('grunt-mocha-spawn');

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
		//buh
		mocha_spawn: {
			unfunk: {
				src:['test/*.test.js'],
				options: {
					reporter: __dirname //yess
				}
			}
		}
	});
	grunt.registerTask('build', ['clean', 'typescript:reporter']);
	grunt.registerTask('test', ['build', 'typescript:test', 'mocha_spawn:unfunk']);
	grunt.registerTask('default', ['test']);
};
