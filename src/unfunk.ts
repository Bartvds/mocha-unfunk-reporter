///<reference path="_ref.ts" />
///<reference path="writer.ts" />
///<reference path="styler.ts" />
///<reference path="diff.ts" />

//declare mocha reporter data typings
interface TestError {
	message:string;
	type:string;
	arguments:any[];
	stack:any;
	actual:any;
	expected:any;
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

	export interface DiffFormat {
		styleObjectDiff(actual:any, expected:any, indent?:string):string;
	}

	export class Stats {
		suites = 0;
		tests = 0;
		passes = 0;
		pending = 0;
		failures = 0;
	}

	//global options
	var expose:any;
	var options:any = {
		writer: 'stdout',
		style: 'plain'
	};

	var option = function (name:string, value?:any):any {
		if (typeof value !== 'undefined') {
			//console.log(name + ': ' + value);
			options[name] = value;
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

	var stringTrueish = function (str:string) {
		str = ('' + str).toLowerCase();
		return str != '' && str != 'false' && str != '0' && str != 'null' && str != 'undefined';
	};

	//the reporter
	export class Unfunk {

		//TODO expose alternate writer/styler choices?
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
			if (options.writer === 'stdout') {
				return new writer.StdOutStreamWriter();
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

		getDiffFormat(styler):DiffFormat {
			return new diff.DiffStylerFormat(styler);
		}

		init(runner) {
			importEnv();

			var stats = this.stats = new Stats();
			var out = this.getWriter();
			var style = this.getStyler();
			var diff = this.getDiffFormat(style);

			/*
			 console.log(out['constructor']);
			 console.log(style['constructor']);
			 console.log(diff['constructor']);*/

			//ugly feature copied from mocha's Base
			runner.stats = stats;

			var indents = 0;
			var indenter:string = '  ';
			var failures = this.failures = [];

			var indent = (add?:number = 0):string => {
				return Array(indents + add).join(indenter);
			};
			var pluralize = (word:string, amount:number, plurl = 's'):string => {
				return amount + ' ' + (1 == amount ? word : word + plurl);
			};
			var start;

			runner.on('start', () => {
				start = (new Date().getTime());
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
				stats.suites++;
				indents++;
				if (!suite.root && suite.title) {
					out.writeln(indent() + style.accent(suite.title));
				}
			});

			runner.on('suite end', (suite:TestSuite) => {
				indents--;
				if (1 == indents && !suite.root) {
					out.writeln();
				}
			});

			runner.on('test', (test:Test) => {
				stats.tests++;
				out.write(indent(1) + style.main(test.title + '.. '));
			});

			runner.on('pending', (test:Test) => {
				stats.pending++;
				out.writeln(indent(1) + test.title + '.. ' + style.warn('pending'));
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
				if (err.message) {
					out.writeln(style.error(stats.failures + ': ') + indent(1) + '' + style.warning(err.message));
				}
				test.err = err;
				failures.push(test);
			});

			runner.on('end', () => {

				var test;
				var sum = '';

				var fail; //reused
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

				indents += 1;

				if (failures.length > 0) {

					out.writeln(style.accent('->') + ' reporting ' + pluralize('failure', failures.length));
					out.writeln();

					failures.forEach((test:Test, num:number) => {
						//deep get title chain
						var title;
						var titles = [test.title];
						var tmp = test.parent;
						while (tmp && !tmp.root) {
							titles.unshift(tmp.title);
							tmp = tmp.parent;
						}
						//zebra
						for (var i = 0, ii = titles.length; i < ii; i++) {
							if (i % 2 === 0) {
								titles[i] = style.main(titles[i]);
							} else {
								titles[i] = style.accent(titles[i]);
							}
						}
						title = titles.join(' ');

						//TODO clean this up
						var err = test.err;
						var message = err.message || '';
						var stack = err.stack || message;
						var index = stack.indexOf(message) + message.length;
						var msg = stack.slice(0, index);

						// out.writeln(indent() + style.error((num + 1) + ': ') + style.main(title.substr(0, pre)) + style.accent(title.substr(pre)));
						out.writeln(indent() + style.error((num + 1) + ': ') + title);
						out.writeln(indent(3) + style.warning(msg));

						// indent stack trace without msg
						stack = stack.slice(index ? index + 1 : index);
						if (stack) {
							out.writeln(stack.replace(/^[ \t]*/gm, indent(4)));
						}

						if (err.showDiff) {
							out.writeln('');
							out.writeln(diff.styleObjectDiff(err.actual, err.expected, indent(3)));
						}
						out.writeln();
					});
				}
				out.writeln(style.main('-> ') + sum + ' (' + ((new Date().getTime()) - start) + 'ms)');
				out.writeln();
				out.finish();
			});
		}
	}

	//combine
	expose = Unfunk;
	expose.option = option;
	exports = (module).exports = expose;
}
