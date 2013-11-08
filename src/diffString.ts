///<reference path="diff.ts" />

module unfunk {

	var lineExtractExp = /(.*?)(\n|\r\n|\r|$)/g;
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

			public getWrappingLines(actual:string, expected:string, maxWidth:number, padLength:number, padFirst:string[], leadSymbols:boolean = false):string {
				var changes:StringDiffChange[] = stringDiff.diffChars(expected, actual);

				var escape = unfunk.escape;;
				var blocks = [];
				var value;
				var sep = '\n';

				var isSimple:boolean = (!diff.identAnyExp.test(actual) || !diff.identAnyExp.test(expected));
				var delim:string = (isSimple ? '"' : '');
				var delimEmpty = repeatStr(' ', delim.length);

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
				if (padLength + delim.length * 2 >= maxWidth) {
					return '<no space for padded diff: "' + (padLength + ' >= ' + maxWidth) + '">';
				}

				var rowPad = repeatStr(' ', padLength);
				var counter = padLength - 1; //wtf -1? beeeh

				//TODO instead of pre-styling per-char use an accumulator
				var charSame = this.diff.style.warning('|');
				var charAdded = this.diff.style.success('+');
				var charMissing = this.diff.style.error('-');
				var match;

				var delimLine = function () {
					top += delimEmpty;
					middle += delim;
					bottom += delimEmpty;

					counter += delim.length;
				};
				delimLine();

				var flushLine = function () {
					delimLine();
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
					delimLine();
				};

				//tight loop diffs
				for (var i = 0, ii = changes.length; i < ii; i++) {
					var change = changes[i];

					//loop lines
					lineExtractExp.lastIndex = 0;
					while ((match = lineExtractExp.exec(change.value))) {
						//make sure to advance at least 1
						lineExtractExp.lastIndex = match.index + (match[0].length || 1);
						var blockCount = 0;
						var line:string = escape(match[0]);
						var len = line.length;

						//per char
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
							}
							else if (change.removed) {
								top += value;
								middle += charMissing;
								bottom += ' ';
							}
							else if (!change.added && !change.removed) {
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

				if (counter > padLength + delim.length) {
					flushLine();
				}

				return blocks.join('\n\n');
			}

		}
	}
}