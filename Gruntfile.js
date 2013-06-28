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
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-mocha-spawn');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-shell');

	var path = require('path');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: grunt.util._.defaults(grunt.file.readJSON('.jshintrc'), {
				reporter: './node_modules/jshint-path-reporter'
			}),
			all: [
				'Gruntfile.js',
				'lib/**/*.js'
			]
		},
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
			test_pass: {
				options: {
					base_path: 'test/'
				},
				src: ['test/async_slow.test.ts', 'test/objectDiff.test.ts'],
				dest: 'test/_tmp.test.js'
			},
			test_objectDiff: {
				options: {
					base_path: 'test/'
				},
				src: ['test/objectDiff.test.ts'],
				dest: 'test/_tmp.test.js'
			},
			test_single: {
				options: {
					base_path: 'test/'
				},
				src: ['test/async.test.ts'],
				dest: 'test/_tmp.test.js'
			}
		},
		//buh
		mocha_spawn: {
			options: {
				reporter: __dirname //yes!
			},
			any: {
				src: ['test/_tmp.test.js']
			}
		},
		mochaTest: {
			options: {
				reporter: __dirname //yes!
			},
			any: {
				src: ['test/_tmp.test.js']
			}
		},
		simplemocha: {
			options: {
				reporter: __dirname //yes!
			},
			any: {
				src: ['test/_tmp.test.js']
			}
		},
		mocha: {
			options: {
				log: true,
				run: true,
				reporter: __dirname //yes!
			},
			any: {
				src: ['test/*.html']
			}
		},
		shell: {
			mocha: {
				options: {
					execOptions: {
						cwd: 'node_modules/.bin'
					},
					failOnError: true,
					stdout: true,
					stderr: true
				},
				//use local mocha
				command: 'mocha --reporter ' + path.resolve(__dirname) + ' ' + path.resolve('test/_tmp.test')
			}
		}
	});

	//see also ./test/_ref.ts
	process.env['mocha-unfunk-style'] = 'ansi';
	process.env['mocha-unfunk-writer'] = 'stdout';

	grunt.registerTask('default', ['test']);

	grunt.registerTask('test', ['build_pass', 'run_all']);
	grunt.registerTask('run_all', ['simplemocha', 'mochaTest', 'mocha',  'shell', 'mocha_spawn']);

	grunt.registerTask('build', ['clean', 'typescript:reporter']);
	grunt.registerTask('build_pass', ['build', 'jshint', 'typescript:test_objectDiff', 'typescript:test_pass']);
	grunt.registerTask('build_fail', ['build', 'jshint', 'typescript:test_fail']);

	//editor ui shortcuts/buttons
	grunt.registerTask('edit_01', ['build_fail', 'mocha']);
	grunt.registerTask('edit_02', ['build_fail', 'mocha_spawn']);
	grunt.registerTask('edit_03', ['build_fail', 'mochaTest']);
	grunt.registerTask('edit_04', ['build_fail', 'simplemocha']);
	grunt.registerTask('edit_05', ['build_fail', 'shell']);

	grunt.registerTask('dev', ['build', 'build_pass', 'mochaTest']);
	grunt.registerTask('run', ['build', 'typescript:test_single', 'mochaTest']);
};
