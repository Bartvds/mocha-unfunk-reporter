/// <reference path="../typings/DefinitelyTyped/node/node.d.ts" />
/// <reference path="../typings/DefinitelyTyped/mocha/mocha.d.ts" />
/// <reference path="../typings/DefinitelyTyped/chai/chai-assert.d.ts" />
/// <reference path="../typings/DefinitelyTyped/proclaim/proclaim.d.ts" />
/// <reference path="../typings/DefinitelyTyped/underscore/underscore.d.ts" />

/// <reference path="_helper.ts" />

require('source-map-support').install();

declare var window:Window;
declare interface Window {
	chai:chai;
	proclaim:any;
	expect:any;
	objectDiff:any;
	jsDiff:any;
}

//ugly TypeScript hacks (this needs revision)

declare var chai:any;
declare var proclaim:any;

declare var objectDiff;
declare var jsDiff;

if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
	// NodeJS
	var chai = require('chai');
	chai.Assertion.includeStack = true;
	var proclaim = require('proclaim');

	var objectDiff = require('../lib/objectDiff');
	var jsDiff = require('../lib/jsDiff');
}
else {
	// Other environment (usually <script> tag): plug in to global chai instance directly.
	var chai = window.chai;
	var proclaim = window.proclaim;

	var jsDiff = window.jsDiff;
	var objectDiff = window.objectDiff;
}
var assert = chai.assert;

if (!chai) {
	throw new Error('missing chai');
}
if (!proclaim) {
	throw new Error('missing proclaim');
}

if (!jsDiff) {
	throw new Error('missing jsDiff');
}
if (!objectDiff) {
	throw new Error('missing objectDiff');
}
