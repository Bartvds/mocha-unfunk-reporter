///<reference path="_ref.ts" />
///<reference path="writer.ts" />
///<reference path="styler.ts" />

interface TestError {
	message:string;
	type:string;
	arguments:any[];
	stack:any;
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
		suite(str:string):string;
		test(str:string):string;
	}

	export class Stats {
		suites = 0;
		tests = 0;
		passes = 0;
		pending = 0;
		failures = 0;
	}

	var util = require('util');

	export class Unfunk {

		//TODO expose alternate writer/styler choices?
		//TODO fix/auto switch colors

		constructor(runner) {
			this.init(runner);
		}

		getStyler(runner):Styler {
			//return new styler.AnsiStyler();
			return new styler.NullStyler();
		}

		getWriter(runner):LineWriter {
			return new writer.ConsoleLineWriter();
		}

		init(runner) {
			var stats = new Stats();
			var out = this.getWriter(runner);
			var style = this.getStyler(runner);

			var indenter:string = '  ';
			var indents = 0;
			var failures = [];

			var indent = (add?:number = 0):string => {
				return Array(indents + add).join(indenter);
			};
			var pluralize = (word:string, amount:number):string => {
				return amount + ' ' + (1 == amount ? word : word + 's');
			};
			var start;
			var counter = 0;

			runner.on('start', () => {
				start = Date.now();
				out.start();
			});

			runner.on('suite', (suite:TestSuite) => {
				stats.suites++;
				indents++;
				if (!suite.root) {
					out.writeln(indent() + style.suite(suite.title));
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
				out.write(indent(1) + style.test(test.title + '.. '));
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

				if (test.speed == 'slow') {
					out.writeln(' ' + style.error('pass') + ' (' + test.duration + 'ms)');
				}
				else if (test.speed == 'medium') {
					out.writeln(' ' + style.warning('(' + test.duration + 'ms)'));
				} else {
					out.writeln();
				}
			});

			runner.on('fail', (test:Test, err:TestError) => {
				stats.failures++;
				out.writeln(style.error('fail'));
				counter++;
				if (err.message) {
					//out.writeln(style.error(counter + ': ') + indent(1) + '' + style.error(err.message));
				}
				test.err = err;
				failures.push(test);
			});

			runner.on('end', () => {
				var summary:string = 'executed ' + pluralize('test', stats.tests) + ' with ';

				if (stats.failures > 0) {
					summary += style.error(pluralize('failure', stats.failures))
				} else {
					summary += style.success(pluralize('failure', stats.failures))
				}
				if (stats.pending > 0) {
					summary += ' and ' + style.warning(stats.pending + ' pending');
				}
				summary += ' (' + (Date.now() - start) + 'ms)';

				indents += 1;

				failures.forEach((test:Test, i:number) => {

					var title = test.fullTitle()
					var pre = title.lastIndexOf(test.title);
					out.writeln(indent() + style.error((i + 1) + ': ') +style.suite(title.substr(0, pre)) + style.test(title.substr(pre)));

					var err = test.err;
					var message = err.message || '';
					var stack = err.stack || message;
					var index = stack.indexOf(message) + message.length;
					var msg = stack.slice(0, index);

					out.writeln(indent(3) + style.warning(msg));

					// indent stack trace without msg
					stack = stack.slice(index ? index + 1 : index);
					if (stack) {
						out.writeln(stack.replace(/^[ \t]*/gm, indent(4)));
					}
					out.writeln();
				});

				out.writeln(summary);
				out.writeln();

				out.finish();
			});
		}
	}
}

exports = (module).exports = unfunk.Unfunk;
