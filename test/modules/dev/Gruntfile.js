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
		}
	}));

	grunt.registerTask('default', ['mocha_unfunk:ansi', 'mochaTest:base']);
	grunt.registerTask('phantom', ['mocha_unfunk:plain', 'mocha:base']);
};
