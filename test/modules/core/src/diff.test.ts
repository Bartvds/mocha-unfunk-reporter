///<reference path="../../../_ref.ts" />

describe('diffs', () => {

	var fs = require('fs');

	describe('long strings', () => {

		it.skip('should show big diffs', () => {
			var stringA = fs.readFileSync('../../fixtures/lorem-big-a.txt', 'utf8');
			var stringB = fs.readFileSync('../../fixtures/lorem-big-b.txt', 'utf8');

			helper.longAssert(stringA, stringB, 'big');
		});

		it('should bail on long diffs', () => {
			var stringA = fs.readFileSync('../../fixtures/lorem-long-a.txt', 'utf8');
			var stringB = fs.readFileSync('../../fixtures/lorem-long-b.txt', 'utf8');

			helper.longAssert(stringA, stringB, 'long');
		});
	});
});
