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

		options:any = {};

		constructor(runner) {
			this.init(runner);
		}

		getStyler(runner):Styler {
			if (this.stringTrue(this.options.color)) {
				return new styler.AnsiStyler();
			}
			return new styler.NullStyler();
		}

		getWriter(runner):LineWriter {
			return new writer.ConsoleLineWriter();
		}

		init(runner) {
			this.importOptions();

			var stats = new Stats();
			var out = this.getWriter(runner);
			var style = this.getStyler(runner);

			var indenter:string = '  ';
			var indents = 0;
			var failures = [];

			var indent = (add?:number = 0):string => {
				return Array(indents + add).join(indenter);
			};
			var pluralize = (word:string, amount:number, plurl='s'):string => {
				return amount + ' ' + (1 == amount ? word : word + plurl);
			};
			var start;
			var counter = 0;

			runner.on('start', () => {
				start = Date.now();
				out.start();
				out.writeln();
			});

			runner.on('suite', (suite:TestSuite) => {
				if (indents === 0) {
					out.writeln(style.suite('->') + ' running ' + style.suite(pluralize('suite', suite.suites.length)));
					out.writeln();
				}
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
					out.writeln(style.error(counter + ': ') + indent(1) + '' + style.warning(err.message));
				}
				test.err = err;
				failures.push(test);
			});

			runner.on('end', () => {

				var test;
				if (stats.tests > 0) {
					test = style.suite(pluralize('test', stats.tests))
				} else {
					test = style.warning(pluralize('test', stats.tests))
				}
				var passes;
				if (stats.tests > 0) {
					passes = style.success(pluralize('pass', stats.passes, 'es'))
				} else {
					passes = style.success(pluralize('pass', stats.passes, 'es'))
				}

				var fail;
				if (stats.failures > 0) {
					fail = style.error(pluralize('failure', stats.failures))
				} else {
					fail = style.success(pluralize('failure', stats.failures))
				}
				var pending = '';
				if (stats.pending > 0) {
					pending = ' and ' + style.warning(stats.pending + ' pending');
				}

				indents += 1;

				if (failures.length > 0) {

					out.writeln(style.suite('->') + ' reporting ' + fail);
					out.writeln();

					failures.forEach((test:Test, i:number) => {

						var title = test.fullTitle()
						var pre = title.lastIndexOf(test.title);

						var err = test.err;
						var message = err.message || '';
						var stack = err.stack || message;
						var index = stack.indexOf(message) + message.length;
						var msg = stack.slice(0, index);

						out.writeln(indent() + style.error((i + 1) + ': ') + style.test(title.substr(0, pre)) + style.suite(title.substr(pre)));
						out.writeln(indent(3) + style.warning(msg));

						// indent stack trace without msg
						stack = stack.slice(index ? index + 1 : index);
						if (stack) {
							out.writeln(stack.replace(/^[ \t]*/gm, indent(4)));
						}
						out.writeln();
					});
				}
				out.writeln(style.suite('->') + ' executed ' + test + ' with '+passes + (stats.pending > 0 ? ', ' :  ' and ') + fail + pending +  ' (' + (Date.now() - start) + 'ms)');
				out.writeln();

				out.finish();
			});
		}

		stringTrue(str:string) {
			str = (''+str).toLowerCase();
			return str != '' && str != 'false' && str != '0' && str != 'null' && str != 'undefined';
		}

		importOptions() {
			//import from env/document
			var pattern = /^mocha-unfunk-([\w][\w_-]*[\w])/g;
			var obj;
			/*if (typeof document !== 'undefined' && document.env){
				obj = document.env;
			}
			else*/
			if (typeof process !== 'undefined' && process.env){
				obj = process.env;
			}
			if (obj) {
				for (var name in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, name)) {
						var match = pattern.exec(name);
						if (match && match.length > 1){
							this.options[match[1]] = obj[name];
						}
					}
				}
			}

		}
	}
}

exports = (module).exports = unfunk.Unfunk;
