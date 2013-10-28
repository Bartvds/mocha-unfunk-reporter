///<reference path="unfunk.ts" />
///<reference path="diffString.ts" />
///<reference path="diffObject.ts" />

module unfunk {

	//var objectDiff = require('../lib/objectDiff');
	var stringDiff = require('diff');
	var jsesc = require('jsesc');

	export module diff {
		/*
		 depends on stringDiff by 'Nikita Vasilyev'
		 https://github.com/NV/objectDiff.js
		 MIT license

		 depends on objectDiff by 'Kevin Decker'
		 https://github.com/kpdecker/jsdiff
		 BSD license

		 diff output algorithm based on objectDiff HTML printer
		 */
		var objectNameExp = /(^\[object )|(\]$)/gi;

		export class DiffFormatter {

			indentert:string = '  ';
			markAdded:string = '+ ';
			markRemov:string = '- ';
			markChang:string = '? ';
			markEqual:string = '. ';
			markEmpty:string = '  ';
			markColum:string = '| ';
			markSpace:string = '';

			stringMaxLength:number = 2000;
			bufferMaxLength:number = 100;
			arrayMaxLength:number = 100;

			constructor(public style:Styler, public maxWidth:number = 80) {

			}

			public forcedDiff(actual:any, expected:any):boolean {
				//hmm...
				if (typeof actual === 'string' && typeof expected === 'string') {
					return true;
				}
				else if (typeof actual === 'object' && typeof expected === 'object') {
					return true;
				}
				return false;
			}

			public isOverlyLengthyObject(obj:any):boolean {
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
			}

			public getObjectType(obj:any):string {
				return Object.prototype.toString.call(obj).replace(objectNameExp, '').toLowerCase();
			}

			public getStyledDiff(actual:any, expected:any, prepend:string = ''):string {
				if (typeof actual === 'undefined' || typeof expected === 'undefined') {
					return '';
				}
				var ret:string = '';
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

				//TODO rewrite to improve diffs for buffers etc

				if (typeof actual === 'object' && typeof expected === 'object') {
					ret = this.getObjectDiff(actual, expected, prepend);
				}
				else if (typeof actual === 'string' && typeof expected === 'string') {
					ret = this.getStringDiff(actual, expected, prepend.length, [prepend, prepend, prepend], true);
				}
				return ret;
			}

			public getObjectDiff(actual:any, expected:any, prepend:string):string {
				return new unfunk.diff.ObjectDiffer(this).getWrapping(actual, expected, prepend);
			}

			public getStringDiff(actual:string, expected:string, padLength:number, padFirst:string[], leadSymbols:boolean = false):string {
				//decide on line strategy
				//return new unfunk.diff.StringDiffer(this).getWrapping(actual, expected, this.maxWidth, padLength, padFirst, leadSymbols);
				return new unfunk.diff.StringDiffer(this).getWrappingLines(actual, expected, this.maxWidth, padLength, padFirst, leadSymbols);
			}
		}
	}
}
