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

var assert = require('chai').assert;
var _ = require('underscore');

process.env['mocha-unfunk-color'] = true;
