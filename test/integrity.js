describe('tsd', function () {
	'use strict';

	var grunt = require('grunt');
	var chai = require('chai');
	chai.use(require('chai-fs'));
	chai.Assertion.includeStack = true;
	var assert = chai.assert;

	describe('package.json', function () {
		var pkg;
		//TODO move it to a json-schema
		it('valid formed', function () {
			assert.jsonFile('package.json');

			pkg = grunt.file.readJSON('package.json');
			assert.isObject(pkg, 'pkg');
		});
		it('api module', function () {
			assert.isObject(pkg, 'pkg');

			assert.property(pkg, 'main', 'pkg.main');
			assert.isFile(pkg.main, 'pkg.main');
		});
	});
});
