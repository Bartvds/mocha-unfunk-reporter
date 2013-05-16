module unfunk {

	export interface LineWriter {
		start();
		write(...args:any[]);
		writeln(...args:any[]);
		flushLine(str:string);
		flushLineBuffer();
		finish();
	}

	export class ConsoleWriter implements LineWriter {

		lineBuffer:string = '';

		constructor(){
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
			console.log(str);
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
}