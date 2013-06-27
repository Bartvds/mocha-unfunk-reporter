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
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-mocha-spawn');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-simple-mocha');

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
			test_fail: {
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
				src: ['test/objectDiff.test.ts'],
				dest: 'test/_tmp.test.js'
			}
		},
		//buh
		mocha_spawn: {
			options: {
				reporter: __dirname //yes!
			},
			any: {
				src:['test/*.test.js']
			}
		},
		mochaTest: {
			options: {
				reporter: __dirname //yes!
			},
			any: {
				src:['test/*.test.js']
			}
		},
		simplemocha: {
			options: {
				reporter: __dirname //yes!
			},
			any: {
				src:['test/*.test.js']
			}
		},
		mocha: {
			options: {
				log: true,
				mocha: {
					ignoreLeaks: false
				},
				run: true,
				reporter: __dirname //yes!
			},
			any: {
				src: ['test/*.html']
			}
		}
	});

	require('./').option('color', true);

	grunt.registerTask('default', ['test']);
	grunt.registerTask('build', ['clean', 'typescript:reporter']);

	grunt.registerTask('test', ['build', 'typescript:test_objectDiff', 'multi']);

	grunt.registerTask('test_pass', ['test']);
	grunt.registerTask('test_fail', ['build', 'typescript:test_fail']);

	grunt.registerTask('multi', ['mocha', 'mocha_spawn', 'mochaTest', 'simplemocha']);

	//editor ui shortcuts/buttons
	grunt.registerTask('edit_01', ['test_fail', 'mocha']);
	grunt.registerTask('edit_02', ['test_fail', 'mocha_spawn']);
	grunt.registerTask('edit_03', ['test_fail', 'mochaTest']);
	grunt.registerTask('edit_04', ['test_fail', 'simplemocha']);
};
