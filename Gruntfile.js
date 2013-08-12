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
	grunt.loadNpmTasks('grunt-wait');

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
			tests: ['build', 'test/tmp', 'test/_tmp.*', '*.js.map']
		},
		typescript: {
			options: { target: 'es5', sourcemap: true },
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
				src: ['test/async_slow.test.ts', 'test/objectDiff.test.ts', 'test/jsDiff.test.ts', 'test/pending.test.ts'],
				dest: 'test/_tmp.test.js'
			},
			test_objectDiff: {
				options: {
					base_path: 'test/'
				},
				src: ['test/objectDiff*.test.ts'],
				dest: 'test/_tmp.test.js'
			},
			test_jsDiff: {
				options: {
					base_path: 'test/'
				},
				src: ['test/jsDiff*.test.ts'],
				dest: 'test/_tmp.test.js'
			},
			test_single: {
				options: {
					base_path: 'test/'
				},
				src: ['test/async.test.ts'],
				dest: 'test/_tmp.test.js'
			},
			test_kitteh: {
				options: {
					base_path: 'test/'
				},
				src: ['test/kitteh*.test.ts'],
				dest: 'test/_tmp.test.js'
			},
			test_asserts: {
				options: {
					base_path: 'test/'
				},
				src: ['test/compare_assertion*.test.ts'],
				dest: 'test/_tmp.test.js'
			}
		},
		//buh
		mocha_spawn: {
			options: {
				reporter: __dirname //yes!
			},
			any: {
				src: ['test/_tmp.*test.js']
			}
		},
		mochaTest: {
			options: {
				reporter: __dirname //yes!
			},
			any: {
				src: ['test/_tmp.*test.js']
			}
		},
		simplemocha: {
			options: {
				reporter: __dirname //yes!
			},
			any: {
				src: ['test/_tmp.*test.js']
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
					callback: function (err, stdout, stderrstderr, cb) {
						console.log(stdout);
						cb();
					},
					failOnError: true,
					stdout: true,
					stderr: true
				},
				//use local mocha
				command: 'mocha --reporter ' + path.resolve(__dirname) + ' ' + path.resolve('test/_tmp.*test')
			}
		},
		wait: {
			short: {
				options: {
					delay: 100
				}
			}
		}
	});

	//process.env['mocha-unfunk-style'] = 'plain';
	//process.env['mocha-unfunk-writer'] = 'log';
	//require('mocha-unfunk-reporter').option({style:'ansi', writer:'stdout'});
	process.env['mocha-unfunk-reportPending'] = true;

	grunt.registerTask('default', ['test']);

	grunt.registerTask('test', ['build_pass', 'run_core']);
	grunt.registerTask('run_core', ['mochaTest', 'mocha']);
	grunt.registerTask('run_all', ['simplemocha', 'wait', 'mochaTest', 'mocha', 'shell', 'mocha_spawn']);

	grunt.registerTask('build', ['clean', 'typescript:reporter']);
	grunt.registerTask('build_pass', ['build', 'jshint', 'typescript:test_pass']);
	grunt.registerTask('build_fail', ['build', 'jshint', 'typescript:test_fail']);

	//editor ui shortcuts/buttons
	grunt.registerTask('edit_01', ['build_fail', 'mocha']);
	grunt.registerTask('edit_02', ['build_fail', 'mocha_spawn']);
	grunt.registerTask('edit_03', ['build_fail', 'mochaTest']);
	grunt.registerTask('edit_04', ['build_fail', 'simplemocha']);
	grunt.registerTask('edit_05', ['build_fail', 'shell']);

	grunt.registerTask('dev', ['build', 'typescript:test_jsDiff', 'mochaTest']);
	grunt.registerTask('run', ['build', 'build_pass', 'mocha']);
};
