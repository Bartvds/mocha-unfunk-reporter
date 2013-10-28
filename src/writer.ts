///<reference path="unfunk.ts" />

module unfunk {

	export module writer {

		var lineBreak = /\r?\n/g;

		export class LineWriter implements unfunk.TextWriter {

			textBuffer:string;

			start() {
				this.textBuffer = '';
			}

			finish() {
				this.flushLineBuffer();
			}

			write(...args:any[]) {
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
						this.textBuffer = arr[len - 1]
					}
				}
			}

			writeln(...args:any[]) {
				if (args.length > 0) {
					this.textBuffer += args.join('\n');
				}
				if (this.textBuffer.length === 0) {
					this.flushLine('');
				}
				else {
					this.textBuffer.split(lineBreak).forEach((line) => {
						this.flushLine(line);
					});
					this.textBuffer = '';
				}
			}

			flushLine(str:string) {
				//abstract noop
			}

			flushLineBuffer() {
				if (this.textBuffer.length > 0) {
					this.textBuffer.split(lineBreak).forEach((line) => {
						this.flushLine(line);
					});
					this.textBuffer = '';
				}
			}
		}

		//flush each line as seperate log()
		export class ConsoleLineWriter extends LineWriter {

			flushLine(str:string) {
				console.log(str);
			}
		}

		//flush everything as one single chunky log();
		export class ConsoleBulkWriter implements unfunk.TextWriter {

			buffer:string;

			start() {
				this.buffer = '';
			}

			write(...args:any[]) {
				if (args.length > 0) {
					this.buffer += args.join('');
				}
			}

			writeln(...args:any[]) {
				if (args.length > 0) {
					this.buffer += args.join('\n') + '\n';
				}
				else {
					this.buffer += '\n';
				}
			}

			finish() {
				if (this.buffer.length > 0) {
					console.log(this.buffer);
				}
				this.buffer = '';
			}
		}

		export class StdStreamWriter implements unfunk.TextWriter {

			constructor(public stream:WritableStream) {
				if (!stream.writable) {
					throw new Error('stream not writable');
				}
			}

			start() {
			}

			finish() {
			}

			write(...args:any[]) {
				if (args.length > 0) {
					this.stream.write(args.join(''), 'utf8');
				}
			}

			writeln(...args:any[]) {
				if (args.length > 0) {
					this.stream.write(args.join('\n') + '\n', 'utf8');
				}
				else {
					this.stream.write('\n', 'utf8');
				}
			}
		}

		export class NullWriter implements unfunk.TextWriter {

			start() {
			}

			finish() {
			}

			write(...args:any[]) {
			}

			writeln(...args:any[]) {
			}
		}
	}
}