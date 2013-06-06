var helper;
(function (helper) {
    var fs = require('fs');
    var path = require('path');
    var util = require('util');
    function readJSON() {
        var src = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            src[_i] = arguments[_i + 0];
        }
        return JSON.parse(fs.readFileSync(path.join.apply(path, src)));
    }
    helper.readJSON = readJSON;
    function dump(object, label, depth, showHidden) {
        if (typeof label === "undefined") { label = ''; }
        if (typeof depth === "undefined") { depth = 6; }
        if (typeof showHidden === "undefined") { showHidden = false; }
        if(console.log) {
            console.log(label + ':');
        }
        console.log(util.inspect(object, showHidden, depth, true));
    }
    helper.dump = dump;
    function dumpJSON(object, label) {
        if (typeof label === "undefined") { label = ''; }
        if(console.log) {
            console.log(label + ':');
        }
        console.log(JSON.stringify(object, null, 4));
    }
    helper.dumpJSON = dumpJSON;
})(helper || (helper = {}));
process.env['mocha-unfunk-color'] = true;
var _ = require('underscore');
var chaii = require('chai');
var expect = chaii.expect;
var assert = chaii.assert;
chaii.use(require('chai-fuzzy'));
assert.like = function (val, exp, msg) {
    new chaii.Assertion(val, msg).to.be.like(exp);
};
assert.notLike = function (val, exp, msg) {
    new chaii.Assertion(val, msg).to.not.be.like(exp);
};
assert.containOneLike = function (val, exp, msg) {
    new chaii.Assertion(val, msg).to.containOneLike(exp);
};
assert.notContainOneLike = function (val, exp, msg) {
    new chaii.Assertion(val, msg).to.not.containOneLike.like(exp);
};
assert.jsonOf = function (val, exp, msg) {
    new chaii.Assertion(val, msg).to.be.jsonOf(exp);
};
assert.notJsonOf = function (val, exp, msg) {
    new chaii.Assertion(val, msg).to.not.be.jsonOf(exp);
};
describe('async tests', function () {
    it('first passes', function (done) {
        setTimeout(function () {
            assert.ok(true);
            done();
        }, 10);
    });
    it('second fails', function (done) {
        setTimeout(function () {
            assert.ok(!true);
            done();
        }, 10);
    });
    it('third errors', function (done) {
        setTimeout(function () {
            done();
        }, 10);
    });
    it.skip('fouth pending', function (done) {
        setTimeout(function () {
            assert.ok(true);
            done();
        }, 10);
    });
    it('fifth passes', function (done) {
        setTimeout(function () {
            assert.ok(true);
            done();
        }, 10);
    });
});
describe('kitteh', function () {
    describe('can', function () {
        it('meow', function () {
            assert.equal('meow', 'meow');
        });
        describe('not', function () {
            it('count', function () {
                assert.deepEqual({
                    one: 1,
                    two: 2,
                    three: 3
                }, {
                    one: 3,
                    two: 2,
                    four: 4
                });
            });
        });
        describe('has', function () {
            it('milk', function () {
                assert.ok(true);
            });
            it('cheeseburgers', function () {
                assert.ok(true);
            });
            describe('no', function () {
                it('dogs', function () {
                    assert.equal('dogs', 'not here');
                });
                it('computer skills', function () {
                    throw (new Error('pretty stack trace is pretty'));
                });
            });
            describe('some', function () {
                it('fun', function () {
                    assert.deepEqual([
                        [
                            1
                        ], 
                        [
                            1, 
                            2
                        ], 
                        [
                            1, 
                            2, 
                            3
                        ]
                    ], [
                        [
                            1
                        ], 
                        [
                            1, 
                            2
                        ], 
                        [
                            1, 
                            2, 
                            3
                        ]
                    ]);
                });
                it('hats', function () {
                    assert.equal('hat', 'silly');
                });
            });
        });
    });
});
describe('objectDiff', function () {
    var TypeA = function () {
        this.aa = 'hello';
        this.bb = {
            a: 'yo',
            b: 1,
            c: [
                10, 
                20, 
                30
            ]
        };
    };
    TypeA.prototype.protoProp = 'shared';
    TypeA.prototype.protoAA = 'myAA';
    TypeA.prototype.protoMethodA = function () {
        return 1;
    };
    var TypeB = function () {
        this.aa = 'hello';
        this.bb = {
            a: 'yo',
            b: 1,
            c: [
                10, 
                20, 
                30
            ]
        };
    };
    TypeB.prototype.protoProp = 'shared';
    TypeB.prototype.protoBB = 'myBB';
    TypeB.prototype.protoMethodB = function () {
        return 3;
    };
    var getTypeC = function () {
        return {
            aa: 'hello',
            bb: {
                a: 'yo',
                b: 1,
                c: [
                    10, 
                    20, 
                    30
                ]
            }
        };
    };
    var getTypeD = function () {
        return {
            aa: 'hello',
            bb: {
                a: 'yo',
                b: 1,
                c: [
                    10, 
                    20, 
                    30, 
                    40
                ]
            }
        };
    };
    var objectDiff = require('../lib/objectDiff');
    describe('check', function () {
        var one, two;
        var instA, instB, instC, instD;
        before(function () {
            instA = new TypeA();
            instB = new TypeB();
            instC = getTypeC();
            instD = getTypeC();
        });
        it('deepEqual pre test', function () {
            assert.deepEqual(instA, instA);
        });
        it('notDeepEqual A B', function () {
            assert.notDeepEqual(instA, instB);
        });
        it('notDeepEqual A C', function () {
            assert.notDeepEqual(instA, instC);
        });
        it('notDeepEqual B C', function () {
            assert.notDeepEqual(instB, instC);
        });
        describe('diff()', function () {
            it('notDeepEqual diff A x B', function () {
                one = objectDiff.diff(instA, instB);
                two = objectDiff.diff(instB, instA);
                assert.notDeepEqual(one, two, 'one, two');
                assert.notDeepEqual(two, one, 'two, one');
            });
            it('notDeepEqual diff A x C', function () {
                one = objectDiff.diff(instA, instC);
                two = objectDiff.diff(instC, instA);
                assert.notDeepEqual(one, two, 'one, two');
                assert.notDeepEqual(two, one, 'two, one');
            });
            it('notDeepEqual diff B x C', function () {
                one = objectDiff.diff(instB, instC);
                two = objectDiff.diff(instC, instB);
                assert.notDeepEqual(one, two, 'one, two');
                assert.notDeepEqual(two, one, 'two, one');
            });
            it('notDeepEqual diff A x D', function () {
                one = objectDiff.diff(instA, instD);
                two = objectDiff.diff(instD, instA);
                assert.notDeepEqual(one, two, 'one, two');
                assert.notDeepEqual(two, one, 'two, one');
            });
            it('A A equal', function () {
                assert.equal(objectDiff.diff(instA, instA).changed, 'equal');
            });
            it('B B equal', function () {
                assert.equal(objectDiff.diff(instB, instB).changed, 'equal');
            });
            it('C C equal', function () {
                assert.equal(objectDiff.diff(instC, instC).changed, 'equal');
            });
            it('A B object change', function () {
                assert.equal(objectDiff.diff(instA, instB).changed, 'object change');
            });
            it('A C object change', function () {
                assert.equal(objectDiff.diff(instA, instC).changed, 'object change');
            });
            it('B A object change', function () {
                assert.equal(objectDiff.diff(instB, instA).changed, 'object change');
            });
            it('B C object change', function () {
                assert.equal(objectDiff.diff(instB, instC).changed, 'object change');
            });
            it('C A object change', function () {
                assert.equal(objectDiff.diff(instC, instA).changed, 'object change');
            });
            it('C B object change', function () {
                assert.equal(objectDiff.diff(instC, instB).changed, 'object change');
            });
        });
        describe('diffOwnProperties()', function () {
            it('deepEqual diff A x B', function () {
                one = objectDiff.diffOwnProperties(instA, instB);
                two = objectDiff.diffOwnProperties(instB, instA);
                assert.deepEqual(one, two, 'one, two');
                assert.deepEqual(two, one, 'two, one');
            });
            it('deepEqual diff A x C', function () {
                one = objectDiff.diffOwnProperties(instA, instC);
                two = objectDiff.diffOwnProperties(instC, instA);
                assert.deepEqual(one, two, 'one, two');
                assert.deepEqual(two, one, 'two, one');
            });
            it('deepEqual diff B x C', function () {
                one = objectDiff.diffOwnProperties(instB, instC);
                two = objectDiff.diffOwnProperties(instC, instB);
                assert.deepEqual(one, two, 'one, two');
                assert.deepEqual(two, one, 'two, one');
            });
            it('notDeepEqual diff A x D', function () {
                one = objectDiff.diffOwnProperties(instA, instD);
                two = objectDiff.diffOwnProperties(instD, instA);
                assert.deepEqual(one, two, 'one, two');
                assert.deepEqual(two, one, 'two, one');
            });
            it('A A equal', function () {
                assert.equal(objectDiff.diffOwnProperties(instA, instA).changed, 'equal');
            });
            it('B B equal', function () {
                assert.equal(objectDiff.diffOwnProperties(instB, instB).changed, 'equal');
            });
            it('C C equal', function () {
                assert.equal(objectDiff.diffOwnProperties(instC, instC).changed, 'equal');
            });
            it('A B object change', function () {
                assert.equal(objectDiff.diffOwnProperties(instA, instB).changed, 'object change');
            });
            it('A C object change', function () {
                assert.equal(objectDiff.diffOwnProperties(instA, instC).changed, 'object change');
            });
            it('B A object change', function () {
                assert.equal(objectDiff.diffOwnProperties(instB, instA).changed, 'object change');
            });
            it('B C object change', function () {
                assert.equal(objectDiff.diffOwnProperties(instB, instC).changed, 'object change');
            });
            it('C A object change', function () {
                assert.equal(objectDiff.diffOwnProperties(instC, instA).changed, 'object change');
            });
            it('C B object change', function () {
                assert.equal(objectDiff.diffOwnProperties(instC, instB).changed, 'object change');
            });
        });
    });
});
