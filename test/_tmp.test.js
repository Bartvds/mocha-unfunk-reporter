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
var _ = require('underscore');
var chaii = require('chai');
var expect = chaii.expect;
var assert = chaii.assert;
chaii.use(require('chai-fuzzy'));
process.env['mocha-unfunk-color'] = true;
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
describe('chai equality', function () {
    describe.only('fuzzy', function () {
        it('expect like', function () {
            expect({
                x: 1,
                y: 2,
                z: 3
            }).to.be.like({
                x: 1,
                y: 2,
                z: 3
            });
        });
    });
    describe('fuzzy', function () {
        it('assert ike', function () {
            assert.like({
                x: 1,
                y: 2,
                z: 3
            }, {
                x: 1,
                y: 2,
                z: 3
            });
            assert.notLike({
                x: 1,
                y: 2,
                z: 3
            }, {
                x: 3,
                y: 2,
                z: 1
            });
        });
    });
    describe('deepEqual', function () {
        it('passes deep array', function () {
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
        it('should fail this complex test', function () {
            var now = new Date();
            var original = {
                aa: 'red',
                bb: 1,
                cc: [
                    1, 
                    2, 
                    3
                ],
                now: now,
                next: now,
                dd: {
                    a: 'yo',
                    b: 1,
                    c: [
                        10, 
                        20, 
                        30
                    ],
                    d: {
                        xx: 100,
                        yy: 200,
                        zz: 300,
                        ww: [
                            1, 
                            2, 
                            3
                        ],
                        vv: {
                            x: 1,
                            y: 2,
                            z: 3
                        }
                    },
                    e: {
                    }
                },
                ee: {
                    x: 1,
                    y: 2
                }
            };
            var different = {
                aa: 'blue',
                cc: [
                    3, 
                    2, 
                    1
                ],
                bb: 1,
                now: now,
                next: new Date(new Date().getTime() + 123456),
                dd: {
                    a: 'yo',
                    b: 1,
                    c: [
                        10, 
                        20, 
                        40
                    ],
                    d: {
                        xx: 50,
                        yy: 200,
                        qq: 300,
                        ww: [
                            3, 
                            2
                        ],
                        vv: {
                            x: 1,
                            y: 2,
                            z: 3
                        }
                    },
                    e: {
                    }
                },
                ee: {
                    x: 1,
                    y: 2,
                    z: 3
                }
            };
            assert.deepEqual(original, different);
        });
    });
});
var ClassTS = (function () {
    function ClassTS() {
        this.aa = 'hello';
        this.bb = 1;
        this.cc = [
            1, 
            2, 
            3
        ];
        this.dd = {
            a: 'yo',
            b: 1,
            c: [
                10, 
                20, 
                30
            ]
        };
    }
    return ClassTS;
})();
var MethoTS = (function () {
    function MethoTS() {
        this.aa = 'hello';
        this.bb = 1;
        this.cc = [
            1, 
            2, 
            3
        ];
        this.dd = {
            a: 'yo',
            b: 1,
            c: [
                10, 
                20, 
                30
            ]
        };
    }
    MethoTS.prototype.method = function () {
        return 1;
    };
    return MethoTS;
})();
describe('chai equality', function () {
    var NamedJS = function NamedJS() {
        this.aa = 'hello';
        this.bb = 1;
        this.cc = [
            1, 
            2, 
            3
        ];
        this.dd = {
            a: 'yo',
            b: 1,
            c: [
                10, 
                20, 
                30
            ]
        };
    };
    NamedJS.prototype.method = function () {
        return 1;
    };
    var AnonJS = function AnonJS() {
        this.aa = 'hello';
        this.bb = 1;
        this.cc = [
            1, 
            2, 
            3
        ];
        this.dd = {
            a: 'yo',
            b: 1,
            c: [
                10, 
                20, 
                30
            ]
        };
    };
    var getLiteral = function () {
        return {
            aa: 'hello',
            bb: 1,
            cc: [
                1, 
                2, 
                3
            ],
            dd: {
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
    var modifyObj = function (obj, level, value) {
        if(level === 1) {
            obj.bb = value;
        } else if(level === 2) {
            obj.dd.id = value;
        } else if(level === 3) {
            obj.dd.c[2] = value;
        }
        return obj;
    };
    var count = 0;
    var typeFactoryMap = {
        literal: function (change) {
            return modifyObj(getLiteral(), change, 'literal' + (count++));
        },
        created: function (change) {
            return modifyObj(Object.create(getLiteral()), change, 'created' + (count++));
        },
        namedJS: function (change) {
            return modifyObj(new NamedJS(), change, 'namedJS' + (count++));
        },
        anonnJS: function (change) {
            return modifyObj(new AnonJS(), change, 'anonnJS' + (count++));
        },
        classTS: function (change) {
            return modifyObj(new ClassTS(), change, 'classTS' + (count++));
        },
        methoTS: function (change) {
            return modifyObj(new MethoTS(), change, 'methoTS' + (count++));
        },
        jsonObj: function (change) {
            return modifyObj(helper.readJSON(__dirname, 'fixtures/chai/equal.object.json'), change, 'jsonObj' + (count++));
        }
    };
    var make = function (type, change) {
        if (typeof change === "undefined") { change = false; }
        if(typeFactoryMap.hasOwnProperty(type)) {
            return modifyObj(new (typeFactoryMap[type])(), change, 'methoTS');
        }
        throw ('bad type ' + type);
        return null;
    };
    before(function () {
    });
    describe('assert only', function () {
        describe('literal', function () {
            var obj = make('literal');
            assert.isObject(obj);
            it('equal', function () {
                assert.equal(obj, make('methoTS'));
            });
            it('deepEqual', function () {
                assert.deepEqual(obj, make('methoTS'));
            });
        });
    });
    describe('assert equal', function () {
        _.each(typeFactoryMap, function (left, name, map) {
            describe(name + ' vs', function () {
                var obj = left();
                assert.isObject(obj);
                _.each(map, function (right, sub) {
                    if(left !== right) {
                        it(sub, function () {
                            assert.deepEqual(obj, right());
                        });
                    }
                });
            });
        });
    });
    describe('assert deepEqual', function () {
        _.each(typeFactoryMap, function (left, name, map) {
            describe(name + ' vs', function () {
                var obj = left();
                assert.isObject(obj);
                _.each(map, function (right, sub) {
                    if(left !== right) {
                        it(sub, function () {
                            assert.deepEqual(obj, right());
                        });
                    }
                });
            });
        });
    });
    describe('assert notDeepEqual level 1', function () {
        _.each(typeFactoryMap, function (left, name, map) {
            describe(name + ' vs', function () {
                var obj = left(1);
                assert.isObject(obj);
                assert.propertyNotVal(obj, 'bb', 'hello');
                _.each(map, function (right, sub) {
                    if(left !== right) {
                        it(sub, function () {
                            assert.notDeepEqual(obj, right());
                        });
                    }
                });
            });
        });
    });
    describe('assert notDeepEqual level 2', function () {
        _.each(typeFactoryMap, function (left, name, map) {
            describe(name + ' vs', function () {
                var obj = left(2);
                assert.isObject(obj);
                assert.propertyNotVal(obj.dd, 'id', 'yo');
                _.each(map, function (right, sub) {
                    if(left !== right) {
                        it(sub, function () {
                            assert.notDeepEqual(obj, right());
                        });
                    }
                });
            });
        });
    });
    describe('assert notDeepEqual level 3', function () {
        _.each(typeFactoryMap, function (left, name, map) {
            describe(name + ' vs', function () {
                var obj = left(3);
                assert.isObject(obj);
                assert.propertyNotVal(obj.dd.c, '2', 30);
                _.each(map, function (right, sub) {
                    if(left !== right) {
                        it(sub, function () {
                            assert.notDeepEqual(obj, right());
                        });
                    }
                });
            });
        });
    });
});
var deepSortX = function (data) {
};
var deepSort = function (data) {
    return data.sort();
};
describe('deepsort', function () {
    before(function () {
    });
    it('first pass', function () {
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
