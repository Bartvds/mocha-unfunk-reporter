///<reference path="diff.ts" />

module unfunk {

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

				var diff = changes.value

				//this.addIndent(1);
				var indent = this.getIndent();

				if (changes.changed == 'equal') {
					for (var prop in diff) {
						var res = diff[prop];
						properties.push(indent + this.getNameEqual(prop) + this.inspect('', res, 'equal'));
					}
				}
				else {
					for (var prop in diff) {
						var res = diff[prop];
						var changed = res.changed;
						switch (changed) {
							case 'object change':
								properties.push(indent + this.getNameChanged(prop) + '\n' + this.addIndent(1) + this.getWrappingDiff(res));
								break;
							case 'primitive change':
								if (typeof res.added === 'string' && typeof res.removed === 'string') {
									if (this.diff.inDiffLengthLimit(res.removed) && this.diff.inDiffLengthLimit(res.added)) {
										var plain = this.getNameEmpty(prop);
										var preLen = plain.length;
										var prepend = [
											indent + this.getNameRemoved(prop),
											indent + plain, //'| ' + repeatStr(' ', preLen - 2),
											indent + this.getNameAdded(prop)
										];
										properties.push(this.diff.getStringDiff(res.removed, res.added, indent.length + preLen, prepend));
									}
									else {
										properties.push(this.diff.printDiffLengthLimit(res.removed, res.added, indent));
									}
								}
								else {
									properties.push(
										indent + this.getNameRemoved(prop) + this.inspect('', res.added, 'removed') + '\n' +
											indent + this.getNameAdded(prop) + this.inspect('', res.removed, 'added') + ''
									);
								}
								break;
							case 'removed':
								properties.push(indent + this.getNameRemoved(prop) + this.inspect('', res.value, 'removed'));
								break;
							case 'added':
								properties.push(indent + this.getNameAdded(prop) + this.inspect('', res.value, 'added'));
								break;
							case 'equal':
							default:
								properties.push(indent + this.getNameEqual(prop) + this.inspect('', res.value, 'equal'));
								break;
						}
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

			private encodeName(prop:string):string {
				if (!diff.identAnyExp.test(prop)) {
					return '"' + unfunk.escape(prop) + '"';
				}
				return prop;
			}
			private encodeString(prop:string):string {
				return '"' + unfunk.escape(prop) + '"';
			}

			private getNameAdded(prop:string):string {
				return this.diff.style.success(this.diff.markAdded + this.encodeName(prop)) + ': ';
			}

			private getNameRemoved(prop:string):string {
				return this.diff.style.error(this.diff.markRemov + this.encodeName(prop)) + ': ';
			}

			private getNameChanged(prop:string):string {
				return this.diff.style.warning(this.diff.markChang + this.encodeName(prop)) + ': ';
			}

			private getNameEmpty(prop:string):string {
				return this.diff.markColum + repeatStr(' ', this.encodeName(prop).length) + ': ';
			}

			private getNameEqual(prop:string):string {
				return this.diff.markEqual + this.encodeName(prop) + ': ';
			}

			private getName(prop, change) {
				switch (change) {
					case 'added':
						return this.getNameAdded(prop);
					case 'removed':
						return this.getNameRemoved(prop);
					case 'object change':
						return this.getNameChanged(prop);
					case 'empty':
						return this.getNameEmpty(prop);
					case 'plain':
					default:
						return this.diff.markEqual + this.encodeName(prop) + ': ';
				}
			}

			private inspect(accumulator, obj, change) {
				switch (typeof obj) {
					case 'object':
						if (!obj) {
							accumulator += 'null';
							break;
						}
						var length;
						if (Array.isArray(obj)) {
							length = obj.length;
							if (length === 0) {
								accumulator += '[]';
							} else {
								accumulator += '\n';
								for (var i = 0; i < length; i++) {
									this.addIndent(1)
									accumulator = this.inspect(accumulator + this.getIndent() + this.getName(String(i), change), obj[i], change);
									if (i < length - 1) {
										accumulator += '\n';
									}
									this.addIndent(-1)
								}
							}
						}
						else {
							var props = Object.keys(obj).sort();
							length = props.length;
							if (length === 0) {
								accumulator += '{}';
							} else {
								accumulator += '\n';
								for (var i = 0; i < length; i++) {
									var prop = props[i];
									this.addIndent(1)
									accumulator = this.inspect(accumulator + this.getIndent() + this.getName(prop, change), obj[prop], change);
									if (i < length - 1) {
										accumulator += '\n';
									}
									this.addIndent(-1)
								}
							}
						}
						break;
					case 'function':
						accumulator += 'function()';
						break;
					case 'undefined':
						accumulator += 'undefined';
						break;
					case 'string':
						accumulator += this.encodeName(obj);
						break;
					case 'number':
						accumulator += String(obj);
						break;
					default:
						accumulator += this.encodeString(String(obj));
						break;
				}
				return accumulator;
			}
		}
	}
}