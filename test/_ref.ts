/// <reference path="../typings/DefinitelyTyped/node/node.d.ts" />
/// <reference path="../typings/DefinitelyTyped/mocha/mocha.d.ts" />
/// <reference path="../typings/DefinitelyTyped/chai/chai-assert.d.ts" />
/// <reference path="../typings/DefinitelyTyped/chai/chai-fuzzy-assert.d.ts" />
/// <reference path="../typings/DefinitelyTyped/underscore/underscore.d.ts" />

/// <reference path="helper.ts" />

/* due bugs in TypeScript compiler's sourcemap generator this is disabled for now
if (require.resolve('source-map-support')) {
	console.log('auto-detected source-map-support');
	require('source-map-support').install();
}*/

process.env['mocha-unfunk-color'] = true;

var _ = require('underscore');

var chaii = require('chai');
var expect = chaii.expect;
var assert = chaii.assert;
chaii.use(require('chai-fuzzy'));

/*
declare module chai {
	interface Assert {
		like(act:any, exp:any, msg?:string);
		notLike(act:any, exp:any, msg?:string);
		containOneLike(act:any, exp:any, msg?:string);
		notContainOneLike(act:any, exp:any, msg?:string);
		jsonOf(act:any, exp:any, msg?:string);
		notJsonOf(act:any, exp:any, msg?:string);
	}
}*/

assert.like = function (val, exp:any, msg?:string) {
	new chaii.Assertion(val, msg).to.be.like(exp);
};
assert.notLike = function (val, exp:any, msg?:string) {
	new chaii.Assertion(val, msg).to.not.be.like(exp);
};
assert.containOneLike = function (val, exp:any, msg?:string) {
	new chaii.Assertion(val, msg).to.containOneLike(exp);
};
assert.notContainOneLike = function (val, exp:any, msg?:string) {
	new chaii.Assertion(val, msg).to.not.containOneLike.like(exp);
};
assert.jsonOf = function (val, exp:any, msg?:string) {
	new chaii.Assertion(val, msg).to.be.jsonOf(exp);
};
assert.notJsonOf = function (val, exp:any, msg?:string) {
	new chaii.Assertion(val, msg).to.not.be.jsonOf(exp);
};