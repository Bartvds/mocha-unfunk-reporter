var objectDiff = require('../lib/objectDiff');
var jsDiff = require('../lib/jsDiff');
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var unfunk;
(function (unfunk) {
    (function (writer) {
        var lineBreak = /\r?\n/g;
        var LineWriter = (function () {
            function LineWriter() { }
            LineWriter.prototype.start = function () {
                this.textBuffer = '';
            };
            LineWriter.prototype.finish = function () {
                this.flushLineBuffer();
            };
            LineWriter.prototype.write = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                if(args.length > 0) {
                    this.textBuffer += args.join('');
                }
                if(lineBreak.test(this.textBuffer)) {
                    var arr = this.textBuffer.split(lineBreak);
                    var len = arr.length;
                    if(len > 0) {
                        for(var i = 0; i < len - 1; i++) {
                            this.flushLine(arr[i]);
                        }
                        this.textBuffer = arr[len - 1];
                    }
                }
            };
            LineWriter.prototype.writeln = function () {
                var _this = this;
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                if(args.length > 0) {
                    this.textBuffer += args.join('\n');
                }
                if(this.textBuffer.length === 0) {
                    this.flushLine('');
                } else {
                    this.textBuffer.split(lineBreak).forEach(function (line) {
                        _this.flushLine(line);
                    });
                    this.textBuffer = '';
                }
            };
            LineWriter.prototype.flushLine = function (str) {
            };
            LineWriter.prototype.flushLineBuffer = function () {
                var _this = this;
                if(this.textBuffer.length > 0) {
                    this.textBuffer.split(lineBreak).forEach(function (line) {
                        _this.flushLine(line);
                    });
                    this.textBuffer = '';
                }
            };
            return LineWriter;
        })();
        writer.LineWriter = LineWriter;        
        var ConsoleLineWriter = (function (_super) {
            __extends(ConsoleLineWriter, _super);
            function ConsoleLineWriter() {
                _super.apply(this, arguments);

            }
            ConsoleLineWriter.prototype.flushLine = function (str) {
                console.log(str);
            };
            return ConsoleLineWriter;
        })(LineWriter);
        writer.ConsoleLineWriter = ConsoleLineWriter;        
        var ConsoleBulkWriter = (function () {
            function ConsoleBulkWriter() { }
            ConsoleBulkWriter.prototype.start = function () {
                this.buffer = '';
            };
            ConsoleBulkWriter.prototype.write = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                if(args.length > 0) {
                    this.buffer += args.join('');
                }
            };
            ConsoleBulkWriter.prototype.writeln = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                if(args.length > 0) {
                    this.buffer += args.join('\n') + '\n';
                } else {
                    this.buffer += '\n';
                }
            };
            ConsoleBulkWriter.prototype.finish = function () {
                if(this.buffer.length > 0) {
                    console.log(this.buffer);
                }
                this.buffer = '';
            };
            return ConsoleBulkWriter;
        })();
        writer.ConsoleBulkWriter = ConsoleBulkWriter;        
        var StdStreamWriter = (function () {
            function StdStreamWriter(stream) {
                this.stream = stream;
            }
            StdStreamWriter.prototype.start = function () {
            };
            StdStreamWriter.prototype.finish = function () {
            };
            StdStreamWriter.prototype.write = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                if(args.length > 0) {
                    this.stream.write(args.join(''), 'utf8');
                }
            };
            StdStreamWriter.prototype.writeln = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                if(args.length > 0) {
                    this.stream.write(args.join('\n') + '\n', 'utf8');
                } else {
                    this.stream.write('\n', 'utf8');
                }
            };
            return StdStreamWriter;
        })();
        writer.StdStreamWriter = StdStreamWriter;        
        var NullWriter = (function () {
            function NullWriter() { }
            NullWriter.prototype.start = function () {
            };
            NullWriter.prototype.finish = function () {
            };
            NullWriter.prototype.write = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
            };
            NullWriter.prototype.writeln = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
            };
            return NullWriter;
        })();
        writer.NullWriter = NullWriter;        
    })(unfunk.writer || (unfunk.writer = {}));
    var writer = unfunk.writer;
})(unfunk || (unfunk = {}));
var unfunk;
(function (unfunk) {
    (function (styler) {
        var NullStyler = (function () {
            function NullStyler() { }
            NullStyler.prototype.ok = function (str) {
                return str;
            };
            NullStyler.prototype.fail = function (str) {
                return str;
            };
            NullStyler.prototype.warn = function (str) {
                return str;
            };
            NullStyler.prototype.error = function (str) {
                return str;
            };
            NullStyler.prototype.warning = function (str) {
                return str;
            };
            NullStyler.prototype.success = function (str) {
                return str;
            };
            NullStyler.prototype.accent = function (str) {
                return str;
            };
            NullStyler.prototype.main = function (str) {
                return str;
            };
            return NullStyler;
        })();
        styler.NullStyler = NullStyler;        
        var PlainStyler = (function (_super) {
            __extends(PlainStyler, _super);
            function PlainStyler() {
                _super.apply(this, arguments);

            }
            PlainStyler.prototype.ok = function (str) {
                return str.toLocaleUpperCase();
            };
            PlainStyler.prototype.warn = function (str) {
                return str.toLocaleUpperCase();
            };
            PlainStyler.prototype.fail = function (str) {
                return str.toLocaleUpperCase();
            };
            return PlainStyler;
        })(NullStyler);
        styler.PlainStyler = PlainStyler;        
        var WrapStyler = (function () {
            function WrapStyler() {
                this.styles = {
                };
            }
            WrapStyler.prototype.ok = function (str) {
                return this.success(str);
            };
            WrapStyler.prototype.warn = function (str) {
                return this.warning(str);
            };
            WrapStyler.prototype.fail = function (str) {
                return this.error(str);
            };
            WrapStyler.prototype.error = function (str) {
                return this.wrap(str, 'red');
            };
            WrapStyler.prototype.warning = function (str) {
                return this.wrap(str, 'yellow');
            };
            WrapStyler.prototype.success = function (str) {
                return this.wrap(str, 'green');
            };
            WrapStyler.prototype.accent = function (str) {
                return this.wrap(str, 'cyan');
            };
            WrapStyler.prototype.main = function (str) {
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
        styler.WrapStyler = WrapStyler;        
        var AnsiStyler = (function (_super) {
            __extends(AnsiStyler, _super);
            function AnsiStyler() {
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
            return AnsiStyler;
        })(WrapStyler);
        styler.AnsiStyler = AnsiStyler;        
        var HtmlStyler = (function (_super) {
            __extends(HtmlStyler, _super);
            function HtmlStyler() {
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
            return HtmlStyler;
        })(WrapStyler);
        styler.HtmlStyler = HtmlStyler;        
        var CssStyler = (function (_super) {
            __extends(CssStyler, _super);
            function CssStyler() {
                _super.apply(this, arguments);

            }
            CssStyler.prototype.ok = function (str) {
                return this.wrap(str, 'ok');
            };
            CssStyler.prototype.warn = function (str) {
                return this.wrap(str, 'warn');
            };
            CssStyler.prototype.fail = function (str) {
                return this.wrap(str, 'fail');
            };
            CssStyler.prototype.error = function (str) {
                return this.wrap(str, 'error');
            };
            CssStyler.prototype.warning = function (str) {
                return this.wrap(str, 'warning');
            };
            CssStyler.prototype.success = function (str) {
                return this.wrap(str, 'success');
            };
            CssStyler.prototype.accent = function (str) {
                return this.wrap(str, 'accent');
            };
            CssStyler.prototype.main = function (str) {
                return this.wrap(str, 'main');
            };
            CssStyler.prototype.wrap = function (str, style) {
                return '<span class="unfunk-' + style + '">' + str + '</span>';
            };
            return CssStyler;
        })(WrapStyler);
        styler.CssStyler = CssStyler;        
    })(unfunk.styler || (unfunk.styler = {}));
    var styler = unfunk.styler;
})(unfunk || (unfunk = {}));
var unfunk;
(function (unfunk) {
    (function (diff) {
        var repeatStr = function (str, amount) {
            var ret = '';
            for(var i = 0; i < amount; i++) {
                ret += str;
            }
            return ret;
        };
        var DiffFormatter = (function () {
            function DiffFormatter(style, maxWidth) {
                if (typeof maxWidth === "undefined") { maxWidth = 80; }
                this.style = style;
                this.maxWidth = maxWidth;
                this.prepend = '';
                this.indents = 0;
                this.indentert = '  ';
                this.markAdded = '+ ';
                this.markRemov = '- ';
                this.markChang = '? ';
                this.markEqual = '. ';
                this.markSpace = '';
            }
            DiffFormatter.prototype.forcedDiff = function (actual, expected) {
                if(typeof actual === 'string' && typeof expected === 'string') {
                    return true;
                } else if(typeof actual === 'object' && typeof expected === 'object') {
                    return true;
                }
                return false;
            };
            DiffFormatter.prototype.styleObjectDiff = function (actual, expected, prepend) {
                if (typeof prepend === "undefined") { prepend = ''; }
                if(typeof actual === 'undefined' || typeof expected === 'undefined') {
                    return '';
                }
                this.prepend = prepend;
                this.indents = 0;
                var ret = '';
                var diff;
                if(typeof actual === 'object' && typeof expected === 'object') {
                    diff = objectDiff.diff(actual, expected);
                    ret = this.objectDiffToLogString(diff);
                } else if(typeof actual === 'string' && typeof expected === 'string') {
                    diff = jsDiff.diffChars(actual, expected);
                    ret = this.stringDiffToLogWrapping(diff, this.maxWidth, prepend.length, [
                        prepend, 
                        prepend, 
                        prepend
                    ]);
                }
                return ret;
            };
            DiffFormatter.prototype.addIndent = function (amount) {
                this.indents += amount;
                return '';
            };
            DiffFormatter.prototype.stringDiffToLogWrapping = function (diff, maxWidth, padLength, padFirst) {
                var dataLength = maxWidth - padLength;
                var rowPad = repeatStr(' ', padLength);
                if(padLength >= maxWidth) {
                    return '<no space for padded diff>';
                }
                var top = '';
                var middle = '';
                var bottom = '';
                var counter = 0;
                var blocks = [];
                var value;
                var blockCount = 0;
                for(var i = 0, ii = diff.length; i < ii; i++) {
                    var change = diff[i];
                    var word = JSON.stringify(change.value).replace(/(^")|("$)/g, '');
                    var len = word.length;
                    for(var j = 0; j < len; j++) {
                        value = word[j];
                        counter += 1;
                        if(counter > dataLength) {
                            counter = 0;
                            if(blockCount > 0) {
                                blocks.push([
                                    rowPad + top, 
                                    rowPad + middle, 
                                    rowPad + bottom
                                ].join('\n'));
                            } else {
                                blocks.push([
                                    padFirst[0] + top, 
                                    padFirst[1] + middle, 
                                    padFirst[2] + bottom
                                ].join('\n'));
                            }
                            blockCount += 1;
                            top = '';
                            middle = '';
                            bottom = '';
                        }
                        if(!change.added && !change.removed) {
                            top += value;
                            middle += this.style.warning('|');
                            bottom += value;
                        } else if(change.removed) {
                            top += ' ';
                            middle += this.style.success('+');
                            bottom += value;
                        } else if(change.added) {
                            top += value;
                            middle += this.style.error('-');
                            bottom += ' ';
                        }
                    }
                }
                if(blockCount > 0) {
                    blocks.push([
                        rowPad + top, 
                        rowPad + middle, 
                        rowPad + bottom
                    ].join('\n'));
                } else {
                    blocks.push([
                        padFirst[0] + top, 
                        padFirst[1] + middle, 
                        padFirst[2] + bottom
                    ].join('\n'));
                }
                blockCount += 1;
                return blocks.join('\n\n');
            };
            DiffFormatter.prototype.stringDiffToLogString = function (diff, prefix, join) {
                if (typeof prefix === "undefined") { prefix = ''; }
                if (typeof join === "undefined") { join = '\n'; }
                var top = '';
                var middle = '';
                var bottom = '';
                for(var i = 0, ii = diff.length; i < ii; i++) {
                    var change = diff[i];
                    var value = JSON.stringify(change.value).replace(/(^")|("$)/g, '');
                    var len = value.length;
                    if(!change.added && !change.removed) {
                        top += value;
                        middle += this.style.warning(repeatStr('|', len));
                        bottom += value;
                    } else if(change.removed) {
                        top += repeatStr(' ', len);
                        middle += this.style.success(repeatStr('+', len));
                        bottom += value;
                    } else if(change.added) {
                        top += value;
                        middle += this.style.error(repeatStr('-', len));
                        bottom += repeatStr(' ', len);
                    }
                }
                var ret = [
                    prefix + top, 
                    prefix + middle, 
                    prefix + bottom
                ];
                if(join !== false) {
                    return ret.join(join);
                }
                return ret;
            };
            DiffFormatter.prototype.objectDiffToLogString = function (changes) {
                var properties = [];
                var diff = changes.value;
                if(changes.changed == 'equal') {
                    return this.inspect(changes, changes.changed);
                }
                var indent = this.getIndent();
                for(var key in diff) {
                    var changed = diff[key].changed;
                    switch(changed) {
                        case 'equal':
                        case 'removed':
                        case 'added':
                            properties.push(indent + this.getName(key, changed) + this.inspect(diff[key].value, changed));
                            break;
                        case 'object change':
                            properties.push(indent + this.getName(key, changed) + '\n' + this.addIndent(1) + this.objectDiffToLogString(diff[key]));
                            break;
                        case 'primitive change':
                            if(typeof diff[key].added === 'string' && typeof diff[key].removed === 'string') {
                                var plain = this.getName(key, 'empty');
                                var preLen = plain.length;
                                var prepend = [
                                    indent + this.getName(key, 'removed'), 
                                    indent + plain, 
                                    indent + this.getName(key, 'added')
                                ];
                                properties.push(this.stringDiffToLogWrapping(jsDiff.diffChars(diff[key].removed, diff[key].added), this.maxWidth, indent.length + preLen, prepend));
                            } else {
                                properties.push(indent + this.getName(key, 'added') + this.inspect(diff[key].removed, 'added') + '\n' + indent + this.getName(key, 'removed') + this.inspect(diff[key].added, 'removed') + '');
                            }
                            break;
                    }
                }
                return properties.join('\n') + this.addIndent(-1) + this.getIndent() + this.markSpace;
            };
            DiffFormatter.prototype.getIndent = function (id) {
                if (typeof id === "undefined") { id = ''; }
                var ret = [];
                for(var i = 0; i < this.indents; i++) {
                    ret.push(this.indentert);
                }
                return id + this.prepend + ret.join('');
            };
            DiffFormatter.prototype.getName = function (key, change) {
                if(change == 'added') {
                    return this.style.success(this.markAdded + this.stringifyObjectKey(key) + ': ');
                } else if(change == 'removed') {
                    return this.style.error(this.markRemov + this.stringifyObjectKey(key) + ': ');
                } else if(change == 'object change') {
                    return this.style.warning(this.markChang + this.stringifyObjectKey(key) + ': ');
                } else if(change == 'plain') {
                    return this.markEqual + this.stringifyObjectKey(key) + ': ';
                } else if(change == 'empty') {
                    return this.markEqual + repeatStr(' ', this.stringifyObjectKey(key).length) + ': ';
                }
                return this.style.main(this.markEqual + this.stringifyObjectKey(key) + ': ');
            };
            DiffFormatter.prototype.stringifyObjectKey = function (key) {
                return /^[a-z0-9_$]*$/i.test(key) ? key : JSON.stringify(key);
            };
            DiffFormatter.prototype.inspect = function (obj, change) {
                return this._inspect('', obj, change);
            };
            DiffFormatter.prototype._inspect = function (accumulator, obj, change) {
                switch(typeof obj) {
                    case 'object':
                        if(!obj) {
                            accumulator += 'null';
                            break;
                        }
                        var keys = Object.keys(obj);
                        var length = keys.length;
                        if(length === 0) {
                            accumulator += '{}';
                        } else {
                            accumulator += '\n';
                            for(var i = 0; i < length; i++) {
                                var key = keys[i];
                                this.addIndent(1);
                                accumulator = this._inspect(accumulator + this.getIndent() + this.getName(key, change), obj[key], change);
                                if(i < length - 1) {
                                    accumulator += '\n';
                                }
                                this.addIndent(-1);
                            }
                        }
                        break;
                    case 'function':
                        if(!obj) {
                            accumulator += 'null';
                            break;
                        }
                        accumulator += 'function()';
                        break;
                    case 'string':
                        accumulator += JSON.stringify(obj);
                        break;
                    case 'undefined':
                        accumulator += 'undefined';
                        break;
                    default:
                        accumulator += String(obj);
                        break;
                }
                return accumulator;
            };
            return DiffFormatter;
        })();
        diff.DiffFormatter = DiffFormatter;        
    })(unfunk.diff || (unfunk.diff = {}));
    var diff = unfunk.diff;
})(unfunk || (unfunk = {}));
var unfunk;
(function (unfunk) {
    (function (stack) {
        var splitLine = /[\r\n]+/g;
        stack.moduleFilters = [
            'mocha', 
            'chai', 
            'proclaim', 
            'assert', 
            'expect', 
            'should'
        ];
        stack.nodeFilters = [];
        stack.webFilters = [
            'mocha.js', 
            'chai.js', 
            'assert.js', 
            'proclaim.js'
        ];
        var trim = /(^[ \t]*)|([ \t]*$)/;
        var StackFilter = (function () {
            function StackFilter(style) {
                this.style = style;
                this.filters = [];
            }
            StackFilter.prototype.addModuleFilters = function (filters) {
                var _this = this;
                filters.forEach(function (filter) {
                    filter = '/node_modules/' + filter + '/';
                    var exp = new RegExp(filter.replace(/\\|\//g, '(\\\\|\\/)'));
                    _this.filters.push(exp);
                }, this);
            };
            StackFilter.prototype.addFilters = function (filters) {
                var _this = this;
                filters.forEach(function (filter) {
                    var exp = new RegExp(filter.replace(/\\|\//g, '(\\\\|\\/)'));
                    _this.filters.push(exp);
                }, this);
            };
            StackFilter.prototype.filter = function (stack) {
                if(!stack) {
                    return '<no stack>';
                }
                var lines = stack.split(splitLine);
                var cut = -1;
                var i, line;
                for(i = lines.length - 1; i >= 0; i--) {
                    line = lines[i].replace(trim, '');
                    if(line.length == 0) {
                        cut = i;
                    } else if(this.filters.some(function (filter) {
                        return filter.test(line);
                    })) {
                        cut = i;
                    } else {
                        if(cut > -1) {
                            break;
                        }
                    }
                }
                if(cut > -1) {
                    lines = lines.slice(0, cut);
                }
                if(lines.length === 0) {
                    return '<no unfiltered calls in stack>';
                }
                return lines.join('\n');
            };
            return StackFilter;
        })();
        stack.StackFilter = StackFilter;        
    })(unfunk.stack || (unfunk.stack = {}));
    var stack = unfunk.stack;
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
            this.duration = 0;
            this.start = 0;
            this.end = 0;
        }
        return Stats;
    })();
    unfunk.Stats = Stats;    
    var expose;
    var options = {
        writer: 'log',
        style: 'ansi',
        stream: null,
        commonjs: true,
        stackFilter: true
    };
    var option = function (nameOrHash, value) {
        if(arguments.length === 1) {
            if(typeof nameOrHash === 'object') {
                for(var name in nameOrHash) {
                    if(nameOrHash.hasOwnProperty(name)) {
                        options[name] = nameOrHash[name];
                    }
                }
            }
        } else if(arguments.length === 2) {
            if(typeof value !== 'undefined') {
                options[nameOrHash] = value;
            }
        }
        return expose;
    };
    var importEnv = function () {
        var pattern = /^mocha-unfunk-([\w]+(?:[\w_-][\w]+)*)$/;
        var obj;
        if(typeof process !== 'undefined' && process.env) {
            obj = process.env;
        }
        if(obj) {
            for(var name in obj) {
                if(Object.prototype.hasOwnProperty.call(obj, name)) {
                    pattern.lastIndex = 0;
                    var match = pattern.exec(name);
                    if(match && match.length > 1) {
                        option(match[1], obj[name]);
                    }
                }
            }
        }
    };
    var stringTrueish = function (str) {
        str = ('' + str).toLowerCase();
        return str != '' && str != 'false' && str != '0' && str != 'null' && str != 'undefined';
    };
    var toDebug = function (value, cutoff) {
        if (typeof cutoff === "undefined") { cutoff = 20; }
        var t = typeof value;
        if(t === 'function') {
            t = '' + t;
        }
        if(t === 'object') {
            var str = '';
            var match = Object.prototype.toString.call(value).match(/^\[object ([\S]*)]$/);
            if(match && match.length > 1 && match[1] !== 'Object') {
                str = match[1];
            }
            value = str + JSON.stringify(value);
            if(value.length > cutoff) {
                value = value.substr(0, cutoff) + '...';
            }
            return value;
        }
        if(t === 'string') {
            if(value.length > cutoff) {
                return JSON.stringify(value.substr(0, cutoff)) + '...';
            }
            return JSON.stringify(value);
        }
        return '' + value;
    };
    var extract = /^[ \t]*[A-Z][A-Za-z0-9_-]*Error: ([\s\S]+?)([\r\n]+[ \t]*at[\s\S]*)$/;
    var errorType = /^[ \t]*([A-Z][A-Za-z0-9_-]*Error)/;
    var assertType = /^AssertionError/;
    var headlessStack = function (error) {
        if(error.stack) {
            var match = error.stack.match(extract);
            if(match && match.length > 2) {
                return match[2].replace(/(^\s+)|(\s+$)/g, '');
            }
        }
        return '';
    };
    var getErrorPrefix = function (error) {
        var str = error.stack || ('' + error);
        var match = str.match(errorType);
        if(match && match.length > 0) {
            if(!assertType.test(match[1])) {
                return match[1] + ': ';
            }
        }
        return '';
    };
    var getErrorMessage = function (error) {
        var msg = '';
        if(error.message) {
            msg = error.message;
        } else if(error.operator) {
            msg += toDebug(error.actual) + ' ' + error.operator + ' ' + toDebug(error.expected) + '';
        }
        if(!msg) {
            msg = ('' + error);
            if(msg === '[object Object]') {
                msg = error.message || '';
                if(!msg) {
                    if(error.stack) {
                        var match = error.stack.match(extract);
                        if(match && match.length > 1) {
                            msg = match[1];
                        }
                    }
                }
            }
            msg = cleanErrorMessage(msg);
        }
        if(msg) {
            return getErrorPrefix(error) + msg.replace(/(\s+$)/g, '');
        }
        return getErrorPrefix(error) + '<no error message>';
    };
    var cleanErrorMessage = function (msg) {
        return msg.replace(/^(AssertionError:[ \t]*)/, '');
    };
    function padRight(str, len, char) {
        char = char.charAt(0);
        while(str.length < len) {
            str += char;
        }
        return str;
    }
    unfunk.padRight = padRight;
    ;
    var Unfunk = (function () {
        function Unfunk(runner) {
            this.init(runner);
        }
        Unfunk.prototype.getStyler = function () {
            if(typeof options.style !== 'undefined') {
                if(options.style === 'plain') {
                    return new unfunk.styler.PlainStyler();
                }
                if(options.style === 'ansi') {
                    return new unfunk.styler.AnsiStyler();
                }
                if(options.style === 'html') {
                    return new unfunk.styler.HtmlStyler();
                }
                if(options.style === 'css') {
                    return new unfunk.styler.CssStyler();
                }
            }
            return new unfunk.styler.PlainStyler();
        };
        Unfunk.prototype.getWriter = function () {
            if(options.stream) {
                if(!options.stream.writable) {
                    throw new Error('stream not writable');
                }
                return new unfunk.writer.StdStreamWriter(options.stream);
            } else if(options.writer === 'stdout') {
                return new unfunk.writer.StdStreamWriter(process.stdout);
            } else if(options.writer === 'bulk') {
                return new unfunk.writer.ConsoleBulkWriter();
            } else if(options.writer === 'null') {
                return new unfunk.writer.NullWriter();
            } else if(options.writer === 'log') {
                return new unfunk.writer.ConsoleLineWriter();
            }
            return new unfunk.writer.ConsoleLineWriter();
        };
        Unfunk.prototype.init = function (runner) {
            importEnv();
            var stats = this.stats = new Stats();
            var out = this.getWriter();
            var style = this.getStyler();
            var diffFormat = new unfunk.diff.DiffFormatter(style);
            var stackFilter = new unfunk.stack.StackFilter(style);
            stackFilter.addFilters(unfunk.stack.nodeFilters);
            stackFilter.addModuleFilters(unfunk.stack.moduleFilters);
            runner.stats = stats;
            var indents = 0;
            var indenter = '   ';
            var failures = this.failures = [];
            var suiteStack = [];
            var currentSuite;
            var indent = function (add) {
                if (typeof add === "undefined") { add = 0; }
                return Array(indents + add + 1).join(indenter);
            };
            var indentLen = function (amount) {
                if (typeof amount === "undefined") { amount = 1; }
                return amount * indenter.length;
            };
            var pluralize = function (word, amount, plurl) {
                if (typeof plurl === "undefined") { plurl = 's'; }
                return amount + ' ' + (1 == amount ? word : word + plurl);
            };
            var start;
            runner.on('start', function () {
                stats.start = new Date().getTime();
                out.start();
                out.writeln();
            });
            runner.on('suite', function (suite) {
                if(indents === 0) {
                    if(suite.suites) {
                        out.writeln(style.accent('->') + ' running ' + style.accent(pluralize('suite', suite.suites.length)));
                    } else {
                        out.writeln(style.accent('->') + ' running suites');
                    }
                    out.writeln();
                }
                suite.parent = currentSuite;
                suiteStack.push(suite);
                currentSuite = suite;
                stats.suites++;
                if(!suite.root && suite.title) {
                    out.writeln(indent() + style.accent(suite.title));
                }
                indents++;
            });
            runner.on('suite end', function (suite) {
                indents--;
                suiteStack.pop();
                if(suiteStack.length > 0) {
                    currentSuite = suiteStack[suiteStack.length - 1];
                } else {
                    currentSuite = null;
                }
                if(1 == indents && !suite.root) {
                    out.writeln();
                }
            });
            runner.on('test', function (test) {
                stats.tests++;
                out.write(indent(0) + style.main(test.title + '.. '));
            });
            runner.on('pending', function (test) {
                stats.pending++;
                out.writeln(indent(0) + style.main(test.title + '.. ') + style.warn('pending'));
            });
            runner.on('pass', function (test) {
                stats.passes++;
                var medium = test.slow() / 2;
                test.speed = test.duration > test.slow() ? 'slow' : (test.duration > medium ? 'medium' : 'fast');
                if(test.speed === 'slow') {
                    out.writeln(style.fail(test.speed) + style.error(' (' + test.duration + 'ms)'));
                } else if(test.speed === 'medium') {
                    out.writeln(style.warn(test.speed) + style.warning(' (' + test.duration + 'ms)'));
                } else {
                    out.writeln(style.ok('ok'));
                }
            });
            runner.on('fail', function (test, err) {
                stats.failures++;
                out.writeln(style.fail('fail'));
                var msg = cleanErrorMessage(getErrorMessage(err));
                if(msg) {
                    out.writeln(style.error(padRight(stats.failures + ': ', indentLen(indents + 1), ' ')) + '' + style.warning(msg));
                }
                test.err = err;
                failures.push(test);
            });
            runner.on('end', function () {
                var test;
                var sum = '';
                var fail;
                indents = 0;
                stats.end = new Date().getTime();
                stats.duration = stats.end - stats.start;
                if(stats.tests > 0) {
                    if(stats.failures > 0) {
                        fail = style.error('failed ' + stats.failures);
                        sum += fail + ' and ';
                    }
                    if(stats.passes == stats.tests) {
                        sum += style.success('passed ' + stats.passes);
                    } else if(stats.passes === 0) {
                        sum += style.error('passed ' + stats.passes);
                    } else {
                        sum += style.warning('passed ' + stats.passes);
                    }
                    sum += ' of ';
                    sum += style.accent(pluralize('test', stats.tests));
                } else {
                    sum += style.warning(pluralize('test', stats.tests));
                }
                if(stats.pending > 0) {
                    sum += ', left ' + style.warning(stats.pending + ' pending');
                }
                if(failures.length > 0) {
                    out.writeln(style.accent('->') + ' reporting ' + style.error(pluralize('failure', failures.length)));
                    out.writeln();
                    failures.forEach(function (test, num) {
                        var tmp = test.fullTitle();
                        var ind = tmp.lastIndexOf(test.title);
                        var title = style.accent(tmp.substring(0, ind)) + style.main(tmp.substring(ind));
                        var err = test.err;
                        var msg = getErrorMessage(err);
                        var stack = headlessStack(err);
                        out.writeln(style.error(padRight((num + 1) + ': ', indentLen(2), ' ')) + title);
                        out.writeln(indent(2) + style.warning(msg));
                        out.writeln();
                        stack = stackFilter.filter(stack);
                        if(stack) {
                            out.writeln(stack.replace(/^[ \t]*/gm, indent(3)));
                            out.writeln();
                        }
                        if(err.showDiff || diffFormat.forcedDiff(err.actual, err.expected)) {
                            var diff = diffFormat.styleObjectDiff(err.actual, err.expected, indent(2));
                            if(diff) {
                                out.writeln(diff);
                                out.writeln();
                            }
                        }
                    });
                }
                out.writeln(style.main('-> ') + sum + ' (' + (stats.duration) + 'ms)');
                out.writeln();
                out.finish();
            });
        };
        return Unfunk;
    })();
    unfunk.Unfunk = Unfunk;    
    expose = Unfunk;
    expose.option = option;
    exports = (module).exports = expose;
})(unfunk || (unfunk = {}));
