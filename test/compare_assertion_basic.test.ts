///<reference path="_ref.ts" />

describe('compare', () => {

	var asrt;
	if (typeof require === 'function') {
		asrt = require('assert');
	}

	describe('pre test', () => {
		assert.ok(proclaim, 'proclaim');
		it('common assert', () => {
			throw new TypeError('test bad type');
		});
	});
	describe('strictEqual boolean', () => {
		describe('basic', () => {
			it('chai', () => {
				assert.strictEqual(true, false);
			});
			it('proclaim', () => {
				proclaim.strictEqual(true, false);
			});
			it('common assert', () => {
				if (asrt) asrt.strictEqual(true, false);
			});
		});
		describe('message', () => {
			it('chai', () => {
				assert.strictEqual(true, false, 'chai message');
			});
			it('proclaim', () => {
				proclaim.strictEqual(true, false, 'proclaim message');
			});
			it('common assert', () => {
				if (asrt) asrt.strictEqual(true, false, 'common assert message');
			});
		});
	});

	describe('strictEqual string', () => {
		describe('basic', () => {
			it('chai', () => {
				assert.strictEqual('Alpha Beta', 'Beta Gamma');
			});
			it('proclaim', () => {
				proclaim.strictEqual('Alpha Beta', 'Beta Gamma');
			});
			it('common assert', () => {
				if (asrt)asrt.strictEqual('Alpha Beta Delta', 'Beta Gamma Delta');
			});
		});
		describe('message', () => {
			it('chai', () => {
				assert.strictEqual('Alpha Beta Delta', 'Beta Gamma Delta', 'chai message');
			});
			it('proclaim', () => {
				proclaim.strictEqual('Alpha Beta Delta', 'Beta Gamma Delta', 'proclaim message');
			});
			it('common assert', () => {
				if (asrt) asrt.strictEqual('Alpha Beta Delta', 'Beta Gamma Delta', 'common assert message');
			});
		});
	});

	describe('deepEqual object', () => {

		var objA = {a: {aa: 1, bb: 4, cc: 'cdehj', dd: 4}, b: [1, 2], f: 'bb cc gg'};
		var objB = {a: {aa: 1, bb: 2, cc: 'aceegijk'}, b: [1, 2], f: 'aa cc dd ee gg hh'};

		describe('basic', () => {
			it('chai', () => {
				assert.deepEqual(objA, objB);
			});
			it('proclaim', () => {
				proclaim.deepEqual(objA, objB);
			});
			it('common assert', () => {
				if (asrt) asrt.deepEqual(objA, objB);
			});
		});
		describe('message', () => {
			it('chai', () => {
				assert.deepEqual(objA, objB, 'chai message');
			});
			it('proclaim', () => {
				proclaim.deepEqual(objA, objB, 'proclaim message');
			});
			it('common assert', () => {
				if (asrt) asrt.deepEqual(objA, objB, 'common assert message');
			});
		});
	});
});
