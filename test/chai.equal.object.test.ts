///<reference path="_ref.ts" />

declare var assert:chai.Assert;
declare var helper:helper;
declare var _:UnderscoreStatic;

class ClassTS {
	aa:string = 'hello';
	bb:number = 1;
	cc:number[] = [1, 2, 3];
	dd:any = {a: 'yo', b: 1, c: [10, 20, 30]};
}

class MethoTS {
	aa:string = 'hello';
	bb:number = 1;
	cc:number[] = [1, 2, 3];
	dd:any = {a: 'yo', b: 1, c: [10, 20, 30]};

	method() {
		return 1;
	}
}

describe('chai equality', () => {

	var NamedJS = function NamedJS() {
		this.aa = 'hello';
		this.bb = 1;
		this.cc = [1, 2, 3];
		this.dd = {a: 'yo', b: 1, c: [10, 20, 30]};
	}
	NamedJS.prototype.method = function () {
		return 1;
	}
	var AnonJS = function AnonJS() {
		this.aa = 'hello';
		this.bb = 1;
		this.cc = [1, 2, 3];
		this.dd = {a: 'yo', b: 1, c: [10, 20, 30]};
	};
	var getLiteral = function () {
		return {
			aa: 'hello',
			bb: 1,
			cc: [1, 2, 3],
			dd: {a: 'yo', b: 1, c: [10, 20, 30]}
		};
	};
	//apply some change
	var modifyObj = (obj, level, value) => {
		if (level === 1) {
			obj.bb = value;
		}
		else if (level === 2) {
			obj.dd.id = value;
		}
		else if (level === 3) {
			obj.dd.c[2] = value;
		}
		return obj;
	};
	var count = 0;
	var typeFactoryMap = {
		literal: (change) => {
			return modifyObj(getLiteral(), change, 'literal' + (count++));
		},
		created: (change) => {
			return  modifyObj(Object.create(getLiteral()), change, 'created' + (count++));
		},
		namedJS: (change) => {
			return modifyObj(new NamedJS(), change, 'namedJS' + (count++));
		},
		anonnJS: (change) => {
			return modifyObj(new AnonJS(), change, 'anonnJS' + (count++));
		},
		classTS: (change) => {
			return modifyObj(new ClassTS(), change, 'classTS' + (count++));
		},
		methoTS: (change) => {
			return modifyObj(new MethoTS(), change, 'methoTS' + (count++));
		},
		jsonObj: (change) => {
			return modifyObj(helper.readJSON(__dirname, 'fixtures/chai/equal.object.json'), change, 'jsonObj' + (count++));
		}
	};
	var make = (type, change?:bool = false) => {
		if (typeFactoryMap.hasOwnProperty(type)) {
			return modifyObj(new (typeFactoryMap[type])(), change, 'methoTS');
		}
		throw('bad type ' + type);
		return null;
	};

	before(()=> {
		//console.log(JSON.stringify(typeFactoryMap.literal(0), null, 4));
	});

	describe('assert only', () => {
		describe('literal', () => {
			var obj = make('literal');
			assert.isObject(obj);
			it('equal', () => {
				assert.equal(obj,  make('methoTS'));
			});
			it('deepEqual', () => {
				assert.deepEqual(obj,  make('methoTS'));
			});
		});
	});


	describe('assert equal', () => {
		_.each(typeFactoryMap, (left, name, map?) => {
			describe(name + ' vs', () => {
				var obj = left();
				assert.isObject(obj);
				_.each(map, (right, sub) => {
					if (left !== right) {
						it(sub, () => {
							assert.deepEqual(obj, right());
						});
					}
				});
			});
		});
	});

	describe('assert deepEqual', () => {
		_.each(typeFactoryMap, (left, name, map?) => {
			describe(name + ' vs', () => {
				var obj = left();
				assert.isObject(obj);
				_.each(map, (right, sub) => {
					if (left !== right) {
						it(sub, () => {
							assert.deepEqual(obj, right());
						});
					}
				});
			});
		});
	});
	describe('assert notDeepEqual level 1', () => {
		_.each(typeFactoryMap, (left, name, map?) => {
			describe(name + ' vs', () => {
				var obj = left(1);
				assert.isObject(obj);
				assert.propertyNotVal(obj, 'bb', 'hello');
				_.each(map, (right, sub) => {
					if (left !== right) {
						it(sub, () => {
							assert.notDeepEqual(obj, right());
						});
					}
				});
			});
		});
	});
	describe('assert notDeepEqual level 2', () => {
		_.each(typeFactoryMap, (left, name, map?) => {
			describe(name + ' vs', () => {
				var obj = left(2);
				assert.isObject(obj);
				assert.propertyNotVal(obj.dd, 'id', 'yo');
				_.each(map, (right, sub) => {
					if (left !== right) {
						it(sub, () => {
							assert.notDeepEqual(obj, right());
						});
					}
				});
			});
		});
	});
	describe('assert notDeepEqual level 3', () => {
		_.each(typeFactoryMap, (left, name, map?) => {
			describe(name + ' vs', () => {
				var obj = left(3);
				assert.isObject(obj);
				assert.propertyNotVal(obj.dd.c, '2', 30);
				_.each(map, (right, sub) => {
					if (left !== right) {
						it(sub, () => {
							assert.notDeepEqual(obj, right());
						});
					}
				});
			});
		});
	});
});
