/// <reference path="../typings/DefinitelyTyped/node/node.d.ts" />
/// <reference path="../typings/DefinitelyTyped/mocha/mocha.d.ts" />
/// <reference path="../typings/DefinitelyTyped/chai/chai-assert.d.ts" />
/// <reference path="../typings/DefinitelyTyped/underscore/underscore.d.ts" />

/// <reference path="_helper.ts" />

declare var window:Window;
declare interface Window {
	chai:chai;
	objectDiff;any;
}

//ugly TypeScript hacks
declare var chai:any;
declare var objectDiff;

if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
	// NodeJS
	var chai = require('chai');
	chai.Assertion.includeStack = true;
	var objectDiff = require('../lib/objectDiff');

	process.env['mocha-unfunk-color'] = true;
}
else {
	// Other environment (usually <script> tag): plug in to global chai instance directly.
	var chai = window.chai;
	var objectDiff = window.objectDiff;
}

var assert = chai.assert;
