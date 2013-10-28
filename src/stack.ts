module unfunk {

	export module stack {

		//var getLine = /^[\S\s]*$/gm;
		var splitLine = /[\r\n]+/g;

		export var moduleFilters = ['mocha', 'chai', 'proclaim', 'assert', 'expect', 'should', 'chai-as-promised', 'mocha-as-promised'];
		export var nodeFilters = [];
		export var webFilters = ['mocha.js', 'chai.js', 'assert.js', 'proclaim.js'];

		var trim = /(^[ \t]*)|([ \t]*$)/;

		export class StackFilter {

			public filters:RegExp[] = [];

			constructor(public style:Styler) {

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

			filter(stack:string):string {
				if (!stack || /^\s+$/.test(stack)) {
					return '<no stack>';
				}
				if (this.filters.length === 0) {
					return stack;
				}
				var allLines = stack.split(splitLine);
				var lines = allLines.slice(0);
				var cut = -1;
				var i, line;

				//bottom to top
				for (i = lines.length - 1; i >= 0; i--) {
					line = lines[i].replace(trim, '');
					if (line.length == 0) {
						cut = i;
					}
					else if (this.filters.some((filter:RegExp) => {
						return filter.test(line);
					})) {
						cut = i;
					}
					else {
						if (cut > -1) {
							break;
						}
					}
				}
				if (cut > 0) {
					lines = lines.splice(0, cut);
				}
				if (allLines.length === 0) {
					return '<no lines in stack>';
				}
				if (lines.length === 0) {
					return '<no unfiltered calls in stack>';
				}
				return lines.join('\n');
			}
		}
	}
}
