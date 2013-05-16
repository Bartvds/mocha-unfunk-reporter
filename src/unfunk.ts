///<reference path="_ref.ts" />


/**
 * Initialize a new `Spec` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

var format = require('format');
var util = require('util');
var inspect = (value) => {
	console.log(util.inspect(value, true, 4));
};

class Stats {
	suites = 0;
	tests = 0;
	passes = 0;
	pending = 0;
	failures = 0;
}
class Unfunk {

	lineBuffer:string = '';
	stats = new Stats();
	indent = '  ';
	failures = [];

	constructor(runner) {
		var self = this;
		var indents = 0;

		var indent = (add?:number = 0):string => {
			return Array(indents + add).join(self.indent);
		};
		var pluralize = (word:string, amount:number):string => {
			return amount + ' ' + (1 == amount ? word : word + 's');
		};

		runner.on('start', () => {
			//self.writeln('start');
		});

		runner.on('suite', (suite) => {
			self.stats.suites++;
			++indents;
			if (!suite.root) {
				self.writeln('%s%s', indent(), suite.title);
			}
		});

		runner.on('suite end', (suite) => {
			--indents;
			if (1 == indents && !suite.root) {
				self.writeln();
			}
		});

		runner.on('test', (test) => {
			self.stats.tests++;
			self.write('%s%s.. ', indent(1), test.title);
		});

		runner.on('pending', (test) => {
			self.stats.pending++;
			self.writeln('%s%s %s.. ', indent(), 'pending', test.title);
		});

		runner.on('pass', (test) => {
			self.stats.passes++;
			if ('fast' == test.speed) {
				self.writeln('%s', 'pass');
			} else {
				self.writeln('%s (%dms)', 'pass', test.duration);
			}
		});

		runner.on('fail', (test, err) => {
			self.stats.failures++;
			self.writeln('%s', 'fail');
			if (err) {
				self.writeln('%s-> %s', indent(2), self.cleanError(err));
			}
		});

		runner.on('end', () => {
			self.writeln('executed %s with %s', pluralize('test', self.stats.tests), pluralize('failure', self.stats.failures));

			self.flushLineBuffer();
		});
	}

	cleanError(err):string{
		return String(err).replace(/^Error:\s*/, '');
	}

	write(...args:any[]) {
		if (args.length > 0) {
			this.lineBuffer += format.apply(null, args);
		}
	}

	writeln(...args:any[]) {
		if (args.length > 0) {
			this.flushLine(this.lineBuffer + format.apply(null, args));
		}
		else {
			this.flushLine(this.lineBuffer);
		}
		this.lineBuffer = '';
	}

	flushLine(str?:string) {
		if (arguments.length == 0) {
			str = '';
		}
		console.log(str);
	}

	flushLineBuffer() {
		if (this.lineBuffer.length > 0) {
			this.writeln(this.lineBuffer);
			this.lineBuffer = '';
		}
	}
}
exports = (module).exports = Unfunk;