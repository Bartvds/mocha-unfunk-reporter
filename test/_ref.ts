/// <reference path="../typings/DefinitelyTyped/node/node.d.ts" />
/// <reference path="../typings/DefinitelyTyped/mocha/mocha.d.ts" />
/// <reference path="../typings/DefinitelyTyped/chai/chai-assert.d.ts" />
/// <reference path="../typings/DefinitelyTyped/underscore/underscore.d.ts" />

/// <reference path="helper.ts" />

/* due bugs in TypeScript compiler's sourcemap generator this is disabled for now
if (require.resolve('source-map-support')) {
	console.log('auto-detected source-map-support');
	require('source-map-support').install();
}*/
var _ = require('underscore');

var chaii = require('chai');
var expect = chaii.expect;
var assert = chaii.assert;
chaii.use(require('chai-fuzzy'));

process.env['mocha-unfunk-color'] = true;

declare module chai
{
	interface Assert
	{
		like(act:any, exp:any, msg?:string);
		notLike(act:any, exp:any, msg?:string);
	}
}