///<reference path="_ref.ts" />
///<reference path="writer.ts" />
///<reference path="styler.ts" />
///<reference path="diff.ts" />
///<reference path="stackFilter.ts" />

//declare mocha reporter data typings
interface TestError {
	message:string;
	type:string;
	arguments:any[];
	stack:any;
	actual:any;
	expected:any;
	operator:string;
	showDiff:bool;
}
interface TestSuite {
	title:string;
	parent:TestSuite;
	root:bool;
	tests:Test[];
	suites:TestSuite[];
	pending:bool;
	ctx:any;
}
interface Test {
	title:string;
	parent:TestSuite;
	speed:string;
	duration:number;
	async:number;
	timedOut:bool;
	pending:bool;
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

	export interface Styler {
		ok(str:string):string;
		fail(str:string):string;
		warn(str:string):string;

		error(str:string):string;
		warning(str:string):string;
		success(str:string):string;

		accent(str:string):string;
		main(str:string):string;
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
		commonjs: true,
		stackFilter: true
	};

	var option = function (nameOrHash:any, value?:any):any {
		if (arguments.length === 1) {
			if (typeof nameOrHash === 'object') {
				for (var name in nameOrHash) {
					if (nameOrHash.hasOwnProperty(name)) {
						options[name] = nameOrHash[name];
					}
				}
			}
		} else if (arguments.length === 2) {
			if (typeof value !== 'undefined') {
				options[nameOrHash] = value;
			}
		}
		return expose;
	};

