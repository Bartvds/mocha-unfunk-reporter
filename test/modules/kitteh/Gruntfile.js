module.exports = function (grunt) {
	'use strict';

	var path = require('path');
	var base = require('../gruntbase').base(grunt);

	grunt.initConfig(base.config({
		mochaTest: {
			options: {
				reporter: path.resolve(__dirname, '..', '..', '..') //yes!
			},
			base: {
				src: ['tmp/*test.js']
			}
		},
		mocha: {
			options: {
				log: true,
				run: true,
				reporter: path.resolve(__dirname, '..', '..', '..') //yes!
			},
			base: {
				src: ['index.html']
			}
		},
		shell: {
			base: {
				options: {
					execOptions: {
						cwd: '../../../node_modules/.bin'
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
				command: 'mocha --reporter ' +path.resolve(__dirname, '..', '..', '..') + ' ' + path.resolve('tmp/*test.js')
			}
		}
	}));

	grunt.registerTask('default', ['mocha_unfunk:plain', 'mochaTest:base']);
	grunt.registerTask('dev', ['mocha_unfunk:dev', 'mochaTest:base']);
	grunt.registerTask('ansi', ['mocha_unfunk:ansi', 'mochaTest:base']);
	grunt.registerTask('phantom', ['mocha_unfunk:dev', 'mocha:base']);
	grunt.registerTask('bin', ['mocha_unfunk:ansi', 'shell:base']);
};
