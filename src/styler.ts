///<reference path="unfunk.ts" />

/*
	color codes taken from:
		colors.js
		Copyright (c) 2010
		Marak Squires & Alexis Sellier (cloudhead)
		https://github.com/marak/colors.js/
		MIT
*/

module unfunk {

	export module styler {
		export class NullStyler implements Styler {
			error(str:string):string {
				return str;
			}

			warning(str:string):string {
				return str;
			}

			success(str:string):string {
				return str;
			}

			suite(str:string):string {
				return str;
			}

			test(str:string):string {
				return str;
			}
			pass(str:string):string {
				return str;
			}
		}

		export class WrapStyler implements Styler {

			styles:any = {};

			error(str:string):string {
				return this.wrap(str, 'red');
			}

			warning(str:string):string {
				return this.wrap(str, 'yellow');
			}

			success(str:string):string {
				return this.wrap(str, 'green');
			}

			suite(str:string):string {
				return this.wrap(str, 'cyan');
			}

			test(str:string):string {
				return str;
			}

			wrap(str:string, style:string):string {
				if (!this.styles.hasOwnProperty(style)) {
					return str;
				}
				var tmp = this.styles[style];
				return tmp[0] + str + tmp[1];
			}

			pass(str:string):string {
				return str;
			}
		}

		export class AnsiStyler extends WrapStyler {
			constructor() {
				super();
				this.styles = {
					//styles
					'bold': ['\033[1m', '\033[22m'],
					'italic': ['\033[3m', '\033[23m'],
					'underline': ['\033[4m', '\033[24m'],
					'inverse': ['\033[7m', '\033[27m'],
					//grayscale
					'white': ['\033[37m', '\033[39m'],
					'grey': ['\033[90m', '\033[39m'],
					'black': ['\033[30m', '\033[39m'],
					//colors
					'blue': ['\033[34m', '\033[39m'],
					'cyan': ['\033[36m', '\033[39m'],
					'green': ['\033[32m', '\033[39m'],
					'magenta': ['\033[35m', '\033[39m'],
					'red': ['\033[31m', '\033[39m'],
					'yellow': ['\033[33m', '\033[39m']
				};
			}
		}

		//not used yet
		export class HtmlStyler extends WrapStyler {
			constructor() {
				super();
				this.styles = {
					//styles
					'bold': ['<b>', '</b>'],
					'italic': ['<i>', '</i>'],
					'underline': ['<u>', '</u>'],
					'inverse': ['<span style="background-color:black;color:white;">', '</span>'],
					//grayscale
					'white': ['<span style="color:white;">', '</span>'],
					'grey': ['<span style="color:grey;">', '</span>'],
					'black': ['<span style="color:black;">', '</span>'],
					//colors
					'blue': ['<span style="color:blue;">', '</span>'],
					'cyan': ['<span style="color:cyan;">', '</span>'],
					'green': ['<span style="color:green;">', '</span>'],
					'magenta': ['<span style="color:magenta;">', '</span>'],
					'red': ['<span style="color:red;">', '</span>'],
					'yellow': ['<span style="color:yellow;">', '</span>']
				};
			}
		}
	}
}