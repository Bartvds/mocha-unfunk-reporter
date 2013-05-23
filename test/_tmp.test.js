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
var assert = require('chai').assert;
var _ = require('underscore');
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
        this.bb = 1;
        this.cc = [
            3, 
            2, 
            1
        ];
        this.dd = {
            a: 'yo',
            b: 1,
            c: [
                10, 
                20, 
                30
            ],
            d: 10
        };
    };
    TypeA.prototype.protoProp = 'shared';
    TypeA.prototype.protoMethodA = function () {
        return 1;
    };
    var TypeB = function () {
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
    TypeB.prototype.protoProp = 'shared';
    TypeB.prototype.protoMethodB = function () {
        return 3;
    };
    var objectDiff = require('../lib/objectDiff');
    describe.only('diff', function () {
        var objDiffA, objDiffB;
        it('deepEqual A B', function () {
            assert.deepEqual(new TypeA(), new TypeB());
        });
        it('deepEqual B A', function () {
            assert.deepEqual(new TypeB(), new TypeA());
        });
        it('diffs deepEqual A B', function () {
            objDiffA = objectDiff.diff(new TypeA(), new TypeB());
            objDiffB = objectDiff.diff(new TypeB(), new TypeA());
            assert.deepEqual(objDiffA, objDiffB);
        });
        it('diffs deepEqual B A', function () {
            objDiffA = objectDiff.diff(new TypeA(), new TypeB());
            objDiffB = objectDiff.diff(new TypeB(), new TypeA());
            assert.deepEqual(objDiffB, objDiffA);
        });
    });
});
