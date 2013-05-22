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
var typeFactoryMap = {
    literal: function (change) {
        return modifyObj(getLiteral(), change, 'literal');
    },
    created: function (change) {
        return modifyObj(Object.create(getLiteral()), change, 'created');
    },
    namedJS: function (change) {
        return modifyObj(new NamedJS(), change, 'namedJS');
    },
    anonnJS: function (change) {
        return modifyObj(new AnonJS(), change, 'anonnJS');
    },
    classTS: function (change) {
        return modifyObj(new ClassTS(), change, 'classTS');
    },
    jsonObj: function (change) {
        return modifyObj(helper.readJSON(__dirname, 'fixtures/chai.equalObject.json'), change, 'jsonObj');
    }
};
describe('chai equality', function () {
    before(function () {
    });
    describe('assert deepEqual', function () {
        _.each(typeFactoryMap, function (left, name, map) {
            it(name, function () {
                var obj = left();
                assert.isObject(obj);
                _.each(map, function (right, name) {
                    assert.deepEqual(obj, right(), name);
                });
            });
        });
    });
    describe('assert notDeepEqual level 1', function () {
        _.each(typeFactoryMap, function (left, name, map) {
            it(name, function () {
                var obj = left(1);
                assert.isObject(obj);
                assert.propertyNotVal(obj, 'bb', 'hello');
                _.each(map, function (right, name) {
                    assert.notDeepEqual(obj, right(), name);
                });
            });
        });
    });
    describe('assert notDeepEqual level 2', function () {
        _.each(typeFactoryMap, function (left, name, map) {
            it(name, function () {
                var obj = left(2);
                assert.isObject(obj);
                assert.propertyNotVal(obj.dd, 'id', 'yo');
                _.each(map, function (right, name) {
                    assert.notDeepEqual(obj, right(), name);
                });
            });
        });
    });
    describe('assert notDeepEqual level 3', function () {
        _.each(typeFactoryMap, function (left, name, map) {
            it(name, function () {
                var obj = left(3);
                assert.isObject(obj);
                assert.propertyNotVal(obj.dd.c, '2', 30);
                _.each(map, function (right, name) {
                    assert.notDeepEqual(obj, right(), name);
                });
            });
        });
    });
});
describe('kitteh', function () {
    describe('can', function () {
        it('meow', function () {
            assert.equal('meow', 'meow');
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
                    throw (new Error('pretty stack trace'));
                });
            });
            describe('some', function () {
                it('hats', function () {
                    assert.equal('hat', 'silly');
                });
                it('yarn', function () {
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
    });
});
