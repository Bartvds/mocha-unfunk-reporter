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
		}
	}));

	grunt.registerTask('default', ['mocha_unfunk:plain', 'mochaTest:base']);
	grunt.registerTask('ansi', ['mocha_unfunk:ansi', 'mochaTest:base']);
	grunt.registerTask('dev', ['mocha_unfunk:dev', 'mochaTest:base']);
};
