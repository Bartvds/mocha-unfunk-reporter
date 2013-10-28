///<reference path="../../../_ref.ts" />
///<reference path="../../../../src/diff.ts" />
///<reference path="../../../../src/styler.ts" />

describe('DiffFormatter', () => {

	var fs = require('fs');

	function assertStringDiff(nameA, nameB, nameDiff, style) {
		var stringA = fs.readFileSync('../../fixtures/' + nameA + '.txt', 'utf8');
		var stringB = fs.readFileSync('../../fixtures//' + nameB + '.txt', 'utf8');

		var diff = new unfunk.diff.DiffFormatter(style);
		var actual = diff.getStyledDiff(stringA, stringB);

		fs.writeFileSync('./tmp/' + nameDiff + '.txt', actual, 'utf8');

		//console.log(actual);

		var expected = fs.readFileSync('./fixtures/' + nameDiff + '.txt', 'utf8').replace(/\r\n/g, '\n');
		assert.notStrictEqual(stringA, stringB, 'pre test');
		assert.strictEqual(actual, expected);
	}

	function assertObjDiff(objA, objB, nameDiff, style) {
		var diff = new unfunk.diff.DiffFormatter(style);
		var actual = diff.getStyledDiff(objA, objB);

		fs.writeFileSync('./tmp/' + nameDiff + '.txt', actual, 'utf8');

		//console.log(actual);

		var expected = fs.readFileSync('./fixtures/' + nameDiff + '.txt', 'utf8').replace(/\r\n/g, '\n');
		assert.strictEqual(actual, expected);
	}

	describe('strings', () => {
		it('should diff hello a/b', () => {
			assertStringDiff('hello-a', 'hello-b', 'hello-diff-plain', new unfunk.styler.PlainStyler());
		});

		it('should diff lines a/b', () => {
			assertStringDiff('lines-a', 'lines-b', 'lines-diff-plain', new unfunk.styler.PlainStyler());
		});

		it('should diff medium a/b', () => {
			assertStringDiff('lorem-medium-a', 'lorem-medium-b', 'lorem-medium-diff-plain', new unfunk.styler.PlainStyler());
		});
	});

	describe('nested Object', () => {
		it('should diff nested multiline a/b', () => {
			var objA = {
				nested: {
					aa: 'aaab'
				},
				lines: fs.readFileSync('../../fixtures/lines-a.txt', 'utf8')
			};
			var objB = {
				nested: {
					aa: 'abaa'
				},
				lines: fs.readFileSync('../../fixtures/lines-b.txt', 'utf8')
			};
			assertObjDiff(objA, objB, 'multiline-diff-plain', new unfunk.styler.PlainStyler());
		});
	});
});
