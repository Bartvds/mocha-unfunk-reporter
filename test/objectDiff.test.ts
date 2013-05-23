///<reference path="_ref.ts" />

declare var assert:chai.Assert;
declare var helper:helper;
declare var _:UnderscoreStatic;

describe('objectDiff', () => {

	var TypeA = function () {
		this.aa = 'hello';
		this.bb = 1;
		this.cc = [1, 2, 3];
		this.dd = {a: 'yo', b: 1, c: [10, 20, 30]};
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
		it('diffs equals diff', () => {
			objDiffA = objectDiff.diff(new TypeA(), new TypeB());
			objDiffB = objectDiff.diff(new TypeB(), new TypeA());
			assert.deepEqual(objDiffA, objDiffB);

		});
	});
});