///<reference path="unfunk.ts" />

module unfunk {

	export module diff {
		/*
		 depends on jsDiff by 'Nikita Vasilyev'
		 https://github.com/NV/objectDiff.js
		 MIT license

		 depends on objectDiff by 'Kevin Decker'
		 https://github.com/kpdecker/jsdiff
		 BSD license

		 diff output algorithm based on objectDiff HTML printer
		 */
		var objectNameExp = /(^\[object )|(\]$)/gi;

		var repeatStr = function (str, amount) {
			var ret = '';
			for (var i = 0; i < amount; i++) {
				ret += str;
			}
			return ret;
		};

		export class DiffFormatter {

			prepend = '';
			indents:number = 0;

			indentert:string = '  ';
			markAdded:string = '+ ';
			markRemov:string = '- ';
			markChang:string = '? ';
			markEqual:string = '. ';
			markEmpty:string = '  ';
			markColum:string = '| ';
			markSpace:string = '';

			constructor(public style:Styler, public maxWidth:number = 80) {

			}

			public forcedDiff(actual:any, expected:any):bool {
				if (typeof actual === 'string' && typeof expected === 'string') {
					return true;
				}
				else if (typeof actual === 'object' && typeof expected === 'object') {
					return true;
				}
				return false;
			}

			public isOverlyLengthyObject(obj:any):bool {
				var type = this.getObjectType(obj);
				switch (type) {
					case 'array':
					case 'arguments':
					case 'buffer':
						return (obj.length > 100);
					case 'string':
						return (obj.length > 250);
					default:
						return false;
				}
			}

			public getObjectType(obj:any):string {
				return Object.prototype.toString.call(obj).replace(objectNameExp, '').toLowerCase();
			}

			public styleObjectDiff(actual:any, expected:any, prepend?:string = ''):string {
				if (typeof actual === 'undefined' || typeof expected === 'undefined') {
					return '';
				}
				this.prepend = prepend;
				this.indents = 0;
				var ret:string = '';
				var diff;

				var len = [];
				if (this.isOverlyLengthyObject(actual)) {
					len.push(prepend + '<actual too lengthy for diff: ' + actual.length + '>');
				}
				if (this.isOverlyLengthyObject(expected)) {
					len.push(prepend + '<expected too lengthy for diff: ' + expected.length + '>');
				}
				if(len.length > 0) {
					return len.join('\n');
				}

				//TODO rewrite to improve diffs for buffers etc

				if (typeof actual === 'object' && typeof expected === 'object') {
					diff = objectDiff.diff(actual, expected);
					ret = this.objectDiffToLogString(diff);
				}
				else if (typeof actual === 'string' && typeof expected === 'string') {
					diff = jsDiff.diffChars(actual, expected);
					ret = this.stringDiffToLogWrapping(diff, this.maxWidth, prepend.length, [prepend, prepend, prepend], true);
				}
				return ret;
			}

			private addIndent(amount:number):string {
				this.indents += amount;
				return '';
			}

			public stringDiffToLogWrapping(diff, maxWidth:number, padLength:number, padFirst:string[], leadSymbols:bool = false):string {

				var dataLength = maxWidth - padLength;
				var rowPad = repeatStr(' ', padLength);

				if (padLength >= maxWidth) {
					return '<no space for padded diff>';
				}

				var top = '';
				var middle = '';
				var bottom = '';

				var counter = 0;
				var blocks = [];
				var value;
				var blockCount = 0;

				if (leadSymbols) {
					padFirst[0] += this.style.error(this.markRemov);
					padFirst[1] += this.style.main(this.markEmpty);
					padFirst[2] += this.style.success(this.markAdded);
				}

				for (var i = 0, ii = diff.length; i < ii; i++) {
					var change = diff[i];
					var word = JSON.stringify(change.value).replace(/(^")|("$)/g, '');
					var len = word.length;
					//per char
					for (var j = 0; j < len; j++) {
						value = word[j];
						counter += 1;
						if (counter > dataLength) {
							counter = 0;
							if (blockCount > 0) {
								blocks.push([rowPad + top, rowPad + middle, rowPad + bottom].join('\n'));
							} else {
								blocks.push([padFirst[0] + top, padFirst[1] + middle, padFirst[2] + bottom].join('\n'));
							}
							blockCount += 1;
							top = '';
							middle = '';
							bottom = '';
						}

						if (!change.added && !change.removed) {
							top += value;
							middle += this.style.warning('|');
							bottom += value;
						}
						else if (change.removed) {
							top += ' ';
							middle += this.style.success('+');
							bottom += value;
						}
						else if (change.added) {
							top += value;
							middle += this.style.error('-');
							bottom += ' ';
						}
					}
				}
				if (blockCount > 0) {
					blocks.push([rowPad + top, rowPad + middle, rowPad + bottom].join('\n'));
				} else {
					blocks.push([padFirst[0] + top, padFirst[1] + middle, padFirst[2] + bottom].join('\n'));
				}
				blockCount += 1;

				return blocks.join('\n\n');
			}