	var importEnv = function ():any {
		//import from env/document
		var pattern = /^mocha-unfunk-([\w]+(?:[\w_-][\w]+)*)$/;
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
						option(match[1], obj[name]);
					}
				}
			}
		}
	};

	var stringTrueish = function (str:string):bool {
		str = ('' + str).toLowerCase();
		return str != '' && str != 'false' && str != '0' && str != 'null' && str != 'undefined';
	};

	var toDebug = function (value, cutoff?:number = 20) {

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
	};
	var extract = /^[ \t]*[A-Z][A-Za-z0-9_-]*Error: ([\s\S]+?)([\r\n]+[ \t]*at[\s\S]*)$/;
	var errorType = /^[ \t]*([A-Z][A-Za-z0-9_-]*Error)/;
	var assertType = /^AssertionError/;

	var headlessStack = function (error:TestError):string {
		if (error.stack) {
			var match = error.stack.match(extract);
			if (match && match.length > 2) {
				return match[2].replace(/(^\s+)|(\s+$)/g, '');
			}
		}
		return '';
	};
	var getErrorPrefix = function (error:TestError):string {
		var str = error.stack || ('' + error);
		var match = str.match(errorType);
		if (match && match.length > 0) {
			if (!assertType.test(match[1])) {
				return match[1] + ': ';
			}
		}
		return '';
	};
	var getErrorMessage = function (error:TestError):string {
		var msg = '';
		if (error.message) {
			msg = error.message;
		}
		else if (error.operator) {
			msg += toDebug(error.actual) + ' ' + error.operator + ' ' + toDebug(error.expected) + '';
		}

		if (!msg) {
			msg = ('' + error);
			if (msg === '[object Object]') {
				msg = error.message || '';
				if (!msg) {
					if (error.stack) {
						var match = error.stack.match(extract);
						if (match && match.length > 1) {
							msg = match[1];
						}
					}
				}
			}
		}
		if (msg) {
			return getErrorPrefix(error) + ('' + msg).replace(/(\s+$)/g, '');
		}
		return getErrorPrefix(error) + '<no error message>';
	};

	/*var getErrorMessage = function (error:TestError):string {
	 var head = ('' + error);
	 if (head === '[object Object]') {
	 head = error.message || '';
	 }
	 if (!head) {
	 if (error.stack) {
	 var match = error.stack.match(extract);
	 if(match && match.length > 1) {
	 return match[1];
	 }
	 }
	 return '<no error message>';
	 }
	 return ('' + head).replace(/(\s+$)/g, '');
	 };*/

	var cleanErrorMessage = function (msg):string {
		return msg.replace(/^(AssertionError:[ \t]*)/, '');
	};

	var padRight = function (str, len, char):string {
		char = char.charAt(0);
		while (str.length < len) {
			str += char;
		}
		return str;
	};

	//the reporter
	export class Unfunk {

		//TODO expose alternate writer/styler choices?a
		//TODO fix/auto switch colors

		stats:Stats;
		failures:Test[];

		constructor(runner) {
			this.init(runner);
		}

		getStyler():Styler {
			if (typeof options.style !== 'undefined') {
				if (options.style === 'plain') {
					return new styler.PlainStyler();
				}
				if (options.style === 'ansi') {
					return new styler.AnsiStyler();
				}
				if (options.style === 'html') {
					return new styler.HtmlStyler();
				}
				if (options.style === 'css') {
					return new styler.CssStyler();
				}
			}
			return new styler.PlainStyler();
		}

		getWriter():TextWriter {
			if (options.stream) {
				if (!options.stream.writable) {
					throw new Error('stream not writable');
				}
				return new writer.StdStreamWriter(options.stream);
			}
			else if (options.writer === 'stdout') {
				return new writer.StdStreamWriter(process.stdout);
			}
			else if (options.writer === 'bulk') {
				return new writer.ConsoleBulkWriter();
			}
			else if (options.writer === 'null') {
				return new writer.NullWriter();
			}
			else if (options.writer === 'log') {
				return new writer.ConsoleLineWriter();
			}
			return new writer.ConsoleLineWriter();
		}

		init(runner) {
			importEnv();

			var stats = this.stats = new Stats();
			var out = this.getWriter();
			var style = this.getStyler();
			var diffFormat = new diff.DiffFormatter(style);
			var stackFilter = new stack.StackFilter(style);
			stackFilter.addFilters(stack.nodeFilters);
			stackFilter.addModuleFilters(stack.moduleFilters);

			/*console.log(out['constructor']);
			 console.log(style['constructor']);
			 console.log(diffFormat['constructor']);*/

			//ugly feature copied from mocha's Base
			runner.stats = stats;

			var indents = 0;
			var indenter:string = '  ';
			var failures = this.failures = [];
			var suiteStack:TestSuite[] = [];
			var currentSuite:TestSuite;

			var indent = (add?:number = 0):string => {
				return Array(indents + add + 1).join(indenter);
			};
			var indentLen = (amount?:number = 1):number => {
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
				test.parent = currentSuite;
				out.write(indent(0) + style.main(test.title + '.. '));
			});

			runner.on('pending', (test:Test) => {
				stats.pending++;
				test.parent = currentSuite;
				out.writeln(indent(0) + style.main(test.title + '.. ') + style.warn('pending'));
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

					if (stats.pending > 0) {
						sum += ', left ' + style.warning(stats.pending + ' pending');
					}

					//details
					if (failures.length > 0) {

						out.writeln(style.accent('->') + ' reporting ' + pluralize('failure', failures.length));
						out.writeln();

						failures.forEach((test:Test, num:number) => {
							//deep get title chain
							var tmp = test.fullTitle();
							var ind = tmp.lastIndexOf(test.title)
							var title = style.accent(tmp.substring(0, ind)) + style.main(tmp.substring(ind));

							//error message
							var err = test.err;
							var msg = getErrorMessage(err);
							var stack = headlessStack(err);
							/*if (msg && stack) {
							 var ind = stack.indexOf(msg);
							 if (ind > -1) {
							 var msg = stack.substring(0, ind + msg.length);
							 stack = stack.substring(msg.length);
							 }
							 }*/
							//fix odd assertions
							if (err.message && msg.indexOf(err.message) < 0) {
								msg += ' ' + err.message;
							}
							msg = cleanErrorMessage(msg);

							out.writeln(style.error(padRight((num + 1) + ': ', indentLen(2), ' ')) + title);
							out.writeln(indent(2) + style.warning(msg));

							out.writeln();

							if (stack && stackFilter) {
								stack = stackFilter.filter(stack);
								if (stack) {
									out.writeln(stack.replace(/^[ \t]*/gm, indent(2)));
									out.writeln();
								}
							}

							if (err.showDiff || diffFormat.forcedDiff(err.actual, err.expected)) {
								var diff = diffFormat.styleObjectDiff(err.actual, err.expected, indent(2));
								if (diff) {
									out.writeln(diff);
									out.writeln();
								}
							}
						});
					}
					out.writeln(style.main('-> ') + sum + ' (' + (stats.duration) + 'ms)');
					out.writeln();
					out.finish();
				}

			)
			;
		}
	}

//combine
	expose = Unfunk;
	expose.option = option;
	exports = (module).exports = expose;
}
