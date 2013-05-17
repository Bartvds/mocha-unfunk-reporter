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

		writer:LineWriter;
		style:Styler;
		stats:Stats = new Stats();
		indent:string = '  ';

		constructor(runner) {
			this.writer = new ConsoleLineWriter();
			this.style = new ANSIStyler();
			this.init(runner);
		}
		init(runner){
			var self:Unfunk = this;
			var writer = this.writer;
			var indents = 0;

			var indent = (add?:number = 0):string => {
				return Array(indents + add).join(self.indent);
			};
			var pluralize = (word:string, amount:number):string => {
				return amount + ' ' + (1 == amount ? word : word + 's');
			};

			var start;

			runner.on('start', () => {
				//self.writeln('start');
				writer.start();
				start = Date.now();
			});

			runner.on('suite', (suite:TestSuite) => {
				self.stats.suites++;
				++indents;
				if (!suite.root) {
					writer.writeln(indent() + self.style.suite(suite.title));
				}
			});

			runner.on('suite end', (suite:TestSuite) => {
				--indents;
				if (1 == indents && !suite.root) {
					writer.writeln();
				}
			});

			runner.on('test', (test:Test) => {
				self.stats.tests++;
				writer.write(indent(1) + self.style.test(test.title + '.. '));
			});

			runner.on('pending', (test:Test) => {
				self.stats.pending++;
				//TODO properly handle pending
				writer.writeln(self.style.warning('?-') + indent() + test.title + '.. '+ self.style.warning('pending'));
			});

			runner.on('pass', (test:Test) => {
				self.stats.passes++;
				if ('fast' == test.speed) {
					writer.writeln(self.style.success('pass'));
				} else {
					writer.writeln(self.style.success('pass') + ' (' + test.duration + 'ms)');
				}
			});

			runner.on('fail', (test:Test, err:TestError) => {
				self.stats.failures++;
				writer.writeln(self.style.error('fail'));
				writer.writeln(self.style.error('!!') + indent(1) + self.style.error(''+err));
			});

			runner.on('end', () => {
				var txt:string = 'executed ' + pluralize('test', self.stats.tests) + ' with ';

				if (self.stats.failures > 0){
					txt += self.style.error(pluralize('failure', self.stats.failures))
				} else {
					txt += self.style.success(pluralize('failure', self.stats.failures))
				}
				if (self.stats.pending > 0){
					txt += ' and ' + self.style.warning(self.stats.pending + ' pending');
				}
				txt += ' (' + (Date.now() - start) +'ms)';
				writer.writeln(txt);
				writer.finish();
			});
		}
	}
}

exports = (module).exports = unfunk.Unfunk;
