require('source-map-support').install();
var format = require('format');
var util = require('util');
var inspect = function (value) {
    console.log(util.inspect(value, false, 4));
};
var Stats = (function () {
    function Stats() {
        this.suites = 0;
        this.tests = 0;
        this.passes = 0;
        this.pending = 0;
        this.failures = 0;
    }
    return Stats;
})();
var Unfunk = (function () {
    function Unfunk(runner) {
        this.lineBuffer = '';
        this.stats = new Stats();
        var self = this;
        var indents = 0;
        var indent = function (add) {
            if (typeof add === "undefined") { add = 0; }
            return Array(indents + add).join('  ');
        };
        var pluralize = function (word, amount) {
            return amount + ' ' + (1 == amount ? word : word + 's');
        };
        runner.on('start', function () {
        });
        runner.on('suite', function (suite) {
            self.stats.suites++;
            ++indents;
            if(!suite.root) {
                self.writeln('%s%s', indent(), suite.title);
            }
        });
        runner.on('suite end', function (suite) {
            --indents;
            if(1 == indents && !suite.root) {
                self.writeln();
            }
        });
        runner.on('test', function (test) {
            self.stats.tests++;
            self.write('%s%s %s.. ', indent(1), 'test', test.title);
        });
        runner.on('pending', function (test) {
            self.stats.pending++;
            self.writeln('%s%s %s.. ', indent(), 'pending', test.title);
        });
        runner.on('pass', function (test) {
            self.stats.passes++;
            if('fast' == test.speed) {
                self.writeln('%s', 'pass');
            } else {
                self.writeln('%s (%dms)', 'pass', test.duration);
            }
        });
        runner.on('fail', function (test, err) {
            self.stats.failures++;
            self.writeln('%s', 'fail');
            if(err) {
                self.writeln('%s%s', indent(2), err);
            }
        });
        runner.on('end', function () {
            self.writeln('executed %s with %s', pluralize('test', self.stats.tests), pluralize('failure', self.stats.failures));
            self.flushLineBuffer();
        });
    }
    Unfunk.prototype.write = function () {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
        if(args.length > 0) {
            this.lineBuffer += format.apply(null, args);
        }
    };
    Unfunk.prototype.writeln = function () {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
        if(args.length > 0) {
            this.flushLine(this.lineBuffer + format.apply(null, args));
        } else {
            this.flushLine(this.lineBuffer);
        }
        this.lineBuffer = '';
    };
    Unfunk.prototype.flushLine = function (str) {
        if(arguments.length == 0) {
            str = '';
        }
        console.log(str);
    };
    Unfunk.prototype.flushLineBuffer = function () {
        if(this.lineBuffer.length > 0) {
            this.writeln(this.lineBuffer);
            this.lineBuffer = '';
        }
    };
    return Unfunk;
})();
exports = (module).exports = Unfunk;
