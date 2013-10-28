///<reference path="diff.ts" />

module unfunk {
	var lineExtractExp = /(.*?)(\n|\r\n|\r|$)/g;

	//var objectDiff = require('../lib/objectDiff');
	var stringDiff = require('diff');
	var jsesc = require('jsesc');

	function repeatStr(str:string, amount:number) {
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

				var diff:StringDiffChange[] = stringDiff.diffChars(expected, actual);

				var dataLength = maxWidth - padLength;

				if (padLength >= maxWidth) {
					return '<no space for padded diff>';
				}

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
				var rowPad = repeatStr(' ', padLength);
				var counter = padLength - 1; //wtf?

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

				//tight loop diffs
				for (var i = 0, ii = diff.length; i < ii; i++) {
					var change = diff[i];

					//loop lines
					lineExtractExp.lastIndex = 0;
					while ((match = lineExtractExp.exec(change.value))) {
						//make sure to advance at least 1
						lineExtractExp.lastIndex = match.index + (match[0].length || 1);
						var blockCount = 0;
						var line:string = jsesc(match[0]);
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
				if (counter > 0) {
					flushLine();
				}

				return blocks.join('\n\n');
			}

			public getWrapping(actual:string, expected:string, maxWidth:number, padLength:number, padFirst:string[], leadSymbols:boolean = false):string {

				var diff:StringDiffChange[] = stringDiff.diffChars(expected, actual);
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

				//tight loop
				for (var i = 0, ii = diff.length; i < ii; i++) {
					var change = diff[i];
					var word:string = jsesc(change.value);
					var len = word.length;
					//per char
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
				}
				if (counter > 0) {
					flushLine();
				}

				return blocks.join('\n\n');
			}
		}
	}
}