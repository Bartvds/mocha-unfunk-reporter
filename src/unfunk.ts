///<reference path="_ref.ts" />
///<reference path="writer.ts" />
///<reference path="styler.ts" />
///<reference path="diff.ts" />
///<reference path="stack.ts" />
///<reference path="stream.ts" />

//declare mocha reporter data typings
interface TestError {
	message:string;
	type:string;
	arguments:any[];
	stack:any;
	actual:any;
	expected:any;
	operator:string;
	showDiff:boolean;
}
interface TestSuite {
	title:string;
	parent:TestSuite;
	root:boolean;
	tests:Test[];
	suites:TestSuite[];
	pending:boolean;
	ctx:any;
}
interface Test {
	title:string;
	parent:TestSuite;
	speed:string;
	duration:number;
	async:number;
	timedOut:boolean;
	pending:boolean;
	ctx:any;
	err:TestError;
	slow():number;
	fullTitle():string;
}

module unfunk {

	export interface TextWriter {
		start();
		write(...args:any[]);
		writeln(...args:any[]);
		finish();
	}

	export class Stats {
		suites = 0;
		tests = 0;
		passes = 0;
		pending = 0;
		failures = 0;
		duration = 0;
		start = 0;
		end = 0;
	}

	//global options
	var expose:any;
	var options:any = {
		writer: 'log',
		style: 'ansi',
		stream: null,
		stackFilter: true,
		reportPending: false,
		width: 0
	};

	var tty = require('tty');
	var isatty = (tty.isatty('1') && tty.isatty('2'));

	function getViewWidth() {
		if (options.width > 0) {
			return options.width;
		}
		if (isatty) {
			return Math.min(options.width, process.stdout['getWindowSize'] ?  process.stdout['getWindowSize'](1)[0]: tty.getWindowSize()[1]);
		}
		return 80;
	}

	function option(nameOrHash:any, value?:any):any {
		if (arguments.length === 1) {
			if (typeof nameOrHash === 'object') {
				for (var name in nameOrHash) {
					if (nameOrHash.hasOwnProperty(name)) {
						options[name] = nameOrHash[name];
					}
				}
			}
		}
		else if (arguments.length === 2) {
			if (typeof value !== 'undefined' && typeof nameOrHash === 'string') {

				//allow case-in-sensitive options (from Bash etc)
				var propLower = nameOrHash.toLowerCase();
				for (var name in options) {
					if (options.hasOwnProperty(name)) {
						var nameLower = name.toLowerCase();
						if (nameLower === propLower) {
							//store using real name
							options[name] = value;
						}
					}
				}
			}
		}
		return expose;
	}

