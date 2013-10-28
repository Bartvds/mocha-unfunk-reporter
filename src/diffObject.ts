///<reference path="diff.ts" />

module unfunk {

	//var objectDiff = require('../lib/objectDiff');
	var jsesc = require('jsesc');

	function repeatStr(str:string, amount:number) {
		var ret = '';
		for (var i = 0; i < amount; i++) {
			ret += str;
		}
		return ret;
	}

	export module diff {

		export class ObjectDiffer {

			prefix:string = '';
			indents:number = 0;

			constructor(public diff:DiffFormatter) {

			}

			private addIndent(amount:number):string {
				this.indents += amount;
				return '';
			}

			public getWrapping(actual:any, expected:any, prefix:string = ''):string {
				this.indents = 0;
				this.prefix = prefix;
				var changes = objectDiff.diff(actual, expected);
				return this.getWrappingDiff(changes);
			}

			public getWrappingDiff(changes):string {
				var properties:string[] = [];

				//this.addIndent(1);
				var diff = changes.value;
				if (changes.changed == 'equal') {
					return this.inspect('', changes, changes.changed);
				}
				var indent = this.getIndent();

				for (var key in diff) {
					var changed = diff[key].changed;
					switch (changed) {
						case 'object change':
							properties.push(indent + this.getNameChanged(key) + '\n' + this.addIndent(1) + this.getWrappingDiff(diff[key]));
							break;
						case 'primitive change':
							if (typeof diff[key].added === 'string' && typeof diff[key].removed === 'string') {
								var plain = this.getNameEmpty(key);
								var preLen = plain.length;
								var prepend = [
									indent + this.getNameRemoved(key),
									indent + plain, //'| ' + repeatStr(' ', preLen - 2),
									indent + this.getNameAdded(key)
								];
								properties.push(this.diff.getStringDiff(diff[key].removed, diff[key].added, indent.length + preLen, prepend));
							}
							else {
								properties.push(
									indent + this.getNameRemoved(key) + this.inspect('', diff[key].added, 'removed') + '\n' +
										indent + this.getNameAdded(key) + this.inspect('', diff[key].removed, 'added') + ''
								);
							}
							break;
						case 'equal':
							properties.push(indent + jsesc(key) + ': ' + this.inspect('', diff[key].value, changed));
						case 'removed':
							properties.push(indent + this.getNameRemoved(key) + this.inspect('', diff[key].value, changed));
							break;
						case 'added':
							properties.push(indent + this.getNameAdded(key) + this.inspect('', diff[key].value, changed));
							break;
					}
				}
				return properties.join('\n') + this.addIndent(-1) + this.getIndent() + this.diff.markSpace;
			}

			private getIndent(id:string = '') {
				var ret = [];
				for (var i = 0; i < this.indents; i++) {
					ret.push(this.diff.indentert)
				}
				return id + this.prefix + ret.join('');
			}

			private getNameAdded(key) {
				return this.diff.style.success(this.diff.markAdded + jsesc(key) + ': ');
			}

			private getNameRemoved(key) {
				return this.diff.style.error(this.diff.markRemov + jsesc(key) + ': ');
			}

			private getNameChanged(key) {
				return this.diff.style.warning(this.diff.markChang + jsesc(key) + ': ');
			}

			private getNameEmpty(key) {
				return this.diff.markColum + repeatStr(' ', jsesc(key).length) + ': ';
			}

			private getName(key, change) {
				var name:string = jsesc(key);
				switch (change) {
					case 'added':
						return this.getNameRemoved(name);
					case 'removed':
						return this.getNameRemoved(name);
					case 'object change':
						return this.getNameChanged(name);
					case 'empty':
						return this.getNameEmpty(name);
					case 'plain':
					default:
						return this.diff.markEqual + name + ': ';
				}
			}

			private stringifyObjectKey(key) {
				return jsesc(key);
			}

			private inspect(accumulator, obj, change) {
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
								accumulator = this.inspect(accumulator + this.getIndent() + this.getName(key, change), obj[key], change);
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