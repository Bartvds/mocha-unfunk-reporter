module unfunk {

	export module error {

		//var getLine = /^[\S\s]*$/gm;
		var splitLine = /[\r\n]+/g;

		export var moduleFilters = ['mocha', 'chai', 'proclaim', 'assert', 'expect', 'should', 'chai-as-promised', 'q', 'mocha-as-promised'];
		export var nodeFilters = ['node.js'];
		export var webFilters = ['mocha.js', 'chai.js', 'assert.js', 'proclaim.js'];

		var assertType = /^AssertionError/;
		var anyLinExp = /^ *(.*) *$/gm;
		var stackLineExp = /^    at (.+)$/;
		var anyLinExp = /^ *(.*) *$/gm;

		export class StackElement {
			text:string;
			lineRef:boolean;

			constructor(text:string, lineRef:boolean) {
				this.text = text;
				this.lineRef = lineRef;
			}
		}

		export class ParsedError {

			public error:any;

			public name:string = '';
			public message:string = '<no message>';
			public stack:StackElement[] = [];

			public isAssertion:boolean = false;

			constructor(error:any) {
				this.error = error;
			}

			getStandard(prepend:string = '', indent:string = ''):string {
				var ret = this.getHeader(prepend);
				ret += '\n' + this.getHeadlessStack(prepend, indent);
				return ret;
			}

			getHeader(prepend:string = ''):string {
				if (this.isAssertion) {
					return prepend + this.message;
				}
				return prepend + (this.name ? this.name + ': ' : '') + this.message;
			}

			getHeaderSingle(prepend:string = ''):string {
				if (this.isAssertion) {
					return prepend + (this.message.match(/^.*$/m)[0]);
				}
				return prepend + (this.name ? this.name + ': ' : '') + (this.message.match(/^.*$/m)[0]);
			}

			getHeadlessStack(prepend:string = '', indent:string = ''):string {
				return this.stack.reduce((lines, element:StackElement) => {
					if (element.lineRef) {
						lines.push(prepend + indent + 'at ' + element.text);
					}
					else {
						lines.push(prepend + element.text);
					}
					return lines;
				}, []).join('\n');
			}

			hasStack():boolean {
				return this.stack.length > 0;
			}

			toString():string {
				if (this.isAssertion) {
					return this.message;
				}
				return (this.name ? this.name + ': ' : '<no name>') + this.message;
			}
		}


		export class StackFilter {

			public filters:RegExp[] = [];

			constructor(public style:MiniStyle.Style) {

			}

			parse(error:any, stackFilter:boolean):ParsedError {
				var parsed = new ParsedError(error);
				if (!error) {
					parsed.name = '<undefined error>';
					return parsed;
				}
				parsed.name = error.name;
				parsed.isAssertion = assertType.test(parsed.name);
				if (error.message) {
					parsed.message = error.message;
				}
				else if (error.operator) {
					parsed.message = unfunk.toDebug(error.actual, 50) + ' ' + this.style.accent(error.operator) + ' ' + unfunk.toDebug(error.expected, 50) + '';
				}

				if (error.stack) {
					var stack = error.stack; //more?
					var seenAt = false;
					var lineMatch;
					var stackLineMatch;

					anyLinExp.lastIndex = 0;

					while ((lineMatch = anyLinExp.exec(stack))) {
						anyLinExp.lastIndex = lineMatch.index + (lineMatch[0].length || 1);
						if (!lineMatch[1]) {
							continue;
						}
						stackLineExp.lastIndex = 0;
						stackLineMatch = stackLineExp.exec(lineMatch[0]);
						if (stackLineMatch) {
							parsed.stack.push(new StackElement(stackLineMatch[1], true));
							seenAt = true;
							continue;
						}
						else if (seenAt) {
							parsed.stack.push(new StackElement(lineMatch[1], false));
						}
					}
					if (stackFilter) {
						parsed.stack = this.filter(parsed.stack);
					}
				}
				else {
					parsed.stack.push(new StackElement('<no error.stack>', false));
				}
				return parsed;
			}

			addModuleFilters(filters:string[]) {
				filters.forEach((filter:string) => {
					filter = '/node_modules/' + filter + '/';
					var exp = new RegExp(filter.replace(/\\|\//g, '(\\\\|\\/)'));
					this.filters.push(exp);
				}, this);
			}

			addFilters(filters:string[]) {
				filters.forEach((filter:string) => {
					var exp = new RegExp(filter.replace(/\\|\//g, '(\\\\|\\/)'));
					this.filters.push(exp);
				}, this);
			}

			filter(lines:StackElement[]):StackElement[] {
				if (lines.length === 0) {
					return [new StackElement('<no lines in stack>', false)];
				}
				if (this.filters.length === 0) {
					return lines;
				}
				var cut = -1;
				var i, line;

				//bottom to top
				for (i = lines.length - 1; i >= 0; i--) {
					line = lines[i];
					if (this.filters.some((filter:RegExp) => {
						return filter.test(line.text);
					})) {
						cut = i;
					}
					else if (cut > -1) {
						break;
					}
				}
				if (cut > 0) {
					lines = lines.splice(0, cut);
				}
				if (lines.length === 0) {
					return [new StackElement('<no unfiltered calls in stack>', false)];
				}
				return lines;
			}
		}
	}
}
