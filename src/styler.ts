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

			ok(str:string):string {
				return str;
			}

			fail(str:string):string {
				return str;
			}

			warn(str:string):string {
				return str;
			}

			error(str:string):string {
				return str;
			}

			warning(str:string):string {
				return str;
			}

			success(str:string):string {
				return str;
			}

			accent(str:string):string {
				return str;
			}

			main(str:string):string {
				return str;
			}
		}

		export class PlainStyler extends NullStyler {
			ok(str:string):string {
				return str.toLocaleUpperCase();
			}

			warn(str:string):string {
				return str.toLocaleUpperCase();
			}

			fail(str:string):string {
				return str.toLocaleUpperCase();
			}
		}

		export class WrapStyler implements Styler {

			styles:any = {};

			ok(str:string):string {
				return this.success(str);
			}

			warn(str:string):string {
				return this.warning(str);
			}

			fail(str:string):string {
				return this.error(str);
			}

			error(str:string):string {
				return this.wrap(str, 'red');
			}

			warning(str:string):string {
				return this.wrap(str, 'yellow');
			}

			success(str:string):string {
				return this.wrap(str, 'green');
			}

			accent(str:string):string {
				return this.wrap(str, 'cyan');
			}

			main(str:string):string {
				return str;
			}

			wrap(str:string, style:string):string {
				if (!this.styles.hasOwnProperty(style)) {
					return str;
				}
				var tmp = this.styles[style];
				return tmp[0] + str + tmp[1];
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

		export class CssStyler extends WrapStyler {

			ok(str:string):string {
				return this.wrap(str, 'ok');
			}

			warn(str:string):string {
				return this.wrap(str, 'warn');
			}

			fail(str:string):string {
				return this.wrap(str, 'fail');
			}

			error(str:string):string {
				return this.wrap(str, 'error');
			}

			warning(str:string):string {
				return this.wrap(str, 'warning');
			}

			success(str:string):string {
				return this.wrap(str, 'success');
			}

			accent(str:string):string {
				return this.wrap(str, 'accent');
			}

			main(str:string):string {
				return this.wrap(str, 'main');
			}

			wrap(str:string, style:string):string {
				return '<span class="unfunk-' + style + '">' + str + '</span>';
			}
		}
	}
}