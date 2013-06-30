///<reference path="unfunk.ts" />

module unfunk {

	export module diff {
		/*
		 uses objectDiff by 'NV'
		 https://github.com/NV/objectDiff.js

		 MIT license

		 diff output algorithm based on objectDiff HTML printer

		 */

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

			indentert:string = '   ';
			markAdded:string = '+  ';
			markRemov:string = '-  ';
			markChang:string = '?  ';
			markEqual:string = '.  ';
			markSpace:string = '';

			constructor(public style:Styler) {

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

			public styleObjectDiff(actual:any, expected:any, prepend?:string = ''):string {
				if (typeof actual === 'undefined' || typeof expected === 'undefined') {
					return '';
				}
				this.prepend = prepend;
				this.indents = 0;

				var ret:string = '';
				var diff;
				if (typeof actual === 'object' && typeof expected === 'object') {
					diff = objectDiff.diff(actual, expected);
					ret = this.objectDiffToLogString(diff);
				}
				else if (typeof actual === 'string' && typeof expected === 'string') {
					diff = jsDiff.diffChars(actual, expected);
					ret = this.stringDiffToLogString(diff, prepend);
				}
				return ret;
			}

			private addIndent(amount:number):string {
				this.indents += amount;
				return '';
			}

			private stringDiffToLogString(diff, prefix?:string = '', join?:any = '\n'):any {

				var top = '';
				var middle = '';
				var bottom = '';

				for (var i = 0, ii = diff.length; i < ii; i++) {
					var change = diff[i];
					var value = JSON.stringify(change.value).replace(/(^")|("$)/g, '');
					var len = value.length;

					if (!change.added && !change.removed) {
						top += value;
						middle += this.style.warning(repeatStr('|', len));
						bottom += value;
					}
					else if (change.removed) {
						top += repeatStr(' ', len);
						middle += this.style.success(repeatStr('+', len));
						bottom += value;
					}
					else if (change.added) {
						top += value;
						middle += this.style.error(repeatStr('-', len));
						bottom += repeatStr(' ', len);
					}
				}
				/*top += '';
				middle += '';
				bottom += '';*/
				var ret:any = [prefix + top, prefix + middle, prefix + bottom];
				if (join !== false) {
					return ret.join(join);
				}
				return ret;
			}

			private objectDiffToLogString(changes) {
				var properties = [];

				//this.addIndent(1);

				var diff = changes.value;
				if (changes.changed == 'equal') {
					return this.inspect(changes, changes.changed);
				}
				for (var key in diff) {
					var changed = diff[key].changed;
					switch (changed) {
						case 'equal':
						case 'removed':
						case 'added':
							properties.push(this.getIndent() + this.getName(key, changed) + this.inspect(diff[key].value, changed));
							break;
						case 'primitive change':
							if (typeof diff[key].added === 'string' && typeof diff[key].removed === 'string') {

								var lines = this.stringDiffToLogString(jsDiff.diffChars(diff[key].removed, diff[key].added), '', false);
								var str = this.getName(key, 'plain');
								properties.push(
									this.getIndent() +  this.getName(key, 'removed') + lines[0] + '\n' +
									this.getIndent() +  '| ' + repeatStr(' ', str.length - 2) + lines[1] + '\n' +
									this.getIndent() +  this.getName(key, 'added') + lines[2]
								);
							}
							else {
								properties.push(
									this.getIndent() + this.getName(key, 'added') + this.inspect(diff[key].removed, 'added') + '\n' +
									this.getIndent() + this.getName(key, 'removed') + this.inspect(diff[key].added, 'removed') + ''
								);
							}
							break;

						case 'object change':
							properties.push(this.getIndent() + this.getName(key, changed) + '\n' + this.addIndent(1) + this.objectDiffToLogString(diff[key]));
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
					return this.markChang + this.stringifyObjectKey(key) + ': ';
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