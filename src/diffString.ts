///<reference path="diff.ts" />

module unfunk {

	var util = require('util');

	//capture text AND linebreaks
	var lineExtractExp = /(.*?)(\n|(\r\n)|\r|$)/g;
	var lineBreaks = /\n|(\r\n)|\r/g;
	var stringDiff = require('diff');

	function repeatStr(str:string, amount:number):string {
		var ret = '';
		for (var i = 0; i < amount; i++) {
			ret += str;
		}
		return ret;
	}

	export module diff {

		export interface StringDiffChange {
			value:any;
			added:any;
			removed:any;
		}

		export class StringDiffer {

			constructor(public diff:DiffFormatter) {

			}

			//print string diff with indent and wrapping
			public getWrappingLines(actual:string, expected:string, maxWidth:number, rowPadLength:number, padFirst:string[], leadSymbols:boolean = false):string {
				var changes:StringDiffChange[] = stringDiff.diffChars(expected, actual);

				var escape = unfunk.escape;
				var style = this.diff.style;
				var sep = '\n';

				// should not happen
				if (changes.length === 0) {
					return [
						padFirst[0],
						padFirst[1] + style.warn('<no diff data>'),
						padFirst[1]
					].join(sep);
				}

				// checked if string has no whitespace or other fancy characters
				// RegExp should also pick up empty strings
				var isSimple:boolean = (diff.identAnyExp.test(actual) && diff.identAnyExp.test(expected));
				var delim:string = (isSimple ? '' : '"');
				var delimEmpty = repeatStr(' ', delim.length);

				// accumulate the 3 rows
				var top = padFirst[0];
				var middle = padFirst[1];
				var bottom = padFirst[2];

				// accumulate styles center
				var buffer = '';

				// sometimes first set of rows has symbols
				if (leadSymbols) {
					top += style.error(this.diff.markRemov);
					middle += style.plain(this.diff.markEmpty);
					bottom += style.success(this.diff.markAdded);

					rowPadLength += this.diff.markAdded.length;
				}

				// sanity check if we don't break availible space
				var dataLength = maxWidth - rowPadLength;
				if (rowPadLength + delim.length * 2 >= maxWidth) {
					return '<no space for padded diff: "' + (rowPadLength + ' >= ' + maxWidth) + '">';
				}

				var rowPad = repeatStr(' ', rowPadLength);

				// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

				var blocks = [];
				var charSame = '|';
				var charAdded = '+';
				var charMissing = '-';

				var charCounter = 0;

				// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

				// append wrapping quotes
				function delimLine() {
					top += delimEmpty;
					middle += delim;
					bottom += delimEmpty;
				}

				delimLine();

				// concat accumulated lined and add to block buffer
				function flushLine() {
					// close open lines
					flushStyle();
					delimLine();
					blocks.push(top + sep + middle + sep + bottom);

					// prepare new
					top = rowPad;
					middle = rowPad;
					bottom = rowPad;
					charCounter = 0;
					delimLine();
				}

				// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

				//TODO swap style/row accumulators with some kind of statemachine (not worth it

				// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

				function appendAdd(value) {
					for (var i = 0; i < value.length; i++) {
						top += ' ';
						buffer += charAdded;
					}
					bottom += value;
				}

				function flushAdd() {
					if (buffer.length > 0) {
						middle += style.success(buffer);
						buffer = '';
					}
				}

				// - - - - - - - - -

				function appendRem(value) {
					top += value;
					for (var i = 0; i < value.length; i++) {
						buffer += charMissing;
						bottom += ' ';
					}
				}

				function flushRem() {
					if (buffer.length > 0) {
						middle += style.error(buffer);
						buffer = '';
					}
				}

				// - - - - - - - - -

				function appendSame(value) {
					top += value;
					for (var i = 0; i < value.length; i++) {
						buffer += charSame;
					}
					bottom += value;
				}

				function flushSame() {
					if (buffer.length > 0) {
						middle += style.warning(buffer);
						buffer = '';
					}
				}

				// - - - - - - - - -

				function appendPlain(value) {
					top += value;
					for (var i = 0; i < value.length; i++) {
						buffer += ' ';
					}
					bottom += value;
				}

				function flushPlainStyle() {
					middle += buffer;
					buffer = '';
				}

				// - - - - - - - - -

				// mini state machine will be set with active style
				var appendStyle = appendPlain;
				var flushStyle = flushPlainStyle;

				// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

				// auto optimising printer

				// send line to buffer (but never split escaped characters over line)
				var printLine = (isSimple ? function (line, end) {
					//simple text
					appendStyle(line);
					charCounter += line.length;
					if (end) {
						flushLine();
					}
				} : function (line, end) {
					// we have weird characters
					for (var j = 0, jj = line.length; j < jj; j++) {
						var value = escape(line[j]);
						if (charCounter + value.length > dataLength) {
							flushLine();
						}
						appendStyle(value);
						charCounter += value.length;
					}
					if (end) {
						flushLine();
					}
				});

				// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

				// loop all changes
				for (var i = 0, ii = changes.length; i < ii; i++) {
					var change = changes[i];

					flushStyle();

					//mini state machine
					if (change.added) {
						appendStyle = appendAdd;
						flushStyle = flushAdd;
					}
					else if (change.removed) {
						appendStyle = appendRem;
						flushStyle = flushRem;
					}
					else {
						appendStyle = appendSame;
						flushStyle = flushSame;
					}

					// empty string
					if (change.value.length === 0) {
						printLine('', true);
						continue;
					}

					var start = 0;
					var match;

					// split lines
					lineBreaks.lastIndex = 0;
					while ((match = lineBreaks.exec(change.value))) {
						var line = change.value.substring(start, match.index);
						// console.log('>>' + escape(line) + '<<');
						start = match.index + match[0].length;
						lineBreaks.lastIndex = start;

						printLine(line + match[0], true);
					}
					// append piece after final linebreak
					if (start < change.value.length) {
						printLine(change.value.substr(start), false);
					}
				}

				// we got unflushed characters
				if (charCounter > 0) {
					flushLine();
				}
				// should not happen
				if (blocks.length === 0) {
					return [
						padFirst[0],
						padFirst[1] + style.warn('<no diff content rendered>'),
						padFirst[1]
					].join(sep);
				}
				// main exit
				return blocks.join(sep + sep);
			}
		}
	}
}
