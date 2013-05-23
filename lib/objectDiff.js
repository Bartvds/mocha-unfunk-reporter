var objectDiff = typeof exports != 'undefined' ? exports : {};

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
	if (str.length == 1)	{
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
		}
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
				}
			} else {

				if (valueA && valueB && (typeA == 'object' || typeA == 'function') && (typeB == 'object' || typeB == 'function')) {

					var valueDiff = diff(valueA, valueB);
					if (valueDiff.changed == 'equal') {
						value[key] = {
							changed: 'equal',
							value: valueA
						}
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
					}
				}
			}
		} else {
			equal = false;
			value[key] = {
				changed: 'removed',
				value: valueA
			}
		}
	}

	for (key in b) {
		if (!(key in a)) {
			equal = false;
			value[key] = {
				changed: 'added',
				value: b[key]
			}
		}
	}

	if (equal) {
		return {
			changed: 'equal',
			value: a
		}
	} else {
		return {
			changed: 'object change',
			value: value
		}
	}
};



objectDiff.diffHa = function diffHa(a, b) {

	if (a === b) {
		return {
			changed: 'equal',
			value: a
		}
	}

	var value = {};
	var equal = true;

	var keys = Object.keys(a);
	for (var i = 0, length = keys.length; i < length; i++) {
		var key = keys[i];
		var valueA = a[key];
		var typeA = typeof valueA;
		if (typeA === 'object' && isDate(valueA)) {
			valueA = getDateObj(valueA);
		}

		if (b.hasOwnProperty(key)) {
			var valueB = b[key];
			var typeB = typeof valueB;
			if (typeB === 'object' && isDate(valueB)) {
				valueB = getDateObj(valueB);
			}

			if (valueA === valueB) {
				value[key] = {
					changed: 'equal',
					value: valueA
				}
			} else {

				if (valueA && valueB && (typeA == 'object' || typeA == 'function') && (typeB == 'object' || typeB == 'function')) {

					var valueDiff = diffHa(valueA, valueB);
					if (valueDiff.changed == 'equal') {
						value[key] = {
							changed: 'equal',
							value: valueA
						}
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
					}
				}
			}
		} else {
			equal = false;
			value[key] = {
				changed: 'removed',
				value: valueA
			}
		}
	}
	keys = Object.keys(b);
	for (var i = 0, length = keys.length; i < length; i++) {
		var key = keys[i];

		if (!a.hasOwnProperty(key)) {
			equal = false;
			value[key] = {
				changed: 'added',
				value: b[key]
			}
		}
	}

	if (equal) {
		return {
			changed: 'equal',
			value: a
		}
	} else {
		return {
			changed: 'object change',
			value: value
		}
	}
};

/**
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 */
objectDiff.diffOwnProperties = function diffOwnProperties(a, b) {

	if (a === b) {
		return {
			changed: 'equal',
			value: a
		}
	}

	var diff = {};
	var equal = true;
	var keys = Object.keys(a);

	for (var i = 0, length = keys.length; i < length; i++) {
		var valueA = a[key];
		var key = keys[i];
		if (b.hasOwnProperty(key)) {
			var valueB = b[key];

			if (valueA === valueB) {
				diff[key] = {
					changed: 'equal',
					value: valueA
				}
			} else {
				var typeA = typeof valueA;
				var typeB = typeof valueB;
				if (valueA && valueB && (typeA == 'object' || typeA == 'function') && (typeB == 'object' || typeB == 'function')) {
					var valueDiff = diffOwnProperties(valueA, valueB);
					if (valueDiff.changed == 'equal') {
						diff[key] = {
							changed: 'equal',
							value: valueA
						}
					} else {
						equal = false;
						diff[key] = valueDiff;
					}
				} else {
					equal = false;
					diff[key] = {
						changed: 'primitive change',
						removed: valueA,
						added: valueB
					}
				}
			}
		} else {
			equal = false;
			diff[key] = {
				changed: 'removed',
				value: valueA
			}
		}
	}

	keys = Object.keys(b);

	for (i = 0, length = keys.length; i < length; i++) {
		key = keys[i];
		if (!a.hasOwnProperty(key)) {
			equal = false;
			diff[key] = {
				changed: 'added',
				value: b[key]
			}
		}
	}

	if (equal) {
		return {
			value: a,
			changed: 'equal'
		}
	} else {
		return {
			changed: 'object change',
			value: diff
		}
	}
};


(function () {

	/**
	 * @param {Object} changes
	 * @return {string}
	 */
	objectDiff.convertToXMLString = function convertToXMLString(changes) {
		var properties = [];

		var diff = changes.value;
		if (changes.changed == 'equal') {
			return inspect(diff);
		}

		for (var key in diff) {
			var changed = diff[key].changed;
			switch (changed) {
				case 'equal':
					properties.push(stringifyObjectKey(escapeHTML(key)) + '<span>: </span>' + inspect(diff[key].value));
					break;

				case 'removed':
					properties.push('<del class="diff">' + stringifyObjectKey(escapeHTML(key)) + '<span>: </span>' + inspect(diff[key].value) + '</del>');
					break;

				case 'added':
					properties.push('<ins class="diff">' + stringifyObjectKey(escapeHTML(key)) + '<span>: </span>' + inspect(diff[key].value) + '</ins>');
					break;

				case 'primitive change':
					var prefix = stringifyObjectKey(escapeHTML(key)) + '<span>: </span>';
					properties.push(
					'<del class="diff diff-key">' + prefix + inspect(diff[key].removed) + '</del><span>,</span>\n' +
					'<ins class="diff diff-key">' + prefix + inspect(diff[key].added) + '</ins>');
					break;

				case 'object change':
					properties.push(stringifyObjectKey(key) + '<span>: </span>' + convertToXMLString(diff[key]));
					break;
			}
		}

		return '<span>{</span>\n<div class="diff-level">' + properties.join('<span>,</span>\n') + '\n</div><span>}</span>';
	};

	/**
	 * @param {string} key
	 * @return {string}
	 */
	function stringifyObjectKey(key) {
		return /^[a-z0-9_$]*$/i.test(key) ?
		key :
		JSON.stringify(key);
	}

	/**
	 * @param {string} string
	 * @return {string}
	 */
	function escapeHTML(string) {
		return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	/**
	 * @param {Object} obj
	 * @return {string}
	 */
	function inspect(obj) {

		return _inspect('', obj);

		/**
		 * @param {string} accumulator
		 * @param {object} obj
		 * @see http://jsperf.com/continuation-passing-style/3
		 * @return {string}
		 */
		function _inspect(accumulator, obj) {
			switch (typeof obj) {
				case 'object':
					if (!obj) {
						accumulator += 'null';
						break;
					}
					var keys = Object.keys(obj);
					var length = keys.length;
					if (length === 0) {
						accumulator += '<span>{}</span>';
					} else {
						accumulator += '<span>{</span>\n<div class="diff-level">';
						for (var i = 0; i < length; i++) {
							var key = keys[i];
							accumulator = _inspect(accumulator + stringifyObjectKey(escapeHTML(key)) + '<span>: </span>', obj[key]);
							if (i < length - 1) {
								accumulator += '<span>,</span>\n';
							}
						}
						accumulator += '\n</div><span>}</span>'
					}
					break;

				case 'string':
					accumulator += JSON.stringify(escapeHTML(obj));
					break;

				case 'undefined':
					accumulator += 'undefined';
					break;

				default:
					accumulator += escapeHTML(String(obj));
					break;
			}
			return accumulator;
		}
	}
})();
