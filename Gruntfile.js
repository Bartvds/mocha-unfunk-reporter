/*
 * mocha-unfunk-reporter
 * https://github.com/Bartvds/mocha-unfunk-reporter
 *
 * Copyright (c) 2013 Bart van der Schoor
 * Licensed under the MIT license.
 */

'use strict';

/*jshint -W107*/

module.exports = function (grunt) {

	var tty = require('tty');
	var isatty = (tty.isatty('1') && tty.isatty('2'));

	function getViewWidth() {
		if (isatty) {
			return (process.stdout['getWindowSize'] ? process.stdout['getWindowSize'](1)[0] : tty.getWindowSize()[1]);
		}
		return 80;
	}

	var gtx = require('gruntfile-gtx').wrap(grunt);

	gtx.loadNpmTasks(
		'grunt-typescript',
		'grunt-contrib-clean',
		'grunt-contrib-jshint',
		'grunt-continue',
		'grunt-mocha-test',
		'grunt-bump',
		'grunt-tslint',
		'grunt-run-grunt');

	gtx.loadTasks(
		'./tasks'
	);
	var path = require('path');
	var ansidiff = require('ansidiff');

	//http://stackoverflow.com/a/1144788/1026362
	function escapeRegExp(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	gtx.addConfig({
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
		clean: {
			build: ['build']
		},
		jshint: {
			options: grunt.util._.defaults(grunt.file.readJSON('.jshintrc'), {
				reporter: './node_modules/jshint-path-reporter'
			}),
			support: [
				'Gruntfile.js',
				'tasks/**/*.js',
				'lib/**/*.js',
				'test/*.js'
			]
		},
		tslint: {
			options: {
				configuration: grunt.file.readJSON('tslint.json'),
				formatter: 'tslint-path-formatter'
			},
			src: ['src/**/*.ts']
		},
		run_grunt: {
			options: {
				log: true
			},
			demo: {
				options: {
					task: ['build', 'ansi'],
					indentLog: ''
				},
				src: ['./test/modules/kitteh/Gruntfile.js']
			}
		},
		typescript: {
			options: { base_path: 'test/', target: 'es5', sourcemap: true },
			reporter: {
				options: {
					base_path: 'src/'
				},
				src: ['src/unfunk.ts'],
				dest: 'build/unfunk.js'
			}
		},
		mochaTest: {
			options: {
				reporter: __dirname //yes!
			},
			integrity: {
				src: ['test/integrity.js']
			}
		},
		mocha_unfunk: {
			width: {
				options: {
					width: getViewWidth() - 10
				}
			}
		}
	});

	grunt.registerMultiTask('file_diff', function () {
		var options = this.options({});

		var actual = grunt.file.read(options.actualPath);
		var expected = grunt.file.read(options.expectedPath);
		if (options.label) {
			grunt.log.writeln('');
			grunt.log.writeln('-> ' + options.label);
		}

		grunt.log.writeln('-> ' + options.actualPath);
		grunt.log.writeln('-> ' + options.expectedPath);

		if (actual !== expected) {
			grunt.log.writeln('');
			grunt.log.writeln('-------diff start-------');
			grunt.log.writeln(ansidiff.chars(actual, expected));
			grunt.log.writeln('-------diff end-------');
			grunt.log.writeln('');
			grunt.fail.warn('files not equal');
		}
	});

	// module bulk tester
	gtx.define('moduleTest', function (macro, id) {
		var testPath = 'test/modules/' + id + '/';

		var tasks = macro.getParam('tasks', 'default');
		if (!Array.isArray(tasks)) {
			tasks = [tasks];
		}

		var assertOutput = macro.getParam('assert', false);
		var ignore = macro.getParam('ignore', false);

		macro.newTask('clean', [testPath + 'tmp/**/*']);
		macro.newTask('typescript', {
			options: {
				base_path: testPath
			},
			src: [testPath + 'src/**/*.ts'],
			dest: testPath + 'tmp/_tmp.test.js'
		});
		/*macro.newTask('tslint', {
		 src: [testPath + 'src/**  /*.ts']
		 });*/

		if (assertOutput || ignore) {
			macro.newTask('continueOn', {});
		}

		var indentLog = macro.getParam('indentLog', '  |  ');

		tasks.forEach(function (task) {

			var taskEscaped = task.replace(':', '__');

			macro.newTask('run_grunt', {
				options: {
					task: task,
					indentLog: indentLog,
					log: macro.getParam('log', false),
					env: {
						'MOCHA_UNFUNK_WIDTH': getViewWidth() - indentLog.length
					},
					process: function (res) {
						var p = path.resolve('./') + path.sep;

						var actual = res.res.stdout;

						var pathExpStr = '(?:file:\/\/\/?)?';
						pathExpStr += '(?:' + escapeRegExp(p) + '|' +  escapeRegExp(p.replace(/\\/g, '/')) + ')';

						var pathExp = new RegExp(pathExpStr, 'g');

							//process stack traces
						actual = actual.replace(/^([ \t]*at) (.*)$/gm, function (all, one, two) {
							//plain paths
							//(replace only work once with strings so split/join)
							two = two.replace(pathExp, '{PATH}');
							//un-windows
							two = two.replace(/\\/g, '/');
							//lines numbers
							two = two.replace(/:\d+:\d+(\)?)/g, ':{Y}:{X}$1');
							two = two.replace(/:\d+(\)?)/g, ':{Y}$1');

							return one + ' ' + two;
						});

						//grunt-mocha leaks file urls
						actual = actual.replace(pathExp, '{PATH}');
						actual = actual.replace(/OK/g, '{{PASS}} ({TIME_INT})');
						actual = actual.replace(/SLOW|MEDIUM/g, '{{PASS}}');

						actual = actual.replace(/^(.*?)(\{PATH\})(.*)$/gm, function (all, one, two, three) {
							three = three.replace(/:\d+:\d+(\)?)/g, ':{Y}:{X}$1');
							three = three.replace(/:\d+(\)?)/g, ':{Y}$1');
							return one + two + three;
						});

						//normalise some changing info (time, line numbers etc)
						actual = actual.replace(/\(\d+(?:ms|s)\)/g, '({TIME_INT})');
						actual = actual.replace(/\(\d+\.\d+(?:ms|s)\)/g, '({TIME_FLOAT})');

						//keep it
						grunt.file.write(testPath + 'tmp/output-' + taskEscaped + '.txt', actual);
						//grunt.file.write(testPath + 'tmp/output-' + taskEscaped + '-raw.txt', res.res.stdout);
					}
				},
				src: [testPath + 'Gruntfile.js']
			});
		});

		if (assertOutput || ignore) {
			macro.newTask('continueOff', {});
		}
		if (assertOutput) {
			//re-loop
			tasks.forEach(function (task) {
				var taskEscaped = task.replace(':', '__');

				macro.newTask('file_diff', {
					options: {
						label: 'diffing: ' + id + ' ' + task,
						actualPath: testPath + 'tmp/output-' + taskEscaped + '.txt',
						expectedPath: testPath + 'fixtures/output-' + taskEscaped + '.txt'
					}
				});
			});
		}

		macro.tag('module');
	}, {
		concurrent: 1
	});

	// assemble!
	gtx.alias('default', ['test']);

	gtx.alias('prep', [
		'clean:build',
		'jshint:support'
	]);
	gtx.alias('build', [
		'prep',
		'typescript:reporter',
		'mochaTest:integrity'
	]);
	gtx.alias('test', [
		'build',
		'gtx:kitteh',
		'gtx:core',
		'gtx:pending',
		'gtx:diff',
		'demo-run',
	]);

	gtx.alias('dev', ['demo']);
	gtx.alias('demo', ['build', 'run_grunt:demo']);
	gtx.alias('demo-run', ['continueOn', 'run_grunt:demo', 'continueOff']);

	gtx.create('core', 'moduleTest', {
		tasks: ['default'],
		assert: true,
		log: true
	});
	gtx.create('kitteh', 'moduleTest', {
		tasks: ['default', 'ansi', 'dev', 'phantom' /*, 'bin'*/],
		assert: true
	});
	gtx.create('compare', 'moduleTest', {
		tasks: ['ansi'],
		log: true,
		ignore: true
	});
	gtx.create('pending', 'moduleTest', {
		log: true
	});
	gtx.create('diff', 'moduleTest', {
		tasks: ['ansi'],
		log: true,
		assert: false
	});
	gtx.create('dev', 'moduleTest', {
		tasks: ['default', 'phantom'],
		log: true,
		ignore: true
	});

	//editor ui shortcuts/buttons
	gtx.alias('edit_01', ['build', 'gtx:diff']);
	gtx.alias('edit_02', ['demo']);
	gtx.alias('edit_03', ['gtx:kitteh']);
	gtx.alias('edit_04', ['gtx:diff']);

	gtx.alias('dev', ['demo']);

	gtx.finalise();
};