	function importEnv():any {
		//import from env

		var pattern = /^mocha[_-]unfunk[_-]([\w]+(?:[\w_-][\w]+)*)$/i;
		var obj;
		if (typeof process !== 'undefined' && process.env) {
			obj = process.env;
		}
		if (obj) {
			for (var name in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, name)) {
					pattern.lastIndex = 0;
					var match = pattern.exec(name);
					if (match && match.length > 1) {
						var prop = match[1].toLowerCase();
						option(prop, obj[name]);
					}
				}
			}
		}
	}

	function stringTrueish(str:string):boolean {
		str = ('' + str).toLowerCase();
		return str != '' && str != 'false' && str != '0' && str != 'null' && str != 'undefined';
	}

	function toDebug(value, cutoff:number = 20) {

		var t = typeof value;
		if (t === 'function') {
			t = '' + t;
		}
		if (t === 'object') {
			var str = '';
			var match = Object.prototype.toString.call(value).match(/^\[object ([\S]*)]$/);
			if (match && match.length > 1 && match[1] !== 'Object') {
				str = match[1];
			}
			value = str + JSON.stringify(value);
			if (value.length > cutoff) {
				value = value.substr(0, cutoff) + '...';
			}
			return value;
		}
		if (t === 'string') {
			if (value.length > cutoff) {
				return JSON.stringify(value.substr(0, cutoff)) + '...';
			}
			return JSON.stringify(value);
		}
		return '' + value;
	}

	var extract = /^[A-Z][\w_]*:[ \t]*([\s\S]+?)([\r\n]+[ \t]*at[\s\S]*)$/;
	var errorType = /^([A-Z][\w_]*)/;
	var assertType = /^AssertionError/;

	function headlessStack(error:TestError):string {
		if (!error) {
			return '';
		}
		if (error.stack) {
			var match = error.stack.match(extract);
			if (match && match.length > 2) {
				return match[2].replace(/(^\s+)|(\s+$)/g, '');
			}
		}
		return '';
	}

	function getErrorPrefix(error:TestError):string {
		if (!error) {
			return '';
		}
		var str = error.stack || ('' + error);
		var match = str.match(errorType);
		if (match && match.length > 0) {
			//show error type only if not an AssertionError
			if (!assertType.test(match[1])) {
				return match[1] + ': ';
			}
		}
		return '';
	}

	function getErrorMessage(error:TestError):string {
		var msg = '';
		if (!error) {
			return '<undefined error>';
		}
		if (error.message) {
			msg = String(error.message);
		}
		else if (error.operator) {
			msg += toDebug(error.actual, 50) + ' ' + error.operator + ' ' + toDebug(error.expected, 50) + '';
		}

		if (!msg) {
			msg = ('' + error);
			if (msg === '[object Object]') {
				msg = String(error.message || '');
				if (!msg) {
					if (error.stack) {
						var match = error.stack.match(extract);
						if (match && match.length > 1) {
							msg = match[1];
						}
					}
				}
			}
			msg = cleanErrorMessage(msg);
		}
		if (msg) {
			return getErrorPrefix(error) + msg.replace(/(\s+$)/g, '');
		}
		return getErrorPrefix(error) + '<no error message>';
	}

	function cleanErrorMessage(msg):string {
		return msg.replace(/^([A-Z][\w_]*:[ \t]*)/, '');
	}

	export function padLeft(str, len, char):string {
		str = String(str);
		char = String(char).charAt(0);
		while (str.length < len) {
			str = char + str;
		}
		return str;
	}

	export function padRight(str, len, char):string {
		str = String(str);
		char = String(char).charAt(0);
		while (str.length < len) {
			str += char;
		}
		return str;
	}

	function getStyler():Styler {
		switch (options.style) {
			case 'no':
			case 'none':
				return new styler.NoStyler();
			case 'plain':
				return new styler.PlainStyler();
			case 'dev':
				return new styler.DevStyler();
			case 'html':
				return new styler.HTMLWrapStyler();
			case 'css':
				return new styler.CSSStyler();
			case 'ansi':
				return new styler.ANSIStyler();
		}
		return new styler.ANSIStyler();
	}

	function getWriter():TextWriter {
		if (options.stream) {
			return new writer.StdStreamWriter(options.stream);
		}
		switch (options.writer) {
			case 'stdout':
				return new writer.StdStreamWriter(process.stdout);
			case 'bulk':
				return new writer.ConsoleBulkWriter();
			case 'null':
				return new writer.NullWriter();
		}
		return new writer.ConsoleLineWriter();
	}

	//the reporter
	export class Unfunk {

		stats:Stats;
		failures:Test[];
		pending:Test[];

		constructor(runner) {
			this.init(runner);
		}

		init(runner) {
			importEnv();

			var stats = this.stats = new Stats();
			var out = getWriter();
			var style = getStyler();

			var diffFormat = new diff.DiffFormatter(style, getViewWidth());
			var stackFilter = new stack.StackFilter(style);
			if (options.stackFilter) {
				stackFilter.addFilters(stack.nodeFilters);
				stackFilter.addFilters(stack.webFilters);
				stackFilter.addModuleFilters(stack.moduleFilters);
			}

			runner.stats = stats;

			var indents = 0;
			var indenter:string = '   ';
			var failures = this.failures = [];
			var pending = this.pending = [];
			var suiteStack:TestSuite[] = [];
			var currentSuite:TestSuite;

			var indent = (add:number = 0):string => {
				return Array(indents + add + 1).join(indenter);
			};
			var indentLen = (amount:number = 1):number => {
				return amount * indenter.length;
			};
			var pluralize = (word:string, amount:number, plurl = 's'):string => {
				return amount + ' ' + (1 == amount ? word : word + plurl);
			};
			var start;

			runner.on('start', () => {
				stats.start = new Date().getTime();
				out.start();
				out.writeln();
			});

			runner.on('suite', (suite:TestSuite) => {
				if (indents === 0) {
					//mocha-test doens't send suites?
					if (suite.suites) {
						out.writeln(style.accent('->') + ' running ' + style.accent(pluralize('suite', suite.suites.length)));
					} else {
						out.writeln(style.accent('->') + ' running suites');
					}
					out.writeln();
				}
				suite.parent = currentSuite;
				suiteStack.push(suite);
				currentSuite = suite;

				stats.suites++;
				if (!suite.root && suite.title) {
					out.writeln(indent() + style.accent(suite.title));
				}
				indents++;
			});

			runner.on('suite end', (suite:TestSuite) => {
				indents--;
				suiteStack.pop();
				if (suiteStack.length > 0) {
					currentSuite = suiteStack[suiteStack.length - 1];
				} else {
					currentSuite = null;
				}

				if (1 == indents && !suite.root) {
					out.writeln();
				}
			});

			runner.on('test', (test:Test) => {
				stats.tests++;
				out.write(indent(0) + style.plain(test.title + '.. '));
			});

			runner.on('pending', (test:Test) => {
				stats.pending++;
				out.writeln(indent(0) + style.plain(test.title + '.. ') + style.warn('pending'));
				pending.push(test);
			});

			runner.on('pass', (test:Test) => {
				stats.passes++;

				var medium = test.slow() / 2;
				test.speed = test.duration > test.slow() ? 'slow' : (test.duration > medium ? 'medium' : 'fast');

				if (test.speed === 'slow') {
					out.writeln(style.fail(test.speed) + style.error(' (' + test.duration + 'ms)'));
				}
				else if (test.speed === 'medium') {
					out.writeln(style.warn(test.speed) + style.warning(' (' + test.duration + 'ms)'));
				}
				else {
					out.writeln(style.ok('ok'));
				}
			});

			runner.on('fail', (test:Test, err:TestError) => {
				stats.failures++;
				out.writeln(style.fail('fail'));
				var msg = cleanErrorMessage(getErrorMessage(err));
				if (msg) {
					out.writeln(style.error(padRight(stats.failures + ': ', indentLen(indents + 1), ' ')) + '' + style.warning(msg));
				}
				test.err = err;
				failures.push(test);
			});

			runner.on('end', () => {

				var test;
				var sum = '';
				var fail; //reused

				indents = 0;

				stats.end = new Date().getTime();
				stats.duration = stats.end - stats.start;

				//pre build summaries
				if (stats.tests > 0) {

					if (stats.failures > 0) {
						fail = style.error('failed ' + stats.failures)
						sum += fail + ' and ';
					}

					if (stats.passes == stats.tests) {
						sum += style.success('passed ' + stats.passes);
					} else if (stats.passes === 0) {
						sum += style.error('passed ' + stats.passes);
					} else {
						sum += style.warning('passed ' + stats.passes)
					}
					sum += ' of ';
					sum += style.accent(pluralize('test', stats.tests));

				} else {
					sum += style.warning(pluralize('test', stats.tests));
				}

				if (pending.length > 0) {
					sum += ', left ' + style.warning(stats.pending + ' pending');
				}

				//details
				if (options.reportPending && pending.length > 0) {
					out.writeln(style.accent('->') + ' reporting ' + style.warn(pluralize('pending spec', pending.length)));
					out.writeln();
					pending.forEach((test:Test, num:number) => {
						var tmp = test.fullTitle();
						var ind = tmp.lastIndexOf(test.title);
						var title = style.accent(tmp.substring(0, ind)) + style.plain(tmp.substring(ind));
						out.writeln(style.warn(padRight((num + 1) + ': ', indentLen(2), ' ')) + title);
					});
					out.writeln();
				}
				if (failures.length > 0) {

					out.writeln(style.accent('->') + ' reporting ' + style.error(pluralize('failure', failures.length)));
					out.writeln();

					failures.forEach((test:Test, num:number) => {
						//deep get title chain
						var tmp = test.fullTitle();
						var ind = tmp.lastIndexOf(test.title);
						var title = style.accent(tmp.substring(0, ind)) + style.plain(tmp.substring(ind));

						//error message
						var err = test.err;
						var msg = getErrorMessage(err);
						var stack = headlessStack(err);

						out.writeln(style.error(padRight((num + 1) + ': ', indentLen(2), ' ')) + title);
						out.writeln();
						out.writeln(indent(2) + style.warning(msg));
						out.writeln();

						stack = stackFilter.filter(stack);
						if (stack) {
							out.writeln(stack.replace(/^[ \t]*/gm, indent(3)));
							out.writeln();
						}

						if (err.showDiff || diffFormat.forcedDiff(err.actual, err.expected)) {
							var diff = diffFormat.getStyledDiff(err.actual, err.expected, indent(2));
							if (diff) {
								out.writeln(diff);
								out.writeln();
							}
						}
					});
				}
				out.writeln(style.plain('-> ') + sum + ' (' + (stats.duration) + 'ms)');
				out.writeln();

				// bye!
				out.finish();
			});
		}
	}

	//combine
	expose = Unfunk;
	expose.option = option;
	exports = (module).exports = expose;
}
