///<reference path="_ref.ts" />

declare var assert:chai.Assert;
declare var helper:helper;
declare var _:UnderscoreStatic;


describe('objectDiff', () => {

	var TypeA = function () {
		this.aa = 'hello';
		this.bb = {a: 'yo', b: 1, c: [10, 20, 30]};
	}
	TypeA.prototype.protoProp = 'shared';
	TypeA.prototype.protoAA = 'myAA';
	TypeA.prototype.protoMethodA = function () {
		return 1;
	};
	var TypeB = function () {
		this.aa = 'hello';
		this.bb = {a: 'yo', b: 1, c: [10, 20, 30]};
	};
	TypeB.prototype.protoProp = 'shared';
	TypeB.prototype.protoBB = 'myBB';
	TypeB.prototype.protoMethodB = function () {
		return 3;
	};

	var getTypeC = function () {
		return {aa: 'hello',
			bb: {a: 'yo', b: 1, c: [10, 20, 30]}
		};
	};

	var getTypeD = function () {
		return {aa: 'hello',
			bb: {a: 'yo', b: 1, c: [10, 20, 30, 40]}
		};
	};

	describe('check', () => {
		var one, two;
		var instA, instB, instC, instD;
		before(() => {
			instA = new TypeA();
			instB = new TypeB();
			instC = getTypeC();
			instD = getTypeC();
			assert.ok(objectDiff, 'objectDiff');
		});
		it('deepEqual pre test', () => {
			assert.deepEqual(instA, instA);
		});
		it('notDeepEqual A B', () => {
			assert.notDeepEqual(instA, instB);
		});
		it('notDeepEqual A C', () => {
			assert.notDeepEqual(instA, instC);
		});
		it('notDeepEqual B C', () => {
			assert.notDeepEqual(instB, instC);
		});
		describe('diff()', () => {
			it('notDeepEqual diff A x B', () => {
				one = objectDiff.diff(instA, instB);
				two = objectDiff.diff(instB, instA);
				assert.notDeepEqual(one, two, 'one, two');
				assert.notDeepEqual(two, one, 'two, one');
			});
			it('notDeepEqual diff A x C', () => {
				one = objectDiff.diff(instA, instC);
				two = objectDiff.diff(instC, instA);
				assert.notDeepEqual(one, two, 'one, two');
				assert.notDeepEqual(two, one, 'two, one');
			});
			it('notDeepEqual diff B x C', () => {
				one = objectDiff.diff(instB, instC);
				two = objectDiff.diff(instC, instB);
				assert.notDeepEqual(one, two, 'one, two');
				assert.notDeepEqual(two, one, 'two, one');
			});
			it('notDeepEqual diff A x D', () => {
				one = objectDiff.diff(instA, instD);
				two = objectDiff.diff(instD, instA);
				assert.notDeepEqual(one, two, 'one, two');
				assert.notDeepEqual(two, one, 'two, one');
			});

			it('A A equal', () => {
				assert.equal(objectDiff.diff(instA, instA).changed, 'equal');
			});
			it('B B equal', () => {
				assert.equal(objectDiff.diff(instB, instB).changed, 'equal');
			});
			it('C C equal', () => {
				assert.equal(objectDiff.diff(instC, instC).changed, 'equal');
			});

			it('A B object change', () => {
				assert.equal(objectDiff.diff(instA, instB).changed, 'object change');
			});
			it('A C object change', () => {
				assert.equal(objectDiff.diff(instA, instC).changed, 'object change');
			});
			it('B A object change', () => {
				assert.equal(objectDiff.diff(instB, instA).changed, 'object change');
			});
			it('B C object change', () => {
				assert.equal(objectDiff.diff(instB, instC).changed, 'object change');
			});
			it('C A object change', () => {
				assert.equal(objectDiff.diff(instC, instA).changed, 'object change');
			});
			it('C B object change', () => {
				assert.equal(objectDiff.diff(instC, instB).changed, 'object change');
			});
		});
		describe('diffOwnProperties()', () => {
			it('deepEqual diff A x B', () => {
				one = objectDiff.diffOwnProperties(instA, instB);
				two = objectDiff.diffOwnProperties(instB, instA);
				assert.deepEqual(one, two, 'one, two');
				assert.deepEqual(two, one, 'two, one');
			});
			it('deepEqual diff A x C', () => {
				one = objectDiff.diffOwnProperties(instA, instC);
				two = objectDiff.diffOwnProperties(instC, instA);
				assert.deepEqual(one, two, 'one, two');
				assert.deepEqual(two, one, 'two, one');
			});
			it('deepEqual diff B x C', () => {
				one = objectDiff.diffOwnProperties(instB, instC);
				two = objectDiff.diffOwnProperties(instC, instB);
				assert.deepEqual(one, two, 'one, two');
				assert.deepEqual(two, one, 'two, one');
			});
			it('notDeepEqual diff A x D', () => {
				one = objectDiff.diffOwnProperties(instA, instD);
				two = objectDiff.diffOwnProperties(instD, instA);
				assert.deepEqual(one, two, 'one, two');
				assert.deepEqual(two, one, 'two, one');
			});
			
			it('A A equal', () => {
				assert.equal(objectDiff.diffOwnProperties(instA, instA).changed, 'equal');
			});
			it('B B equal', () => {
				assert.equal(objectDiff.diffOwnProperties(instB, instB).changed, 'equal');
			});
			it('C C equal', () => {
				assert.equal(objectDiff.diffOwnProperties(instC, instC).changed, 'equal');
			});

			it('A B object change', () => {
				assert.equal(objectDiff.diffOwnProperties(instA, instB).changed, 'object change');
			});
			it('A C object change', () => {
				assert.equal(objectDiff.diffOwnProperties(instA, instC).changed, 'object change');
			});
			it('B A object change', () => {
				assert.equal(objectDiff.diffOwnProperties(instB, instA).changed, 'object change');
			});
			it('B C object change', () => {
				assert.equal(objectDiff.diffOwnProperties(instB, instC).changed, 'object change');
			});
			it('C A object change', () => {
				assert.equal(objectDiff.diffOwnProperties(instC, instA).changed, 'object change');
			});
			it('C B object change', () => {
				assert.equal(objectDiff.diffOwnProperties(instC, instB).changed, 'object change');
			});
		});
	});
});