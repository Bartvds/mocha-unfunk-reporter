var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var unfunk;
(function (unfunk) {
    var BaseWriter = (function () {
        function BaseWriter() {
            this.lineBuffer = '';
        }
        BaseWriter.prototype.start = function () {
            this.lineBuffer = '';
        };
        BaseWriter.prototype.write = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            if(args.length > 0) {
                this.lineBuffer += args.join('');
            }
        };
        BaseWriter.prototype.writeln = function () {
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
        BaseWriter.prototype.flushLine = function (str) {
        };
        BaseWriter.prototype.flushLineBuffer = function () {
            if(this.lineBuffer.length > 0) {
                this.writeln(this.lineBuffer);
                this.lineBuffer = '';
            }
        };
        BaseWriter.prototype.finish = function () {
            this.flushLineBuffer();
        };
        return BaseWriter;
    })();
    unfunk.BaseWriter = BaseWriter;    
    var ConsoleLineWriter = (function (_super) {
        __extends(ConsoleLineWriter, _super);
        function ConsoleLineWriter() {
            _super.apply(this, arguments);

        }
        ConsoleLineWriter.prototype.flushLine = function (str) {
            console.log(str);
        };
        return ConsoleLineWriter;
    })(BaseWriter);
    unfunk.ConsoleLineWriter = ConsoleLineWriter;    
    var ConsoleBulkWriter = (function (_super) {
        __extends(ConsoleBulkWriter, _super);
        function ConsoleBulkWriter() {
            _super.apply(this, arguments);

            this.buffer = [];
        }
        ConsoleBulkWriter.prototype.flushLine = function (str) {
            this.buffer.push(str);
        };
        ConsoleBulkWriter.prototype.finish = function () {
            console.log(this.buffer.join('\n'));
            this.buffer = [];
        };
        return ConsoleBulkWriter;
    })(BaseWriter);
    unfunk.ConsoleBulkWriter = ConsoleBulkWriter;    
})(unfunk || (unfunk = {}));
var unfunk;
(function (unfunk) {
    var NullStyler = (function () {
        function NullStyler() { }
        NullStyler.prototype.error = function (str) {
            return str;
        };
        NullStyler.prototype.warning = function (str) {
            return str;
        };
        NullStyler.prototype.success = function (str) {
            return str;
        };
        NullStyler.prototype.suite = function (str) {
            return str;
        };
        NullStyler.prototype.test = function (str) {
            return str;
        };
        return NullStyler;
    })();
    unfunk.NullStyler = NullStyler;    
    var WrapStyler = (function () {
        function WrapStyler() {
            this.styles = {
            };
        }
        WrapStyler.prototype.error = function (str) {
            return this.wrap(str, 'red');
        };
        WrapStyler.prototype.warning = function (str) {
            return this.wrap(str, 'yellow');
        };
        WrapStyler.prototype.success = function (str) {
            return this.wrap(str, 'green');
        };
        WrapStyler.prototype.suite = function (str) {
            return this.wrap(str, 'cyan');
        };
        WrapStyler.prototype.test = function (str) {
            return str;
        };
        WrapStyler.prototype.wrap = function (str, style) {
            if(!this.styles.hasOwnProperty(style)) {
                return str;
            }
            var tmp = this.styles[style];
            return tmp[0] + str + tmp[1];
        };
        return WrapStyler;
    })();
    unfunk.WrapStyler = WrapStyler;    
    var ANSIStyler = (function (_super) {
        __extends(ANSIStyler, _super);
        function ANSIStyler() {
                _super.call(this);
            this.styles = {
                'bold': [
                    '\033[1m', 
                    '\033[22m'
                ],
                'italic': [
                    '\033[3m', 
                    '\033[23m'
                ],
                'underline': [
                    '\033[4m', 
                    '\033[24m'
                ],
                'inverse': [
                    '\033[7m', 
                    '\033[27m'
                ],
                'white': [
                    '\033[37m', 
                    '\033[39m'
                ],
                'grey': [
                    '\033[90m', 
                    '\033[39m'
                ],
                'black': [
                    '\033[30m', 
                    '\033[39m'
                ],
                'blue': [
                    '\033[34m', 
                    '\033[39m'
                ],
                'cyan': [
                    '\033[36m', 
                    '\033[39m'
                ],
                'green': [
                    '\033[32m', 
                    '\033[39m'
                ],
                'magenta': [
                    '\033[35m', 
                    '\033[39m'
                ],
                'red': [
                    '\033[31m', 
                    '\033[39m'
                ],
                'yellow': [
                    '\033[33m', 
                    '\033[39m'
                ]
            };
        }
        return ANSIStyler;
    })(WrapStyler);
    unfunk.ANSIStyler = ANSIStyler;    
    var HTMLStyler = (function (_super) {
        __extends(HTMLStyler, _super);
        function HTMLStyler() {
                _super.call(this);
            this.styles = {
                'bold': [
                    '<b>', 
                    '</b>'
                ],
                'italic': [
                    '<i>', 
                    '</i>'
                ],
                'underline': [
                    '<u>', 
                    '</u>'
                ],
                'inverse': [
                    '<span style="background-color:black;color:white;">', 
                    '</span>'
                ],
                'white': [
                    '<span style="color:white;">', 
                    '</span>'
                ],
                'grey': [
                    '<span style="color:grey;">', 
                    '</span>'
                ],
                'black': [
                    '<span style="color:black;">', 
                    '</span>'
                ],
                'blue': [
                    '<span style="color:blue;">', 
                    '</span>'
                ],
                'cyan': [
                    '<span style="color:cyan;">', 
                    '</span>'
                ],
                'green': [
                    '<span style="color:green;">', 
                    '</span>'
                ],
                'magenta': [
                    '<span style="color:magenta;">', 
                    '</span>'
                ],
                'red': [
                    '<span style="color:red;">', 
                    '</span>'
                ],
                'yellow': [
                    '<span style="color:yellow;">', 
                    '</span>'
                ]
            };
        }
        return HTMLStyler;
    })(WrapStyler);
    unfunk.HTMLStyler = HTMLStyler;    
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
            this.stats = new Stats();
            this.indent = '  ';
            this.writer = new unfunk.ConsoleLineWriter();
            this.style = new unfunk.ANSIStyler();
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
                    writer.writeln(indent() + self.style.suite(suite.title));
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
                writer.write(indent(1) + self.style.test(test.title + '.. '));
            });
            runner.on('pending', function (test) {
                self.stats.pending++;
                writer.writeln(self.style.warning('?-') + indent() + test.title + '.. ' + self.style.warning('pending'));
            });
            runner.on('pass', function (test) {
                self.stats.passes++;
                if('fast' == test.speed) {
                    writer.writeln(self.style.success('pass'));
                } else {
                    writer.writeln(self.style.success('pass') + ' (' + test.duration + 'ms)');
                }
            });
            runner.on('fail', function (test, err) {
                self.stats.failures++;
                writer.writeln(self.style.error('fail'));
                writer.writeln(self.style.error('!!') + indent(1) + self.style.error('' + err));
            });
            runner.on('end', function () {
                var txt = 'executed ' + pluralize('test', self.stats.tests) + ' with ';
                if(self.stats.failures > 0) {
                    txt += self.style.error(pluralize('failure', self.stats.failures));
                } else {
                    txt += self.style.success(pluralize('failure', self.stats.failures));
                }
                if(self.stats.pending > 0) {
                    txt += ' and ' + self.style.warning(self.stats.pending + ' pending');
                }
                txt += ' (' + (Date.now() - start) + 'ms)';
                writer.writeln(txt);
                writer.finish();
            });
        };
        return Unfunk;
    })();
    unfunk.Unfunk = Unfunk;    
})(unfunk || (unfunk = {}));
exports = (module).exports = unfunk.Unfunk;
