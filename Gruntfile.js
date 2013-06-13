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
	grunt.loadNpmTasks('grunt-mocha');

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
			},
			test_objectDiff: {
				options: {
					base_path: 'test/'
				},
				src: ['test/*.test.ts'],
				dest: 'test/_tmp.test.js'
			}
		},
		//buh
		mocha_spawn: {
			any: {
				src:['test/*.test.js'],
				options: {
					reporter: __dirname //yess
				}
			}
		},
		mocha: {
			options: {
				bail: true,
				log: true,
				mocha: {
					ignoreLeaks: false
				},
				run: true,
				reporter: __dirname //yess
			},
			any: {
				src: ['test/*.html']
			}
		}
	});
	grunt.registerTask('default', ['test']);
	grunt.registerTask('build', ['clean', 'typescript:reporter', 'typescript:test']);
	grunt.registerTask('test', ['grunt_mocha_spawn']);

	grunt.registerTask('grunt_mocha_spawn', ['build', 'mocha_spawn:any']);
	grunt.registerTask('grunt_mocha', ['build', 'mocha:any']);

	grunt.registerTask('edit_01', ['grunt_mocha_spawn']);
	grunt.registerTask('edit_02', ['grunt_mocha']);
};
