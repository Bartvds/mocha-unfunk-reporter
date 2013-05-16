///<reference path="_ref.ts" />
///<reference path="writer.ts" />

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
	export class Stats {
		suites = 0;
		tests = 0;
		passes = 0;
		pending = 0;
		failures = 0;
	}
	export class Unfunk {

		writer:LineWriter = new ConsoleWriter();
		stats:Stats = new Stats();
		indent:string = '  ';
		failures:Test[] = [];

		constructor(runner) {
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
					writer.writeln(indent() + suite.title);
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
				writer.write(indent(1) + test.title + '.. ');
			});

			runner.on('pending', (test:Test) => {
				self.stats.pending++;
				//TODO properly handle pending
				writer.writeln('? ' + indent() + test.title + '..  pending');
			});

			runner.on('pass', (test:Test) => {
				self.stats.passes++;
				if ('fast' == test.speed) {
					writer.writeln('pass');
				} else {
					writer.writeln('pass (' + test.duration + 'ms)');
				}
			});

			runner.on('fail', (test:Test, err:TestError) => {
				self.stats.failures++;
				writer.writeln('fail');
				writer.writeln('!!' + indent(1) + self.cleanError(err));
			});

			runner.on('end', () => {
				writer.writeln('executed ' + pluralize('test', self.stats.tests) + ' with ' + pluralize('failure', self.stats.failures) + ' (' + (Date.now() - start) +'ms)');
				writer.finish();
			});
		}

		cleanError(err):string {
			return String(err).replace(/^Error:\s*/, '');
		}
	}
}
exports = (module).exports = unfunk.Unfunk;