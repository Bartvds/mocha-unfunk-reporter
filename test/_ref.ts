/// <reference path="../typings/DefinitelyTyped/node/node.d.ts" />
/// <reference path="../typings/DefinitelyTyped/mocha/mocha.d.ts" />
/// <reference path="../typings/DefinitelyTyped/chai/chai-assert.d.ts" />
/// <reference path="../typings/DefinitelyTyped/chai/chai-fuzzy-assert.d.ts" />
/// <reference path="../typings/DefinitelyTyped/underscore/underscore.d.ts" />

/// <reference path="_helper.ts" />

/* due bugs in TypeScript compiler's sourcemap generator this is disabled for now
if (require.resolve('source-map-support')) {
	console.log('auto-detected source-map-support');
	require('source-map-support').install();
}*/

if (typeof process !== 'undefined' && typeof process.env === 'object') {
	process.env['mocha-unfunk-color'] = true;
}

declare var window:Window;
declare interface Window {
	chai:chai;
	objectDiff;any;
}

//ugly TypeScript hacks
var _;
declare var chai:any;
declare var objectDiff;

if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
	// NodeJS
	var chai = require('chai');
	chai.Assertion.includeStack = true;
	_ = require('underscore')
	chai.use(require('chai-fuzzy'));
	var objectDiff = require('../lib/objectDiff');
}
else {
	// Other environment (usually <script> tag): plug in to global chai instance directly.
	var chai = window.chai;
	var objectDiff = window.objectDiff;
}

var expect = chai.expect;
var assert = chai.assert;
