

module unfunk {

	export module stack {

		//var getLine = /^[\S\s]*$/gm;
		var splitLine = /[\r\n]+/g;

		export var moduleFilters = ['mocha','chai', 'proclaim', 'assert', 'expect', 'should'];
		export var nodeFilters = [];
		export var webFilters = ['mocha.js', 'chai.js', 'assert.js', 'proclaim.js'];

		export class StackFilter {

			public filters:RegExp[] = [];

			constructor (public style:Styler) {

			}

			addModuleFilters(filters:string[]){
				filters.forEach((filter:string) => {
					filter = '/node_modules/' + filter + '/';
					var exp = new RegExp(filter.replace(/\\|\//g, '(\\\\|\\/)'));
					this.filters.push(exp);
				}, this);
			}

			addFilters(filters:string[]){
				filters.forEach((filter:string) => {
					var exp = new RegExp(filter.replace(/\\|\//g, '(\\\\|\\/)'));
					this.filters.push(exp);
				}, this);
			}

			filter(stack:string):string {
				if (!stack) {
					return '';
				}
				var lines = stack.split(splitLine);
				var cut = -1;
				var i, line;
				for (i = lines.length - 1; i >= 0; i--) {
					line = lines[i];
					if (this.filters.some((filter:RegExp) => {
						return filter.test(line);
					})){
						cut = i;
					}
					else {
						if (cut > -1) {
							break;
						}
					}
				}
				if (cut > -1) {
					lines = lines.slice(0, cut);
				}
				return lines.join('\n');
			};
		}
	}
}