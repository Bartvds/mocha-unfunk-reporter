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
		export var objectNameExp = /(^\[object )|(\]$)/gi;

		export var stringExp = /^[a-z](?:[a-z0-9_\-]*?[a-z0-9])?$/i;

		export var stringEsc = {
			quotes: 'double'
		};
		export var stringEscWrap = {
			quotes: 'double',
			wrap: true
		};
		export var stringQuote = '"';

		export var identExp = /^[a-z](?:[a-z0-9_\-]*?[a-z0-9])?$/i;
		export var identAnyExp = /^[a-z0-9](?:[a-z0-9_\-]*?[a-z0-9])?$/i;
		export var identEscWrap = {
			quotes: 'double',
			wrap: true
		};
		export var intExp = /^\d+$/;

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
				if (maxWidth === 0) {
					this.maxWidth = 100;
				}
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

			public inDiffLengthLimit(obj:any, limit:number = 0):boolean {
				switch (typeof obj) {
					case 'string':
						return (obj.length < (limit ? limit : this.stringMaxLength));
					case 'object':
						switch (this.getObjectType(obj)) {
							case 'array':
							case 'arguments':
								return (obj.length < (limit ? limit : this.arrayMaxLength));
							case 'buffer':
								return (obj.length < (limit ? limit : this.bufferMaxLength));
							case 'object':
								return (obj && (Object.keys(obj).length < (limit ? limit : this.arrayMaxLength)));
						}
					default:
						return false;
				}
			}

			public printDiffLengthLimit(actual:any, expected:any, prepend:string = '', limit:number = 0):string {
				var len = [];
				if (actual && !this.inDiffLengthLimit(actual, limit)) {
					len.push(prepend + this.style.warning('<actual too lengthy for diff: ' + actual.length + '>'));
				}
				if (expected && !this.inDiffLengthLimit(expected, limit)) {
					len.push(prepend + this.style.warning('<expected too lengthy for diff: ' + expected.length + '>'));
				}
				if (len.length > 0) {
					return len.join('\n');
				}
				return '';
			}

			public getObjectType(obj:any):string {
				return Object.prototype.toString.call(obj).replace(objectNameExp, '').toLowerCase();
			}

			public validType(value:any):boolean {
				var type = typeof value;
				if (type === 'string') {
					return true;
				}
				if (type === 'object') {
					//null
					return !!value;
				}
				return false;
			}

			public getStyledDiff(actual:any, expected:any, prepend:string = ''):string {
				if ((this.getObjectType(actual) !== this.getObjectType(expected) || !this.validType(actual) || !this.validType(expected))) {
					//empty
					return '';
				}
				if (!this.inDiffLengthLimit(actual) || !this.inDiffLengthLimit(expected)) {
					return this.printDiffLengthLimit(actual, expected, prepend);
				}

				//TODO rewrite to improve diffs for buffers etc
				if (typeof actual === 'object' && typeof expected === 'object') {
					return this.getObjectDiff(actual, expected, prepend);
				}
				else if (typeof actual === 'string' && typeof expected === 'string') {
					return this.getStringDiff(actual, expected, prepend.length, [prepend, prepend, prepend], true);
				}
				return '';
			}

			public getObjectDiff(actual:any, expected:any, prepend:string, diffLimit:number = 0):string {
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
