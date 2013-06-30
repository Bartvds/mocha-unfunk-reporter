// Type definitions for proclaim v1.4.0
// Project: https://github.com/rowanmanning/proclaim
// Definitions by: Bart van der Schoor <https://github.com/Bartvds>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module Proclaim
{
	interface Assert
	{
		fail(actual, expected, message?:string, operator?:string):void;

		ok(value, message?:string):void;

		equal(actual, expected, message?:string):void;
		notEqual(actual, expected, message?:string):void;

		strictEqual(actual, expected, message?:string):void;
		notStrictEqual(actual, expected, message?:string):void;

		deepEqual(actual, expected, message?:string):void;
		notDeepEqual(actual, expected, message?:string):void;
		
		throws(fn, expected?, message?:string):void;
		doesNotThrow(fn, expected?, message?:string):void;

		isTypeOf(actual, expected, message?:string):void;
		isNotTypeOf(actual, expected, message?:string):void;
		isInstanceOf(actual, expected, message?:string):void;
		isNotInstanceOf(actual, expected, message?:string):void;

		isArray(value, message?:string):void;
		isNotArray(value, message?:string):void;
		
		isBoolean(value, message?:string):void;
		isNotBoolean(value, message?:string):void;

		isTrue(value:bool, message?:string):void;
		isFalse(value:bool, message?:string):void;

		isFunction(value, message?:string):void;
		isNotFunction(value, message?:string):void;

		isNull(value, message?:string):void;
		isNotNull(value, message?:string):void;

		isNumber(value, message?:string):void;
		isNotNumber(value, message?:string):void;

		isObject(value, message?:string):void;
		isNotObject(value, message?:string):void;

		isString(value, message?:string):void;
		isNotString(value, message?:string):void;

		isUndefined(value, message?:string):void;
		isDefined(value, message?:string):void;

		match(actual, expected:RegExp, message?:string):void;
		notMatch(actual, expected:RegExp, message?:string):void;

		includes(haystack, needle, message?:string):void;
		doesNotInclude(haystack, needle, message?:string):void;

		length(value, expected, message?:string):void;
	}
	//node module
	declare var proclaim:Assert;
}
//browser global
declare var proclaim:Proclaim.Assert;