///<reference path="../../../_ref.ts" />
///<reference path="../../../../src/diff.ts" />
///<reference path="../../../../src/styler.ts" />

describe('string diffs', () => {

	var fs = require('fs');
	var path = require('path');
	var mkdirp = require('mkdirp');

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	function assertStringDiff(nameA:string, nameB:string, name:string, style, debug:boolean = true) {
		var stringA = fs.readFileSync('../../fixtures/' + nameA + '.txt', 'utf8');
		var stringB = fs.readFileSync('../../fixtures/' + nameB + '.txt', 'utf8');
		assertStringValueDiff(stringA, stringB, name, style, debug);
	}

	function assertStringValueDiff(stringA:string, stringB:string, name:string, style, debug:boolean = true) {

		var diff = new unfunk.diff.DiffFormatter(style);
		var actual = diff.getStyledDiff(stringA, stringB);

		var expPath = path.join('.', 'tmp', 'string', name + '.txt');
		mkdirp.sync(path.dirname(expPath), 0744);
		fs.writeFileSync(expPath, actual, 'utf8');

		if (debug) {
			console.log('');
			console.log(new unfunk.diff.DiffFormatter(new unfunk.styler.ANSIStyler()).getStyledDiff(stringA, stringB, '            '));
			console.log('');
		}

		var expected = fs.readFileSync('./fixtures/string/' + name + '.txt', 'utf8').replace(/\r\n/g, '\n');

		assert.strictEqual(actual, expected);
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	describe('strings', () => {
		it('should diff empty', () => {
			assertStringValueDiff('', '', 'empty', new unfunk.styler.PlainStyler());
		});
		it('should diff empty', () => {
			assertStringValueDiff('aa', '', 'aa-empty', new unfunk.styler.PlainStyler());
		});
		it('should diff empty', () => {
			assertStringValueDiff('', 'aa', 'empty-aa', new unfunk.styler.PlainStyler());
		});
		it('should diff same', () => {
			assertStringValueDiff('aaaa', 'aaaa', 'aaaa-aaaa', new unfunk.styler.PlainStyler());
		});
		it('should diff same', () => {
			assertStringValueDiff('aa aa', 'aa aa', 'aa-space-aa', new unfunk.styler.PlainStyler());
		});
		it('should diff aaaa/bbbb', () => {
			assertStringValueDiff('aaaa', 'bbbb', 'aaaa-bbbb', new unfunk.styler.PlainStyler());
		});
		it('should diff aaaa/bbbb-dev', () => {
			assertStringValueDiff('aaaa', 'bbbb', 'aaaa-bbbb-dev', new unfunk.styler.DevStyler());
		});

		it('should diff aaaa/bbbb/cccc', () => {
			assertStringValueDiff('aaaacccc', 'bbbbcccc', 'aaaa-bbbb-cccc', new unfunk.styler.PlainStyler());
		});

		it('should diff aaaa/bbbb/cccc-dev', () => {
			assertStringValueDiff('aaaacccc', 'bbbbcccc', 'aaaa-bbbb-cccc-dev', new unfunk.styler.DevStyler());
		});

		it('should diff hello a/b', () => {
			assertStringDiff('hello-a', 'hello-b', 'hello-diff-plain', new unfunk.styler.PlainStyler());
		});

		it('should diff aaaa/line/bbbb', () => {
			assertStringValueDiff('aaaa\naaaa\naaaa', 'aaab\naaab\naaab', 'aaaa-line', new unfunk.styler.PlainStyler());
		});

		it('should diff aaaa/line/bbbb', () => {
			assertStringValueDiff('aabb\n\nbaab\nabab', 'aaaa\naaaa\naaaa', 'aaaa-line-abab', new unfunk.styler.PlainStyler());
		});

		it('should diff lines a/b', () => {
			assertStringDiff('lines-a', 'lines-b', 'lines-diff-plain', new unfunk.styler.PlainStyler());
		});

		it('should diff medium a/b', () => {
			assertStringDiff('lorem-medium-a', 'lorem-medium-b', 'lorem-medium-diff-plain', new unfunk.styler.PlainStyler(), false);
		});
	});
});
