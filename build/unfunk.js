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
                this.lineBuffer += args.join('');
            }
        };
        ConsoleWriter.prototype.writeln = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            if(args.length > 0) {
                this.flushLine(this.lineBuffer + args.join(''));
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
            var start;
            runner.on('start', function () {
                writer.start();
                start = Date.now();
            });
            runner.on('suite', function (suite) {
                self.stats.suites++;
                ++indents;
                if(!suite.root) {
                    writer.writeln(indent() + suite.title);
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
                writer.write(indent(1) + test.title + '.. ');
            });
            runner.on('pending', function (test) {
                self.stats.pending++;
                writer.writeln('? ' + indent() + test.title + '..  pending');
            });
            runner.on('pass', function (test) {
                self.stats.passes++;
                if('fast' == test.speed) {
                    writer.writeln('pass');
                } else {
                    writer.writeln('pass (' + test.duration + 'ms)');
                }
            });
            runner.on('fail', function (test, err) {
                self.stats.failures++;
                writer.writeln('fail');
                writer.writeln('!!' + indent(1) + self.cleanError(err));
            });
            runner.on('end', function () {
                writer.writeln('executed ' + pluralize('test', self.stats.tests) + ' with ' + pluralize('failure', self.stats.failures) + ' (' + (Date.now() - start) + 'ms)');
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
