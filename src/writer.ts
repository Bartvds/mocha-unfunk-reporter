///<reference path="unfunk.ts" />

module unfunk {

	export module writer {
		export class BaseWriter implements unfunk.LineWriter {

			lineBuffer:string = '';

			constructor() {
			}

			start() {
				this.lineBuffer = '';
			}

			write(...args:any[]) {
				if (args.length > 0) {
					this.lineBuffer += args.join('');
				}
			}

			writeln(...args:any[]) {
				if (args.length > 0) {
					this.flushLine(this.lineBuffer + args.join(''));
				}
				else {
					this.flushLine(this.lineBuffer);
				}
				this.lineBuffer = '';
			}

			flushLine(str:string) {
				//null
			}

			flushLineBuffer() {
				if (this.lineBuffer.length > 0) {
					this.writeln(this.lineBuffer);
					this.lineBuffer = '';
				}
			}

			finish() {
				this.flushLineBuffer();
			}
		}

		//flush each line as seperate log()
		export class ConsoleLineWriter extends BaseWriter {

			flushLine(str:string) {
				console.log(str);
			}
		}

		//flush everything as one chunky log();
		export class ConsoleBulkWriter extends BaseWriter {

			buffer:string[] = [];

			flushLine(str:string) {
				this.buffer.push(str);
			}

			finish() {
				console.log(this.buffer.join('\n'));
				this.buffer = [];
			}
		}
	}
}