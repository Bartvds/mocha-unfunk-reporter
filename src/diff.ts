///<reference path="unfunk.ts" />

module unfunk {

	export module diff {


		export class DiffChange {
			static PRIMITIVE:string = 'primitive change';;
			static OBJECT:string = 'object change';;
			static ADDED:string = 'added';
			static REMOVED:string = 'removed';
			static EQUAL:string = 'equal';
		}

		export interface DiffRes {
			changed:string;
			removed:any;
			added:any;
			value:any;
		}


		/*
			uses objectDiff by 'NV'
			https://github.com/NV/objectDiff.js

			MIT license

			diff output algorithm based on objectDiff HTML printer

		*/
		export class DiffStylerFormat implements DiffFormat {

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

			styleObjectDiff(actual:any, expected:any, prepend?:string = ''):string {
				this.prepend = prepend;
				this.indents = 0;

				var ret:string = '';
				var objDiff;
				if (typeof actual === 'object' && typeof expected === 'object') {
					objDiff = objectDiff.diff(actual, expected);
					ret = this.convertToLogString(objDiff);
				}
				return ret;
			}

			private addIndent(amount:number):string {
				this.indents += amount;
				return '';
			}

			private getIndent(id:string = '') {
				var ret = [];
				for (var i = 0; i < this.indents; i++) {
					ret.push(this.indentert)
				}
				return id + this.prepend + ret.join('');
			}

			//
			private convertToLogString(changes) {
				var properties = [];

				this.addIndent(1);

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
							properties.push(
								this.getIndent() +  this.getName(key, 'added') + this.inspect(diff[key].removed, 'added') + '\n' +
								this.getIndent() +  this.getName(key, 'removed') + this.inspect(diff[key].added, 'removed') + ''
							);
							break;

						case 'object change':
							properties.push(this.getIndent() +  this.getName(key, changed) + '\n' + this.convertToLogString(diff[key]));
							break;
					}
				}
				return properties.join('\n')  + this.addIndent(-1) + this.getIndent() + this.markSpace;
			}

			stringifyObjectKey(key) {
				return /^[a-z0-9_$]*$/i.test(key) ? key : JSON.stringify(key);
			}

			escapeString(string) {
				return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			}

			private inspect(obj, change) {

				return this._inspect('', obj, change);
			}


			private getName(key, change) {
				if (change == 'added'){
					return this.style.success(this.markAdded + this.stringifyObjectKey(this.escapeString(key)) + ': ');
				}
				else if (change == 'removed'){
					return this.style.error(this.markRemov + this.stringifyObjectKey(this.escapeString(key)) + ': ');
				}
				else if (change == 'object change'){
					return this.style.warning(this.markChang + this.stringifyObjectKey(this.escapeString(key)) + ': ');
				}
				return this.style.suite(this.markEqual + this.stringifyObjectKey(this.escapeString(key)) + ': ');
			}
			/**
			 * @param {string} accumulator
			 * @param {object} obj
			 * @see http://jsperf.com/continuation-passing-style/3
			 * @return {string}
			 */
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
						accumulator += JSON.stringify(this.escapeString(obj));
						break;

					case 'undefined':
						accumulator += 'undefined';
						break;

					default:
						accumulator += this.escapeString(String(obj));
						break;
				}
				return accumulator;
			}
		}
	}
}