module.exports = function (grunt) {
	'use strict';

	var path = require('path');
	var base = require('../gruntbase').base(grunt);

	grunt.initConfig(base.config({
		mochaTest: {
			options: {
				reportPending: true,
				reporter: path.resolve(__dirname, '..', '..', '..') //yes!
			},
			base: {
				src: ['tmp/*test.js']
			}
		}
	}));

	process.env['MOCHA_UNFUNK_STYLE'] = 'dev';
	process.env['MOCHA_UNFUNK_REPORTPENDING'] = true;

	grunt.registerTask('default', ['mochaTest:base']);
};
