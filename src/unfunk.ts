///<reference path="_ref.ts" />
///<reference path="writer.ts" />
///<reference path="styler.ts" />
///<reference path="diff.ts" />

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

//global hack
declare interface Document {
	env:any;
}
declare var document:Document;

module unfunk {

	export interface LineWriter {
		start();
		write(...args:any[]);
		writeln(...args:any[]);
		flushLine(str:string);
		flushLineBuffer();
		finish();
	}

	export interface Styler {
		error(str:string):string;
		warning(str:string):string;
		success(str:string):string;
		accent(str:string):string;
		main(str:string):string;
		pass(str:string):string;
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

	var options:any = {};
	var unfunkRef;

	export class Unfunk {

		//TODO expose alternate writer/styler choices?
		//TODO fix/auto switch colors

		stats:Stats;
		failures:Test[];

		constructor(runner) {
			this.init(runner);
		}

		getStyler():Styler {
			if (this.stringTrueish(options.color)) {
				return new styler.AnsiStyler();
			}
			return new styler.NullStyler();
		}

		getWriter():LineWriter {
			return new writer.ConsoleLineWriter();
		}

		getDiffFormat(styler):DiffFormat {
			return new diff.DiffStylerFormat(styler);
		}

		init(runner) {
			this.importOptions();

			var stats = this.stats = new Stats();
			var out = this.getWriter();
			var style = this.getStyler();
			var diff = this.getDiffFormat(style);

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
				out.writeln(indent(1) + test.title + '.. ' + style.warning('pending'));
			});

			runner.on('pass', (test:Test) => {
				stats.passes++;

				var medium = test.slow() / 2;
				test.speed = test.duration > test.slow() ? 'slow' : (test.duration > medium ? 'medium' : 'fast');

				out.write(style.success('pass'));

				if (test.speed === 'slow') {
					out.writeln(' ' + style.error(test.speed + ' (' + test.duration + 'ms)'));
				}
				else if (test.speed === 'medium') {
					out.writeln(' ' + style.warning(test.speed + '(' + test.duration + 'ms)'));
				}
				else {
					out.writeln();
				}
			});

			runner.on('fail', (test:Test, err:TestError) => {
				stats.failures++;
				out.writeln(style.error('fail'));
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
						fail = style.error(pluralize('failure', stats.failures))
					} else {
						fail = style.success(pluralize('failure', stats.failures));
					}
					sum += fail + ' and ';

					if (stats.passes == stats.tests) {
						sum += style.success(pluralize('pass', stats.passes, 'es'))
					} else if (stats.passes === 0) {
						sum += style.error(pluralize('pass', stats.passes, 'es'))
					} else {
						sum += style.warning(pluralize('pass', stats.passes, 'es'))
					}
					sum += ' in ';
					sum += style.accent(pluralize('test', stats.tests));

				} else {
					sum += style.warning(pluralize('test', stats.tests));
				}

				if (stats.pending > 0) {
					sum += ', left ' + style.warning(stats.pending + ' pending');
				}

				indents += 1;

				if (failures.length > 0) {

					out.writeln(style.accent('->') + ' reporting ' + fail);
					out.writeln();

					failures.forEach((test:Test, num:number) => {

						var title; // = test.fullTitle()
						var titles = [test.title];
						var tmp = test.parent;
						while (tmp && !tmp.root) {
							titles.unshift(tmp.title);
							tmp = tmp.parent;
						}
						for (var i = 0, ii = titles.length; i < ii; i++) {
							if (i % 2 === 0) {
								titles[i] = style.main(titles[i]);
							} else {
								titles[i] = style.accent(titles[i]);
							}
						}
						title = titles.join(' ');

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

		stringTrueish(str:string) {
			str = ('' + str).toLowerCase();
			return str != '' && str != 'false' && str != '0' && str != 'null' && str != 'undefined';
		}

		static option(name:string, value?:any) {
			if (typeof value !== 'undefined') {
				options[name] = value;
			}
			return unfunkRef;
		}

		static importOptions(values:any) {
			for (var name in values) {
				if (values.hasOwnProperty(name)){
					options[name] = values[name];
				}
			}
			return unfunkRef;
		}

		importOptions() {
			//import from env/document
			var pattern = /^mocha-unfunk-([\w][\w_-]*[\w])/g;
			var obj;
			if (typeof document !== 'undefined' && document.env) {
				obj = document.env;
			}
			else if (typeof process !== 'undefined' && process.env) {
				obj = process.env;
			}
			if (obj) {
				for (var name in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, name)) {
						var match = pattern.exec(name);
						if (match && match.length > 1) {
							options[match[1]] = obj[name];
						}
					}
				}
			}
		}
	}
	unfunkRef = Unfunk;
}
exports = (module).exports = unfunk.Unfunk;
