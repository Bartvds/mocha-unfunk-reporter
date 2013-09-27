///<reference path="_ref.ts" />

declare var assert:chai.Assert;
declare var helper:helper;
declare var _:UnderscoreStatic;

describe('diffs', () => {

	if (typeof require === 'function') {
		var fs = require('fs');

		it('should bail on long diffs', () => {
			var loremA = fs.readFileSync('./test/fixtures/lorem-long-a.txt', 'utf8');
			var loremB = fs.readFileSync('./test/fixtures/lorem-long-b.txt', 'utf8');

			assert.strictEqual(loremA, loremB, 'long text:expected')
		});
	}
});
