var unfunk;
(function (unfunk) {
    var ConsoleWriter = (function () {
        function ConsoleWriter() {
            this.lineBuffer = '';
        }
        ConsoleWriter.prototype.start = function () {
            this.lineBuffer = '';
        };
        ConsoleWriter.prototype.write = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            if(args.length > 0) {
                this.lineBuffer += format.apply(null, args);
            }
        };
        ConsoleWriter.prototype.writeln = function () {
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
        ConsoleWriter.prototype.flushLine = function (str) {
            console.log(str);
        };
        ConsoleWriter.prototype.flushLineBuffer = function () {
            if(this.lineBuffer.length > 0) {
                this.writeln(this.lineBuffer);
                this.lineBuffer = '';
            }
        };
        ConsoleWriter.prototype.finish = function () {
            this.flushLineBuffer();
        };
        return ConsoleWriter;
    })();
    unfunk.ConsoleWriter = ConsoleWriter;    
})(unfunk || (unfunk = {}));
var format = require('format');
var util = require('util');
var inspect = function (value) {
    console.log(util.inspect(value, true, 4));
};
var unfunk;
(function (unfunk) {
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
    unfunk.Stats = Stats;    
    var Unfunk = (function () {
        function Unfunk(runner) {
            this.writer = new unfunk.ConsoleWriter();
            this.stats = new Stats();
            this.indent = '  ';
            this.failures = [];
            this.init(runner);
        }
        Unfunk.prototype.init = function (runner) {
            var self = this;
            var writer = this.writer;
            var indents = 0;
            var indent = function (add) {
                if (typeof add === "undefined") { add = 0; }
                return Array(indents + add).join(self.indent);
            };
            var pluralize = function (word, amount) {
                return amount + ' ' + (1 == amount ? word : word + 's');
            };
            runner.on('start', function () {
                writer.start();
            });
            runner.on('suite', function (suite) {
                self.stats.suites++;
                ++indents;
                if(!suite.root) {
                    writer.writeln('%s%s', indent(), suite.title);
                }
            });
            runner.on('suite end', function (suite) {
                --indents;
                if(1 == indents && !suite.root) {
                    writer.writeln();
                }
            });
            runner.on('test', function (test) {
                self.stats.tests++;
                writer.write('%s%s.. ', indent(1), test.title);
            });
            runner.on('pending', function (test) {
                self.stats.pending++;
                writer.writeln('%s%s %s.. ', indent(), 'pending', test.title);
            });
            runner.on('pass', function (test) {
                self.stats.passes++;
                if('fast' == test.speed) {
                    writer.writeln('%s', 'pass');
                } else {
                    writer.writeln('%s (%dms)', 'pass', test.duration);
                }
            });
            runner.on('fail', function (test, err) {
                self.stats.failures++;
                writer.writeln('%s', 'fail');
                if(err) {
                    writer.writeln('%s-> %s', indent(2), self.cleanError(err));
                }
            });
            runner.on('end', function () {
                writer.writeln('executed %s with %s', pluralize('test', self.stats.tests), pluralize('failure', self.stats.failures));
                writer.finish();
            });
        };
        Unfunk.prototype.cleanError = function (err) {
            return String(err).replace(/^Error:\s*/, '');
        };
        return Unfunk;
    })();
    unfunk.Unfunk = Unfunk;    
})(unfunk || (unfunk = {}));
exports = (module).exports = unfunk.Unfunk;
//@ sourceMappingURL=unfunk.js.map
