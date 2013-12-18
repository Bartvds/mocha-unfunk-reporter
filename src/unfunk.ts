///<reference path="_ref.d.ts" />
///<reference path="error.ts" />

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

	parsed:unfunk.error.ParsedError;
}

module unfunk {

	var jsesc = require('jsesc');
	var ministyle = <MiniStyle> require('ministyle');
	var miniwrite = <MiniWrite> require('miniwrite');
	var DiffFormatter = require('unfunk-diff').DiffFormatter;

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
	var options = {
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
			return Math.min(options.width, process.stdout['getWindowSize'] ? process.stdout['getWindowSize'](1)[0] : tty.getWindowSize()[1]);
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

	var escapableExp = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	var meta = {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"': '\\"',
		'\\': '\\\\'
	};
	var jsonNW = {
		json: true,
		wrap: false,
		quotes: 'double'
	};

	// JSON escape: https://github.com/douglascrockford/JSON-js/blob/master/json2.js#L211
	// If the string contains no control characters, no quote characters, and no
	// backslash characters, then we can safely slap some quotes around it.
	// Otherwise we must also replace the offending characters with safe escape
	// sequences.
	export function escape(str:string):string {
		escapableExp.lastIndex = 0;
		if (escapableExp.test(str)) {
			return str.replace(escapableExp, function (a) {
				var c = meta[a];
				if (typeof c === 'string') {
					return c;
				}
				//return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				return jsesc(a, jsonNW);
			})
		}
		return str;
	}

	export function stringTrueish(str:string):boolean {
		str = ('' + str).toLowerCase();
		return str != '' && str != 'false' && str != '0' && str != 'null' && str != 'undefined';
	}

	export function toDebug(value, cutoff:number = 20) {

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
				return '"' + escape(value.substr(0, cutoff)) + '"' + '...';
			}
			return '"' + escape(value) + '"' ;
		}
		return '' + value;
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

	function getStyler():MiniStyle.Style {
		switch (options.style) {
			case 'no':
			case 'none':
			case 'plain':
				return ministyle.plain();
			case 'dev':
				return ministyle.dev();
			case 'html':
				return ministyle.html();
			case 'css':
				return ministyle.css();
			case 'ansi':
			default:
				return ministyle.ansi();
		}
	}

	function getWriter():MiniWrite.Chars {
		if (options.stream) {
			return miniwrite.chars(miniwrite.stream(options.stream));
		}
		switch (options.writer) {
			case 'stdout':
				return miniwrite.chars(miniwrite.stream(process.stdout));
			case 'null':
				return miniwrite.chars(miniwrite.base());
			case 'log':
			default:
				return miniwrite.chars(miniwrite.log());
		}
	}

	export function pluralize(word:string, amount:number, plurl = 's'):string {
		return amount + ' ' + (1 == amount ? word : word + plurl);
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

			var diffFormat = new DiffFormatter(style, getViewWidth());
			var stackFilter = new unfunk.error.StackFilter(style);
			if (options.stackFilter) {
				stackFilter.addFilters(unfunk.error.nodeFilters);
				stackFilter.addFilters(unfunk.error.webFilters);
				stackFilter.addModuleFilters(unfunk.error.moduleFilters);
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
			var start;

			runner.on('start', () => {
				stats.start = new Date().getTime();
				// use plain to reset style
				out.writeln(style.plain(''));
			});

			runner.on('suite', (suite:TestSuite) => {
				if (indents === 0) {
					//mocha-test doens't send suites?
					if (suite.suites) {
						out.writeln(style.accent('->') + ' running ' + style.accent(pluralize('suite', suite.suites.length)));
					} else {
						out.writeln(style.accent('->') + ' running suites');
					}
					out.writeln('');
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
					out.writeln('');
				}
			});

			runner.on('test', (test:Test) => {
				stats.tests++;
				out.write(indent(0) + style.plain(test.title + '.. '));
			});

			runner.on('pending', (test:Test) => {
				stats.pending++;
				out.writeln(indent(0) + style.plain(test.title + '.. ') + style.warning('pending'));
				pending.push(test);
			});

			runner.on('pass', (test:Test) => {
				stats.passes++;

				var medium = test.slow() / 2;
				test.speed = test.duration > test.slow() ? 'slow' : (test.duration > medium ? 'medium' : 'fast');

				if (test.speed === 'slow') {
					out.writeln(style.success(test.speed) + style.error(' (' + test.duration + 'ms)'));
				}
				else if (test.speed === 'medium') {
					out.writeln(style.success(test.speed) + style.warning(' (' + test.duration + 'ms)'));
				}
				else {
					out.writeln(style.success('ok'));
				}
			});

			runner.on('fail', (test:Test, err:TestError) => {
				stats.failures++;
				out.writeln(style.error('fail'));

				test.err = err;
				test.parsed = stackFilter.parse(err, options.stackFilter);

				out.writeln(style.error(padRight(stats.failures + ': ', indentLen(indents + 1), ' ')) + style.warning(test.parsed.getHeaderSingle()));

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
					out.writeln(style.accent('->') + ' reporting ' + style.warning(pluralize('pending spec', pending.length)));
					out.writeln('');
					pending.forEach((test:Test, num:number) => {
						var tmp = test.fullTitle();
						var ind = tmp.lastIndexOf(test.title);
						var title = style.accent(tmp.substring(0, ind)) + style.plain(tmp.substring(ind));
						out.writeln(style.warning(padRight((num + 1) + ': ', indentLen(2), ' ')) + title);
					});
					out.writeln('');
				}
				if (failures.length > 0) {

					out.writeln(style.accent('->') + ' reporting ' + style.error(pluralize('failure', failures.length)));
					out.writeln('');

					failures.forEach((test:Test, num:number) => {
						//deep get title chain
						var tmp = test.fullTitle();
						var ind = tmp.lastIndexOf(test.title);
						var title = style.accent(tmp.substring(0, ind)) + style.plain(tmp.substring(ind));

						//error message
						var err = test.err;
						var parsed = test.parsed;
						var msg = parsed.getHeader();

						out.writeln(style.error(padRight((num + 1) + ': ', indentLen(2), ' ')) + title);
						out.writeln('');
						out.writeln(indent(2) + style.warning(msg));

						if (parsed.hasStack()) {
							out.writeln(parsed.getHeadlessStack(indent(2), indenter));
							out.writeln('');
						}
						else {
							out.writeln('');
						}

						if (err.showDiff || diffFormat.forcedDiff(err.actual, err.expected)) {
							var diff = diffFormat.getStyledDiff(err.actual, err.expected, indent(2));
							if (diff) {
								out.writeln(diff);
								out.writeln('');
							}
						}
					});
				}
				out.writeln(style.plain('-> ') + sum + ' (' + (stats.duration) + 'ms)');
				out.writeln('');

				// bye!
			});
		}
	}

	//combine
	expose = Unfunk;
	expose.option = option;
	(module).exports = expose;
}
