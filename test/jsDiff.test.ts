///<reference path="_ref.ts" />

declare var assert:chai.Assert;
declare var helper:helper;
declare var _:UnderscoreStatic;


describe('jsDiff', () => {

	describe('check', () => {
		var actual;
		var expected;
		var diff;
		before(() => {
			assert.ok(jsDiff, 'jsDiff');
		});
		var repeatStr = function (str, amount) {
			var ret = '';
			for (var i = 0; i < amount; i++) {
				ret += str;
			}
			return ret;
		};
		var printDiffLines = function (diff, prefix?:string = ''):any {
			var top = '';
			var middle = '';
			var bottom = '';

			for (var i = 0, ii = diff.length; i < ii; i++) {
				var change = diff[i];
				var len = change.value.length;

				if (!change.added && !change.removed) {
					top += change.value;
					middle += repeatStr('|', len);
					bottom += change.value;
				}
				else if (change.removed) {
					top += repeatStr(' ', len);
					middle += repeatStr('+', len);
					bottom += change.value;
				}
				else if (change.added) {
					top += change.value;
					middle += repeatStr('-', len);
					bottom += repeatStr(' ', len);
				}
			}
			return [prefix + top, prefix + middle, prefix + bottom].join('\n');
		};

		it('hello', () => {
			var display = '';
			display += 'Hello        world today' + '\n';
			display += '||||||+++++++|||||------' + '\n';
			display += 'Hello lovely world      ';

			actual = 'Hello lovely world';
			expected = 'Hello world today';

			var diff = jsDiff.diffChars(actual, expected);
			var ret = printDiffLines(diff);
			assert.strictEqual(ret, display, 'hello world');
		});
	});
});