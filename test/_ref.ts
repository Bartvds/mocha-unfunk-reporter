/// <reference path="../typings/DefinitelyTyped/node/node.d.ts" />
/// <reference path="../typings/DefinitelyTyped/mocha/mocha.d.ts" />
/// <reference path="../typings/DefinitelyTyped/chai/chai-assert.d.ts" />
/// <reference path="../typings/DefinitelyTyped/chai/chai-json-schema-assert.d.ts" />
/// <reference path="../typings/DefinitelyTyped/proclaim/proclaim.d.ts" />

/// <reference path="_helper.ts" />


declare var window:Window;
interface Window {
	chai:Chai.ChaiStatic;
	proclaim:Proclaim.Assert;
	expect:any;
	objectDiff:any;
	jsDiff:any;
}
var chai:Chai.ChaiStatic;
var objectDiff;

// ugly TypeScript mash

if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
	// nodeJS
	chai = (<Chai.ChaiStatic> require('chai'));
	proclaim = (<Proclaim.Assert> require('proclaim'));

	objectDiff = require('../../../../lib/objectDiff');

	// DON't use this as it will mess-up diffs
	// require('source-map-support').install();
}
else {
	// browser
	chai = window.chai;
	proclaim = window.proclaim;
}

if (!chai) {
	throw new Error('missing chai');
}

chai.Assertion.includeStack = true;
var assert = chai.assert;

if (!proclaim) {
	throw new Error('missing proclaim');
}
