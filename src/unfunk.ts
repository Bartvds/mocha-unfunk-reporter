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

	export class Unfunk {

		//TODO expose alternate writer/styler choices?
		//TODO fix/auto switch colors

		constructor(runner) {
			this.init(runner);
		}

		getStyler(runner):Styler {
			//if (Unfunk.styler === 'ansi') {
			return new styler.AnsiStyler();
			//}
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

			var indent = (add?:number = 0):string => {
				return Array(indents + add).join(indenter);
			};
			var pluralize = (word:string, amount:number):string => {
				return amount + ' ' + (1 == amount ? word : word + 's');
			};

			var start;

			runner.on('start', () => {
				//self.writeln('start');
				out.start();
				start = Date.now();
			});

			runner.on('suite', (suite:TestSuite) => {
				stats.suites++;
				++indents;
				if (!suite.root) {
					out.writeln(indent() + style.suite(suite.title));
				}
			});

			runner.on('suite end', (suite:TestSuite) => {
				--indents;
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
				//TODO properly handle pending
				out.writeln(style.warning('?-') + indent() + test.title + '.. ' + style.warning('pending'));
			});

			runner.on('pass', (test:Test) => {
				stats.passes++;
				if ('fast' == test.speed) {
					out.writeln(style.success('pass'));
				} else {
					out.writeln(style.success('pass') + ' (' + test.duration + 'ms)');
				}
			});

			runner.on('fail', (test:Test, err:TestError) => {
				stats.failures++;
				out.writeln(style.error('fail'));
				out.writeln(style.error('!!') + indent(1) + style.error('' + err));
			});

			runner.on('end', () => {
				var txt:string = 'executed ' + pluralize('test', stats.tests) + ' with ';

				if (stats.failures > 0) {
					txt += style.error(pluralize('failure', stats.failures))
				} else {
					txt += style.success(pluralize('failure', stats.failures))
				}
				if (stats.pending > 0) {
					txt += ' and ' + style.warning(stats.pending + ' pending');
				}
				txt += ' (' + (Date.now() - start) + 'ms)';
				out.writeln(txt);
				out.writeln();
				out.finish();
			});
		}
	}
}

exports = (module).exports = unfunk.Unfunk;
