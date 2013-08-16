/*
 *
 * Note: this is not the full original distribution but only the necessary parts.
 *
 * The remaining code is modified and tweaked.
 *
 * For the full version go to: https://github.com/NV/objectDiff.js
 *
 */

/*
 Original Copyright (c) Nikita Vasilyev

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
var objectDiff = typeof exports !== 'undefined' ? exports : {};

/**
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 */

var isDate = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Date]';
};

var padZero = function (str, len) {
	str = '' + str;
	while (str.length < len) {
		str = '0' + str;
	}
	return str;
};
var padZero2 = function (str) {
	str = '' + str;
	if (str.length === 1) {
		return '0' + str;
	}
	return str;
};
var getDateObj = function (date) {
	return {
		__date: padZero(date.getFullYear(), 4) + '/' + padZero2(date.getMonth()) + '/' + padZero2(date.getDate()),
		__time: padZero2(date.getHours()) + ':' + padZero2(date.getMinutes()) + ' ' + padZero2(date.getSeconds()) + ':' + padZero(date.getMilliseconds(), 3)
	};
};

objectDiff.diff = function diff(a, b) {

	if (a === b) {
		return {
			changed: 'equal',
			value: a
		};
	}
	if (!a) {
		return {
			changed: 'removed',
			value: b
		};
	}
	if (!b) {
		return {
			changed: 'added',
			value: a
		};
	}

	var value = {};
	var equal = true;
	for (var key in a) {
		var valueA = a[key];
		var typeA = typeof valueA;
		if (typeA === 'object' && isDate(valueA)) {
			valueA = getDateObj(valueA);
		}

		if (key in b) {
			var valueB = b[key];
			var typeB = typeof valueB;
			if (typeB === 'object' && isDate(valueB)) {
				valueB = getDateObj(valueB);
			}

			if (valueA === valueB) {
				value[key] = {
					changed: 'equal',
					value: valueA
				};
			} else {

				if (valueA && valueB && (typeA === 'object' || typeA === 'function') && (typeB === 'object' || typeB === 'function')) {

					var valueDiff = diff(valueA, valueB);
					if (valueDiff.changed === 'equal') {
						value[key] = {
							changed: 'equal',
							value: valueA
						};
					} else {
						equal = false;
						value[key] = valueDiff;
					}
				} else {
					equal = false;
					value[key] = {
						changed: 'primitive change',
						removed: valueA,
						added: valueB
					};
				}
			}
		} else {
			equal = false;
			value[key] = {
				changed: 'added',
				value: valueA
			};
		}
	}

	for (key in b) {
		if (!(key in a)) {
			equal = false;
			value[key] = {
				changed: 'removed',
				value: b[key]
			};
		}
	}

	if (equal) {
		return {
			changed: 'equal',
			value: a
		};
	} else {
		return {
			changed: 'object change',
			value: value
		};
	}
};
