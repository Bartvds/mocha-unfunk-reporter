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
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-continue');
	grunt.loadNpmTasks('grunt-fileindex');

	var path = require('path');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bump: {
			options: {
				files: ['package.json'],
				updateConfigs: ['pkg'],
				commit: true,
				commitMessage: 'release %VERSION%',
				commitFiles: ['-a'], // '-a' for all files
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: 'version %VERSION%',
				push: true,
				pushTo: 'origin',
				// cargo cult magic.. wtf?
				// options to use with '$ git describe'
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
			}
		},
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
			build: ['build'],
			test: ['test/tmp', 'test/_tmp.*', '*.js.map']
		},
		fileindex : {
			test: {
				options: {
					format: 'script_src'
				},
				files: [
					{dest: 'test/_tmp.tags.js', src: ['**/*.test.js'], cwd: 'test'}
				]
			}
		},
		typescript: {
			options: { base_path: 'test/', target: 'es5', sourcemap: false },
			reporter: {
				options: {
					base_path: 'src/'
				},
				src: ['src/unfunk.ts'],
				dest: 'build/unfunk.js'
			},


			//TODO clean this mess up by using 'gruntfile-gtx'


			test_fail: {
				src: ['test/*.test.ts'],
				dest: 'test/_tmp.fail.test.js'
			},
			test_pass: {
				src: ['test/async_slow.test.ts', 'test/objectDiff.test.ts', 'test/jsDiff.test.ts', 'test/pending.test.ts'],
				dest: 'test/_tmp.pass.test.js'
			},
			test_objectDiff: {
				src: ['test/objectDiff*.test.ts'],
				dest: 'test/_tmp.objectDiff.test.js'
			},
			test_jsDiff: {
				src: ['test/jsDiff*.test.ts'],
				dest: 'test/_tmp.jsDiff.test.js'
			},
			test_single: {
				src: ['test/async.test.ts'],
				dest: 'test/_tmp.async.test.js'
			},
			test_kitteh: {
				src: ['test/kitteh*.test.ts'],
				dest: 'test/_tmp.kitteh.test.js'
			},
			test_errors: {
				src: ['test/errors*.test.ts'],
				dest: 'test/_tmp.errors.test.js'
			},
			test_asserts: {
				src: ['test/compare_assertion*.test.ts'],
				dest: 'test/_tmp.compare_assertion.test.js'
			},
			test_demo: {
				src: ['test/diff.test.ts', 'test/kitteh.test.ts'],
				dest: 'test/_tmp.demo.test.js'
			},
			test_diff: {
				src: ['test/diff.test.ts'],
				dest: 'test/_tmp.diff.test.js'
			}
		},
		//buh
		mochaTest: {
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
		}
	});

	//require('mocha-unfunk-reporter').option({style:'ansi', writer:'stdout'});
	//process.env['mocha-unfunk-style'] = 'plain';
	//process.env['mocha-unfunk-writer'] = 'log';

	//process.env['mocha-unfunk-style'] = 'plain'
	//process.env['mocha-unfunk-reportPending'] = true;
	//process.env['MOCHA_UNFUNK_REPORTPENDING'] = true;

	grunt.registerTask('default', ['test']);

	grunt.registerTask('test', [
		'build',
		'typescript:test_pass',
		'fileindex:test',
		'run_core',
		'clean:test',
		'typescript:test_demo',
		'fileindex:test',
		'continueOn',
		'mochaTest',
		'continueOff'
	]);
	grunt.registerTask('run_core', ['mocha', 'mochaTest']);
	grunt.registerTask('run_all', ['mocha', 'shell', 'mochaTest']);

	grunt.registerTask('build', ['clean', 'jshint', 'typescript:reporter']);
	grunt.registerTask('build_pass', ['build', 'jshint', 'typescript:test_pass']);
	grunt.registerTask('build_fail', ['build', 'jshint', 'typescript:test_fail']);

	//editor ui shortcuts/buttons
	grunt.registerTask('edit_01', ['build_fail', 'mocha']);
	grunt.registerTask('edit_02', ['build_fail', 'mochaTest']);
	grunt.registerTask('edit_03', ['build_fail', 'shell']);
	grunt.registerTask('edit_04', ['build_fail']);
	grunt.registerTask('edit_05', ['demo']);

	grunt.registerTask('demo', ['build', 'jshint', 'typescript:test_demo', 'mochaTest']);

	grunt.registerTask('dev', ['build', 'typescript:test_errors', 'mochaTest']);
	grunt.registerTask('run', ['build', 'build_pass', 'mocha']);
};
