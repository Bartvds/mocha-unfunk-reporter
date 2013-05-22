///<reference path="_ref.ts" />

declare var assert:chai.Assert;
declare var helper:helper;
declare var _:UnderscoreStatic;

class ClassTS {
	aa:string = 'hello';
	bb:number = 1;
	cc:number[] = [1, 2, 3];
	dd:any = {a: 'yo', b: 1, c:[10,20,30]};
}
var NamedJS = function NamedJS() {
	this.aa = 'hello';
	this.bb = 1;
	this.cc = [1, 2, 3];
	this.dd = {a: 'yo', b: 1, c:[10,20,30]};
}
var AnonJS = function AnonJS() {
	this.aa = 'hello';
	this.bb = 1;
	this.cc = [1, 2, 3];
	this.dd = {a: 'yo', b: 1, c:[10,20,30]};
};
var getLiteral = function () {
	return {
		aa: 'hello',
		bb: 1,
		cc: [1, 2, 3],
		dd: {a: 'yo', b: 1, c:[10,20,30]}
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
var typeFactoryMap = {
	literal: (change) => {
		return modifyObj(getLiteral(), change, 'literal');
	},
	created: (change) => {
		return  modifyObj(Object.create(getLiteral()), change, 'created');
	},
	namedJS: (change) => {
		return modifyObj(new NamedJS(), change, 'namedJS');
	},
	anonnJS: (change) => {
		return modifyObj(new AnonJS(), change, 'anonnJS');
	},
	classTS: (change) => {
		return modifyObj(new ClassTS(), change, 'classTS');
	},
	jsonObj: (change) => {
		return modifyObj(helper.readJSON(__dirname, 'fixtures/chai.equalObject.json'), change, 'jsonObj');
	}
};

describe('chai equality', () => {

	before(()=>{
		//console.log(JSON.stringify(typeFactoryMap.literal(0), null, 4));
	});
	describe('assert deepEqual', () => {
		_.each(typeFactoryMap, (left, name, map?) => {
			it(name, () => {
				var obj = left();
				assert.isObject(obj);
				_.each(map, (right, name) => {
					assert.deepEqual(obj, right(), name);
				});
			});
		});
	});
	describe('assert notDeepEqual level 1', () => {
		_.each(typeFactoryMap, (left, name, map?) => {
			it(name, () => {
				var obj = left(1);
				assert.isObject(obj);
				assert.propertyNotVal(obj, 'bb', 'hello');
				_.each(map, (right, name) => {
					assert.notDeepEqual(obj, right(), name);
				});
			});
		});
	});
	describe('assert notDeepEqual level 2', () => {
		_.each(typeFactoryMap, (left, name, map?) => {
			it(name, () => {
				var obj = left(2);
				assert.isObject(obj);
				assert.propertyNotVal(obj.dd, 'id', 'yo');
				_.each(map, (right, name) => {
					assert.notDeepEqual(obj, right(), name);
				});
			});
		});
	});
	describe('assert notDeepEqual level 3', () => {
		_.each(typeFactoryMap, (left, name, map?) => {
			it(name, () => {
				var obj = left(3);
				assert.isObject(obj);
				assert.propertyNotVal(obj.dd.c, '2', 30);
				_.each(map, (right, name) => {
					assert.notDeepEqual(obj, right(), name);
				});
			});
		});
	});
});
