try  {
    if (!objectDiff) {
        var objectDiff = require('../lib/objectDiff');
    }
} catch (e) {
}
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var unfunk;
(function (unfunk) {
    (function (writer) {
        var lineBreak = /\r?\n/g;

        var LineWriter = (function () {
            function LineWriter() {
            }
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
                if (args.length > 0) {
                    this.textBuffer += args.join('');
                }
                if (lineBreak.test(this.textBuffer)) {
                    var arr = this.textBuffer.split(lineBreak);
                    var len = arr.length;
                    if (len > 0) {
                        for (var i = 0; i < len - 1; i++) {
                            this.flushLine(arr[i]);
                        }
                        this.textBuffer = arr[len - 1];
                    }
                }
            };

            LineWriter.prototype.writeln = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                var _this = this;
                if (args.length > 0) {
                    this.textBuffer += args.join('\n');
                }
                if (this.textBuffer.length === 0) {
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
                if (this.textBuffer.length > 0) {
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
            function ConsoleBulkWriter() {
            }
            ConsoleBulkWriter.prototype.start = function () {
                this.buffer = '';
            };

            ConsoleBulkWriter.prototype.write = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                if (args.length > 0) {
                    this.buffer += args.join('');
                }
            };

            ConsoleBulkWriter.prototype.writeln = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                if (args.length > 0) {
                    this.buffer += args.join('\n') + '\n';
                } else {
                    this.buffer += '\n';
                }
            };

            ConsoleBulkWriter.prototype.finish = function () {
                if (this.buffer.length > 0) {
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
                if (!stream.writable) {
                    throw new Error('stream not writable');
                }
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
                if (args.length > 0) {
                    this.stream.write(args.join(''), 'utf8');
                }
            };

            StdStreamWriter.prototype.writeln = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                if (args.length > 0) {
                    this.stream.write(args.join('\n') + '\n', 'utf8');
                } else {
                    this.stream.write('\n', 'utf8');
                }
            };
            return StdStreamWriter;
        })();
        writer.StdStreamWriter = StdStreamWriter;

        var NullWriter = (function () {
            function NullWriter() {
            }
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
        var NoStyler = (function () {
            function NoStyler() {
            }
            NoStyler.prototype.ok = function (str) {
                return str;
            };

            NoStyler.prototype.fail = function (str) {
                return str;
            };

            NoStyler.prototype.warn = function (str) {
                return str;
            };

            NoStyler.prototype.error = function (str) {
                return str;
            };

            NoStyler.prototype.warning = function (str) {
                return str;
            };

            NoStyler.prototype.success = function (str) {
                return str;
            };

            NoStyler.prototype.accent = function (str) {
                return str;
            };

            NoStyler.prototype.plain = function (str) {
                return str;
            };

            NoStyler.prototype.zero = function () {
                return '';
            };
            return NoStyler;
        })();
        styler.NoStyler = NoStyler;

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
        })(NoStyler);
        styler.PlainStyler = PlainStyler;

        var WrapStyler = (function () {
            function WrapStyler() {
                this.styles = {};
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

            WrapStyler.prototype.plain = function (str) {
                return str;
            };

            WrapStyler.prototype.zero = function () {
                return '';
            };

            WrapStyler.prototype.wrap = function (str, style) {
                if (!this.styles.hasOwnProperty(style)) {
                    return str;
                }
                var tmp = this.styles[style];
                return tmp[0] + str + tmp[1];
            };
            return WrapStyler;
        })();
        styler.WrapStyler = WrapStyler;

        styler.ansiWrapTable = {
            'bold': ['\033[1m', '\033[22m'],
            'italic': ['\033[3m', '\033[23m'],
            'underline': ['\033[4m', '\033[24m'],
            'inverse': ['\033[7m', '\033[27m'],
            'white': ['\033[37m', '\033[39m'],
            'grey': ['\033[90m', '\033[39m'],
            'black': ['\033[30m', '\033[39m'],
            'blue': ['\033[34m', '\033[39m'],
            'cyan': ['\033[36m', '\033[39m'],
            'green': ['\033[32m', '\033[39m'],
            'magenta': ['\033[35m', '\033[39m'],
            'red': ['\033[31m', '\033[39m'],
            'yellow': ['\033[33m', '\033[39m']
        };

        var ANSIWrapStyler = (function (_super) {
            __extends(ANSIWrapStyler, _super);
            function ANSIWrapStyler() {
                _super.call(this);
                this.styles = styler.ansiWrapTable;
            }
            return ANSIWrapStyler;
        })(WrapStyler);
        styler.ANSIWrapStyler = ANSIWrapStyler;

        var ANSIStyler = (function () {
            function ANSIStyler() {
            }
            ANSIStyler.prototype.ok = function (str) {
                return '\033[32m' + str + '\033[39m';
            };

            ANSIStyler.prototype.fail = function (str) {
                return '\033[31m' + str + '\033[39m';
            };

            ANSIStyler.prototype.warn = function (str) {
                return '\033[33m' + str + '\033[39m';
            };

            ANSIStyler.prototype.error = function (str) {
                return '\033[31m' + str + '\033[39m';
            };

            ANSIStyler.prototype.warning = function (str) {
                return '\033[33m' + str + '\033[39m';
            };

            ANSIStyler.prototype.success = function (str) {
                return '\033[32m' + str + '\033[39m';
            };

            ANSIStyler.prototype.accent = function (str) {
                return '\033[36m' + str + '\033[39m';
            };

            ANSIStyler.prototype.plain = function (str) {
                return str;
            };

            ANSIStyler.prototype.zero = function () {
                return '';
            };
            return ANSIStyler;
        })();
        styler.ANSIStyler = ANSIStyler;

        styler.htmlWrapTable = {
            'bold': ['<b>', '</b>'],
            'italic': ['<i>', '</i>'],
            'underline': ['<u>', '</u>'],
            'inverse': ['<span style="background-color:black;color:white;">', '</span>'],
            'white': ['<span style="color:white;">', '</span>'],
            'grey': ['<span style="color:grey;">', '</span>'],
            'black': ['<span style="color:black;">', '</span>'],
            'blue': ['<span style="color:blue;">', '</span>'],
            'cyan': ['<span style="color:cyan;">', '</span>'],
            'green': ['<span style="color:green;">', '</span>'],
            'magenta': ['<span style="color:magenta;">', '</span>'],
            'red': ['<span style="color:red;">', '</span>'],
            'yellow': ['<span style="color:yellow;">', '</span>']
        };

        var HTMLWrapStyler = (function (_super) {
            __extends(HTMLWrapStyler, _super);
            function HTMLWrapStyler() {
                _super.call(this);
                this.styles = styler.htmlWrapTable;
            }
            return HTMLWrapStyler;
        })(WrapStyler);
        styler.HTMLWrapStyler = HTMLWrapStyler;

        var CSSStyler = (function (_super) {
            __extends(CSSStyler, _super);
            function CSSStyler(prefix) {
                _super.call(this);
                if (typeof prefix === 'string') {
                    this.prefix = prefix;
                } else {
                    this.prefix = 'styler-';
                }
            }
            CSSStyler.prototype.ok = function (str) {
                return this.wrap(str, 'ok');
            };

            CSSStyler.prototype.warn = function (str) {
                return this.wrap(str, 'warn');
            };

            CSSStyler.prototype.fail = function (str) {
                return this.wrap(str, 'fail');
            };

            CSSStyler.prototype.error = function (str) {
                return this.wrap(str, 'error');
            };

            CSSStyler.prototype.warning = function (str) {
                return this.wrap(str, 'warning');
            };

            CSSStyler.prototype.success = function (str) {
                return this.wrap(str, 'success');
            };

            CSSStyler.prototype.accent = function (str) {
                return this.wrap(str, 'accent');
            };

            CSSStyler.prototype.plain = function (str) {
                return this.wrap(str, 'plain');
            };

            CSSStyler.prototype.wrap = function (str, style) {
                return '<span class="' + this.prefix + style + '">' + str + '</span>';
            };
            return CSSStyler;
        })(WrapStyler);
        styler.CSSStyler = CSSStyler;

        var DevStyler = (function () {
            function DevStyler() {
            }
            DevStyler.prototype.ok = function (str) {
                return '[ok|' + str + ']';
            };

            DevStyler.prototype.fail = function (str) {
                return '[fail|' + str + ']';
            };

            DevStyler.prototype.warn = function (str) {
                return '[warn|' + str + ']';
            };

            DevStyler.prototype.error = function (str) {
                return '[error|' + str + ']';
            };

            DevStyler.prototype.warning = function (str) {
                return '[warning|' + str + ']';
            };

            DevStyler.prototype.success = function (str) {
                return '[success|' + str + ']';
            };

            DevStyler.prototype.accent = function (str) {
                return '[accent|' + str + ']';
            };

            DevStyler.prototype.plain = function (str) {
                return '[plain|' + str + ']';
            };

            DevStyler.prototype.zero = function () {
                return '[zero]';
            };
            return DevStyler;
        })();
        styler.DevStyler = DevStyler;
    })(unfunk.styler || (unfunk.styler = {}));
    var styler = unfunk.styler;
})(unfunk || (unfunk = {}));
var unfunk;
(function (unfunk) {
    var lineExtractExp = /(.*?)(\n|\r\n|\r|$)/g;

    var stringDiff = require('diff');
    var jsesc = require('jsesc');

    function repeatStr(str, amount) {
        var ret = '';
        for (var i = 0; i < amount; i++) {
            ret += str;
        }
        return ret;
    }

    (function (diff) {
        var StringDiffer = (function () {
            function StringDiffer(diff) {
                this.diff = diff;
            }
            StringDiffer.prototype.getWrappingLines = function (actual, expected, maxWidth, padLength, padFirst, leadSymbols) {
                if (typeof leadSymbols === "undefined") { leadSymbols = false; }
                var diff = stringDiff.diffChars(expected, actual);

                var blocks = [];
                var value;
                var sep = '\n';

                var padPreTop = this.diff.style.error(this.diff.markRemov);
                var padPreMid = this.diff.style.plain(this.diff.markEmpty);
                var padPrBot = this.diff.style.success(this.diff.markAdded);

                var top = padFirst[0];
                var middle = padFirst[1];
                var bottom = padFirst[2];

                if (leadSymbols) {
                    top += padPreTop;
                    middle += padPreMid;
                    bottom += padPrBot;

                    padLength += this.diff.markAdded.length;
                }
                var dataLength = maxWidth - padLength;
                if (padLength >= maxWidth) {
                    return '<no space for padded diff: "' + (padLength + ' >= ' + maxWidth) + '">';
                }

                var rowPad = repeatStr(' ', padLength);
                var counter = padLength - 1;

                var charSame = this.diff.style.warning('|');
                var charAdded = this.diff.style.success('+');
                var charMissing = this.diff.style.error('-');
                var match;

                var flushLine = function () {
                    if (blockCount > 0) {
                        blocks.push(top + sep + middle + sep + bottom);
                    } else {
                        blocks.push(top + sep + middle + sep + bottom);
                    }
                    blockCount += 1;
                    top = rowPad;
                    middle = rowPad;
                    bottom = rowPad;
                    counter = padLength;
                };

                for (var i = 0, ii = diff.length; i < ii; i++) {
                    var change = diff[i];

                    lineExtractExp.lastIndex = 0;
                    while ((match = lineExtractExp.exec(change.value))) {
                        lineExtractExp.lastIndex = match.index + (match[0].length || 1);
                        var blockCount = 0;
                        var line = jsesc(match[0]);
                        var len = line.length;

                        for (var j = 0; j < len; j++) {
                            value = line[j];
                            counter += 1;
                            if (counter > dataLength) {
                                flushLine();
                            }
                            if (change.added) {
                                top += ' ';
                                middle += charAdded;
                                bottom += value;
                            } else if (change.removed) {
                                top += value;
                                middle += charMissing;
                                bottom += ' ';
                            } else if (!change.added && !change.removed) {
                                top += value;
                                middle += charSame;
                                bottom += value;
                            }
                        }
                        if (match[2].length > 0) {
                            flushLine();
                        }
                    }
                }
                if (counter > padLength) {
                    flushLine();
                }

                return blocks.join('\n\n');
            };

            StringDiffer.prototype.getWrapping = function (actual, expected, maxWidth, padLength, padFirst, leadSymbols) {
                if (typeof leadSymbols === "undefined") { leadSymbols = false; }
                var diff = stringDiff.diffChars(expected, actual);
                var dataLength = maxWidth - padLength;

                if (padLength >= maxWidth) {
                    return '<no space for padded diff>';
                }

                var counter = 0;
                var blocks = [];
                var value;
                var blockCount = 0;

                var sep = '\n';

                var top = padFirst[0];
                var middle = padFirst[1];
                var bottom = padFirst[2];

                if (leadSymbols) {
                    top += this.diff.style.error(this.diff.markRemov);
                    middle += this.diff.style.plain(this.diff.markEmpty);
                    bottom += this.diff.style.success(this.diff.markAdded);
                    padLength += this.diff.markAdded.length;
                }
                var rowPad = repeatStr(' ', padLength);

                var charSame = this.diff.style.warning('|');
                var charAdded = this.diff.style.success('+');
                var charMissing = this.diff.style.error('-');

                var flushLine = function () {
                    if (blockCount > 0) {
                        blocks.push(top + sep + middle + sep + bottom);
                    } else {
                        blocks.push(top + sep + middle + sep + bottom);
                    }
                    blockCount += 1;
                    counter = 0;
                    top = rowPad;
                    middle = rowPad;
                    bottom = rowPad;
                };

                for (var i = 0, ii = diff.length; i < ii; i++) {
                    var change = diff[i];
                    var word = jsesc(change.value);
                    var len = word.length;

                    for (var j = 0; j < len; j++) {
                        value = word[j];
                        counter += 1;
                        if (counter > dataLength) {
                            flushLine();
                        }
                        if (change.added) {
                            top += ' ';
                            middle += charAdded;
                            bottom += value;
                        } else if (change.removed) {
                            top += value;
                            middle += charMissing;
                            bottom += ' ';
                        } else if (!change.added && !change.removed) {
                            top += value;
                            middle += charSame;
                            bottom += value;
                        }
                    }
                }
                if (counter > padLength) {
                    flushLine();
                }

                return blocks.join('\n\n');
            };
            return StringDiffer;
        })();
        diff.StringDiffer = StringDiffer;
    })(unfunk.diff || (unfunk.diff = {}));
    var diff = unfunk.diff;
})(unfunk || (unfunk = {}));
var unfunk;
(function (unfunk) {
    var jsesc = require('jsesc');

    function repeatStr(str, amount) {
        var ret = '';
        for (var i = 0; i < amount; i++) {
            ret += str;
        }
        return ret;
    }

    (function (diff) {
        var ObjectDiffer = (function () {
            function ObjectDiffer(diff) {
                this.diff = diff;
                this.prefix = '';
                this.indents = 0;
            }
            ObjectDiffer.prototype.addIndent = function (amount) {
                this.indents += amount;
                return '';
            };

            ObjectDiffer.prototype.getWrapping = function (actual, expected, prefix) {
                if (typeof prefix === "undefined") { prefix = ''; }
                this.indents = 0;
                this.prefix = prefix;
                var changes = objectDiff.diff(actual, expected);
                return this.getWrappingDiff(changes);
            };

            ObjectDiffer.prototype.getWrappingDiff = function (changes) {
                var properties = [];

                var diff = changes.value;
                if (changes.changed == 'equal') {
                    return this.inspect('', changes, changes.changed);
                }
                var indent = this.getIndent();

                for (var key in diff) {
                    var changed = diff[key].changed;
                    switch (changed) {
                        case 'object change':
                            properties.push(indent + this.getNameChanged(key) + '\n' + this.addIndent(1) + this.getWrappingDiff(diff[key]));
                            break;
                        case 'primitive change':
                            if (typeof diff[key].added === 'string' && typeof diff[key].removed === 'string') {
                                var plain = this.getNameEmpty(key);
                                var preLen = plain.length;
                                var prepend = [
                                    indent + this.getNameRemoved(key),
                                    indent + plain,
                                    indent + this.getNameAdded(key)
                                ];
                                properties.push(this.diff.getStringDiff(diff[key].removed, diff[key].added, indent.length + preLen, prepend));
                            } else {
                                properties.push(indent + this.getNameRemoved(key) + this.inspect('', diff[key].added, 'removed') + '\n' + indent + this.getNameAdded(key) + this.inspect('', diff[key].removed, 'added') + '');
                            }
                            break;
                        case 'equal':
                            properties.push(indent + jsesc(key) + ': ' + this.inspect('', diff[key].value, changed));
                            break;
                        case 'removed':
                            properties.push(indent + this.getNameRemoved(key) + this.inspect('', diff[key].value, changed));
                            break;
                        case 'added':
                            properties.push(indent + this.getNameAdded(key) + this.inspect('', diff[key].value, changed));
                            break;
                    }
                }
                return properties.join('\n') + this.addIndent(-1) + this.getIndent() + this.diff.markSpace;
            };

            ObjectDiffer.prototype.getIndent = function (id) {
                if (typeof id === "undefined") { id = ''; }
                var ret = [];
                for (var i = 0; i < this.indents; i++) {
                    ret.push(this.diff.indentert);
                }
                return id + this.prefix + ret.join('');
            };

            ObjectDiffer.prototype.getNameAdded = function (key) {
                return this.diff.style.success(this.diff.markAdded + jsesc(key) + ': ');
            };

            ObjectDiffer.prototype.getNameRemoved = function (key) {
                return this.diff.style.error(this.diff.markRemov + jsesc(key) + ': ');
            };

            ObjectDiffer.prototype.getNameChanged = function (key) {
                return this.diff.style.warning(this.diff.markChang + jsesc(key) + ': ');
            };

            ObjectDiffer.prototype.getNameEmpty = function (key) {
                return this.diff.markColum + repeatStr(' ', jsesc(key).length) + ': ';
            };

            ObjectDiffer.prototype.getName = function (key, change) {
                var name = jsesc(key);
                switch (change) {
                    case 'added':
                        return this.getNameRemoved(name);
                    case 'removed':
                        return this.getNameRemoved(name);
                    case 'object change':
                        return this.getNameChanged(name);
                    case 'empty':
                        return this.getNameEmpty(name);
                    case 'plain':
                    default:
                        return this.diff.markEqual + name + ': ';
                }
            };

            ObjectDiffer.prototype.stringifyObjectKey = function (key) {
                return jsesc(key);
            };

            ObjectDiffer.prototype.inspect = function (accumulator, obj, change) {
                switch (typeof obj) {
                    case 'object':
                        if (!obj) {
                            accumulator += 'null';
                            break;
                        }
                        var keys = Object.keys(obj);
                        var length = keys.length;
                        if (length === 0) {
                            accumulator += '{}';
                        } else {
                            accumulator += '\n';
                            for (var i = 0; i < length; i++) {
                                var key = keys[i];
                                this.addIndent(1);
                                accumulator = this.inspect(accumulator + this.getIndent() + this.getName(key, change), obj[key], change);
                                if (i < length - 1) {
                                    accumulator += '\n';
                                }
                                this.addIndent(-1);
                            }
                        }
                        break;
                    case 'function':
                        if (!obj) {
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
            return ObjectDiffer;
        })();
        diff.ObjectDiffer = ObjectDiffer;
    })(unfunk.diff || (unfunk.diff = {}));
    var diff = unfunk.diff;
})(unfunk || (unfunk = {}));
var unfunk;
(function (unfunk) {
    var stringDiff = require('diff');
    var jsesc = require('jsesc');

    (function (diff) {
        var objectNameExp = /(^\[object )|(\]$)/gi;

        var DiffFormatter = (function () {
            function DiffFormatter(style, maxWidth) {
                if (typeof maxWidth === "undefined") { maxWidth = 80; }
                this.style = style;
                this.maxWidth = maxWidth;
                this.indentert = '  ';
                this.markAdded = '+ ';
                this.markRemov = '- ';
                this.markChang = '? ';
                this.markEqual = '. ';
                this.markEmpty = '  ';
                this.markColum = '| ';
                this.markSpace = '';
                this.stringMaxLength = 2000;
                this.bufferMaxLength = 100;
                this.arrayMaxLength = 100;
            }
            DiffFormatter.prototype.forcedDiff = function (actual, expected) {
                if (typeof actual === 'string' && typeof expected === 'string') {
                    return true;
                } else if (typeof actual === 'object' && typeof expected === 'object') {
                    return true;
                }
                return false;
            };

            DiffFormatter.prototype.isOverlyLengthyObject = function (obj) {
                switch (typeof obj) {
                    case 'string':
                        return (obj.length > this.stringMaxLength);
                    case 'object':
                        switch (this.getObjectType(obj)) {
                            case 'array':
                            case 'arguments':
                                return (obj.length > this.arrayMaxLength);
                            case 'buffer':
                                return (obj.length > this.bufferMaxLength);
                        }
                    default:
                        return false;
                }
            };

            DiffFormatter.prototype.getObjectType = function (obj) {
                return Object.prototype.toString.call(obj).replace(objectNameExp, '').toLowerCase();
            };

            DiffFormatter.prototype.getStyledDiff = function (actual, expected, prepend) {
                if (typeof prepend === "undefined") { prepend = ''; }
                if (typeof actual === 'undefined' || typeof expected === 'undefined') {
                    return '';
                }
                var ret = '';
                var diff;

                var len = [];
                if (this.isOverlyLengthyObject(actual)) {
                    len.push(prepend + '<actual too lengthy for diff: ' + actual.length + '>');
                }
                if (this.isOverlyLengthyObject(expected)) {
                    len.push(prepend + '<expected too lengthy for diff: ' + expected.length + '>');
                }
                if (len.length > 0) {
                    return len.join('\n');
                }

                if (typeof actual === 'object' && typeof expected === 'object') {
                    ret = this.getObjectDiff(actual, expected, prepend);
                } else if (typeof actual === 'string' && typeof expected === 'string') {
                    ret = this.getStringDiff(actual, expected, prepend.length, [prepend, prepend, prepend], true);
                }
                return ret;
            };

            DiffFormatter.prototype.getObjectDiff = function (actual, expected, prepend) {
                return new unfunk.diff.ObjectDiffer(this).getWrapping(actual, expected, prepend);
            };

            DiffFormatter.prototype.getStringDiff = function (actual, expected, padLength, padFirst, leadSymbols) {
                if (typeof leadSymbols === "undefined") { leadSymbols = false; }
                return new unfunk.diff.StringDiffer(this).getWrappingLines(actual, expected, this.maxWidth, padLength, padFirst, leadSymbols);
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

        stack.moduleFilters = ['mocha', 'chai', 'proclaim', 'assert', 'expect', 'should', 'chai-as-promised', 'mocha-as-promised'];
        stack.nodeFilters = [];
        stack.webFilters = ['mocha.js', 'chai.js', 'assert.js', 'proclaim.js'];

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
                if (!stack || /^\s+$/.test(stack)) {
                    return '<no stack>';
                }
                if (this.filters.length === 0) {
                    return stack;
                }
                var allLines = stack.split(splitLine);
                var lines = allLines.slice(0);
                var cut = -1;
                var i, line;

                for (i = lines.length - 1; i >= 0; i--) {
                    line = lines[i].replace(trim, '');
                    if (line.length == 0) {
                        cut = i;
                    } else if (this.filters.some(function (filter) {
                        return filter.test(line);
                    })) {
                        cut = i;
                    } else {
                        if (cut > -1) {
                            break;
                        }
                    }
                }
                if (cut > 0) {
                    lines = lines.splice(0, cut);
                }
                if (allLines.length === 0) {
                    return '<no lines in stack>';
                }
                if (lines.length === 0) {
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
    (function (stream) {
        var StreamBuffer = (function () {
            function StreamBuffer(stream, start) {
                if (typeof start === "undefined") { start = true; }
                this.stream = stream;
                this.buffer = [];
                this._running = false;
                var self = this;
                this.handle = function (data) {
                    self.buffer.push(data);
                };
                if (start) {
                    this.start();
                }
            }
            StreamBuffer.prototype.start = function () {
                if (!this._running) {
                    this._running = true;
                    this.stream.addListener('data', this.handle);
                }
            };

            StreamBuffer.prototype.peek = function () {
                return Buffer.concat(this.buffer);
            };

            StreamBuffer.prototype.get = function () {
                var data = Buffer.concat(this.buffer);
                this.buffer = [];
                return data;
            };

            StreamBuffer.prototype.clear = function () {
                this.buffer = [];
            };

            StreamBuffer.prototype.stop = function () {
                var data = this.get();
                if (this._running) {
                    this._running = false;
                    this.stream.removeListener('data', this.handle);
                }
                return data;
            };
            return StreamBuffer;
        })();
        stream.StreamBuffer = StreamBuffer;
    })(unfunk.stream || (unfunk.stream = {}));
    var stream = unfunk.stream;
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
        stackFilter: true,
        reportPending: false,
        width: 0
    };

    var tty = require('tty');
    var isatty = (tty.isatty('1') && tty.isatty('2'));

    function getViewWidth() {
        if (options.width > 0) {
            return options.width;
        }
        if (isatty) {
            return Math.min(options.width, process.stdout['getWindowSize'] ? process.stdout['getWindowSize'](1)[0] : tty.getWindowSize()[1]);
        }
        return 80;
    }

    function option(nameOrHash, value) {
        if (arguments.length === 1) {
            if (typeof nameOrHash === 'object') {
                for (var name in nameOrHash) {
                    if (nameOrHash.hasOwnProperty(name)) {
                        options[name] = nameOrHash[name];
                    }
                }
            }
        } else if (arguments.length === 2) {
            if (typeof value !== 'undefined' && typeof nameOrHash === 'string') {
                var propLower = nameOrHash.toLowerCase();
                for (var name in options) {
                    if (options.hasOwnProperty(name)) {
                        var nameLower = name.toLowerCase();
                        if (nameLower === propLower) {
                            options[name] = value;
                        }
                    }
                }
            }
        }
        return expose;
    }

    function importEnv() {
        var pattern = /^mocha[_-]unfunk[_-]([\w]+(?:[\w_-][\w]+)*)$/i;
        var obj;
        if (typeof process !== 'undefined' && process.env) {
            obj = process.env;
        }
        if (obj) {
            for (var name in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, name)) {
                    pattern.lastIndex = 0;
                    var match = pattern.exec(name);
                    if (match && match.length > 1) {
                        var prop = match[1].toLowerCase();
                        option(prop, obj[name]);
                    }
                }
            }
        }
    }

    function stringTrueish(str) {
        str = ('' + str).toLowerCase();
        return str != '' && str != 'false' && str != '0' && str != 'null' && str != 'undefined';
    }

    function toDebug(value, cutoff) {
        if (typeof cutoff === "undefined") { cutoff = 20; }
        var t = typeof value;
        if (t === 'function') {
            t = '' + t;
        }
        if (t === 'object') {
            var str = '';
            var match = Object.prototype.toString.call(value).match(/^\[object ([\S]*)]$/);
            if (match && match.length > 1 && match[1] !== 'Object') {
                str = match[1];
            }
            value = str + JSON.stringify(value);
            if (value.length > cutoff) {
                value = value.substr(0, cutoff) + '...';
            }
            return value;
        }
        if (t === 'string') {
            if (value.length > cutoff) {
                return JSON.stringify(value.substr(0, cutoff)) + '...';
            }
            return JSON.stringify(value);
        }
        return '' + value;
    }

    var extract = /^[A-Z][\w_]*:[ \t]*([\s\S]+?)([\r\n]+[ \t]*at[\s\S]*)$/;
    var errorType = /^([A-Z][\w_]*)/;
    var assertType = /^AssertionError/;

    function headlessStack(error) {
        if (error.stack) {
            var match = error.stack.match(extract);
            if (match && match.length > 2) {
                return match[2].replace(/(^\s+)|(\s+$)/g, '');
            }
        }
        return '';
    }

    function getErrorPrefix(error) {
        var str = error.stack || ('' + error);
        var match = str.match(errorType);
        if (match && match.length > 0) {
            if (!assertType.test(match[1])) {
                return match[1] + ': ';
            }
        }
        return '';
    }

    function getErrorMessage(error) {
        var msg = '';
        if (error.message) {
            msg = error.message;
        } else if (error.operator) {
            msg += toDebug(error.actual, 50) + ' ' + error.operator + ' ' + toDebug(error.expected, 50) + '';
        }

        if (!msg) {
            msg = ('' + error);
            if (msg === '[object Object]') {
                msg = error.message || '';
                if (!msg) {
                    if (error.stack) {
                        var match = error.stack.match(extract);
                        if (match && match.length > 1) {
                            msg = match[1];
                        }
                    }
                }
            }
            msg = cleanErrorMessage(msg);
        }
        if (msg) {
            return getErrorPrefix(error) + msg.replace(/(\s+$)/g, '');
        }
        return getErrorPrefix(error) + '<no error message>';
    }

    function cleanErrorMessage(msg) {
        return msg.replace(/^([A-Z][\w_]*:[ \t]*)/, '');
    }

    function padLeft(str, len, char) {
        str = String(str);
        char = String(char).charAt(0);
        while (str.length < len) {
            str = char + str;
        }
        return str;
    }
    unfunk.padLeft = padLeft;

    function padRight(str, len, char) {
        str = String(str);
        char = String(char).charAt(0);
        while (str.length < len) {
            str += char;
        }
        return str;
    }
    unfunk.padRight = padRight;

    function getStyler() {
        switch (options.style) {
            case 'no':
            case 'none':
                return new unfunk.styler.NoStyler();
            case 'plain':
                return new unfunk.styler.PlainStyler();
            case 'dev':
                return new unfunk.styler.DevStyler();
            case 'html':
                return new unfunk.styler.HTMLWrapStyler();
            case 'css':
                return new unfunk.styler.CSSStyler();
            case 'ansi':
                return new unfunk.styler.ANSIStyler();
        }
        return new unfunk.styler.ANSIStyler();
    }

    function getWriter() {
        if (options.stream) {
            return new unfunk.writer.StdStreamWriter(options.stream);
        }
        switch (options.writer) {
            case 'stdout':
                return new unfunk.writer.StdStreamWriter(process.stdout);
            case 'bulk':
                return new unfunk.writer.ConsoleBulkWriter();
            case 'null':
                return new unfunk.writer.NullWriter();
        }
        return new unfunk.writer.ConsoleLineWriter();
    }

    var Unfunk = (function () {
        function Unfunk(runner) {
            this.init(runner);
        }
        Unfunk.prototype.init = function (runner) {
            importEnv();

            var stats = this.stats = new Stats();
            var out = getWriter();
            var style = getStyler();

            var diffFormat = new unfunk.diff.DiffFormatter(style, getViewWidth());
            var stackFilter = new unfunk.stack.StackFilter(style);
            if (options.stackFilter) {
                stackFilter.addFilters(unfunk.stack.nodeFilters);
                stackFilter.addFilters(unfunk.stack.webFilters);
                stackFilter.addModuleFilters(unfunk.stack.moduleFilters);
            }

            runner.stats = stats;

            var indents = 0;
            var indenter = '   ';
            var failures = this.failures = [];
            var pending = this.pending = [];
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
                if (indents === 0) {
                    if (suite.suites) {
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
                if (!suite.root && suite.title) {
                    out.writeln(indent() + style.accent(suite.title));
                }
                indents++;
            });

            runner.on('suite end', function (suite) {
                indents--;
                suiteStack.pop();
                if (suiteStack.length > 0) {
                    currentSuite = suiteStack[suiteStack.length - 1];
                } else {
                    currentSuite = null;
                }

                if (1 == indents && !suite.root) {
                    out.writeln();
                }
            });

            runner.on('test', function (test) {
                stats.tests++;
                out.write(indent(0) + style.plain(test.title + '.. '));
            });

            runner.on('pending', function (test) {
                stats.pending++;
                out.writeln(indent(0) + style.plain(test.title + '.. ') + style.warn('pending'));
                pending.push(test);
            });

            runner.on('pass', function (test) {
                stats.passes++;

                var medium = test.slow() / 2;
                test.speed = test.duration > test.slow() ? 'slow' : (test.duration > medium ? 'medium' : 'fast');

                if (test.speed === 'slow') {
                    out.writeln(style.fail(test.speed) + style.error(' (' + test.duration + 'ms)'));
                } else if (test.speed === 'medium') {
                    out.writeln(style.warn(test.speed) + style.warning(' (' + test.duration + 'ms)'));
                } else {
                    out.writeln(style.ok('ok'));
                }
            });

            runner.on('fail', function (test, err) {
                stats.failures++;
                out.writeln(style.fail('fail'));
                var msg = cleanErrorMessage(getErrorMessage(err));
                if (msg) {
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

                if (stats.tests > 0) {
                    if (stats.failures > 0) {
                        fail = style.error('failed ' + stats.failures);
                        sum += fail + ' and ';
                    }

                    if (stats.passes == stats.tests) {
                        sum += style.success('passed ' + stats.passes);
                    } else if (stats.passes === 0) {
                        sum += style.error('passed ' + stats.passes);
                    } else {
                        sum += style.warning('passed ' + stats.passes);
                    }
                    sum += ' of ';
                    sum += style.accent(pluralize('test', stats.tests));
                } else {
                    sum += style.warning(pluralize('test', stats.tests));
                }

                if (pending.length > 0) {
                    sum += ', left ' + style.warning(stats.pending + ' pending');
                }

                if (options.reportPending && pending.length > 0) {
                    out.writeln(style.accent('->') + ' reporting ' + style.warn(pluralize('pending spec', pending.length)));
                    out.writeln();
                    pending.forEach(function (test, num) {
                        var tmp = test.fullTitle();
                        var ind = tmp.lastIndexOf(test.title);
                        var title = style.accent(tmp.substring(0, ind)) + style.plain(tmp.substring(ind));
                        out.writeln(style.warn(padRight((num + 1) + ': ', indentLen(2), ' ')) + title);
                    });
                    out.writeln();
                }
                if (failures.length > 0) {
                    out.writeln(style.accent('->') + ' reporting ' + style.error(pluralize('failure', failures.length)));
                    out.writeln();

                    failures.forEach(function (test, num) {
                        var tmp = test.fullTitle();
                        var ind = tmp.lastIndexOf(test.title);
                        var title = style.accent(tmp.substring(0, ind)) + style.plain(tmp.substring(ind));

                        var err = test.err;
                        var msg = getErrorMessage(err);
                        var stack = headlessStack(err);

                        out.writeln(style.error(padRight((num + 1) + ': ', indentLen(2), ' ')) + title);
                        out.writeln();
                        out.writeln(indent(2) + style.warning(msg));
                        out.writeln();

                        stack = stackFilter.filter(stack);
                        if (stack) {
                            out.writeln(stack.replace(/^[ \t]*/gm, indent(3)));
                            out.writeln();
                        }

                        if (err.showDiff || diffFormat.forcedDiff(err.actual, err.expected)) {
                            var diff = diffFormat.getStyledDiff(err.actual, err.expected, indent(2));
                            if (diff) {
                                out.writeln(diff);
                                out.writeln();
                            }
                        }
                    });
                }
                out.writeln(style.plain('-> ') + sum + ' (' + (stats.duration) + 'ms)');
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
//# sourceMappingURL=unfunk.js.map