			private objectDiffToLogString(changes) {
				var properties = [];

				//this.addIndent(1);

				var diff = changes.value;
				if (changes.changed == 'equal') {
					return this.inspect(changes, changes.changed);
				}
				var indent = this.getIndent();

				for (var key in diff) {
					var changed = diff[key].changed;
					switch (changed) {
						case 'equal':
						case 'removed':
						case 'added':
							properties.push(indent + this.getName(key, changed) + this.inspect(diff[key].value, changed));
							break;
						case 'object change':
							properties.push(indent + this.getName(key, changed) + '\n' + this.addIndent(1) + this.objectDiffToLogString(diff[key]));
							break;
						case 'primitive change':
							if (typeof diff[key].added === 'string' && typeof diff[key].removed === 'string') {
								var plain = this.getName(key, 'empty');
								var preLen = plain.length;
								var prepend = [
									indent + this.getName(key, 'removed'),
									indent + plain, //'| ' + repeatStr(' ', preLen - 2),
									indent + this.getName(key, 'added')
								];
								properties.push(this.stringDiffToLogWrapping(jsDiff.diffChars(diff[key].removed, diff[key].added), this.maxWidth, indent.length + preLen, prepend));
							}
							else {
								properties.push(
									indent + this.getName(key, 'removed') + this.inspect(diff[key].added, 'removed') + '\n' +
										indent + this.getName(key, 'added') + this.inspect(diff[key].removed, 'added') + ''
								);
							}
							break;
					}
				}
				return properties.join('\n') + this.addIndent(-1) + this.getIndent() + this.markSpace;
			}

			private getIndent(id:string = '') {
				var ret = [];
				for (var i = 0; i < this.indents; i++) {
					ret.push(this.indentert)
				}
				return id + this.prepend + ret.join('');
			}

			private getName(key, change) {
				if (change == 'added') {
					return this.style.success(this.markAdded + this.stringifyObjectKey(key) + ': ');
				}
				else if (change == 'removed') {
					return this.style.error(this.markRemov + this.stringifyObjectKey(key) + ': ');
				}
				else if (change == 'object change') {
					return this.style.warning(this.markChang + this.stringifyObjectKey(key) + ': ');
				}
				else if (change == 'plain') {
					return this.markEqual + this.stringifyObjectKey(key) + ': ';
				}
				else if (change == 'empty') {
					return this.markColum + repeatStr(' ', this.stringifyObjectKey(key).length) + ': ';
				}
				return this.style.main(this.markEqual + this.stringifyObjectKey(key) + ': ');
			}

			private stringifyObjectKey(key) {
				return /^[a-z0-9_$]*$/i.test(key) ? key : JSON.stringify(key);
			}

			private inspect(obj, change) {
				return this._inspect('', obj, change);
			}

			private _inspect(accumulator, obj, change) {
				switch (typeof obj) {
					case 'object':
						if (!obj) {
							accumulator += 'null';
							break;
						}
						var keys = Object.keys(obj);
						var length = keys.length;
						if (length === 0) {
							accumulator += '{}';
						} else {
							accumulator += '\n';
							for (var i = 0; i < length; i++) {
								var key = keys[i];
								this.addIndent(1)
								accumulator = this._inspect(accumulator + this.getIndent() + this.getName(key, change), obj[key], change);
								if (i < length - 1) {
									accumulator += '\n';
								}
								this.addIndent(-1)
							}
						}
						break;
					case 'function':
						if (!obj) {
							accumulator += 'null';
							break;
						}
						accumulator += 'function()';
						break;
					case 'string':
						accumulator += JSON.stringify(obj);
						break;

					case 'undefined':
						accumulator += 'undefined';
						break;

					default:
						accumulator += String(obj);
						break;
				}
				return accumulator;
			}
		}
	}
}
