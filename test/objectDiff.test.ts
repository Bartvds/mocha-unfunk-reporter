///<reference path="_ref.ts" />

declare var assert:chai.Assert;
declare var helper:helper;
declare var _:UnderscoreStatic;

describe('objectDiff', () => {

	var TypeA = function () {
		this.aa = 'hello';
		this.bb = 1;
		this.cc = [3, 2, 1];
		this.dd = {a: 'yo', b: 1, c: [10, 20, 30], d:10};
	}
	TypeA.prototype.protoProp = 'shared';
	TypeA.prototype.protoMethodA = function () {
		return 1;
	};
	var TypeB = function () {
		this.aa = 'hello';
		this.bb = 1;
		this.cc = [1, 2, 3];
		this.dd = {a: 'yo', b: 1, c: [10, 20, 30]};
	};
	TypeB.prototype.protoProp = 'shared';
	TypeB.prototype.protoMethodB = function () {
		return 3;
	};

	var objectDiff = require('../lib/objectDiff');

	describe.only('diff', () => {
		var objDiffA, objDiffB;
		it('deepEqual A B', () => {
			assert.deepEqual(new TypeA(), new TypeB());
		});
		it('deepEqual B A', () => {
			assert.deepEqual(new TypeB(), new TypeA());
		});
		it('diffs deepEqual A B', () => {
			objDiffA = objectDiff.diff(new TypeA(), new TypeB());
			objDiffB = objectDiff.diff(new TypeB(), new TypeA());
			assert.deepEqual(objDiffA, objDiffB);

		});
		it('diffs deepEqual B A', () => {
			objDiffA = objectDiff.diff(new TypeA(), new TypeB());
			objDiffB = objectDiff.diff(new TypeB(), new TypeA());
			assert.deepEqual(objDiffB, objDiffA);

		});
	});
});