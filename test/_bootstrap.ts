/// <reference path="_ref.d.ts" />
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

// ugly TypeScript mash

if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
	// nodeJS
	chai = (<Chai.ChaiStatic> require('chai'));
	proclaim = (<Proclaim.Assert> require('proclaim'));

	chai.use(require('chai-json-schema'));

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
